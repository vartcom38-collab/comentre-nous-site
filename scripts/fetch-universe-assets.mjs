import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const assets = [
  {
    name: 'universe-family-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5426798905/3580017407.jpg?token=exp=1789516800~hmac=57c1b6df5122cb16b6d896a837e971fe526fb0bbf0272546049c67027dd9379a'
  },
  {
    name: 'universe-business-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5426799537/3580017751.jpg?token=exp=1789516800~hmac=2d16ffd7b9b46f0b3aab2e6c71fbf9da140d8a66e1d502b628e4e1a448e20982'
  },
  {
    name: 'universe-paper-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5426800156/3580017991.jpg?token=exp=1789516800~hmac=6d51af3cfe6bf245c19f602d558a3f522f4a7b90386963476e147f92e9150c9b'
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
