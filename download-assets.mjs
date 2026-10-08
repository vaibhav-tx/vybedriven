import fs from 'fs';
import path from 'path';
import https from 'https';

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, 'src', 'assets');
const publicDir = path.join(rootDir, 'public');
const cdnHost = '5f5288a1-f6cb-46b2-ac33-85d0a2cc472a.lovableproject.com';

function downloadFile(urlPath, dest) {
  return new Promise((resolve, reject) => {
    // If file already exists and is non-empty, keep it
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`Skipping already existing file: ${dest}`);
      return resolve();
    }

    const fullUrl = `https://${cdnHost}${urlPath}`;
    console.log(`Downloading ${fullUrl} to ${dest}`);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempDest = `${dest}.tmp`;
    const file = fs.createWriteStream(tempDest);
    https.get(fullUrl, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(tempDest, () => {});
        reject(new Error(`Failed to download ${fullUrl}, status code: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        fs.renameSync(tempDest, dest);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(tempDest, () => {});
      reject(err);
    });
  });
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.asset.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (content.url) {
          const destPath = path.join(publicDir, content.url);
          await downloadFile(content.url, destPath);
        }
      } catch (err) {
        console.error(`Error processing ${fullPath}: ${err.message}`);
      }
    }
  }
}

async function run() {
  console.log('Starting asset download...');
  await processDirectory(assetsDir);
  console.log('Finished downloading all assets.');
}

run();
