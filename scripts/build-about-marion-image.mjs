import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = 'https://pikaso.cdnpk.net/private/production/5488104320/3610280438.png?token=exp=1790035200~hmac=8a37f4da715e27b150d20241ae5014648636751a10c1889b771c4b245ac18e39';
const uploadsDir = path.join(root, 'public', 'uploads');
const target = path.join(uploadsDir, 'a-propos-marion.png');

fs.mkdirSync(uploadsDir, { recursive: true });

try {
  const response = await fetch(source);
  if (!response.ok) {
    console.warn(`Photo de Marion indisponible à la génération : ${response.status} ${response.statusText}. Le déploiement continue et conserve le fichier déjà présent sur l’hébergement.`);
    process.exit(0);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100000) {
    console.warn(`Photo de Marion anormalement petite : ${bytes.length} octets. Le déploiement continue sans remplacer l’image existante.`);
    process.exit(0);
  }

  fs.writeFileSync(target, bytes);
  console.log(`Photo de Marion téléchargée : ${target} (${bytes.length} octets)`);
} catch (error) {
  console.warn(`Photo de Marion non régénérée : ${error instanceof Error ? error.message : String(error)}. Le déploiement continue sans remplacer l’image existante.`);
}
