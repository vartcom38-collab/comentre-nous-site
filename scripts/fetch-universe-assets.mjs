import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const assets = [
  {
    name: 'universe-family-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5424523101/3578923856.png?token=exp=1789516800~hmac=743ad0712f40c3a4adeb1ba49fd8ba636e9d2e3261cae2631108f80a449134ec'
  },
  {
    name: 'universe-business-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5424524591/3578924659.png?token=exp=1789516800~hmac=154fe739727baf4f50ee4baad4a425144f5477071a01e3b15957bc5a59866f16'
  },
  {
    name: 'universe-paper-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5424525654/3578925214.png?token=exp=1789516800~hmac=de129f8855ed95a5df1e00cc6ea133a7efaee60f22978ee169b481e4534dedf4'
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
