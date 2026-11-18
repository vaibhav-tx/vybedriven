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
      .modulate({ brightness: bgBrightness, saturation: 1.2 })
      .toBuffer();
  }

  // Calculate foreground size
  let maxW = Math.round(W * fgScale);
  let maxH = Math.round(H * fgScale);

  if (isWide) {
    // For wide banners, let them span across width nicely
    maxW = Math.round(W * 0.94);
    maxH = Math.round(H * 0.78);
  } else if (isSquareOrTall) {
    // For square posters, fit height nicely inside 16:9 frame
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

// Special custom generator for Shaastra CTF
async function generateShaastraBanner(logoPath, outputPath) {
  console.log(`Generating Shaastra CTF Banner -> ${outputPath}`);

  const svgOverlay = `
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cyberBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050811" />
        <stop offset="50%" stop-color="#0a1224" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#00f59b" stop-opacity="0.18" />
        <stop offset="60%" stop-color="#0ea5e9" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="neonLine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00f59b" stop-opacity="0" />
        <stop offset="50%" stop-color="#00f59b" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#00f59b" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${W}" height="${H}" fill="url(#cyberBg)" />
    <rect width="${W}" height="${H}" fill="url(#glow)" />

    <!-- Matrix / Tech Grid Lines -->
    <g stroke="#1e293b" stroke-width="1" opacity="0.4">
      <line x1="0" y1="135" x2="${W}" y2="135" />
      <line x1="0" y1="270" x2="${W}" y2="270" />
      <line x1="0" y1="405" x2="${W}" y2="405" />
      <line x1="0" y1="540" x2="${W}" y2="540" />
      <line x1="240" y1="0" x2="240" y2="${H}" />
      <line x1="480" y1="0" x2="480" y2="${H}" />
      <line x1="720" y1="0" x2="720" y2="${H}" />
      <line x1="960" y1="0" x2="960" y2="${H}" />
    </g>

    <!-- Glowing Accent line -->
    <rect x="200" y="490" width="800" height="2" fill="url(#neonLine)" />

    <!-- Eyebrow Badge -->
    <rect x="420" y="70" width="360" height="38" rx="19" fill="#00f59b" fill-opacity="0.12" stroke="#00f59b" stroke-opacity="0.5" stroke-width="1.5" />
    <text x="600" y="95" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#00f59b" text-anchor="middle" letter-spacing="3">IIT MADRAS · SHAASTRA 2027</text>

    <!-- Main Title -->
    <text x="600" y="380" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">CTF — CAPTURE THE FLAG</text>
    
    <!-- Subtitle / Tagline -->
    <text x="600" y="435" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="1">Nationwide Cybersecurity Jeopardy-Style Challenge</text>

    <!-- Bottom Badges -->
    <rect x="360" y="525" width="220" height="42" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <text x="470" y="552" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#38bdf8" text-anchor="middle">PRIZES: ₹ 70,000</text>

    <rect x="620" y="525" width="220" height="42" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
    <text x="730" y="552" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#a7f3d0" text-anchor="middle">ONLINE + IIT MADRAS</text>
  </svg>
  `;

  // Invert the black Shaastra dice logo to crisp white for dark mode
  const whiteLogo = await sharp(logoPath)
    .negate({ alpha: false })
    .resize(260, 190, { fit: 'inside' })
    .toBuffer();

  const logoMeta = await sharp(whiteLogo).metadata();

  const bg = await sharp(Buffer.from(svgOverlay)).png().toBuffer();

  await sharp(bg)
    .composite([
      {
        input: whiteLogo,
        top: 140,
        left: Math.round((W - logoMeta.width) / 2)
      }
    ])
    .jpeg({ quality: 92 })
    .toFile(outputPath);

  console.log(`✓ Saved Shaastra Banner: ${outputPath}`);
}

async function main() {
  const brainUserUploads = 'C:/Users/SATYAM PANDEY/.gemini/antigravity/brain/672b1d78-de66-4979-984f-691ce863e01a/.user_uploaded';

  // 1. Process 5 Meetups (from original uploaded images in user_uploaded)
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794978240876_fe8dbc5b.jpg'),
    outputPath: 'public/events/semiconductor-deep-dive-hackerfab.jpg',
    bgBlur: 35,
    bgBrightness: 0.5,
    fgScale: 0.88
  });

  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794978332683_0930aaff.jpg'),
    outputPath: 'public/events/mumbai-community-year-end-meet.jpg',
    bgBlur: 35,
    bgBrightness: 0.65,
    fgScale: 0.88
  });

  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794978484468_96e56181.jpg'),
    outputPath: 'public/events/paranormal-real-or-not-versova.jpg',
    bgBlur: 35,
    bgBrightness: 0.45,
    fgScale: 0.88
  });

  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794978588919_ad11747f.jpg'),
    outputPath: 'public/events/lovable-builders-bangalore.jpg',
    bgBlur: 35,
    bgBrightness: 0.7,
    fgScale: 0.88
  });

  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794978696241_4ac480cb.jpg'),
    outputPath: 'public/events/the-big-aaaart-club-delhi.jpg',
    bgBlur: 35,
    bgBrightness: 0.65,
    fgScale: 0.88
  });

  // 2. Process 5 Hackathons & Competitions
  // Code Relay 5.0 - IIT Bhubaneswar
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794981157941_c6a7a31d.jpg'),
    outputPath: 'public/events/code-relay-5-iit-bhubaneswar.jpg',
    bgBlur: 25,
    bgBrightness: 0.55,
    fgScale: 0.94
  });

  // Hacksprint 3.0 - KAHE Coimbatore
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794981233735_86aaf686.jpg'),
    outputPath: 'public/events/hacksprint-3-kahe-coimbatore.jpg',
    bgBlur: 25,
    bgBrightness: 0.5,
    fgScale: 0.94
  });

  // Skysparks Boeing Aeromodelling - Techkriti IIT Kanpur
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794981294228_fe2ca77f.jpg'),
    outputPath: 'public/events/skysparks-techkriti-iit-kanpur.jpg',
    customBgColor: { r: 8, g: 8, b: 10 },
    fgScale: 0.94
  });

  // Shaastra 2027 CTF - IIT Madras
  await generateShaastraBanner(
    path.join(brainUserUploads, 'media_1794981438765_c53e429e.png'),
    'public/events/shaastra-ctf-iit-madras.jpg'
  );

  // LightHouse Hackathon - Chandigarh University
  await createAmbientBanner({
    inputPath: path.join(brainUserUploads, 'media_1794981558923_be394bcd.jpg'),
    outputPath: 'public/events/lighthouse-hackathon-chandigarh.jpg',
    customBgColor: { r: 5, g: 5, b: 8 },
    fgScale: 0.94
  });

  console.log('All 10 banners successfully generated in 16:9 ratio!');
}

main().catch(console.error);
