import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const products = JSON.parse(await readFile(path.join(root, 'content/products.json'), 'utf8'));
const operations = JSON.parse(await readFile(path.join(root, 'content/papeterie-operations.json'), 'utf8'));

function cents(value) {
  if (typeof value === 'number') return Math.round(value * 100);
  const cleaned = String(value ?? '').replace(/\s/g, '').replace('€', '').replace(',', '.').replace(/[^0-9.-]/g, '');
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 100) : null;
}

const papeterie = products
  .filter((product) => product.category === 'papeterie' || product.universe === 'Papeterie')
  .map((product) => {
    const rawOptions = Array.isArray(product.purchaseOptions) && product.purchaseOptions.length
      ? product.purchaseOptions
      : [{
          id: `${product.id}-default`,
          label: product.deliveryType === 'digital' ? 'Version numérique' : 'Version papier',
          kind: product.deliveryType === 'digital' ? 'digital' : 'physical',
          price: product.price,
          format: product.format || '',
        }];
    const options = rawOptions.map((option) => ({
      id: String(option.id || `${product.id}-default`),
      label: String(option.label || 'Produit'),
      kind: String(option.kind || product.deliveryType || 'physical'),
      priceCents: cents(option.price ?? product.price),
      format: String(option.format || product.format || ''),
      paymentOwner: 'aurelie',
      paymentChannel: 'stripe',
    })).filter((option) => Number.isInteger(option.priceCents));
    return {
      id: String(product.id),
      title: String(product.title || ''),
      slug: String(product.slug || ''),
      published: Boolean(product.published),
      stockStatus: String(product.stockStatus || ''),
      stockQuantity: Number(product.stockQuantity || 0),
      options,
      paymentOwner: 'aurelie',
      paymentChannel: 'stripe',
    };
  });

const payload = {
  generatedAt: new Date().toISOString(),
  currency: 'EUR',
  paymentOwner: 'aurelie',
  paymentChannel: 'stripe',
  products: papeterie,
  shipping: {
    franceEnabled: Boolean(operations?.shipping?.franceEnabled),
    franceFlatRateCents: cents(operations?.shipping?.franceFlatRate) ?? 0,
    europeEnabled: Boolean(operations?.shipping?.europeEnabled),
    europeFlatRateCents: cents(operations?.shipping?.europeFlatRate) ?? 0,
    freeShippingThresholdCents: cents(operations?.shipping?.freeShippingThreshold) ?? 0,
    pickupEnabled: Boolean(operations?.shipping?.pickupEnabled),
  },
};

const outDir = path.join(root, 'public/api/comentre');
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, 'papeterie-catalog.json'), JSON.stringify(payload, null, 2) + '\n');
console.log(`Papeterie checkout catalog built: ${papeterie.length} product(s).`);
