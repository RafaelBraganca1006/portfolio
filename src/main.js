import { DitherShaderEngine } from './dither-shader.js';

document.addEventListener('DOMContentLoaded', () => {
  const bgCanvas = document.getElementById('dither-canvas');
  if (bgCanvas) {
    new DitherShaderEngine(bgCanvas, '/background.jpg', { fitMode: 0 });
  }

  // Real-world Gravitational Pendulum Physics Simulation
  const profileContainer = document.querySelector('.profile-square-container');
  if (profileContainer) {
    let angle = 0;             // current angle in degrees
    let angularVelocity = 0;    // angular velocity (deg/frame)
    const gravity = 0.55;       // gravitational restoring torque strength
    const damping = 0.984;      // air resistance & pivot friction coefficient
    let animId = null;
    let lastTime = null;

    function stepPhysics(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min((timestamp - lastTime) / 16.667, 2.0);
      lastTime = timestamp;

      // Real gravity restoring torque: tau = -g * sin(theta)
      const torque = -gravity * Math.sin(angle * (Math.PI / 180));
      angularVelocity += torque * delta;
      angularVelocity *= Math.pow(damping, delta);
      angle += angularVelocity * delta;

      profileContainer.style.transform = `rotate(${angle.toFixed(3)}deg)`;

      // Continue physics loop while motion is above perception threshold
      if (Math.abs(angle) > 0.05 || Math.abs(angularVelocity) > 0.05) {
        animId = requestAnimationFrame(stepPhysics);
      } else {
        angle = 0;
        angularVelocity = 0;
        profileContainer.style.transform = 'rotate(0deg)';
        animId = null;
        lastTime = null;
      }
    }

    profileContainer.addEventListener('click', (e) => {
      // Impart realistic physical angular impulse tap
      const clickX = e.clientX;
      const rect = profileContainer.getBoundingClientRect();
      const clickOffset = clickX - (rect.left + rect.width / 2);
      
      // Impulse direction based on click side for maximum physical realism
      const impulseStrength = clickOffset < 0 ? -9.5 : -6.5;
      angularVelocity += impulseStrength;

      if (!animId) {
        lastTime = null;
        animId = requestAnimationFrame(stepPhysics);
      }
    });
  }

  // Parallax Scroll Reveal Effect (Section 2 sliding over Section 1 with 3D Depth Stack)
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollY <= windowHeight * 1.2) {
        const progress = Math.min(scrollY / windowHeight, 1);
        const scale = 1 - progress * 0.07;
        const opacity = 1 - progress * 0.6;
        const translateY = scrollY * 0.3;
        
        heroSection.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        heroSection.style.opacity = opacity.toFixed(2);
      }
    }, { passive: true });
  }

  // Parallax Slide-Over Stack Effect (Projects section sliding over About section with 3D depth)
  const aboutSection = document.getElementById('about');
  const projectsSection = document.getElementById('projects');

  if (aboutSection && projectsSection) {
    window.addEventListener('scroll', () => {
      const projectsRect = projectsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (projectsRect.top < windowHeight && projectsRect.top > 0) {
        const progress = 1 - (projectsRect.top / windowHeight);
        const scale = 1 - progress * 0.05;
        const opacity = 1 - progress * 0.4;
        aboutSection.style.transform = `scale(${scale.toFixed(3)})`;
        aboutSection.style.opacity = opacity.toFixed(2);
      } else if (projectsRect.top >= windowHeight) {
        aboutSection.style.transform = 'scale(1)';
        aboutSection.style.opacity = '1';
      }
    }, { passive: true });
  }
});
