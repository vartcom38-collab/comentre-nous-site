import catalog from '../../content/products.json';

export type Product = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  universe: string;
  category: string;
  type: string;
  price: string;
  compareAtPrice?: string;
  image?: string;
  gallery?: string[];
  badge?: string;
  age?: string;
  format?: string;
  shortDescription?: string;
  longDescription?: string;
  highlights?: string[];
  included?: string[];
  usage?: string;
  care?: string;
  buyLabel: string;
  buyUrl: string;
  purchaseChannel?: 'none' | 'amazon' | 'stripe' | 'external';
  amazonUrl?: string;
  stripeUrl?: string;
  externalUrl?: string;
  paymentNote?: string;
  workflowStatus?: 'draft' | 'ready' | 'published' | 'hidden' | 'archived';
  color: string;
  deliveryType?: string;
  stockStatus?: string;
  stockQuantity?: number;
  sku?: string;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  featured: boolean;
  new: boolean;
  createdAt: string;
  updatedAt?: string;
  description: string;
};

export const allProducts: Product[] = (catalog as Omit<Product, 'description'>[]).map((product) => ({
  ...product,
  description: product.shortDescription || product.tagline || '',
}));

export const products: Product[] = allProducts.filter((product) => product.published);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getAnyProduct(slug: string) {
  return allProducts.find((product) => product.slug === slug);
}

export function getPurchaseUrl(product: Product) {
  if (product.purchaseChannel === 'amazon') return product.amazonUrl || product.buyUrl;
  if (product.purchaseChannel === 'stripe') return product.stripeUrl || product.buyUrl;
  if (product.purchaseChannel === 'external') return product.externalUrl || product.buyUrl;
  return product.buyUrl;
}
