'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import products from '../content/products.json';
import home from '../content/home.json';
import podcast from '../content/podcast.json';

type Product = (typeof products)[number];
type Episode = (typeof podcast.episodes)[number];

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

function latestPublishedEpisode(): Episode | null {
  const published = (podcast.episodes as Episode[]).filter((episode) => episode.published);
  if (!published.length) return null;
  return [...published].sort((a, b) => {
    const byDate = String(b.date || '').localeCompare(String(a.date || ''));
    if (byDate !== 0) return byDate;
    return Number(b.number || 0) - Number(a.number || 0);
  })[0] || null;
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

function applyPodcastTeaser() {
  const section = document.querySelector<HTMLElement>('.podcast');
  if (!section) return;

  const settings = podcast.homepage;
  const latest = latestPublishedEpisode();
  const showLatest = settings.mode === 'latest' && latest;
  const kicker = settings.kicker || 'Com’ entre nous · le podcast';
  const badge = showLatest ? 'Nouvel épisode' : (settings.badge || 'Prochainement');
  const title = showLatest ? latest.title : settings.title;
  const description = showLatest ? latest.description : settings.description;
  const image = (showLatest ? latest.image : '') || settings.image;
  const buttonLabel = showLatest ? 'Découvrir le nouvel épisode →' : (settings.buttonLabel || 'Découvrir l’espace podcast →');
  const buttonHref = showLatest ? '/podcast' : (settings.buttonHref || '/podcast');

  section.classList.add('podcast-teaser');
  section.innerHTML = '';

  const visual = document.createElement('div');
  visual.className = 'podcast-teaser-visual';
  if (image) {
    const img = document.createElement('img');
    img.src = image;
    img.alt = showLatest ? `Couverture du podcast ${latest.title}` : 'Com’ entre nous, le podcast avec Marion et Aurélie';
    img.loading = 'lazy';
    img.decoding = 'async';
    visual.appendChild(img);
  } else {
    visual.innerHTML = '<span class="podcast-teaser-heart">♡</span><span class="podcast-teaser-mic">🎙</span><small>Marion & Aurélie</small>';
  }

  const copy = document.createElement('div');
  copy.className = 'podcast-teaser-copy';
  const label = document.createElement('p');
  label.className = 'label';
  label.textContent = kicker;
  const status = document.createElement('span');
  status.className = 'podcast-teaser-badge';
  status.textContent = badge;
  const heading = document.createElement('h2');
  heading.textContent = title;
  const body = document.createElement('p');
  body.className = 'podcast-teaser-description';
  body.textContent = description;
  const button = document.createElement('a');
  button.className = 'btn secondary podcast-teaser-button';
  button.href = buttonHref;
  button.textContent = buttonLabel;

  copy.append(label, status, heading, body, button);
  section.append(visual, copy);

  if (!document.getElementById('podcast-teaser-dynamic-style')) {
    const style = document.createElement('style');
    style.id = 'podcast-teaser-dynamic-style';
    style.textContent = `
      .home-page .podcast.podcast-teaser{grid-template-columns:minmax(280px,.82fr) minmax(0,1.18fr);gap:clamp(1.4rem,3.5vw,3.4rem);padding:clamp(1rem,2vw,1.35rem);background:linear-gradient(135deg,#ffdcd7 0%,#fff1e9 58%,#e5f7f2 100%);overflow:hidden;align-items:stretch}
      .home-page .podcast-teaser-visual{position:relative;min-height:340px;border-radius:1.75rem;overflow:hidden;background:linear-gradient(145deg,#d8f5ef,#ead9ff 50%,#ffd768);display:grid;place-items:center;box-shadow:0 18px 42px rgba(48,30,18,.12)}
      .home-page .podcast-teaser-visual img{width:100%;height:100%;min-height:340px;object-fit:cover;display:block}
      .home-page .podcast-teaser-heart{position:absolute;right:1.2rem;top:.8rem;font:700 4rem/1 var(--hand);transform:rotate(10deg)}
      .home-page .podcast-teaser-mic{font-size:5rem;filter:grayscale(1)}
      .home-page .podcast-teaser-visual small{position:absolute;left:1.2rem;bottom:1.1rem;padding:.55rem .8rem;border-radius:999px;background:rgba(255,255,255,.82);font-weight:800}
      .home-page .podcast-teaser-copy{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:clamp(.6rem,2vw,1.6rem) clamp(.4rem,2vw,1.6rem)}
      .home-page .podcast-teaser-copy .label{margin-bottom:.8rem}
      .home-page .podcast-teaser-badge{display:inline-flex;margin:0 0 1rem;padding:.48rem .78rem;border-radius:999px;background:#ffd768;color:#171b2a;font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.08em;transform:rotate(-1deg)}
      .home-page .podcast-teaser-copy h2{max-width:760px;margin:0;font:700 clamp(2.8rem,4.6vw,5rem)/.92 var(--hand);letter-spacing:-.035em}
      .home-page .podcast-teaser-description{max-width:700px;margin:1rem 0 1.5rem!important;color:#313746!important;font-size:clamp(.92rem,1.15vw,1.08rem);line-height:1.7!important}
      .home-page .podcast-teaser-button{width:auto;margin-top:auto;background:rgba(255,255,255,.78)}
      @media(max-width:900px){.home-page .podcast.podcast-teaser{grid-template-columns:1fr}.home-page .podcast-teaser-visual{min-height:0;aspect-ratio:16/10}.home-page .podcast-teaser-visual img{min-height:0;aspect-ratio:16/10}.home-page .podcast-teaser-copy{padding:1rem .5rem 1.2rem}}
      @media(max-width:600px){.home-page .podcast-teaser-copy h2{font-size:2.65rem}.home-page .podcast-teaser-button{width:100%}.home-page .podcast-teaser-visual{aspect-ratio:1/1}.home-page .podcast-teaser-visual img{aspect-ratio:1/1}}
    `;
    document.head.appendChild(style);
  }
}

export default function HomeContentBridge() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;
    applyHeroContent();
    applyHomepageProducts();
    applyPodcastTeaser();
    applyCartIntegration();

    const timer = window.setTimeout(applyCartIntegration, 500);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
