import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const assets = [
  {
    name: 'universe-family-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5426781477/3580008901.jpg?token=exp=1789516800~hmac=63c6b8d37923756683d56c119fa4fa7983f6379c3ab67b5593692d655362b5c0'
  },
  {
    name: 'universe-business-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5426780793/3580008562.jpg?token=exp=1789516800~hmac=bc3b610425d247cca7cbc179cf0fd78ba4cbfbf3c31d9ef9bed0c586e5d61bff'
  },
  {
    name: 'universe-paper-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5426780348/3580008353.jpg?token=exp=1789516800~hmac=04bf31000dbd95580333ab74e4ec9290655898974a4accbfa88a6b2eb75e2929'
  }
];

const publicDir = path.join(process.cwd(), 'public');
await mkdir(publicDir, { recursive: true });

for (const asset of assets) {
  const response = await fetch(asset.url);
  if (!response.ok) {
    throw new Error(`Unable to fetch ${asset.name}: ${response.status} ${response.statusText}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(publicDir, asset.name), bytes);
  console.log(`Downloaded ${asset.name} (${bytes.length} bytes)`);
}
