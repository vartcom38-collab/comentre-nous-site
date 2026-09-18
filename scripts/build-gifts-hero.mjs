import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentPath = path.join(root, 'content', 'gifts.json');
const gifts = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

const approvedHeroUrl = 'https://pikaso.cdnpk.net/private/production/5485419431/3608940485.png?token=exp=1790035200~hmac=93a68a0d2bc7c666accdbcf1163ddb76df71dc9a7173b6a15b97e54dcc4e2ff2';

const response = await fetch(approvedHeroUrl);
if (!response.ok) {
  throw new Error(`Impossible de télécharger le hero Petits cadeaux approuvé : ${response.status} ${response.statusText}`);
}

const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 100000) {
  throw new Error(`Hero Petits cadeaux téléchargé anormalement petit : ${bytes.length} octets`);
}

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const targetFile = path.join(uploadsDir, 'petits-cadeaux-hero-photo.png');
fs.writeFileSync(targetFile, bytes);

gifts.page.heroImage = '/uploads/petits-cadeaux-hero-photo.png?v=20260918b';
fs.writeFileSync(contentPath, `${JSON.stringify(gifts, null, 2)}\n`);

console.log(`Hero Petits cadeaux approuvé téléchargé : ${targetFile} (${bytes.length} octets)`);
