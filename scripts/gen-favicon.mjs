import sharp from "sharp";
import { writeFileSync } from "node:fs";

const PINE = "#1f5c57";
const BONE = "#fbfaf7";

function svg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect x="0" y="0" width="32" height="32" rx="8" fill="${PINE}"/>
  <rect x="6" y="8" width="20" height="4.6" rx="2.3" fill="${BONE}"/>
  <rect x="13.7" y="8" width="4.6" height="17.5" rx="2.3" fill="${BONE}"/>
</svg>`;
}

function icoFromPngs(entries) {
  const count = entries.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = [];
  const dataParts = [];
  for (const { size, buf } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buf.length;
    dirEntries.push(entry);
    dataParts.push(buf);
  }
  return Buffer.concat([header, ...dirEntries, ...dataParts]);
}

const sizes = [16, 32, 48];
const pngs = [];
for (const size of sizes) {
  const buf = await sharp(Buffer.from(svg(size)), { density: 384 })
    .resize(size, size)
    .png()
    .toBuffer();
  pngs.push({ size, buf });
}

writeFileSync("src/app/favicon.ico", icoFromPngs(pngs));

const appleTouch = await sharp(Buffer.from(svg(180)), { density: 384 })
  .resize(180, 180)
  .png()
  .toBuffer();
writeFileSync("src/app/apple-icon.png", appleTouch);

console.log("favicon.ico + apple-icon.png written");
