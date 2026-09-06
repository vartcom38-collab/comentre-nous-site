import Link from 'next/link';
import { LayoutShell } from '@/components/Site';

const universes = [
  {
    title: "Com’ en famille",
    text: "Des jeux et des outils pour se parler, s’écouter et grandir ensemble.",
    href: '/com-en-famille',
    tone: 'family',
    cta: 'Découvrir'
  },
  {
    title: "Com’ des entrepreneuses",
    text: "Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.",
    href: '/com-des-entrepreneuses',
    tone: 'business',
    cta: 'Découvrir'
  },
  {
    title: 'Papeterie du lien',
    text: "Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.",
    href: '/papeterie-du-lien',
    tone: 'paper',
    cta: 'Découvrir'
  }
];

const values = [
  ['♡', 'Des créations\navec amour'],
  ['♧', 'Une approche bienveillante\net sans pression'],
  ['☷', 'Des outils pour la vraie vie'],
  ['☆', 'Une communauté qui inspire']
];

const products = [
  { title: 'Les Petits Liens', price: '29,00 €', badge: 'Nouveau', href: '/produits/les-petits-liens', tone: 'box', note: 'jeu de cartes' },
  { title: 'Mon carnet de clarté', price: '12,90 €', href: '/produits/mon-carnet-de-clarte', tone: 'notebook', note: 'Tout commence\npar une idée' },
  { title: "Mon kit d’été", price: '12,90 €', href: '/produits/mon-kit-ete', tone: 'summer', note: 'mon kit\nd’été' },
  { title: 'Cartes émotions', price: '24,90 €', href: '/boutique', tone: 'cards', note: 'je suis\nfière de moi' }
];

function Scribble({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`scribble ${className}`}>{children}</span>;
}

function HeroPhoto() {
  return (
    <div className="approved-hero-photo" aria-label="Zone photo mère et enfant à remplacer ensuite">
      <div className="photo-soft-focus" />
      <div className="person-back adult-back"><span /></div>
      <div className="person-back child-back"><span /></div>
      <p className="shirt-quote">Les mots<br />aujourd’hui<br />pour demain<br /><i>♡</i></p>
      <div className="photo-lines l-a" />
      <div className="photo-lines l-b" />
      <div className="photo-lines l-c" />
      <p className="hero-note">Des petits<br />outils pour<br />de grands<br />moments !</p>
      <div className="side-tabs">
        <span>Écouter</span>
        <span>Comprendre</span>
        <span>Ressentir</span>
        <span>Partager</span>
        <span>Avancer</span>
      </div>
    </div>
  );
}

function UniverseIllustration({ tone }: { tone: string }) {
  return (
    <div className={`universe-illu ${tone}`} aria-hidden="true">
      <div className="u-head one" />
      <div className="u-head two" />
      <div className="u-body one" />
      <div className="u-body two" />
      <div className="u-object" />
      <span>♡</span>
    </div>
  );
}

function ProductVisual({ tone, note }: { tone: string; note: string }) {
  return (
    <div className={`approved-product-visual ${tone}`}>
      <div className="visual-paper">
        {note.split('\n').map((line) => <span key={line}>{line}</span>)}
        <i>♡</i>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <LayoutShell>
      <main className="approved-home">
        <section className="approved-hero">
          <div className="sun-doodle">☼</div>
          <div className="hero-copy approved-copy">
            <h1>
              Des mots,<br />
              des cartes et des carnets<br />
              pour <Scribble>créer du lien.</Scribble>
            </h1>
            <p>
              Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />
              En famille, dans ton quotidien ou dans ton projet.
            </p>
            <div className="approved-actions">
              <Link className="main-cta" href="/par-ou-commencer">Découvrir nos univers <span>→</span></Link>
              <Link className="soft-cta" href="/boutique">Voir les nouveautés</Link>
            </div>
          </div>
          <HeroPhoto />
          <span className="blob blob-left" />
          <span className="blob blob-right" />
        </section>

        <section className="approved-universes" id="univers">
          <h2>Quel est ton univers ?</h2>
          <div className="approved-universe-grid">
            {universes.map((item) => (
              <Link key={item.href} href={item.href} className={`approved-universe-card ${item.tone}`}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="outline-link">{item.cta} →</span>
                </div>
                <UniverseIllustration tone={item.tone} />
              </Link>
            ))}
          </div>
        </section>

        <section className="approved-values">
          {values.map(([icon, label]) => (
            <div key={label}>
              <span>{icon}</span>
              <p>{label.split('\n').map((line) => <b key={line}>{line}</b>)}</p>
            </div>
          ))}
        </section>

        <section className="approved-products" id="nouveautes">
          <h2>Les nouveautés</h2>
          <div className="approved-products-layout">
            <div className="approved-product-grid">
              {products.map((product) => (
                <article className="approved-product" key={product.title}>
                  {product.badge && <span className="product-badge">{product.badge}</span>}
                  <ProductVisual tone={product.tone} note={product.note} />
                  <div className="product-info">
                    <div>
                      <h3>{product.title}</h3>
                      <p>{product.price}</p>
                    </div>
                    <Link href={product.href} aria-label={`Voir ${product.title}`}>🛒</Link>
                  </div>
                </article>
              ))}
            </div>
            <aside className="shop-side-note">
              <p>Des idées<br />dans ta valise !</p>
              <Link href="/boutique">Voir toute la boutique →</Link>
            </aside>
          </div>
        </section>

        <section className="approved-podcast">
          <div className="mic-doodle">▌</div>
          <div className="podcast-copy">
            <h2>Com’ entre nous<br />Le podcast</h2>
            <p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p>
            <Link className="soft-cta" href="/podcast">Écouter le dernier épisode →</Link>
          </div>
          <div className="podcast-photo" aria-label="Zone photo Marion et Aurélie à remplacer ensuite">
            <div className="pod-person p1" />
            <div className="pod-person p2" />
            <span>Café<br />idées<br />projets<br />♡</span>
          </div>
          <div className="podcast-quote">
            « Des discussions<br />imparfaites, vraies<br />et tellement nous. »
            <i>♡</i>
            <Link href="/podcast">Voir tous les épisodes →</Link>
          </div>
        </section>

        <section className="approved-newsletter">
          <div className="envelope-doodle">✉</div>
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
