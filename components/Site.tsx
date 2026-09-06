import type { ReactNode } from 'react';
import Link from 'next/link';
import { navItems, universes } from '@/src/data/site';
import { products, Product } from '@/src/data/products';

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Accueil Com' entre nous">
      <span>Com’</span>
      <span>entre</span>
      <span>nous</span>
      <i>♥</i>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Navigation principale">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </nav>
      <Link className="shop-pill" href="/boutique">Boutique</Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Logo />
        <p>Des mots, des outils, des humains.</p>
      </div>
      <div className="footer-links">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faq">FAQ</Link>
      </div>
      <div className="socials">
        <span>Instagram</span>
        <span>Pinterest</span>
        <span>Spotify</span>
      </div>
    </footer>
  );
}

export function LayoutShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export function DoodleScene() {
  return (
    <div className="hero-board" aria-hidden="true">
      <div className="paper-card paper-card-large">
        <span className="paper-kicker">jeu de cartes</span>
        <strong>Les petits liens</strong>
        <p>Une question. Une émotion. Un moment qui s’ouvre.</p>
      </div>
      <div className="photo-paper photo-one">
        <span>cartes · carnets · café froid</span>
      </div>
      <div className="photo-paper photo-two">
        <span>idées à imprimer</span>
      </div>
      <div className="scribble-note">parler vrai<br />écouter fort</div>
      <div className="tiny-line line-a" />
      <div className="tiny-line line-b" />
    </div>
  );
}

export function UniverseCards() {
  return (
    <section className="section compact">
      <div className="section-heading">
        <p className="tag">Choisir son chemin</p>
        <h2>Tu arrives par quelle porte ?</h2>
      </div>
      <div className="universe-grid">
        {universes.map((item, index) => (
          <Link href={item.href} className={`universe-card ${item.tone}`} key={item.href}>
            <span className="card-number">0{index + 1}</span>
            <p className="tag">{item.tag}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <b>Découvrir →</b>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ValuesStrip() {
  const values = ['Bienveillant, mais jamais gnangnan', 'Des outils qui servent vraiment', 'Une esthétique douce et vivante', 'Du lien dans la vraie vie'];
  return (
    <section className="values-strip">
      {values.map((value) => (
        <div key={value}><p>{value}</p></div>
      ))}
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className={`product-card ${product.color}`}>
      <div className={`product-cover ${product.color}`}>
        {product.badge && <em>{product.badge}</em>}
        <span>{product.type}</span>
        <strong>{product.title}</strong>
      </div>
      <div className="product-copy">
        <p className="product-meta">{product.universe} · {product.type}</p>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{product.price}</strong>
          <Link href={`/produits/${product.slug}`}>{product.buyLabel} →</Link>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ items = products }: { items?: Product[] }) {
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>;
}

export function ProductHighlights({ title = 'Nos nouveautés' }: { title?: string }) {
  return (
    <section className="section">
      <div className="section-title">
        <h2>{title}</h2>
        <Link href="/boutique">Voir toute la boutique →</Link>
      </div>
      <ProductGrid />
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="newsletter">
      <div>
        <p className="tag">Petit cadeau</p>
        <h2>Une ressource douce dans ta boîte mail.</h2>
        <p>Des idées concrètes, des coulisses et des supports à imprimer. Pas de bruit inutile, promis.</p>
      </div>
      <form>
        <input placeholder="Ton adresse email" />
        <button>Je m’inscris</button>
      </form>
    </section>
  );
}

export function PodcastBand() {
  return (
    <section className="podcast-band">
      <div className="podcast-label">ON AIR</div>
      <div>
        <p className="tag">Le podcast</p>
        <h2>Com’ entre nous, même quand le café est froid.</h2>
        <p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse.</p>
      </div>
      <Link href="/podcast" className="dark-btn">Écouter →</Link>
    </section>
  );
}

export function PageIntro({ kicker, title, text }: { kicker?: string; title: string; text: string }) {
  return (
    <section className="page-intro">
      {kicker && <p className="tag">{kicker}</p>}
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

export function NeedCards() {
  const needs = ['Aider mon enfant à parler', 'Créer un moment en famille', 'Occuper les enfants sans écran', 'Trouver des idées de contenu', 'Débloquer ma communication', 'M’offrir une pause créative'];
  return (
    <section className="needs">
      <div className="section-heading">
        <p className="tag">Pas besoin de savoir par où commencer</p>
        <h2>Dis-nous juste ce que tu cherches.</h2>
      </div>
      <div className="need-grid">
        {needs.map((need) => (
          <Link href="/par-ou-commencer" key={need}>{need}<span>→</span></Link>
        ))}
      </div>
    </section>
  );
}
