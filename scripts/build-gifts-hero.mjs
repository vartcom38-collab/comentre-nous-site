import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentPath = path.join(root, 'content', 'gifts.json');
const gifts = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const approvedHeroUrl = 'https://pikaso.cdnpk.net/private/production/5485298879/3608879737.jpg?token=exp=1790035200~hmac=6645148a9196db6afd3c1e78d0117badb65d713badf7a55d8d5ad8818810f6a9';

const response = await fetch(approvedHeroUrl);
if (!response.ok) {
  throw new Error(`Impossible de télécharger le hero Petits cadeaux approuvé : ${response.status} ${response.statusText}`);
}

const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 30000) {
  throw new Error(`Hero Petits cadeaux téléchargé anormalement petit : ${bytes.length} octets`);
}

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const targetFile = path.join(uploadsDir, 'petits-cadeaux-hero-photo.jpg');
fs.writeFileSync(targetFile, bytes);

gifts.page.heroImage = '/uploads/petits-cadeaux-hero-photo.jpg?v=20260918';
fs.writeFileSync(contentPath, `${JSON.stringify(gifts, null, 2)}\n`);

console.log(`Hero Petits cadeaux approuvé téléchargé : ${targetFile} (${bytes.length} octets)`);
