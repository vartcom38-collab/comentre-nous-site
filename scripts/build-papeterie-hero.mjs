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

// Embed the image directly into the generated static HTML.
// This removes any dependency on FTP paths, MIME types or /uploads serving.
paper.hero.image = `data:image/webp;base64,${base64}`;
fs.writeFileSync(paperPath, `${JSON.stringify(paper, null, 2)}\n`);

console.log(`Papeterie hero HQ intégré directement dans la page (${base64.length} caractères base64).`);
