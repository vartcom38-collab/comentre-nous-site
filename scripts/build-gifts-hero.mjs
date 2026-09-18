import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentPath = path.join(root, 'content', 'gifts.json');
const uploadsDir = path.join(root, 'public', 'uploads');
const outputName = 'petits-cadeaux-hero-photo.jpg';
const outputPath = path.join(uploadsDir, outputName);

const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const hero = String(data?.page?.heroImage || '');

if (hero.startsWith('data:image/')) {
  const match = hero.match(/^data:image\/(?:jpeg|jpg);base64,(.+)$/s);
  if (!match) {
    throw new Error('Unsupported Petits cadeaux hero data URI.');
  }
  fs.mkdirSync(uploadsDir, {recursive:true});
  fs.writeFileSync(outputPath, Buffer.from(match[1], 'base64'));
  data.page.heroImage = '/uploads/' + outputName;
  fs.writeFileSync(contentPath, JSON.stringify(data, null, 2) + '\n');
  console.log('Built Petits cadeaux hero:', outputPath, fs.statSync(outputPath).size, 'bytes');
} else {
  console.log('Petits cadeaux hero already uses a regular asset path.');
}
