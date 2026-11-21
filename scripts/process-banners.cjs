const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const W = 1200;
const H = 675;

// Helper to create 16:9 ambient banner from any aspect ratio image
async function createAmbientBanner({ inputPath, outputPath, bgBlur = 35, bgBrightness = 0.55, fgScale = 0.92, customBgColor }) {
  console.log(`Processing: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);

  const inputMeta = await sharp(inputPath).metadata();
  const isWide = inputMeta.width / inputMeta.height > 2.2;
  const isSquareOrTall = inputMeta.width / inputMeta.height < 1.3;

  let bgBuffer;
  if (customBgColor) {
    bgBuffer = await sharp({
      create: {
        width: W,
        height: H,
        channels: 3,
        background: customBgColor
      }
    }).png().toBuffer();
  } else {
    bgBuffer = await sharp(inputPath)
      .resize(W, H, { fit: 'cover' })
      .blur(bgBlur)
      .modulate({ brightness: bgBrightness, saturation: 1.3 })
      .toBuffer();
  }

  // Calculate foreground size
  let maxW = Math.round(W * fgScale);
  let maxH = Math.round(H * fgScale);

  if (isWide) {
    maxW = Math.round(W * 0.94);
    maxH = Math.round(H * 0.78);
  } else if (isSquareOrTall) {
    maxH = Math.round(H * 0.90);
    maxW = Math.round(W * 0.65);
  }

  const fgBuffer = await sharp(inputPath)
    .resize(maxW, maxH, { fit: 'inside' })
    .toBuffer();

  const fgMeta = await sharp(fgBuffer).metadata();

  const left = Math.round((W - fgMeta.width) / 2);
  const top = Math.round((H - fgMeta.height) / 2);

  await sharp(bgBuffer)
    .composite([
      {
        input: fgBuffer,
        top,
        left
      }
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(outputPath);

  console.log(`✓ Saved: ${outputPath} (${W}x${H})`);
}

async function main() {
  const brainUserUploads = 'C:/Users/SATYAM PANDEY/.gemini/antigravity/brain/672b1d78-de66-4979-984f-691ce863e01a/.user_uploaded';

  // 5 New Events
  // 1. Bangalore Product Mixer #4
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794982314897_d45d6c3c.png'),
    outputPath: 'public/events/bangalore-product-mixer.webp',
    bgBlur: 35,
    bgBrightness: 0.6,
    fgScale: 0.88
  });

  // 2. DesignMyx'26 Myntra
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794982357844_69a340fd.png'),
    outputPath: 'public/events/designmyx-myntra-bangalore.webp',
    bgBlur: 35,
    bgBrightness: 0.55,
    fgScale: 0.88
  });

  // 3. Nerds Winter of Code
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794982411796_9d5b97fd.jpg'),
    outputPath: 'public/events/nerds-winter-of-code.webp',
    bgBlur: 35,
    bgBrightness: 0.65,
    fgScale: 0.88
  });

  // 4. UNBOXED: Reimagining STEM Education
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794982469011_2f0b50a9.png'),
    outputPath: 'public/events/unboxed-stem-education.webp',
    bgBlur: 35,
    bgBrightness: 0.55,
    fgScale: 0.88
  });

  // 5. Apify AI Tools that Earn Hackathon
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794982568814_e266f694.png'),
    outputPath: 'public/events/apify-ai-tools-that-earn.webp',
    bgBlur: 30,
    bgBrightness: 0.5,
    fgScale: 0.88
  });

  console.log('All 5 new banners generated in 16:9 ratio!');
}

main().catch(console.error);
