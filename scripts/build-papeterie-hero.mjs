import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceFiles = [0, 1, 2].map((index) =>
  path.join(root, 'src', 'data', `papeterieHero${index}.ts`)
);

const parts = sourceFiles.map((file) => {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/export default ["']([\s\S]*?)["'];?\s*$/);
  if (!match) throw new Error(`Impossible de lire ${file}`);
  return match[1];
});

const targetDir = path.join(root, 'public');
const targetFile = path.join(targetDir, 'papeterie-hero.webp');
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetFile, Buffer.from(parts.join(''), 'base64'));
console.log(`Papeterie hero généré : ${targetFile}`);
