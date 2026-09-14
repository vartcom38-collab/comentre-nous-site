'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/src/data/products';

type SortKey = 'newest' | 'oldest' | 'price-asc' | 'price-desc';

function priceValue(value: string) {
  const normalized = String(value || '').replace(/\s/g, '').replace('€', '').replace(',', '.').replace(/[^0-9.]/g, '');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

export default function EntrepreneurShop({ items }: { items: Product[] }) {
  const [sort, setSort] = useState<SortKey>('newest');
  const [type, setType] = useState('Tous');

  const types = useMemo(() => ['Tous', ...Array.from(new Set(items.map((item) => item.type).filter(Boolean)))], [items]);
  const visible = useMemo(() => {
    const filtered = type === 'Tous' ? [...items] : items.filter((item) => item.type === type);
    return filtered.sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'price-asc') return priceValue(a.price) - priceValue(b.price);
      if (sort === 'price-desc') return priceValue(b.price) - priceValue(a.price);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [items, sort, type]);

  return (
    <section className="entre-shop" id="boutique">
      <div className="entre-shop-head">
        <div>
          <p className="entre-eyebrow">La boutique</p>
          <h2>Les outils Com’ des entrepreneuses</h2>
          <p>Oracle, carnets et ressources : tout ce qui est publié dans cet univers apparaît ici automatiquement.</p>
        </div>
        <div className="entre-sort">
          <label htmlFor="entre-sort">Trier par</label>
          <select id="entre-sort" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="newest">Du plus récent au plus ancien</option>
            <option value="oldest">Du plus ancien au plus récent</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {types.length > 1 ? (
        <div className="entre-filter-chips" aria-label="Filtrer par type de produit">
          {types.map((item) => (
            <button key={item} type="button" className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>
          ))}
        </div>
      ) : null}

      {visible.length ? (
        <div className="entre-product-grid">
          {visible.map((product) => (
            <article className="entre-product-card" key={product.id}>
              <Link href={`/produits/${product.slug}`} className={`entre-product-image ${product.color || ''}`}>
                {product.image ? <img src={product.image} alt={product.title} /> : <span className="entre-product-placeholder">✦</span>}
                {product.new ? <em>Nouveau</em> : product.badge ? <em>{product.badge}</em> : null}
              </Link>
              <div className="entre-product-copy">
                <p>{product.type}{product.format ? ` · ${product.format}` : ''}</p>
                <h3><Link href={`/produits/${product.slug}`}>{product.title}</Link></h3>
                {product.description ? <span>{product.description}</span> : null}
                <div className="entre-product-bottom">
                  <strong>{product.price || 'Prix à venir'}</strong>
                  <Link href={`/produits/${product.slug}`}>Découvrir la fiche →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="entre-empty-shop">
          <span>✦</span>
          <h3>Les prochains outils arrivent ici.</h3>
          <p>Dès qu’une fiche Com’ des entrepreneuses est publiée, elle apparaît automatiquement dans cette boutique.</p>
        </div>
      )}
    </section>
  );
}
