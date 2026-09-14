import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LayoutShell } from '@/components/Site';
import { getProduct, getPurchaseOptions, products } from '@/src/data/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const purchaseOptions = getPurchaseOptions(product);
  const prices = purchaseOptions.map((option) => option.price).filter(Boolean) as string[];
  const displayPrice = prices.length > 1 ? `À partir de ${prices[0]}` : (prices[0] || product.price);

  return (
    <LayoutShell>
      <main className="product-page-rich">
        <section className="product-hero-rich">
          <div className="product-gallery-rich">
            <div className={`product-main-rich ${product.color}`}>
              {product.image ? <img src={product.image} alt={product.title} /> : <><span>{product.type}</span><strong>{product.title}</strong></>}
              {product.badge && <em className="product-image-badge">{product.badge}</em>}
            </div>
            {!!product.gallery?.length && <div className="product-thumbs-rich">{product.gallery.map((image, index) => <img src={image} alt={`${product.title} ${index + 1}`} key={image + index} />)}</div>}
          </div>
          <div className="product-info-rich">
            <p className="tag">{product.universe} · {product.type}</p>
            <h1>{product.title}</h1>
            <p className="product-tagline-rich">{product.tagline}</p>
            <div className="product-price-rich"><strong>{displayPrice}</strong>{purchaseOptions.length <= 1 && product.compareAtPrice && <del>{product.compareAtPrice}</del>}</div>
            <p>{product.shortDescription}</p>
            <div className="product-meta-rich">
              {product.age && <span><b>Public</b>{product.age}</span>}
              {product.format && <span><b>Format</b>{product.format}</span>}
              {product.stockStatus && <span><b>Disponibilité</b>{product.stockStatus === 'available' ? 'Disponible' : product.stockStatus === 'preorder' ? 'Précommande' : product.stockStatus === 'out' ? 'Rupture' : 'Bientôt'}</span>}
            </div>

            {purchaseOptions.length > 0 ? <div className="purchase-options-rich">
              {purchaseOptions.map((option) => <article className="purchase-option-rich" key={option.id}>
                <div className="purchase-option-copy">
                  <div className="purchase-option-title-row"><h3>{option.label}</h3>{option.kind === 'digital' && <span className="digital-pill">À télécharger</span>}</div>
                  {(option.format || option.note) && <p>{[option.format, option.note].filter(Boolean).join(' · ')}</p>}
                  <div className="purchase-option-price">{option.price && <strong>{option.price}</strong>}{option.compareAtPrice && <del>{option.compareAtPrice}</del>}</div>
                </div>
                {option.url ? <a className={`dark-btn purchase-btn ${option.channel}`} href={option.url} target="_blank" rel="noopener noreferrer">{option.buttonLabel || (option.channel === 'amazon' ? 'Acheter sur Amazon' : 'Acheter')} →</a> : <span className="dark-btn disabled-buy">Bientôt disponible</span>}
                {option.kind === 'digital' && option.downloadKey && <small className="secure-note">Le fichier sera associé à l’achat et ne sera pas exposé publiquement.</small>}
              </article>)}
            </div> : <span className="dark-btn disabled-buy">Bientôt disponible</span>}

            {purchaseOptions.some((option) => option.channel === 'amazon') && <p className="purchase-note">Les versions Amazon sont achetées et livrées directement par Amazon.</p>}
            {purchaseOptions.some((option) => option.channel === 'stripe') && <p className="purchase-note">Paiement sécurisé via Stripe pour les versions vendues directement.</p>}
          </div>
        </section>

        {(product.longDescription || product.highlights?.length || product.included?.length || product.usage || product.care) && <section className="product-content-rich">
          {product.longDescription && <article><p className="tag">En quelques mots</p><h2>Tout savoir sur {product.title}</h2><p className="long-copy-rich">{product.longDescription}</p></article>}
          {!!product.highlights?.length && <article><p className="tag">Pourquoi on l’aime</p><h2>Les petits plus</h2><ul>{product.highlights.map((item) => <li key={item}>{item}</li>)}</ul></article>}
          {!!product.included?.length && <article><p className="tag">Dans le produit</p><h2>Ce qui est inclus</h2><ul>{product.included.map((item) => <li key={item}>{item}</li>)}</ul></article>}
          {product.usage && <article><p className="tag">Utilisation</p><h2>Comment l’utiliser</h2><p>{product.usage}</p></article>}
          {product.care && <article><p className="tag">Bon à savoir</p><h2>Informations complémentaires</h2><p>{product.care}</p></article>}
        </section>}
        <div className="product-back-rich"><Link href="/boutique">← Retour à la boutique</Link></div>
        <style>{css}</style>
      </main>
    </LayoutShell>
  );
}

const css = `.product-page-rich{width:min(1400px,calc(100% - 2rem));margin:auto;padding:clamp(2rem,5vw,5rem) 0}.product-hero-rich{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(360px,.82fr);gap:clamp(2rem,5vw,5rem);align-items:start}.product-main-rich{aspect-ratio:4/3;border-radius:34px;overflow:hidden;display:grid;place-items:center;padding:30px;text-align:center;box-shadow:0 24px 70px rgba(48,30,18,.1);position:relative}.product-main-rich img{width:100%;height:100%;object-fit:cover}.product-main-rich span{font-size:13px;text-transform:uppercase;font-weight:900}.product-main-rich strong{font:700 clamp(42px,5vw,72px)/.9 'Patrick Hand',cursive}.product-main-rich.coral{background:#ffe0da}.product-main-rich.mint{background:#d9f5ef}.product-main-rich.lilac{background:#ead9ff}.product-main-rich.yellow{background:#ffedb6}.product-main-rich.blue{background:#dcecff}.product-image-badge{position:absolute;top:16px;left:16px;z-index:2;display:inline-flex;padding:8px 11px;border-radius:999px;background:#ff5d62;color:#fff;font-size:11px;font-style:normal;font-weight:900;box-shadow:0 8px 20px rgba(23,27,42,.15)}.product-thumbs-rich{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}.product-thumbs-rich img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px}.product-info-rich{position:sticky;top:110px}.product-info-rich h1{margin:.4rem 0 .8rem;font:700 clamp(48px,6vw,84px)/.88 'Patrick Hand',cursive}.product-tagline-rich{font-size:20px;font-weight:800;line-height:1.4}.product-price-rich{display:flex;align-items:center;gap:12px;margin:20px 0}.product-price-rich strong{font-size:30px}.product-price-rich del{color:#8c8f9c}.product-meta-rich{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:22px 0}.product-meta-rich span{display:grid;gap:4px;padding:12px;border-radius:14px;background:#fff;box-shadow:0 10px 30px rgba(48,30,18,.05);font-size:12px}.product-meta-rich b{font-size:10px;text-transform:uppercase;color:#777}.purchase-options-rich{display:grid;gap:12px;margin-top:22px}.purchase-option-rich{border:1px solid #eadfd6;background:#fff;padding:16px;border-radius:20px;box-shadow:0 12px 32px rgba(48,30,18,.05)}.purchase-option-title-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.purchase-option-rich h3{margin:0;font:700 26px/1 'Patrick Hand',cursive}.purchase-option-rich p{margin:6px 0 0;font-size:12px;color:#737887}.purchase-option-price{display:flex;align-items:center;gap:8px;margin:10px 0 12px}.purchase-option-price strong{font-size:21px}.purchase-option-price del{font-size:13px;color:#8c8f9c}.digital-pill{display:inline-flex;padding:5px 8px;border-radius:999px;background:#dff7f2;color:#116e68;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.purchase-btn{display:inline-flex;border:0;cursor:pointer;font:900 13px Comfortaa,system-ui,sans-serif}.purchase-btn.amazon{background:#171b2a}.purchase-btn.stripe{background:#635bff}.purchase-btn.external{background:#171b2a}.purchase-note{margin:10px 0 0!important;font-size:12px;color:#737887}.secure-note{display:block;margin-top:10px;color:#737887;font-size:11px;line-height:1.5}.disabled-buy{opacity:.55;pointer-events:none}.product-content-rich{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:70px}.product-content-rich article{background:#fff;padding:clamp(22px,3vw,38px);border-radius:28px;box-shadow:0 18px 55px rgba(48,30,18,.06)}.product-content-rich h2{margin:.3rem 0 1rem;font:700 clamp(34px,4vw,48px)/.95 'Patrick Hand',cursive}.product-content-rich p,.product-content-rich li{line-height:1.7}.product-content-rich ul{padding-left:1.2rem}.long-copy-rich{white-space:pre-line}.product-back-rich{margin:30px 0;font-weight:800}@media(max-width:900px){.product-hero-rich{grid-template-columns:1fr}.product-info-rich{position:static}.product-content-rich{grid-template-columns:1fr}.product-meta-rich{grid-template-columns:1fr 1fr}}@media(max-width:560px){.product-page-rich{width:calc(100% - 1rem);padding-top:1rem}.product-main-rich{border-radius:22px}.product-image-badge{top:10px;left:10px}.product-thumbs-rich{grid-template-columns:repeat(3,1fr)}.product-info-rich h1{font-size:48px}.product-tagline-rich{font-size:17px}.product-meta-rich{grid-template-columns:1fr}.product-content-rich{margin-top:35px}}`;