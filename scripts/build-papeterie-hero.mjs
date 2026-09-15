import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const paperPath = path.join(root, 'content', 'papeterie.json');
const paper = JSON.parse(fs.readFileSync(paperPath, 'utf8'));

const sourceFiles = [
  path.join(root, 'src', 'data', 'papeterieHeroHQ0.txt'),
  path.join(root, 'src', 'data', 'papeterieHeroHQ1.txt'),
];

const base64 = sourceFiles
  .map((file) => fs.readFileSync(file, 'utf8').replace(/\s/g, ''))
  .join('');

if (!base64) throw new Error('Image HQ Papeterie introuvable.');

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

for (const ext of ['webp', 'jpg', 'png']) {
  const oldFile = path.join(uploadsDir, `papeterie-hero.${ext}`);
  if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
}

const targetFile = path.join(uploadsDir, 'papeterie-hero.webp');
fs.writeFileSync(targetFile, Buffer.from(base64, 'base64'));

paper.hero.image = '/uploads/papeterie-hero.webp';
fs.writeFileSync(paperPath, `${JSON.stringify(paper, null, 2)}\n`);

console.log(`Papeterie hero HQ généré : ${targetFile}`);
console.log(`Papeterie hero configuré sur : ${paper.hero.image}`);
