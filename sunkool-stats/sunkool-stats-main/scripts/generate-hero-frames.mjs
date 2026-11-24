// Builds the homepage scroll-scrub frame sequence from the hero video.
//
//   node scripts/generate-hero-frames.mjs [path/to/hero.mp4]
//
// Needs ffmpeg on PATH. Every frame of the video becomes:
//   public/frames/ezgif-frame-NNN.jpg            1920px JPEG (decode fallback)
//   public/frames/avif-1920/ezgif-frame-NNN.avif what desktop normally loads
//   public/frames/avif-1440/ezgif-frame-NNN.avif for viewports up to 1440 device px
// Existing ezgif-frame-* files in those folders are removed first, so the folder
// always holds exactly one sequence.
//
// Afterwards, set TECH_DEMO_FRAMES.count in src/lib/tech-demo-media.ts to the
// printed frame count and bump TECH_DEMO_ASSET_VERSION: /frames/ is served with
// a one-year Cache-Control, and frame N of a new sequence is a different picture.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const source = path.resolve(process.argv[2] ?? path.join(root, "public/videos/hero/hero.mp4"));
const framesDir = path.join(root, "public/frames");
const outputs = [
  { dir: framesDir, ext: "jpg", width: 1920, encode: (img) => img.jpeg({ quality: 55, mozjpeg: true }) },
  { dir: path.join(framesDir, "avif-1920"), ext: "avif", width: 1920, encode: (img) => img.avif({ quality: 50, effort: 4 }) },
  { dir: path.join(framesDir, "avif-1440"), ext: "avif", width: 1440, encode: (img) => img.avif({ quality: 50, effort: 4 }) },
];

if (!fs.existsSync(source)) {
  console.error(`Source video not found: ${source}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hero-frames-"));
try {
  console.log(`Extracting frames from ${path.relative(root, source)} ...`);
  // Lossless PNGs, so each output format is encoded once from the original pixels.
  execFileSync("ffmpeg", ["-v", "error", "-i", source, "-an", "-fps_mode", "passthrough", path.join(tmp, "%03d.png")], { stdio: "inherit" });
  const pngs = fs.readdirSync(tmp).filter((f) => f.endsWith(".png")).sort();
  if (pngs.length === 0) throw new Error("ffmpeg produced no frames");
  if (pngs.length > 999) throw new Error(`${pngs.length} frames: names are padded to 3 digits`);

  for (const { dir, ext } of outputs) {
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) {
      if (f.startsWith("ezgif-frame-") && f.endsWith(`.${ext}`)) fs.rmSync(path.join(dir, f));
    }
  }

  let done = 0;
  const encodeFrame = async (png) => {
    const name = `ezgif-frame-${png.slice(0, 3)}`;
    for (const { dir, ext, width, encode } of outputs) {
      await encode(sharp(path.join(tmp, png)).resize({ width, withoutEnlargement: true })).toFile(path.join(dir, `${name}.${ext}`));
    }
    if (++done % 50 === 0 || done === pngs.length) console.log(`  ${done}/${pngs.length}`);
  };
  // sharp is multithreaded already; a small pool keeps all cores busy without thrashing.
  const queue = [...pngs];
  const workers = Array.from({ length: Math.min(4, os.availableParallelism()) }, async () => {
    while (queue.length) await encodeFrame(queue.shift());
  });
  await Promise.all(workers);

  for (const { dir, ext } of outputs) {
    const files = fs.readdirSync(dir).filter((f) => f.startsWith("ezgif-frame-") && f.endsWith(`.${ext}`));
    const bytes = files.reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0);
    console.log(`${path.relative(root, dir)}: ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB`);
  }
  console.log(`\nFrame count: ${pngs.length}. Update TECH_DEMO_FRAMES.count and bump TECH_DEMO_ASSET_VERSION.`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
