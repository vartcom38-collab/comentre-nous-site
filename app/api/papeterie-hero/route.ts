import part0 from '@/src/data/papeterieHero0';
import part1 from '@/src/data/papeterieHero1';
import part2 from '@/src/data/papeterieHero2';

export const dynamic = 'force-static';

export function GET(){
  const image = Buffer.from(part0 + part1 + part2, 'base64');
  return new Response(image, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
