'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { heroScene } from './heroScene';
import { universeVisuals } from './universeVisuals';

const nav = [
  ['Com’ en famille', '/com-en-famille'],
  ['Com’ des entrepreneuses', '/com-des-entrepreneuses'],
  ['La papeterie', '/papeterie-du-lien'],
  ['Le podcast', '/podcast'],
  ['Les petits cadeaux', '/les-petits-cadeaux'],
  ['À propos', '/a-propos'],
] as const;

const univers = [
  {
    title: 'Com’ en famille',
    href: '/com-en-famille',
    kicker: 'Famille · émotions · lien',
    text: 'Des jeux et des outils pour se parler, s’écouter et grandir ensemble.',
    tone: 'family',
    alt: 'Illustration d’une adulte et d’un enfant qui se parlent avec douceur',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    kicker: 'Idées · clarté · visibilité',
    text: 'Des cartes et des carnets pour clarifier tes idées, poser tes mots et créer avec plus de justesse.',
    tone: 'business',
    alt: 'Illustration d’une entrepreneuse avec son ordinateur et ses idées',
  },
  {
    title: 'Papeterie du lien',
    href: '/papeterie-du-lien',
    kicker: 'Bujo · to-do · trackers',
    text: 'Des carnets, kits, listes et pages à imprimer pour organiser la vraie vie.',
    tone: 'paper',
    alt: 'Illustration d’un carnet et d’un crayon pour la papeterie',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/produits/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/produits/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/produits/mon-kit-ete'],
  ['Cartes émotions', 'Support à imprimer', '24,90 €', '/produits/cartes-emotions'],
] as const;

type Universe = (typeof univers)[number];

function UniverseVisual({ item }: { item: Universe }) {
  return (
    <div className="universe-visual">
      <span className="visual-glow" />
      <span className="visual-heart">♡</span>
      <span className="visual-dash dash-one" />
      <span className="visual-dash dash-two" />
      <img src={universeVisuals[item.tone]} alt={item.alt} />
    </div>
  );
}

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem('comentre_cart_count');
    setCartCount(saved ? Number(saved) || 0 : 0);
  }, []);

  function addToCart() {
    setCartCount((current) => {
      const next = current + 1;
      window.localStorage.setItem('comentre_cart_count', String(next));
      return next;
    });
  }

  return (
    <main className="home-page">
      <style>{styles}</style>

      <header className="header">
        <Link href="/" className="logo" aria-label="Com’ entre nous accueil">
          <img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" />
        </Link>

        <nav className="nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="actions">
          <Link href="/boutique" aria-label="Recherche" className="icon-link">⌕</Link>
          <Link href="/a-propos" aria-label="Compte" className="icon-link">♡</Link>
          <Link href="/boutique" className="cart" aria-label={`Panier ${cartCount} article${cartCount > 1 ? 's' : ''}`}>
            <span>Panier</span><b>{cartCount}</b>
          </Link>
        </div>
      </header>

      <section className="hero" aria-label="Présentation Com’ entre nous">
        <div className="hero-copy">
          <p className="eyebrow">Des petits outils pour de grands moments</p>
          <h1>Des mots,<br />des cartes et des carnets pour <mark>créer du lien.</mark></h1>
          <p className="intro">Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, faire circuler les idées et remettre un peu de lien dans la vraie vie.</p>
          <div className="button-row">
            <Link href="/par-ou-commencer" className="btn primary">Découvrir nos univers →</Link>
            <Link href="/boutique" className="btn secondary">Voir les nouveautés →</Link>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroScene} alt="Une mère et une enfant autour de cartes de communication Com’ entre nous" />
        </div>
      </section>

      <section className="promise-strip" aria-label="Nos promesses">
        <div><span>♡</span><strong>Des créations</strong><p>avec amour</p></div>
        <div><span>✦</span><strong>Une approche</strong><p>bienveillante</p></div>
        <div><span>⌁</span><strong>Des outils</strong><p>pour la vraie vie</p></div>
        <div><span>☾</span><strong>Une communauté</strong><p>qui inspire</p></div>
      </section>

      <section className="univers" aria-labelledby="univers-title">
        <div className="universe-title">
          <span className="title-doodle">⌁</span>
          <h2 id="univers-title">Quel est ton univers ?</h2>
        </div>

        <div className="univers-grid">
          {univers.map((item) => (
            <Link href={item.href} key={item.href} className={`universe-card ${item.tone}`}>
              <div className="universe-copy">
                <p className="card-kicker">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="card-button">Découvrir <b>→</b></span>
              </div>
              <UniverseVisual item={item} />
            </Link>
          ))}
        </div>
      </section>

      <section className="products" aria-labelledby="news-title">
        <div className="section-head left">
          <p>Les nouveautés</p>
          <h2 id="news-title">Des idées dans ta valise</h2>
          <Link href="/boutique" className="shop-link">Voir toute la boutique →</Link>
        </div>
        <div className="product-grid">
          {products.map(([title, tag, price, href]) => (
            <article className="product-card" key={href}>
              <Link href={href} className="product-visual"><span>{tag}</span></Link>
              <h3><Link href={href}>{title}</Link></h3>
              <div className="product-bottom">
                <strong>{price}</strong>
                <button type="button" onClick={addToCart}>Ajouter</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="podcast">
        <div>
          <p className="label">Com’ entre nous · le podcast</p>
          <h2>Des conversations vraies, imparfaites, et tellement nous.</h2>
          <p>Le podcast est à venir. On lui garde une place douce, sans en faire trop pour l’instant.</p>
        </div>
        <Link href="/podcast" className="btn secondary">Découvrir l’espace podcast →</Link>
      </section>

      <footer className="footer">
        <div className="footer-brand"><img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" /></div>
        <p>Des mots, des outils, des humains.</p>
        <nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
      </footer>
    </main>
  );
}

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700;800&family=Patrick+Hand&display=swap');

:root {
  --cream: #fff9f1;
  --paper: #fffdfa;
  --ink: #0d1424;
  --muted: #5c5760;
  --coral: #ff565f;
  --pink: #ffe5e2;
  --pink-deep: #ff6670;
  --mint: #d7f5ef;
  --teal: #009b97;
  --yellow: #ffd768;
  --lilac: #ead4ff;
  --purple: #7f59d8;
  --shadow: 0 24px 70px rgba(48, 30, 18, .12);
  --body: 'Comfortaa', system-ui, sans-serif;
  --hand: 'Patrick Hand', 'Comic Sans MS', cursive;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--cream); color: var(--ink); }
a { color: inherit; text-decoration: none; }
button { font: inherit; }

.home-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at -3rem 14rem, rgba(255,198,194,.64) 0 9rem, transparent 9.1rem),
    radial-gradient(circle at calc(100% + 3rem) 12rem, rgba(201,242,236,.82) 0 9rem, transparent 9.1rem),
    linear-gradient(180deg, #fffdfa 0%, #fff7ec 100%);
  font-family: var(--body);
}
.header {
  position: sticky;
  top: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1rem, 2.5vw, 2.5rem);
  padding: .72rem clamp(1rem, 4vw, 4rem);
  background: rgba(255,253,248,.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(13,20,36,.06);
}
.logo { display: flex; align-items: center; width: 132px; min-width: 132px; }
.logo img { display: block; width: 100%; height: auto; }
.nav { display: flex; justify-content: center; gap: clamp(.9rem, 2vw, 2.15rem); font-weight: 800; font-size: clamp(.76rem, .86vw, .94rem); white-space: nowrap; }
.nav a { position: relative; }
.nav a:after { content: ''; position: absolute; left: 0; right: 0; bottom: -.45rem; height: .34rem; border-radius: 999px; background: var(--pink); transform: scaleX(0); transform-origin: left; transition: transform .18s ease; }
.nav a:hover:after { transform: scaleX(1); }
.actions { display: flex; align-items: center; gap: .65rem; }
.icon-link { display: grid; place-items: center; width: 2.3rem; height: 2.3rem; border-radius: 999px; font: 700 1.8rem/1 var(--hand); }
.cart { display: inline-flex; align-items: center; gap: .52rem; min-height: 2.65rem; padding: .65rem .92rem; border: 2px solid var(--ink); border-radius: 999px; background: #fff; font-weight: 800; }
.cart b { display: grid; place-items: center; min-width: 1.35rem; height: 1.35rem; border-radius: 999px; background: var(--coral); color: white; font-size: .72rem; }

.hero {
  width: min(1540px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(420px, .88fr) minmax(560px, 1.12fr);
  align-items: center;
  gap: clamp(2rem, 4vw, 4.5rem);
  padding: clamp(2.6rem, 5vw, 5.2rem) clamp(1.1rem, 5vw, 5.2rem) clamp(1.6rem, 3vw, 2.5rem);
}
.hero-copy { position: relative; z-index: 2; }
.eyebrow { display: inline-block; margin: 0 0 1.45rem; padding: .6rem 1.1rem; background: rgba(255,255,255,.84); border-radius: 999px; box-shadow: 0 12px 34px rgba(38,24,14,.08); font: 700 clamp(1.15rem,1.65vw,1.75rem)/1 var(--hand); transform: rotate(-2deg); }
h1 { margin: 0 0 1.35rem; max-width: 740px; font: 700 clamp(3.15rem,4.45vw,4.8rem)/.92 var(--hand); letter-spacing: -.045em; }
mark { display: inline-block; color: inherit; background: linear-gradient(90deg, rgba(255,180,176,.74), rgba(255,206,199,.78)); border-radius: 999px; padding: 0 .16em .04em; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.intro { max-width: 650px; margin: 0; color: #202636; font-size: clamp(1rem, 1.12vw, 1.18rem); line-height: 1.7; }
.button-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 2rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 3.2rem; padding: .92rem 1.42rem; border-radius: 999px; font-weight: 800; letter-spacing: -.02em; }
.primary { background: var(--coral); color: white; box-shadow: 0 16px 34px rgba(255,86,95,.24); }
.secondary { background: rgba(255,255,255,.78); border: 2px solid var(--ink); }
.hero-visual { position: relative; justify-self: end; width: min(780px, 100%); border-radius: 4.5rem 3.4rem 4.2rem 2.8rem; overflow: hidden; background: rgba(255,255,255,.62); box-shadow: var(--shadow); transform: rotate(.3deg); }
.hero-visual:before { content: ''; position: absolute; inset: 1rem; border-radius: 3.6rem 2.8rem 3.4rem 2.2rem; border: 1px solid rgba(255,255,255,.8); z-index: 2; pointer-events: none; }
.hero-visual img { display: block; width: 100%; height: auto; min-height: 430px; object-fit: cover; }

.promise-strip {
  width: min(1360px, calc(100% - 2rem));
  margin: 0 auto 4.2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  padding: 1.1rem 1.4rem;
  background: rgba(255,233,231,.7);
  border-radius: 2.2rem;
  box-shadow: 0 18px 48px rgba(48,30,18,.08);
}
.promise-strip div { display: grid; grid-template-columns: auto 1fr; gap: .25rem .8rem; align-items: center; padding: .35rem .8rem; }
.promise-strip span { grid-row: 1/3; font: 700 2rem/1 var(--hand); }
.promise-strip strong { font-size: .98rem; }
.promise-strip p { margin: 0; color: var(--muted); font-size: .85rem; }

.univers {
  width: min(1480px, calc(100% - 2rem));
  margin: 0 auto 5rem;
  position: relative;
}
.universe-title { text-align: center; margin-bottom: 1.35rem; position: relative; }
.title-doodle { display: inline-block; margin-bottom: -.2rem; color: var(--ink); font: 700 2.4rem/1 var(--hand); transform: rotate(-12deg); }
.universe-title h2 { margin: 0; font: 700 clamp(2.7rem, 4.8vw, 5.2rem)/.9 var(--hand); letter-spacing: -.035em; }
.univers-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(1rem, 1.7vw, 1.45rem); }
.universe-card {
  position: relative;
  min-height: 315px;
  display: grid;
  grid-template-columns: 1.02fr .92fr;
  align-items: stretch;
  overflow: hidden;
  padding: clamp(1.25rem, 2.2vw, 2rem);
  border-radius: 2.1rem;
  isolation: isolate;
  box-shadow: 0 22px 55px rgba(48,30,18,.10);
  transition: transform .18s ease, box-shadow .18s ease;
}
.universe-card:hover { transform: translateY(-5px); box-shadow: 0 26px 65px rgba(48,30,18,.14); }
.universe-card.family { background: linear-gradient(135deg, #ffe2df 0%, #fff3ec 68%); }
.universe-card.business { background: linear-gradient(135deg, #d9f6f1 0%, #fff8ef 73%); }
.universe-card.paper { background: linear-gradient(135deg, #ead8ff 0%, #fff7ef 72%); }
.universe-card:before { content: ''; position: absolute; right: -4.2rem; top: -3.5rem; width: 12rem; height: 12rem; border-radius: 999px; background: rgba(255,255,255,.44); z-index: -1; }
.universe-copy { position: relative; z-index: 3; align-self: stretch; display: flex; flex-direction: column; justify-content: flex-start; padding-right: .3rem; }
.card-kicker { align-self: flex-start; margin: 0 0 1.2rem; padding: .46rem .72rem; border-radius: 999px; background: rgba(255,255,255,.78); font-size: .66rem; font-weight: 800; text-transform: uppercase; letter-spacing: .045em; }
.universe-card h3 { margin: 0 0 .85rem; font: 700 clamp(2.1rem, 3.2vw, 3.6rem)/.84 var(--hand); letter-spacing: -.04em; }
.universe-card.family h3 { color: var(--pink-deep); }
.universe-card.business h3 { color: var(--teal); }
.universe-card.paper h3 { color: var(--purple); }
.universe-copy p:not(.card-kicker) { max-width: 18rem; margin: 0; font-size: .96rem; line-height: 1.55; color: #202638; }
.card-button { align-self: flex-start; margin-top: auto; display: inline-flex; align-items: center; gap: .65rem; min-height: 2.75rem; padding: .72rem 1.05rem; border: 1.8px solid var(--ink); border-radius: 999px; background: rgba(255,255,255,.72); font-weight: 800; font-size: .82rem; box-shadow: 0 8px 22px rgba(48,30,18,.06); }
.card-button b { display: grid; place-items: center; width: 1.4rem; height: 1.4rem; border-radius: 999px; background: var(--ink); color: #fff; line-height: 1; }
.universe-visual { position: relative; z-index: 2; min-height: 250px; align-self: end; }
.visual-glow { position: absolute; right: -.8rem; bottom: -.8rem; width: 11.8rem; height: 11.8rem; border-radius: 55% 45% 48% 52%; background: rgba(255,255,255,.46); filter: blur(.2px); }
.universe-card.family .visual-glow { background: rgba(255,249,245,.68); }
.universe-card.business .visual-glow { background: rgba(245,255,251,.72); }
.universe-card.paper .visual-glow { background: rgba(252,246,255,.72); }
.universe-visual img { position: absolute; right: -.35rem; bottom: -.25rem; width: min(94%, 18rem); max-height: 290px; object-fit: contain; object-position: right bottom; mix-blend-mode: multiply; filter: drop-shadow(0 18px 18px rgba(48,30,18,.08)); }
.visual-heart { position: absolute; top: 1.2rem; left: .5rem; color: var(--ink); font: 700 2.1rem/1 var(--hand); transform: rotate(-10deg); z-index: 4; }
.visual-dash { position: absolute; width: 2.25rem; height: .22rem; border-radius: 999px; background: var(--ink); z-index: 4; }
.dash-one { top: 2.4rem; right: 1rem; transform: rotate(54deg); }
.dash-two { top: 4.4rem; right: 2.55rem; width: 1.55rem; transform: rotate(18deg); }

.products { width: min(1260px, calc(100% - 2rem)); margin: 0 auto 4.5rem; }
.section-head.left { text-align: left; position: relative; margin-bottom: 1.4rem; }
.section-head p, .label { margin: 0 0 .55rem; color: var(--coral); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: .76rem; }
.section-head h2, .podcast h2 { margin: 0; font: 700 clamp(2.5rem, 4.4vw, 4.8rem)/.95 var(--hand); letter-spacing: -.035em; }
.shop-link { position: absolute; right: 0; bottom: .3rem; padding: .85rem 1.1rem; border-radius: 999px; background: rgba(255,255,255,.76); font-weight: 800; box-shadow: 0 12px 28px rgba(48,30,18,.07); }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.product-card { background: white; border-radius: 1.45rem; padding: .75rem; box-shadow: 0 16px 40px rgba(48,30,18,.08); }
.product-visual { height: 150px; border-radius: 1.1rem; background: linear-gradient(135deg,#ffe3df,#fff8ef 58%,#d7f6f1); display: grid; place-items: center; }
.product-visual span { max-width: 70%; padding: 1rem; border-radius: .9rem; background: rgba(255,255,255,.7); text-align: center; font: 700 1.35rem/1.05 var(--hand); transform: rotate(-2deg); }
.product-card h3 { margin: .8rem .15rem .4rem; font-size: .92rem; line-height: 1.25; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; gap: .7rem; margin: .15rem; }
.product-bottom button { border: 0; border-radius: 999px; background: var(--coral); color: white; width: 2.5rem; height: 2.5rem; overflow: hidden; text-indent: -999px; position: relative; cursor: pointer; }
.product-bottom button:before { content: '🛒'; position: absolute; inset: 0; display: grid; place-items: center; text-indent: 0; }

.podcast { width: min(1260px, calc(100% - 2rem)); margin: 0 auto 4rem; padding: clamp(1.5rem,4vw,3rem); display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center; background: #ffd9d1; border-radius: 2.2rem; box-shadow: var(--shadow); }
.podcast p:not(.label) { max-width: 650px; line-height: 1.6; color: #252936; }
.footer { width: min(1260px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 3rem; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 1.5rem; }
.footer-brand { width: 5.4rem; }
.footer-brand img { display: block; width: 100%; height: auto; }
.footer p { margin: 0; color: var(--muted); }
.footer nav { display: flex; gap: 1rem; font-weight: 800; font-size: .82rem; }

@media (max-width: 1120px) {
  .header { grid-template-columns: auto auto; }
  .nav { grid-column: 1 / -1; justify-content: flex-start; overflow-x: auto; padding: .25rem 0 .45rem; }
  .hero { grid-template-columns: 1fr; }
  .hero-visual { justify-self: start; }
  .univers-grid { grid-template-columns: 1fr; max-width: 760px; margin: 0 auto; }
  .universe-card { grid-template-columns: 1fr .82fr; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .podcast { grid-template-columns: 1fr; }
  .footer { grid-template-columns: 1fr; }
}
@media (max-width: 680px) {
  .home-page { background: linear-gradient(180deg,#fffdfa,#fff7ec); }
  .header { position: relative; padding: .7rem 1rem; }
  .logo { width: 92px; min-width: 92px; }
  .actions { gap: .35rem; }
  .icon-link { display: none; }
  .cart span { display: none; }
  .hero { padding: 1.7rem 1rem 1rem; gap: 1.4rem; }
  h1 { font-size: clamp(2.8rem, 17vw, 4.2rem); }
  .button-row { flex-direction: column; }
  .btn { width: 100%; }
  .hero-visual { border-radius: 2.2rem; }
  .hero-visual img { min-height: 260px; }
  .promise-strip { grid-template-columns: 1fr 1fr; margin-bottom: 2.7rem; padding: 1rem; }
  .promise-strip div { grid-template-columns: 1fr; text-align: center; }
  .promise-strip span { grid-row: auto; }
  .universe-title h2 { font-size: clamp(2.8rem, 15vw, 4.2rem); }
  .universe-card { min-height: 430px; grid-template-columns: 1fr; padding: 1.35rem; }
  .universe-copy p:not(.card-kicker) { max-width: 100%; }
  .universe-visual { min-height: 210px; margin-top: .5rem; }
  .universe-visual img { width: min(75%, 15rem); right: 0; }
  .visual-glow { right: 0; bottom: 0; }
  .product-grid { grid-template-columns: 1fr; }
  .shop-link { position: static; display: inline-flex; margin-top: 1rem; }
  .footer nav { flex-wrap: wrap; }
}
`;
