// Generates opaque, platform-correct icon variants from the transparent
// public/icon.png master (512x512 SK monogram):
//   - public/apple-icon.png + public/sk-apple-icon.png (180x180, opaque
//     black background) — iOS renders transparency in apple-touch-icons as
//     a black/white square, so the source (transparent) file can't be used
//     directly.
//   - public/icon-maskable.png (512x512, opaque black background, logo
//     scaled to fit Android's maskable "safe zone") — for the Web Manifest.
//
// No image-processing dependency (sharp/jimp) is installed, so this decodes
// and re-encodes PNG (8-bit RGBA, non-interlaced) using only Node's zlib.
// Run with: node scripts/generate-touch-icons.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync, deflateSync, crc32 } from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function decodePNG(buf) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buf.subarray(0, 8).equals(sig)) throw new Error("Not a PNG file");

  let offset = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
  const idatParts = [];

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    const data = buf.subarray(offset + 8, offset + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idatParts.push(data);
    }
    offset += 8 + len + 4; // length + type + data + crc
  }

  if (bitDepth !== 8) throw new Error(`Unsupported bit depth ${bitDepth}`);
  if (interlace !== 0) throw new Error("Interlaced PNGs are not supported");
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`Unsupported color type ${colorType}`);

  const raw = inflateSync(Buffer.concat(idatParts));
  const bpp = channels; // bytes per pixel (8-bit)
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);

  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  };

  let inPos = 0;
  for (let y = 0; y < height; y++) {
    const filterType = raw[inPos++];
    const rowStart = y * stride;
    const prevRowStart = rowStart - stride;
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[inPos++];
      const a = x >= bpp ? out[rowStart + x - bpp] : 0;
      const b = y > 0 ? out[prevRowStart + x] : 0;
      const c = y > 0 && x >= bpp ? out[prevRowStart + x - bpp] : 0;
      let value;
      switch (filterType) {
        case 0: value = rawByte; break;
        case 1: value = rawByte + a; break;
        case 2: value = rawByte + b; break;
        case 3: value = rawByte + Math.floor((a + b) / 2); break;
        case 4: value = rawByte + paeth(a, b, c); break;
        default: throw new Error(`Unknown filter type ${filterType}`);
      }
      out[rowStart + x] = value & 0xff;
    }
  }

  // Normalize to RGBA
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, p = 0; i < width * height; i++, p += bpp) {
    const o = i * 4;
    if (channels === 4) {
      rgba[o] = out[p]; rgba[o + 1] = out[p + 1]; rgba[o + 2] = out[p + 2]; rgba[o + 3] = out[p + 3];
    } else if (channels === 3) {
      rgba[o] = out[p]; rgba[o + 1] = out[p + 1]; rgba[o + 2] = out[p + 2]; rgba[o + 3] = 255;
    } else if (channels === 2) {
      rgba[o] = rgba[o + 1] = rgba[o + 2] = out[p]; rgba[o + 3] = out[p + 1];
    } else {
      rgba[o] = rgba[o + 1] = rgba[o + 2] = out[p]; rgba[o + 3] = 255;
    }
  }

  return { width, height, data: rgba };
}

function encodePNG(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type None
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcInput = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(crcInput) >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** Bilinear-sample `src` at floating point (sx, sy); returns [r,g,b,a]. */
function sampleBilinear(src, sx, sy) {
  const { width, height, data } = src;
  const x0 = Math.max(0, Math.min(width - 1, Math.floor(sx)));
  const y0 = Math.max(0, Math.min(height - 1, Math.floor(sy)));
  const x1 = Math.min(width - 1, x0 + 1);
  const y1 = Math.min(height - 1, y0 + 1);
  const fx = sx - x0, fy = sy - y0;

  const px = (x, y) => {
    const o = (y * width + x) * 4;
    return [data[o], data[o + 1], data[o + 2], data[o + 3]];
  };
  const p00 = px(x0, y0), p10 = px(x1, y0), p01 = px(x0, y1), p11 = px(x1, y1);
  const out = [0, 0, 0, 0];
  for (let c = 0; c < 4; c++) {
    const top = p00[c] * (1 - fx) + p10[c] * fx;
    const bottom = p01[c] * (1 - fx) + p11[c] * fx;
    out[c] = top * (1 - fy) + bottom * fy;
  }
  return out;
}

/** Composite `src` (with alpha) centered at `scale` over an opaque `bg` color onto a new `size`x`size` canvas. */
function composeOpaqueIcon(src, size, scale, bg) {
  const data = Buffer.alloc(size * size * 4);
  const logoSize = size * scale;
  const offset = (size - logoSize) / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const o = (y * size + x) * 4;
      let r = bg[0], g = bg[1], b = bg[2];

      const lx = x - offset;
      const ly = y - offset;
      if (lx >= 0 && lx < logoSize && ly >= 0 && ly < logoSize) {
        const sx = (lx / logoSize) * src.width;
        const sy = (ly / logoSize) * src.height;
        const [sr, sg, sb, sa] = sampleBilinear(src, sx, sy);
        const a = sa / 255;
        r = sr * a + r * (1 - a);
        g = sg * a + g * (1 - a);
        b = sb * a + b * (1 - a);
      }

      data[o] = Math.round(r);
      data[o + 1] = Math.round(g);
      data[o + 2] = Math.round(b);
      data[o + 3] = 255; // fully opaque output
    }
  }
  return data;
}

const sourcePath = path.join(root, "public", "icon.png");
const source = decodePNG(readFileSync(sourcePath));
console.log(`Source: ${sourcePath} (${source.width}x${source.height})`);

const BLACK = [0, 0, 0];

// Apple touch icon — 180x180, opaque, no extra safe-zone needed (iOS applies
// its own rounded-square mask), just enough margin to avoid touching the edge.
const appleSize = 180;
const appleData = composeOpaqueIcon(source, appleSize, 0.86, BLACK);
const applePNG = encodePNG(appleSize, appleSize, appleData);
for (const name of ["apple-icon.png", "sk-apple-icon.png"]) {
  writeFileSync(path.join(root, "public", name), applePNG);
  console.log(`Wrote public/${name} (${appleSize}x${appleSize}, opaque)`);
}

// Android maskable icon — 512x512, opaque, logo kept inside the ~80% safe
// zone so circular/squircle masks on Android don't clip the ring.
const maskableSize = 512;
const maskableData = composeOpaqueIcon(source, maskableSize, 0.8, BLACK);
const maskablePNG = encodePNG(maskableSize, maskableSize, maskableData);
writeFileSync(path.join(root, "public", "icon-maskable.png"), maskablePNG);
console.log(`Wrote public/icon-maskable.png (${maskableSize}x${maskableSize}, opaque, 80% safe zone)`);
