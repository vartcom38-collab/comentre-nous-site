import type { ReactNode } from 'react';
import Link from 'next/link';
import { navItems, universes } from '@/src/data/site';
import siteSections from '@/content/site-sections.json';
import { products, Product } from '@/src/data/products';

export function Logo() {
  return (
    <Link className="shared-logo" href="/" aria-label="Accueil Com' entre nous">
      <img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" />
    </Link>
  );
}

export function Header() {
  return (
    <header className="shared-header">
      <Logo />
      <nav className="shared-nav" aria-label="Navigation principale">
        {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <div className="shared-actions">
        <Link href="/boutique" aria-label="Recherche" className="shared-search">⌕</Link>
        <Link className="shared-login" href="/mon-espace" aria-label="Se connecter à son espace cliente">Se connecter</Link>
        <button type="button" className="shared-cart" data-woo-cart-toggle aria-label="Ouvrir le panier">
          <span>Panier</span><b data-woo-cart-count>0</b>
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  const footer = siteSections.footer;
  const socialLinks = [
    { label: footer.instagramLabel, url: footer.instagramUrl },
    { label: footer.pinterestLabel, url: footer.pinterestUrl },
    { label: footer.spotifyLabel, url: footer.spotifyUrl },
  ];
  return (
    <footer className="shared-footer">
      <div className="shared-footer-brand">
        <Link href="/" aria-label="Accueil Com’ entre nous"><img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" /></Link>
        <p>{footer.tagline}</p>
      </div>
      <div className="shared-footer-links">
        {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        <Link href="/mon-espace">Se connecter</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faq">FAQ</Link>
      </div>
      <div className="shared-socials">{socialLinks.map((item) => item.url ? <a key={item.label} href={item.url} target="_blank" rel="noreferrer">{item.label}</a> : <span key={item.label}>{item.label}</span>)}</div>
    </footer>
  );
}

export function LayoutShell({ children }: { children: ReactNode }) { return <><Header />{children}<Footer /></>; }

export function DoodleScene() {
  return <div className="hero-board" aria-hidden="true"><div className="paper-card paper-card-large"><span className="paper-kicker">jeu de cartes</span><strong>Les petits liens</strong><p>Une question. Une émotion. Un moment qui s’ouvre.</p></div><div className="photo-paper photo-one"><span>cartes · carnets · café froid</span></div><div className="photo-paper photo-two"><span>idées à imprimer</span></div><div className="scribble-note">parler vrai<br />écouter fort</div><div className="tiny-line line-a" /><div className="tiny-line line-b" /></div>;
}

export function UniverseCards() {
  return (
    <section className="section compact"><div className="section-heading"><p className="tag">{siteSections.universeSection.eyebrow}</p><h2>{siteSections.universeSection.title}</h2></div><div className="universe-grid">{universes.map((item, index) => <Link href={item.href} className={`universe-card ${item.tone}`} key={item.href}><span className="card-number">0{index + 1}</span><p className="tag">{item.tag}</p><h3>{item.title}</h3><p>{item.text}</p><b>{item.buttonLabel || 'Découvrir'} →</b></Link>)}</div></section>
  );
}

export function ValuesStrip() { return <section className="values-strip">{siteSections.values.map((value) => <div key={value}><p>{value}</p></div>)}</section>; }

export function ProductCard({ product }: { product: Product }) {
  return <article className={`product-card ${product.color}`}><div className={`product-cover ${product.color}`}>{product.badge && <em>{product.badge}</em>}<span>{product.type}</span><strong>{product.title}</strong></div><div className="product-copy"><p className="product-meta">{product.universe} · {product.type}</p><h3>{product.title}</h3><p>{product.description}</p><div className="product-bottom"><strong>{product.price}</strong><Link href={`/produits/${product.slug}`}>{product.buyLabel} →</Link></div></div></article>;
}

export function ProductGrid({ items = products }: { items?: Product[] }) { return <div className="product-grid">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>; }

export function ProductHighlights({ title = 'Nos nouveautés' }: { title?: string }) { return <section className="section"><div className="section-title"><h2>{title}</h2><Link href="/boutique">Voir toute la boutique →</Link></div><ProductGrid /></section>; }

export function Newsletter() {
  const block = siteSections.newsletter;
  return <section className="newsletter"><div><p className="tag">{block.eyebrow}</p><h2>{block.title}</h2><p>{block.text}</p></div><form><input placeholder={block.placeholder} /><button>{block.buttonLabel}</button></form></section>;
}

export function PodcastBand() {
  const block = siteSections.podcastBand;
  return <section className="podcast-band"><div className="podcast-label">{block.label}</div><div><p className="tag">{block.eyebrow}</p><h2>{block.title}</h2><p>{block.text}</p></div><Link href={block.href} className="dark-btn">{block.buttonLabel} →</Link></section>;
}

export function PageIntro({ kicker, title, text }: { kicker?: string; title: string; text: string }) { return <section className="page-intro">{kicker && <p className="tag">{kicker}</p>}<h1>{title}</h1><p>{text}</p></section>; }

export function NeedCards() {
  const block = siteSections.needs;
  return <section className="needs"><div className="section-heading"><p className="tag">{block.eyebrow}</p><h2>{block.title}</h2></div><div className="need-grid">{block.items.map((item) => <Link href={item.href} key={`${item.label}-${item.href}`}>{item.label}<span>→</span></Link>)}</div></section>;
}
