import type { ReactNode } from 'react';
import Link from 'next/link';
import { LayoutShell } from '@/components/Site';

const universes = [
  {
    title: "Com’ en famille",
    text: "Des jeux et des outils pour se parler, s’écouter et grandir ensemble.",
    href: '/com-en-famille',
    tone: 'family',
    note: 'moments en famille'
  },
  {
    title: "Com’ des entrepreneuses",
    text: "Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.",
    href: '/com-des-entrepreneuses',
    tone: 'business',
    note: 'idées · message · visibilité'
  },
  {
    title: 'Papeterie du lien',
    text: "Des carnets, kits, jeux à imprimer et accessoires pour mettre de la magie dans le quotidien.",
    href: '/papeterie-du-lien',
    tone: 'paper',
    note: 'carnets & imprimables'
  }
];

const values = [
  ['♡', 'Des créations\navec amour'],
  ['♧', 'Une approche bienveillante\net sans pression'],
  ['☷', 'Des outils pour la vraie vie'],
  ['☆', 'Une communauté qui inspire']
];

const products = [
  { title: 'Les Petits Liens', price: '29,00 €', badge: 'Nouveau', href: '/produits/les-petits-liens', tone: 'box', note: 'Les petits\nliens' },
  { title: 'Mon carnet de clarté', price: '12,90 €', href: '/produits/mon-carnet-de-clarte', tone: 'notebook', note: 'Tout commence\npar une idée' },
  { title: "Mon kit d’été", price: '12,90 €', href: '/produits/mon-kit-ete', tone: 'summer', note: 'Mon kit\nd’été' },
  { title: 'Cartes émotions', price: '24,90 €', href: '/boutique', tone: 'cards', note: 'Je suis\nfière de moi' }
];

function Lines({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={className}>{children}</span>;
}

function PhotoSlot({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`photo-slot ${className}`}>{children}</div>;
}

function HeroPhoto() {
  return (
    <div className="home-hero-visual" aria-label="Espace photo mère et enfant à remplacer ensuite">
      <p className="hero-handnote">Des petits<br />outils pour<br />de grands<br />moments !</p>
      <PhotoSlot className="hero-photo-slot">
        <div className="photo-soft-shape" />
        <p className="photo-placeholder-label">Photo mère + enfant<br />à remplacer</p>
        <p className="photo-shirt-note">Les mots<br />aujourd’hui<br />pour demain<br /><i>♡</i></p>
      </PhotoSlot>
      <div className="tab-stack">
        <span>Écouter</span>
        <span>Comprendre</span>
        <span>Ressentir</span>
        <span>Partager</span>
        <span>Avancer</span>
      </div>
      <span className="doodle-line dl-one" />
      <span className="doodle-line dl-two" />
      <span className="doodle-heart hero-heart">♡</span>
    </div>
  );
}

function UniverseVisual({ tone, note }: { tone: string; note: string }) {
  return (
    <div className={`universe-visual ${tone}`}>
      <div className="visual-card-main"><span>{note}</span></div>
      <div className="visual-card-small" />
      <i>♡</i>
    </div>
  );
}

function ProductVisual({ tone, note }: { tone: string; note: string }) {
  return (
    <div className={`home-product-visual ${tone}`}>
      <div className="product-paper">
        {note.split('\n').map((line) => <span key={line}>{line}</span>)}
        <i>♡</i>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <LayoutShell>
      <main className="home-mockup">
        <section className="home-hero">
          <span className="big-cream-blob left" />
          <span className="big-cream-blob right" />
          <div className="sun-doodle">☼</div>
          <div className="home-hero-copy">
            <h1>
              Des mots,<br />
              des cartes et des carnets<br />
              pour <Lines className="highlight-brush">créer du lien.</Lines>
            </h1>
            <p>
              Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />
              En famille, dans ton quotidien ou dans ton projet.
            </p>
            <div className="home-actions">
              <Link className="red-button" href="/par-ou-commencer">Découvrir nos univers <span>→</span></Link>
              <Link className="outline-button" href="/boutique">Voir les nouveautés</Link>
            </div>
          </div>
          <HeroPhoto />
        </section>

        <section className="home-universes" id="univers">
          <h2>Quel est ton univers ?</h2>
          <div className="home-universe-grid">
            {universes.map((item) => (
              <Link href={item.href} key={item.href} className={`home-universe-card ${item.tone}`}>
                <div className="universe-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span>Découvrir →</span>
                </div>
                <UniverseVisual tone={item.tone} note={item.note} />
              </Link>
            ))}
          </div>
        </section>

        <section className="home-values">
          {values.map(([icon, label]) => (
            <div key={label}>
              <span>{icon}</span>
              <p>{label.split('\n').map((line) => <b key={line}>{line}</b>)}</p>
            </div>
          ))}
        </section>

        <section className="home-products" id="nouveautes">
          <div className="section-center-title">
            <h2>Les nouveautés</h2>
          </div>
          <div className="products-and-note">
            <div className="home-product-grid">
              {products.map((product) => (
                <article className="home-product" key={product.title}>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <ProductVisual tone={product.tone} note={product.note} />
                  <div className="home-product-info">
                    <div>
                      <h3>{product.title}</h3>
                      <p>{product.price}</p>
                    </div>
                    <Link href={product.href} aria-label={`Voir ${product.title}`}>🛒</Link>
                  </div>
                </article>
              ))}
            </div>
            <aside className="home-shop-note">
              <p>Des idées<br />dans ta valise !</p>
              <Link href="/boutique">Voir toute la boutique →</Link>
            </aside>
          </div>
        </section>

        <section className="home-podcast">
          <div className="mic-box">🎙</div>
          <div className="podcast-text">
            <h2>Com’ entre nous<br />Le podcast</h2>
            <p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p>
            <Link className="outline-button" href="/podcast">Écouter le dernier épisode →</Link>
          </div>
          <PhotoSlot className="podcast-photo-slot">
            <p>Photo Marion + Aurélie<br />à remplacer</p>
            <span>Café<br />idées<br />projets<br />♡</span>
          </PhotoSlot>
          <div className="podcast-quote">
            <p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p>
            <i>♡</i>
            <Link href="/podcast">Voir tous les épisodes →</Link>
          </div>
        </section>

        <section className="home-newsletter">
          <div className="envelope-box">✉</div>
          <div>
            <h2>Reçois des idées, des ressources et des coulisses !</h2>
            <p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p>
          </div>
          <form>
            <input placeholder="Ton adresse email" />
            <button>Je m’inscris !</button>
          </form>
        </section>
      </main>
    </LayoutShell>
  );
}
