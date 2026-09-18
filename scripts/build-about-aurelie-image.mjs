import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = 'https://pikaso.cdnpk.net/private/production/5488045696/3610251322.png?token=exp=1790035200~hmac=a96ae6217a536eea3436284cd6b8ae084081aedb429ee764a00aaf1d34e0fe14';

const response = await fetch(source);
if (!response.ok) throw new Error(`Impossible de télécharger la photo d’Aurélie : ${response.status} ${response.statusText}`);

const bytes = Buffer.from(await response.arrayBuffer());
if (bytes.length < 100000) throw new Error(`Photo d’Aurélie anormalement petite : ${bytes.length} octets`);

const uploadsDir = path.join(root, 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const target = path.join(uploadsDir, 'a-propos-aurelie.png');
fs.writeFileSync(target, bytes);

console.log(`Photo d’Aurélie téléchargée : ${target} (${bytes.length} octets)`);
