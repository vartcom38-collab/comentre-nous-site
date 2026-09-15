import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const paperPath = path.join(root, 'content', 'papeterie.json');
const paper = JSON.parse(fs.readFileSync(paperPath, 'utf8'));

const approvedHeroUrl = 'https://pikaso.cdnpk.net/private/production/5453508533/3593315163.webp?token=exp=1789776000~hmac=5d8173ab0a8d96ef638ebf88a02370f97fd80e4785c08cb9aca483e610f16e99';

const response = await fetch(approvedHeroUrl);
if (!response.ok) {
  throw new Error(`Impossible de télécharger le hero Papeterie approuvé : ${response.status} ${response.statusText}`);
}

const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 100000) {
  throw new Error(`Hero Papeterie téléchargé anormalement petit : ${bytes.length} octets`);
}

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const targetFile = path.join(uploadsDir, 'papeterie-hero.webp');
fs.writeFileSync(targetFile, bytes);

paper.hero.image = '/uploads/papeterie-hero.webp';
fs.writeFileSync(paperPath, `${JSON.stringify(paper, null, 2)}\n`);

console.log(`Papeterie hero approuvé téléchargé : ${targetFile} (${bytes.length} octets)`);
