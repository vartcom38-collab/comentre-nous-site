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

export default function FamilyShop({ items }: { items: Product[] }) {
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
    <section className="family-shop" id="collection">
      <div className="family-shop-head">
        <div>
          <p className="family-eyebrow">La collection</p>
          <h2>Les outils Com’ en famille</h2>
          <p>Cette sélection se remplit automatiquement avec les fiches produits publiées dans l’univers Com’ en famille.</p>
        </div>
        <div className="family-sort">
          <label htmlFor="family-sort">Trier par</label>
          <select id="family-sort" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            <option value="newest">Du plus récent au plus ancien</option>
            <option value="oldest">Du plus ancien au plus récent</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {types.length > 1 ? (
        <div className="family-filter-chips" aria-label="Filtrer par type de produit">
          {types.map((item) => (
            <button key={item} type="button" className={type === item ? 'active' : ''} onClick={() => setType(item)}>{item}</button>
          ))}
        </div>
      ) : null}

      {visible.length ? (
        <div className="family-product-grid">
          {visible.map((product) => (
            <article className="family-product-card" key={product.id}>
              <Link href={`/produits/${product.slug}`} className={`family-product-image ${product.color || ''}`}>
                {product.image ? <img src={product.image} alt={product.title} /> : <span className="family-product-placeholder">♡</span>}
                {product.new ? <em>Nouveau</em> : null}
              </Link>
              <div className="family-product-copy">
                <p>{product.type}{product.age ? ` · ${product.age}` : ''}</p>
                <h3><Link href={`/produits/${product.slug}`}>{product.title}</Link></h3>
                <div className="family-product-bottom">
                  <strong>{product.price || 'Prix à venir'}</strong>
                  <Link href={`/produits/${product.slug}`}>Voir la fiche →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="family-empty-shop">
          <span>♡</span>
          <h3>Les prochains outils arrivent ici.</h3>
          <p>Dès qu’une fiche produit Com’ en famille est publiée, elle apparaît automatiquement dans cette collection.</p>
        </div>
      )}
    </section>
  );
}
