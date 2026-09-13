'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import products from '../content/products.json';
import home from '../content/home.json';

type Product = (typeof products)[number];

function sortedHomepageProducts(): Product[] {
  const published = (products as Product[]).filter((product) => product.published);

  if (home.homeProducts.mode === 'featured') {
    return [...published]
      .filter((product) => product.featured)
      .sort((a, b) => {
        const byUpdated = String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt));
        if (byUpdated !== 0) return byUpdated;
        return String(b.createdAt).localeCompare(String(a.createdAt));
      })
      .slice(0, 4);
  }

  return [...published]
    .sort((a, b) => {
      const byCreated = String(b.createdAt).localeCompare(String(a.createdAt));
      if (byCreated !== 0) return byCreated;
      return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    })
    .slice(0, 4);
}

function applyHeroContent() {
  const eyebrow = document.querySelector<HTMLElement>('.hero .eyebrow');
  const title = document.querySelector<HTMLElement>('.hero .hero-copy h1');
  const intro = document.querySelector<HTMLElement>('.hero .intro');

  if (eyebrow) eyebrow.textContent = home.hero.eyebrow;
  if (intro) intro.textContent = home.hero.intro;

  if (title) {
    const rawTitle = String(home.hero.title || '').trim();
    const highlight = 'créer du lien.';
    const lower = rawTitle.toLowerCase();
    const highlightIndex = lower.lastIndexOf(highlight);

    title.innerHTML = '';
    if (highlightIndex >= 0) {
      const before = rawTitle.slice(0, highlightIndex).trimEnd();
      const highlighted = rawTitle.slice(highlightIndex);
      if (before) title.append(document.createTextNode(`${before} `));
      const mark = document.createElement('mark');
      mark.textContent = highlighted;
      title.append(mark);
    } else {
      title.textContent = rawTitle;
    }
  }
}

function applyHomepageProducts() {
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

    const button = document.createElement('a');
    button.href = `/produits/${product.slug}/`;
    button.textContent = 'Voir le produit';
    button.setAttribute('aria-label', `Voir ${product.title}`);

    bottom.append(price, button);
    article.append(visual, heading, bottom);
    grid.appendChild(article);
  }
}

export default function HomeContentBridge() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;
    applyHeroContent();
    applyHomepageProducts();
  }, [pathname]);

  return null;
}
