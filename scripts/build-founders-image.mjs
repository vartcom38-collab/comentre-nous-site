import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), 'assets', 'founders-photo');
const files = [
  'part0.txt',
  'part1.txt',
  'part2.txt',
  'part3.txt',
  'rem0.txt',
  'rem1.txt',
  'rem2.txt',
  'rem3.txt',
  'rem4.txt',
  'rem5.txt',
  'rem6.txt',
  'rem7.txt'
];

const parts = [];
for (const file of files) {
  parts.push((await readFile(join(root, file), 'utf8')).trim());
}

const bytes = Buffer.from(parts.join(''), 'base64');
const uploads = join(process.cwd(), 'public', 'uploads');
await mkdir(uploads, { recursive: true });
await writeFile(join(uploads, 'marion-aurelie-home-crisp.webp'), bytes);

console.log(`Built founders photo (${bytes.length} bytes)`);
