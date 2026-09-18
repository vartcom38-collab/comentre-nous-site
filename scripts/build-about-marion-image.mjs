import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = 'https://pikaso.cdnpk.net/private/production/5488104320/3610280438.png?token=exp=1790035200~hmac=8a37f4da715e27b150d20241ae5014648636751a10c1889b771c4b245ac18e39';

const response = await fetch(source);
if (!response.ok) throw new Error(`Impossible de télécharger la photo de Marion : ${response.status} ${response.statusText}`);

const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 100000) throw new Error(`Photo de Marion anormalement petite : ${bytes.length} octets`);

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const target = path.join(uploadsDir, 'a-propos-marion.png');
fs.writeFileSync(target, bytes);

console.log(`Photo de Marion téléchargée : ${target} (${bytes.length} octets)`);
