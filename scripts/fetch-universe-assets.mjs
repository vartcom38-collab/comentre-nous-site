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
  },
  {
    name: 'home-hero-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5429342431/3581265061.png?token=exp=1789516800~hmac=9f20cdd0c8d6250258d06ff5c6d9af65d93eb42bbc06c770650bb20e2420d024'
  },
  {
    name: 'home-hero-mobile-hd.png',
    url: 'https://pikaso.cdnpk.net/private/production/5429342802/3581265208.png?token=exp=1789516800~hmac=8512250699637080f8889955b047ad33367c325ed425cb06575183069354a89f'
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

const foundersUrl = 'https://pikaso.cdnpk.net/private/production/5442437369/3587832354.jpg?token=exp=1789776000~hmac=d1d47e2c94d3062cff280fa2a66bd4cd1321f99ca8b706fb2ce6b15d921bd7c4';
const foundersResponse = await fetch(foundersUrl);
if (!foundersResponse.ok) {
  throw new Error(`Unable to fetch founders portrait: ${foundersResponse.status} ${foundersResponse.statusText}`);
}
const foundersBytes = Buffer.from(await foundersResponse.arrayBuffer());
const uploadsDir = path.join(publicDir, 'uploads');
await mkdir(uploadsDir, { recursive: true });
await writeFile(path.join(uploadsDir, 'marion-aurelie-founders-hq.jpg'), foundersBytes);
console.log(`Downloaded marion-aurelie-founders-hq.jpg (${foundersBytes.length} bytes)`);

const familyHeroUrl = 'https://pikaso.cdnpk.net/private/production/5442987590/3588110698.png?token=exp=1789776000~hmac=5ff677654f204d5036862879c9f0337facf4385e4a6daa631049b06a210c0db7';
const familyHeroResponse = await fetch(familyHeroUrl);
if (!familyHeroResponse.ok) {
  throw new Error(`Unable to fetch family hero: ${familyHeroResponse.status} ${familyHeroResponse.statusText}`);
}
const familyHeroBytes = Buffer.from(await familyHeroResponse.arrayBuffer());
await writeFile(path.join(uploadsDir, 'family-hero-com-en-famille.png'), familyHeroBytes);
console.log(`Downloaded family-hero-com-en-famille.png (${familyHeroBytes.length} bytes)`);

const familyCharactersUrl = 'https://pikaso.cdnpk.net/private/production/5443150074/3588191483.png?token=exp=1789776000~hmac=5eb85a2459e11164cd38bd912486f8242b39c73ef7950db5ca13d17e227aa5f8';
const familyCharactersResponse = await fetch(familyCharactersUrl);
if (!familyCharactersResponse.ok) {
  throw new Error(`Unable to fetch family characters: ${familyCharactersResponse.status} ${familyCharactersResponse.statusText}`);
}
const familyCharactersBytes = Buffer.from(await familyCharactersResponse.arrayBuffer());
await writeFile(path.join(uploadsDir, 'family-characters-link.png'), familyCharactersBytes);
console.log(`Downloaded family-characters-link.png (${familyCharactersBytes.length} bytes)`);

const entrepreneurHeroUrl = 'https://pikaso.cdnpk.net/private/production/5443742005/3588487672.png?token=exp=1789776000~hmac=079b1d92a0f0192ee443ded06f349ed5deffa40dad9df51d7250a35e29646e61';
const entrepreneurHeroResponse = await fetch(entrepreneurHeroUrl);
if (!entrepreneurHeroResponse.ok) {
  throw new Error(`Unable to fetch entrepreneurs hero: ${entrepreneurHeroResponse.status} ${entrepreneurHeroResponse.statusText}`);
}
const entrepreneurHeroBytes = Buffer.from(await entrepreneurHeroResponse.arrayBuffer());
await writeFile(path.join(uploadsDir, 'entrepreneurs-hero-com-murmure.png'), entrepreneurHeroBytes);
console.log(`Downloaded entrepreneurs-hero-com-murmure.png (${entrepreneurHeroBytes.length} bytes)`);
