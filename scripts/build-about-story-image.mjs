import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const approvedPhotoUrl = 'https://pikaso.cdnpk.net/private/production/5486516952/3609494529.png?token=exp=1790035200~hmac=38e25ab60ea9a9c06ad9941c44a389a7f7290f5c830b85fe48c4d46583a1e4be';

const response = await fetch(approvedPhotoUrl);
if (!response.ok) {
  throw new Error(`Impossible de télécharger la photo Notre histoire : ${response.status} ${response.statusText}`);
}

const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 100000) {
  throw new Error(`Photo Notre histoire téléchargée anormalement petite : ${bytes.length} octets`);
}

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const targetFile = path.join(uploadsDir, 'a-propos-notre-histoire.png');
fs.writeFileSync(targetFile, bytes);

console.log(`Photo Notre histoire téléchargée : ${targetFile} (${bytes.length} octets)`);
