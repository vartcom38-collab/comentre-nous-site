import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const paperPath = path.join(root, 'content', 'papeterie.json');
const paper = JSON.parse(fs.readFileSync(paperPath, 'utf8'));
const image = String(paper?.hero?.image || '');

if (!image.startsWith('data:image/')) {
  console.log('Aucune image encodée dans content/papeterie.json, génération du hero ignorée.');
  process.exit(0);
}

const match = image.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,(.+)$/s);
if (!match) throw new Error('Format de l’image du hero Papeterie invalide.');

const mime = match[1].toLowerCase();
const extension = mime.includes('png') ? 'png' : mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'webp';
const base64 = match[2].replace(/\s/g, '');

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

for (const ext of ['webp', 'jpg', 'png']) {
  const oldFile = path.join(uploadsDir, `papeterie-hero.${ext}`);
  if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
}

const targetFile = path.join(uploadsDir, `papeterie-hero.${extension}`);
fs.writeFileSync(targetFile, Buffer.from(base64, 'base64'));

const publicPath = `/uploads/papeterie-hero.${extension}`;
paper.hero.image = publicPath;
fs.writeFileSync(paperPath, `${JSON.stringify(paper, null, 2)}\n`);

console.log(`Papeterie hero généré : ${targetFile}`);
console.log(`Papeterie hero configuré sur : ${publicPath}`);
