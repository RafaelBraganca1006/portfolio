/**
 * WebGL 3-Color Image Dithering Shader
 * Inspired by Paper Design (https://shaders.paper.design/image-dithering)
 */

const vsSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

const fsSource = `
  precision highp float;

  varying vec2 v_texCoord;
  uniform sampler2D u_image;
  uniform vec2 u_resolution;
  uniform vec2 u_imageResolution;
  
  // 3-Color Palette
  uniform vec3 u_colorDark;      // Color 1: Very dark / almost black
  uniform vec3 u_colorEarthyRed; // Color 2: Dark earthy red
  uniform vec3 u_colorLight;     // Color 3: Very light cream

  uniform float u_ditherScale;   // Dither pixel size
  uniform int u_bayerSize;       // 4 for 4x4, 8 for 8x8
  uniform float u_spread;        // Dither spread intensity
  uniform float u_contrast;      // Contrast adjustment
  uniform int u_fitMode;         // 0: cover, 1: fill (no zoom)
  uniform int u_originalColors;  // 0: palette mode, 1: original colors mode
  uniform float u_colorSteps;    // number of color levels for original colors dither

  // 4x4 Bayer Matrix
  float getBayer4(vec2 pixelCoord) {
    ivec2 p = ivec2(mod(pixelCoord, 4.0));
    int index = p.x + p.y * 4;
    
    // Bayer matrix values 0 to 15 normalized
    if (index == 0) return 0.0 / 16.0;
    if (index == 1) return 8.0 / 16.0;
    if (index == 2) return 2.0 / 16.0;
    if (index == 3) return 10.0 / 16.0;
    if (index == 4) return 12.0 / 16.0;
    if (index == 5) return 4.0 / 16.0;
    if (index == 6) return 14.0 / 16.0;
    if (index == 7) return 6.0 / 16.0;
    if (index == 8) return 3.0 / 16.0;
    if (index == 9) return 11.0 / 16.0;
    if (index == 10) return 1.0 / 16.0;
    if (index == 11) return 9.0 / 16.0;
    if (index == 12) return 15.0 / 16.0;
    if (index == 13) return 7.0 / 16.0;
    if (index == 14) return 13.0 / 16.0;
    return 5.0 / 16.0;
  }

  // 8x8 Bayer Matrix
  float getBayer8(vec2 pixelCoord) {
    vec2 p4 = floor(pixelCoord / 2.0);
    float b4 = getBayer4(p4);
    vec2 p2 = mod(pixelCoord, 2.0);
    float b2 = (p2.x + p2.y * 2.0) / 4.0;
    return b4 * 0.75 + b2 * 0.25;
  }

  void main() {
    vec2 uv = v_texCoord;

    if (u_fitMode == 0) {
      // Cover aspect ratio
      vec2 screenRatio = vec2(u_resolution.x / u_resolution.y, 1.0);
      vec2 imageRatio = vec2(u_imageResolution.x / u_imageResolution.y, 1.0);
      
      if (screenRatio.x > imageRatio.x) {
        float scale = screenRatio.x / imageRatio.x;
        uv.y = (uv.y - 0.5) / scale + 0.5;
      } else {
        float scale = screenRatio.y / imageRatio.y;
        uv.x = (uv.x - 0.5) * scale + 0.5;
      }
    }

    vec4 texColor = texture2D(u_image, uv);
    if (texColor.a < 0.05) {
      discard;
    }

    vec3 finalColor;

    if (u_originalColors == 1) {
      // Bayer dithering preserving original image colors
      vec2 pixelPos = gl_FragCoord.xy / u_ditherScale;
      float bayerVal = (u_bayerSize == 8) ? getBayer8(pixelPos) : getBayer4(pixelPos);
      float ditherOffset = (bayerVal - 0.5) * u_spread;

      vec3 ditheredRGB = floor((texColor.rgb + vec3(ditherOffset)) * u_colorSteps + 0.5) / u_colorSteps;
      finalColor = clamp(ditheredRGB, 0.0, 1.0);
    } else {
      // 3-Color Palette Quantization
      float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      luminance = clamp((luminance - 0.5) * u_contrast + 0.5, 0.0, 1.0);

      vec2 pixelPos = gl_FragCoord.xy / u_ditherScale;
      float bayerVal = (u_bayerSize == 8) ? getBayer8(pixelPos) : getBayer4(pixelPos);
      float ditherOffset = (bayerVal - 0.5) * u_spread;
      float val = clamp(luminance + ditherOffset, 0.0, 1.0);

      if (val < 0.38) {
        float t = smoothstep(0.0, 0.38, val);
        finalColor = mix(u_colorDark, u_colorEarthyRed, t);
      } else {
        float t = smoothstep(0.38, 1.0, val);
        finalColor = mix(u_colorEarthyRed, u_colorLight, t);
      }
    }

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

export class DitherShaderEngine {
  constructor(canvas, imageSrc, options = {}) {
    this.canvas = canvas;
    this.imageSrc = imageSrc;
    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!this.gl) {
      console.error('WebGL not supported');
      return;
    }

    // Default parameters matching paper design dithering
    this.params = {
      ditherScale: options.ditherScale || 1.0,
      bayerSize: options.bayerSize || 8,
      spread: options.spread || 0.45,
      contrast: options.contrast || 1.1,
      fitMode: options.fitMode !== undefined ? options.fitMode : 0,
      originalColors: options.originalColors ? 1 : 0,
      colorSteps: options.colorSteps || 6.0,
      // Colors in RGB [0..1]
      // 1. Dark (Almost black) #0d0a09
      colorDark: [0.051, 0.039, 0.035],
      // 2. Dark Earthy Red #792823
      colorEarthyRed: [0.475, 0.157, 0.137],
      // 3. Very light cream #f6eee3
      colorLight: [0.965, 0.933, 0.890]
    };

    this.init();
  }

  init() {
    const gl = this.gl;

    // Create Shaders
    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
    
    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(this.program));
      return;
    }

    gl.useProgram(this.program);

    // Buffers for full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0
    ]), gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    this.uniforms = {
      image: gl.getUniformLocation(this.program, 'u_image'),
      resolution: gl.getUniformLocation(this.program, 'u_resolution'),
      imageResolution: gl.getUniformLocation(this.program, 'u_imageResolution'),
      colorDark: gl.getUniformLocation(this.program, 'u_colorDark'),
      colorEarthyRed: gl.getUniformLocation(this.program, 'u_colorEarthyRed'),
      colorLight: gl.getUniformLocation(this.program, 'u_colorLight'),
      ditherScale: gl.getUniformLocation(this.program, 'u_ditherScale'),
      bayerSize: gl.getUniformLocation(this.program, 'u_bayerSize'),
      spread: gl.getUniformLocation(this.program, 'u_spread'),
      contrast: gl.getUniformLocation(this.program, 'u_contrast'),
      fitMode: gl.getUniformLocation(this.program, 'u_fitMode'),
      originalColors: gl.getUniformLocation(this.program, 'u_originalColors'),
      colorSteps: gl.getUniformLocation(this.program, 'u_colorSteps')
    };

    this.loadTexture();
    this.bindEvents();
    this.resize();
  }

  compileShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  loadTexture() {
    const gl = this.gl;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    
    // Warm dark earthy red 1x1 pixel fallback while loading (#792823)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([121, 40, 35, 255]));

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.imageWidth = img.width;
      this.imageHeight = img.height;

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      this.resize();
      this.render();
    };
    img.src = this.imageSrc;
    if (img.complete && img.naturalWidth !== 0) {
      img.onload();
    }
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.render();
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
  }

  updateParam(key, val) {
    this.params[key] = val;
    this.render();
  }

  render() {
    if (!this.gl || !this.program || !this.texture) return;
    const gl = this.gl;

    gl.useProgram(this.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uniforms.image, 0);

    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.imageResolution, this.imageWidth || 1024, this.imageHeight || 768);
    
    gl.uniform3fv(this.uniforms.colorDark, this.params.colorDark);
    gl.uniform3fv(this.uniforms.colorEarthyRed, this.params.colorEarthyRed);
    gl.uniform3fv(this.uniforms.colorLight, this.params.colorLight);

    gl.uniform1f(this.uniforms.ditherScale, this.params.ditherScale * (window.devicePixelRatio || 1));
    gl.uniform1i(this.uniforms.bayerSize, this.params.bayerSize);
    gl.uniform1f(this.uniforms.spread, this.params.spread);
    gl.uniform1f(this.uniforms.contrast, this.params.contrast);
    gl.uniform1i(this.uniforms.fitMode, this.params.fitMode);
    gl.uniform1i(this.uniforms.originalColors, this.params.originalColors);
    gl.uniform1f(this.uniforms.colorSteps, this.params.colorSteps);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
