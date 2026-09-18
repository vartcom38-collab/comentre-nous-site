import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'assets', 'gifts-hero', 'source.txt');
const uploadsDir = path.join(root, 'public', 'uploads');
const outputPath = path.join(uploadsDir, 'petits-cadeaux-hero-photo.jpg');

const b64 = fs.readFileSync(sourcePath, 'utf8').trim();
const bytes = Buffer.from(b64, 'base64');

if (bytes.length < 5000) {
  throw new Error(`Petits cadeaux hero source is unexpectedly small: ${bytes.length} bytes`);
}

fs.mkdirSync(uploadsDir, { recursive: true });
fs.writeFileSync(outputPath, bytes);

console.log(`Built Petits cadeaux hero (${bytes.length} bytes)`);
