import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LayoutShell } from '@/components/Site';
import { getProduct, products } from '@/src/data/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <LayoutShell>
      <main>
        <section className="page-intro">
          <p className="tag">{product.universe} · {product.type}</p>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
        </section>

        <section className="content-card product-detail">
          <div className={`product-detail-visual ${product.color}`}>
            <span>{product.type}</span>
            <strong>{product.title}</strong>
          </div>
          <div className="product-detail-copy">
            <h2>{product.price}</h2>
            <p>Cette fiche produit est prête à recevoir une vraie image, une description longue, des détails, des avis, un lien Amazon ou un lien de paiement.</p>
            <a className="dark-btn" href={product.buyUrl}>{product.buyLabel} / Acheter →</a>
            <br />
            <Link className="back-link" href="/boutique">← Retour à la boutique</Link>
          </div>
        </section>
      </main>
    </LayoutShell>
  );
}
