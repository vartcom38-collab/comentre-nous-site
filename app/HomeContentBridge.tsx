'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import products from '../content/products.json';
import home from '../content/home.json';

type Product = (typeof products)[number];

function sortedHomepageProducts(): Product[] {
  const published = (products as Product[]).filter((product) => product.published);
  const selected = home.homeProducts.mode === 'featured'
    ? published.filter((product) => product.featured)
    : published.filter((product) => product.new);

  const source = selected.length ? selected : published;
  return [...source]
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .slice(0, Math.max(1, Number(home.homeProducts.limit) || 4));
}

export default function HomeContentBridge() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;

    const eyebrow = document.querySelector<HTMLElement>('.products .section-head p');
    const title = document.querySelector<HTMLElement>('.products .section-head h2');
    const grid = document.querySelector<HTMLElement>('.products .product-grid');
    if (!grid) return;

    if (eyebrow) eyebrow.textContent = home.homeProducts.eyebrow;
    if (title) title.textContent = home.homeProducts.title;

    const selected = sortedHomepageProducts();
    grid.innerHTML = '';

    if (!selected.length) {
      const empty = document.createElement('div');
      empty.className = 'product-empty-state';
      empty.textContent = 'Les prochaines créations arrivent bientôt ♡';
      grid.appendChild(empty);
      return;
    }

    for (const product of selected) {
      const article = document.createElement('article');
      article.className = 'product-card';

      const visual = document.createElement('a');
      visual.className = 'product-visual';
      visual.href = `/produits/${product.slug}/`;
      if (product.image) {
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.title;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = 'inherit';
        visual.appendChild(img);
      } else {
        const span = document.createElement('span');
        span.textContent = product.tagline;
        visual.appendChild(span);
      }

      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = `/produits/${product.slug}/`;
      link.textContent = product.title;
      heading.appendChild(link);

      const bottom = document.createElement('div');
      bottom.className = 'product-bottom';
      const price = document.createElement('strong');
      price.textContent = product.price;
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Ajouter';
      button.addEventListener('click', () => {
        const key = 'comentre_cart_count';
        const current = Number(window.localStorage.getItem(key) || '0') || 0;
        window.localStorage.setItem(key, String(current + 1));
        window.dispatchEvent(new Event('storage'));
      });
      bottom.append(price, button);

      article.append(visual, heading, bottom);
      grid.appendChild(article);
    }
  }, [pathname]);

  return null;
}
