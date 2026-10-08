import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const userMediaDir = 'C:/Users/SATYAM PANDEY/.gemini/antigravity-ide/brain/ed53e97a-5aba-47e6-8537-e167d29eebf9/.user_uploaded/';
const publicDir = 'public/partners/';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Pizza Hut (media_1791458890642.png)
// Transparent PNG 1024x971
await sharp(path.join(userMediaDir, 'media_1791458890642.png'))
  .trim()
  .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .webp({ lossless: true })
  .toFile(path.join(publicDir, 'pizza-hut.webp'));
console.log('Pizza Hut done');

// 2. n8n
// Perfect centered SVG for n8n
const n8nSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="15 15 330 110" fill="none">
  <!-- n8n Node Network -->
  <g fill="#EA4B71">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M48 40C33.64 40 22 51.64 22 66C22 80.36 33.64 92 48 92C59.98 92 70.07 83.89 73.08 72.82C76.2 72.94 80.64 73.34 85.5 74.5C92.29 76.12 99.35 79.16 104.83 83.99C111.45 89.81 116.34 98.42 121.24 107.89C124.78 114.73 131.62 119 139.31 119C152.01 119 162.31 108.7 162.31 96C162.31 83.3 152.01 73 139.31 73C133.4 73 128.01 75.24 123.95 78.93C118.8 72.89 112.56 67.84 105.15 64.13C96.26 59.68 85.93 57.51 76.47 57.06C73.3 47.34 63.97 40 48 40ZM36 66C36 59.37 41.37 54 48 54C54.63 54 60 59.37 60 66C60 72.63 54.63 78 48 78C41.37 78 36 72.63 36 66ZM139.31 87C144.28 87 148.31 91.03 148.31 96C148.31 100.97 144.28 105 139.31 105C134.34 105 130.31 100.97 130.31 96C130.31 91.03 134.34 87 139.31 87ZM139.31 21C131.62 21 124.78 25.27 121.24 32.11C116.34 41.58 111.45 50.19 104.83 56.01C102.51 58.05 99.88 59.79 97 61.23C98.46 63.83 99.64 66.57 100.5 69.45C106.66 65.57 113.88 61.64 122.5 56.5C126.84 59.95 132.41 62 138.5 62C151.2 62 161.5 51.7 161.5 39C161.5 26.3 151.2 21 138.5 21H139.31ZM138.5 35C143.47 35 147.5 39.03 147.5 44C147.5 48.97 143.47 53 138.5 53C133.53 53 129.5 48.97 129.5 44C129.5 39.03 133.53 35 138.5 35ZM88 66C88 59.37 93.37 54 100 54C106.63 54 112 59.37 112 66C112 72.63 106.63 78 100 78C93.37 78 88 72.63 88 66Z"/>
  </g>
  <!-- n8n text -->
  <text x="180" y="93" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="76" fill="#ffffff" letter-spacing="-2">n8n</text>
</svg>`;
await sharp(Buffer.from(n8nSvg))
  .webp({ lossless: true })
  .toFile(path.join(publicDir, 'n8n.webp'));
console.log('n8n done');

// 3. TSEC Thakur (media_1791458890647.jpg)
await sharp(path.join(userMediaDir, 'media_1791458890647.jpg'))
  .trim({ background: { r: 255, g: 255, b: 255 } })
  .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'thakur-tsec.webp'));

// 4. TSEC Thadomal (media_1791458890671.jpg)
await sharp(path.join(userMediaDir, 'media_1791458890671.jpg'))
  .trim({ background: { r: 255, g: 255, b: 255 } })
  .resize(500, 300, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'thadomal-tsec.webp'));

// 5. XIE (media_1791458890694.jpg)
await sharp(path.join(userMediaDir, 'media_1791458890694.jpg'))
  .trim({ background: { r: 255, g: 255, b: 255 } })
  .resize(400, 240, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'xie.webp'));

// 6. GitHub (media_1791460049134.jpg)
const githubCropped = await sharp(path.join(userMediaDir, 'media_1791460049134.jpg'))
  .extract({ left: 195, top: 0, width: 635, height: 578 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const githubRgba = Buffer.alloc(githubCropped.info.width * githubCropped.info.height * 4);
for (let i = 0; i < githubCropped.info.width * githubCropped.info.height; i++) {
  const srcIdx = i * 3;
  const dstIdx = i * 4;
  const gray = Math.round(0.299 * githubCropped.data[srcIdx] + 0.587 * githubCropped.data[srcIdx + 1] + 0.114 * githubCropped.data[srcIdx + 2]);
  const alpha = Math.max(0, Math.min(255, 255 - gray));
  githubRgba[dstIdx] = 255;
  githubRgba[dstIdx + 1] = 255;
  githubRgba[dstIdx + 2] = 255;
  githubRgba[dstIdx + 3] = alpha;
}
await sharp(githubRgba, { raw: { width: githubCropped.info.width, height: githubCropped.info.height, channels: 4 } })
  .webp({ lossless: true })
  .toFile(path.join(publicDir, 'github.webp'));
console.log('GitHub done');

// 7. Google Developers (media_1791460049169.jpg)
await sharp(path.join(userMediaDir, 'media_1791460049169.jpg'))
  .extract({ left: 135, top: 150, width: 755, height: 290 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'google-developers.webp'));
console.log('Google Developers done');

// 8. FCRIT (media_1791460049155.jpg)
await sharp(path.join(userMediaDir, 'media_1791460049155.jpg'))
  .extract({ left: 190, top: 175, width: 644, height: 670 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'fcrit.webp'));
console.log('FCRIT done');

// 9. DJSCE (media_1791460049166.jpg)
await sharp(path.join(userMediaDir, 'media_1791460049166.jpg'))
  .extract({ left: 25, top: 75, width: 920, height: 240 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'djsce.webp'));
console.log('DJSCE done');

// 10. IIC (media_1791460049273.jpg)
const b1 = await sharp(path.join(userMediaDir, 'media_1791460049273.jpg'))
  .extract({ left: 37, top: 39, width: 270, height: 294 })
  .toBuffer();
const b2 = await sharp(path.join(userMediaDir, 'media_1791460049273.jpg'))
  .extract({ left: 360, top: 39, width: 626, height: 294 })
  .toBuffer();
await sharp({ create: { width: 930, height: 294, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: b1, left: 0, top: 0 }, { input: b2, left: 304, top: 0 }])
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'iic.webp'));
console.log('IIC done');

// 11. IIC DJSCE (media_1791460640689.jpg)
await sharp(path.join(userMediaDir, 'media_1791460640689.jpg'))
  .extract({ left: 50, top: 10, width: 915, height: 420 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'iic-djsce.webp'));
console.log('IIC DJSCE done');

// 12. CSI SIES GST (media_1791460640715.jpg)
const csiCropped = await sharp(path.join(userMediaDir, 'media_1791460640715.jpg'))
  .extract({ left: 40, top: 70, width: 945, height: 435 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const csiRgba = Buffer.alloc(csiCropped.info.width * csiCropped.info.height * 4);
for (let i = 0; i < csiCropped.info.width * csiCropped.info.height; i++) {
  const src = i * 3;
  const dst = i * 4;
  const b = Math.max(csiCropped.data[src], csiCropped.data[src + 1], csiCropped.data[src + 2]);
  const alpha = b < 30 ? 0 : Math.min(255, Math.round((b - 30) * (255 / 150)));
  csiRgba[dst] = 255;
  csiRgba[dst + 1] = 255;
  csiRgba[dst + 2] = 255;
  csiRgba[dst + 3] = Math.min(255, alpha);
}
await sharp(csiRgba, { raw: { width: csiCropped.info.width, height: csiCropped.info.height, channels: 4 } })
  .webp({ lossless: true })
  .toFile(path.join(publicDir, 'csi-siesgst.webp'));
console.log('CSI SIES GST done');

// 13. ACM TSEC (media_1791460640747.jpg)
const acmB1 = await sharp(path.join(userMediaDir, 'media_1791460640747.jpg'))
  .extract({ left: 47, top: 38, width: 435, height: 431 })
  .toBuffer();
const acmB2 = await sharp(path.join(userMediaDir, 'media_1791460640747.jpg'))
  .extract({ left: 525, top: 38, width: 456, height: 431 })
  .toBuffer();
await sharp({ create: { width: 915, height: 431, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: acmB1, left: 0, top: 0 }, { input: acmB2, left: 459, top: 0 }])
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'acm-tsec.webp'));
console.log('ACM TSEC done');

// 14. IEEE SLRTCE (media_1791460640779.jpg)
await sharp(path.join(userMediaDir, 'media_1791460640779.jpg'))
  .extract({ left: 80, top: 60, width: 885, height: 885 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'ieee-slrtce.webp'));
console.log('IEEE SLRTCE done');

// 15. DevSphere India (media_1791460640828.jpg)
const devCropped = await sharp(path.join(userMediaDir, 'media_1791460640828.jpg'))
  .extract({ left: 95, top: 45, width: 830, height: 675 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const devRgba = Buffer.alloc(devCropped.info.width * devCropped.info.height * 4);
for (let i = 0; i < devCropped.info.width * devCropped.info.height; i++) {
  const src = i * 3;
  const dst = i * 4;
  const r = devCropped.data[src], g = devCropped.data[src + 1], b = devCropped.data[src + 2];
  const brightness = Math.max(r, g, b);
  let alpha = 255;
  if (brightness < 18) {
    alpha = 0;
  } else if (brightness < 45) {
    alpha = Math.round((brightness - 18) * (255 / 27));
  }
  devRgba[dst] = r;
  devRgba[dst + 1] = g;
  devRgba[dst + 2] = b;
  devRgba[dst + 3] = alpha;
}
await sharp(devRgba, { raw: { width: devCropped.info.width, height: devCropped.info.height, channels: 4 } })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'devsphere-india.webp'));
console.log('DevSphere India done');

// 16. IcyPluto (media_1791461018746.jpg)
await sharp(path.join(userMediaDir, 'media_1791461018746.jpg'))
  .extract({ left: 60, top: 70, width: 900, height: 290 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'icypluto.webp'));
console.log('IcyPluto done');

// 17. IET (media_1791461018768.jpg)
await sharp(path.join(userMediaDir, 'media_1791461018768.jpg'))
  .extract({ left: 26, top: 25, width: 972, height: 197 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'iet.webp'));
console.log('IET done');

// 18. CISCO (media_1791461018795.jpg)
const ciscoRaw = await sharp(path.join(userMediaDir, 'media_1791461018795.jpg'))
  .extract({ left: 140, top: 85, width: 700, height: 365 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const ciscoRgba = Buffer.alloc(ciscoRaw.info.width * ciscoRaw.info.height * 4);
for (let i = 0; i < ciscoRaw.info.width * ciscoRaw.info.height; i++) {
  const src = i * 3, dst = i * 4;
  const r = ciscoRaw.data[src], g = ciscoRaw.data[src + 1], b = ciscoRaw.data[src + 2];
  const brightness = (r + g + b) / 3;
  const alpha = brightness > 245 ? 0 : Math.min(255, Math.round((245 - brightness) * (255 / 100)));
  ciscoRgba[dst] = r;
  ciscoRgba[dst + 1] = g;
  ciscoRgba[dst + 2] = b;
  ciscoRgba[dst + 3] = Math.min(255, alpha);
}
await sharp(ciscoRgba, { raw: { width: ciscoRaw.info.width, height: ciscoRaw.info.height, channels: 4 } })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'cisco.webp'));
console.log('CISCO done');

// 19. NIIT Foundation (media_1791461018815.jpg)
await sharp(path.join(userMediaDir, 'media_1791461018815.jpg'))
  .extract({ left: 55, top: 0, width: 890, height: 439 })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'niit-foundation.webp'));
console.log('NIIT done');

// 20. infraon (media_1791461018835.jpg)
const infRaw = await sharp(path.join(userMediaDir, 'media_1791461018835.jpg'))
  .extract({ left: 35, top: 20, width: 955, height: 220 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const infRgba = Buffer.alloc(infRaw.info.width * infRaw.info.height * 4);
for (let i = 0; i < infRaw.info.width * infRaw.info.height; i++) {
  const src = i * 3, dst = i * 4;
  const r = infRaw.data[src], g = infRaw.data[src + 1], b = infRaw.data[src + 2];
  const brightness = Math.max(r, g, b);
  let alpha = 255;
  if (brightness < 15) alpha = 0;
  else if (brightness < 40) alpha = Math.round((brightness - 15) * (255 / 25));
  infRgba[dst] = r;
  infRgba[dst + 1] = g;
  infRgba[dst + 2] = b;
  infRgba[dst + 3] = Math.min(255, alpha);
}
await sharp(infRgba, { raw: { width: infRaw.info.width, height: infRaw.info.height, channels: 4 } })
  .webp({ quality: 95 })
  .toFile(path.join(publicDir, 'infraon.webp'));
console.log('infraon done');

console.log('All 20 partners processed successfully!');
