import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const paperPath = path.join(root, 'content', 'papeterie.json');
const paper = JSON.parse(fs.readFileSync(paperPath, 'utf8'));

const sourceFiles = [
  path.join(root, 'src', 'data', 'papeterieHero0.ts'),
  path.join(root, 'src', 'data', 'papeterieHero1.ts'),
  path.join(root, 'src', 'data', 'papeterieHero2.ts'),
];

const base64 = sourceFiles
  .map((file) => {
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(/export default\s+"([A-Za-z0-9+/=]+)";?/s);
    if (!match) throw new Error(`Impossible de lire ${file}`);
    return match[1];
  })
  .join('');

if (!base64.startsWith('UklG')) throw new Error('Image Papeterie approuvée invalide.');

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const targetFile = path.join(uploadsDir, 'papeterie-hero.webp');
fs.writeFileSync(targetFile, Buffer.from(base64, 'base64'));

paper.hero.image = '/uploads/papeterie-hero.webp';
fs.writeFileSync(paperPath, `${JSON.stringify(paper, null, 2)}\n`);

console.log(`Papeterie hero approuvé généré : ${targetFile}`);
console.log(`Papeterie hero configuré sur : ${paper.hero.image}`);
