'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import products from '../content/products.json';
import home from '../content/home.json';

type Product = (typeof products)[number];

function homepageLimit() {
  const value = Number(home.homeProducts.limit || 4);
  return Number.isFinite(value) && value > 0 ? Math.min(12, Math.floor(value)) : 4;
}

function sortedHomepageProducts(): Product[] {
  const published = (products as Product[]).filter((product) => product.published);
  const limit = homepageLimit();

  if (home.homeProducts.mode === 'featured') {
    return [...published]
      .filter((product) => product.featured)
      .sort((a, b) => {
        const byUpdated = String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt));
        if (byUpdated !== 0) return byUpdated;
        return String(b.createdAt).localeCompare(String(a.createdAt));
      })
      .slice(0, limit);
  }

  return [...published]
    .sort((a, b) => {
      const byCreated = String(b.createdAt).localeCompare(String(a.createdAt));
      if (byCreated !== 0) return byCreated;
      return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    })
    .slice(0, limit);
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

function applyCartIntegration() {
  const cart = document.querySelector<HTMLElement>('.header .cart');
  if (!cart) return;

  cart.setAttribute('href', '#panier');
  cart.setAttribute('role', 'button');
  cart.setAttribute('data-woo-cart-toggle', '1');
  cart.setAttribute('aria-label', 'Ouvrir le panier');

  const count = cart.querySelector<HTMLElement>('b');
  if (count) {
    count.setAttribute('data-woo-cart-count', '');
    if (!count.textContent?.trim()) count.textContent = '0';
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
    visual.style.position = 'relative';

    if (product.image) {
      const img = document.createElement('img');
      img.src = product.image;
      img.alt = product.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = 'inherit';
      visual.appendChild(img);
    } else {
      const span = document.createElement('span');
      span.textContent = product.tagline || product.type || 'Découvrir le produit';
      visual.appendChild(span);
    }

    if (product.badge && product.badge.trim()) {
      const badge = document.createElement('em');
      badge.textContent = product.badge;
      badge.style.position = 'absolute';
      badge.style.top = '12px';
      badge.style.left = '12px';
      badge.style.zIndex = '2';
      badge.style.display = 'inline-flex';
      badge.style.padding = '7px 10px';
      badge.style.borderRadius = '999px';
      badge.style.background = '#ff5d62';
      badge.style.color = '#fff';
      badge.style.fontSize = '10px';
      badge.style.fontStyle = 'normal';
      badge.style.fontWeight = '900';
      badge.style.boxShadow = '0 6px 16px rgba(23,27,42,.14)';
      visual.appendChild(badge);
    }

    const heading = document.createElement('h3');
    const link = document.createElement('a');
    link.href = `/produits/${product.slug}/`;
    link.textContent = product.title;
    heading.appendChild(link);

    const bottom = document.createElement('div');
    bottom.className = 'product-bottom';
    const price = document.createElement('strong');
    price.textContent = product.price || '';

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
    applyCartIntegration();

    const timer = window.setTimeout(applyCartIntegration, 500);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
