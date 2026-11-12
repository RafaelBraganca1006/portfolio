export type Photo = { file: string; w: number; h: number; alt: string };

export const photoMeta: Record<string, Photo> = Object.fromEntries(
  (
    [
      { file: "portrait.jpg", w: 1200, h: 1200, alt: "Rafael in the Alps" },
      { file: "IMG_0587.jpg", w: 1200, h: 1600, alt: "Matterhorn and ski slopes" },
      { file: "IMG_7467.jpg", w: 1600, h: 1200, alt: "Zürich at sunset" },
      { file: "IMG_0195.jpg", w: 1200, h: 1600, alt: "BMW building" },
      { file: "IMG_7133.jpg", w: 1600, h: 1200, alt: "Snowy Zürich" },
      { file: "IMG_7188.jpg", w: 1200, h: 1600, alt: "ETH main building" },
      { file: "IMG_0031.jpg", w: 1600, h: 1200, alt: "Lake Zürich" },
      { file: "IMG_9738.jpg", w: 1200, h: 1600, alt: "Tennis court" },
      { file: "IMG_6956.jpg", w: 1200, h: 1600, alt: "Limmat canal in Zürich" },
      { file: "IMG_0631.jpg", w: 1600, h: 1200, alt: "Swiss Alps from above" },
      { file: "IMG_0189.jpg", w: 1200, h: 1600, alt: "BMW welcome gift" },
    ] as Photo[]
  ).map((p) => [p.file, p])
);

/**
 * Generated mosaic: every photo keeps its natural ratio, edges are flush and the
 * gaps are a constant 0.9 units. x / y / w are percentages of the container
 * width (y is measured against the same width, so the container's aspect ratio
 * is `aspect` / 100).
 */
export const layout: { aspect: number; items: { file: string; x: number; y: number; w: number }[] } = {
  "aspect": 77.72,
  "items": [
    {
      "file": "IMG_6956.jpg",
      "x": 0,
      "y": 0,
      "w": 12.17
    },
    {
      "file": "IMG_7133.jpg",
      "x": 13.07,
      "y": 0,
      "w": 21.63
    },
    {
      "file": "IMG_0631.jpg",
      "x": 35.6,
      "y": 0,
      "w": 21.63
    },
    {
      "file": "IMG_0195.jpg",
      "x": 58.13,
      "y": 0,
      "w": 12.17
    },
    {
      "file": "IMG_0587.jpg",
      "x": 0,
      "y": 17.12,
      "w": 29.74
    },
    {
      "file": "portrait.jpg",
      "x": 30.64,
      "y": 17.12,
      "w": 39.65
    },
    {
      "file": "IMG_7467.jpg",
      "x": 0,
      "y": 57.67,
      "w": 26.73
    },
    {
      "file": "IMG_7188.jpg",
      "x": 27.63,
      "y": 57.67,
      "w": 15.03
    },
    {
      "file": "IMG_0031.jpg",
      "x": 43.56,
      "y": 57.67,
      "w": 26.73
    },
    {
      "file": "IMG_9738.jpg",
      "x": 71.19,
      "y": 0,
      "w": 28.81
    },
    {
      "file": "IMG_0189.jpg",
      "x": 71.19,
      "y": 39.31,
      "w": 28.81
    }
  ]
};

// slideshow order = reading order (top to bottom in loose bands, then left to right)
export const photos: Photo[] = [...layout.items]
  .sort((a, b) => Math.round(a.y / 24) - Math.round(b.y / 24) || a.x - b.x)
  .map((i) => photoMeta[i.file]);
