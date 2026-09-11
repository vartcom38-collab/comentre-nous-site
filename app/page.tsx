'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { heroScene } from './heroScene';

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
    state: 'active',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    kicker: 'Idées · clarté · visibilité',
    text: 'Des cartes et des carnets pour clarifier tes idées et créer avec plus de justesse.',
    tone: 'business',
    state: 'waiting',
  },
  {
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    kicker: 'Bujo · to-do · trackers',
    text: 'Des carnets, kits et pages à imprimer pour organiser la vraie vie.',
    tone: 'paper',
    state: 'waiting',
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
    <div className={`universe-visual ${item.state}`} aria-hidden="true">
      <span className="soft-photo" />
      <span className="asset-note">visuel à choisir</span>
      {item.tone === 'family' ? (
        <>
          <span className="tiny-character family-kid"><i /></span>
          <span className="tiny-character family-adult"><i /></span>
          <span className="drawn-line line-one" />
          <span className="drawn-line line-two" />
          <span className="floating-heart">♡</span>
        </>
      ) : (
        <>
          <span className="quiet-blob" />
          <span className="floating-heart">♡</span>
        </>
      )}
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
          <p>Trois univers, un même fil</p>
          <h2 id="univers-title">Quel est ton univers ?</h2>
        </div>

        <div className="univers-grid">
          {univers.map((item) => (
            <Link href={item.href} key={item.href} className={`universe-card ${item.tone} ${item.state}`}>
              <div className="universe-copy">
                <p className="card-kicker">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p className="card-text">{item.text}</p>
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
  margin: 0 auto 4.4rem;
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
  margin: 0 auto 4.9rem;
}
.universe-title { text-align: center; margin-bottom: 1.7rem; }
.universe-title p { margin: 0 0 .45rem; color: var(--coral); font-weight: 800; text-transform: uppercase; letter-spacing: .12em; font-size: .74rem; }
.universe-title h2 { margin: 0; font: 700 clamp(2.75rem, 5vw, 5.25rem)/.92 var(--hand); letter-spacing: -.035em; }
.univers-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 1.9vw, 1.55rem);
  align-items: stretch;
}
.universe-card {
  position: relative;
  min-height: 360px;
  display: grid;
  grid-template-columns: .92fr 1.05fr;
  align-items: end;
  gap: .4rem;
  overflow: hidden;
  padding: clamp(1.25rem, 2vw, 1.9rem);
  border-radius: 2.2rem;
  box-shadow: 0 22px 55px rgba(48,30,18,.09);
  transition: transform .18s ease, box-shadow .18s ease;
}
.universe-card:hover { transform: translateY(-5px); box-shadow: 0 28px 70px rgba(48,30,18,.14); }
.universe-card.family { background: linear-gradient(135deg, #ffe1dd 0%, #fff6f1 74%); }
.universe-card.business { background: linear-gradient(135deg, #d8f5ef 0%, #fff9f2 75%); }
.universe-card.paper { background: linear-gradient(135deg, #ead9ff 0%, #fff8f0 75%); }
.universe-card.waiting { opacity: .84; }
.universe-card:before { content: ''; position: absolute; right: -4.3rem; top: -4.4rem; width: 12rem; height: 12rem; border-radius: 999px; background: rgba(255,255,255,.42); }
.universe-card:after { content: '♡'; position: absolute; right: 1.15rem; top: .95rem; color: rgba(13,20,36,.75); font: 700 2.15rem/1 var(--hand); transform: rotate(11deg); }
.universe-copy { position: relative; z-index: 3; align-self: stretch; display: flex; flex-direction: column; justify-content: flex-start; padding-top: .6rem; }
.card-kicker { margin: 0 auto 1rem 0; padding: .48rem .75rem; border-radius: 999px; background: rgba(255,255,255,.72); font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
.universe-card h3 { margin: 0 0 .95rem; font: 700 clamp(2.35rem, 3.3vw, 3.9rem)/.86 var(--hand); letter-spacing: -.04em; }
.universe-card.family h3 { color: var(--pink-deep); }
.universe-card.business h3 { color: var(--teal); }
.universe-card.paper h3 { color: var(--purple); }
.card-text { max-width: 18.5rem; margin: 0 0 auto; font-size: .98rem; line-height: 1.55; color: #192032; }
.card-button { align-self: flex-start; display: inline-flex; align-items: center; gap: .58rem; justify-content: center; min-height: 2.65rem; margin-top: 1.4rem; padding: .7rem 1.05rem .7rem 1.15rem; border: 1.8px solid var(--ink); border-radius: 999px; background: rgba(255,255,255,.62); font-weight: 800; font-size: .86rem; }
.card-button b { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; border-radius: 50%; background: var(--ink); color: #fff; font-weight: 800; }
.universe-visual {
  position: relative;
  z-index: 2;
  align-self: stretch;
  min-height: 255px;
}
.soft-photo {
  position: absolute;
  right: -1.1rem;
  bottom: -1.25rem;
  width: min(17.5rem, 112%);
  aspect-ratio: 1 / 1.18;
  border-radius: 44% 56% 34% 66% / 44% 38% 62% 56%;
  background:
    radial-gradient(circle at 48% 30%, rgba(255,255,255,.72) 0 18%, transparent 18.5%),
    linear-gradient(150deg, rgba(255,255,255,.62), rgba(255,255,255,.16));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.5), 0 22px 40px rgba(48,30,18,.07);
}
.family.active .soft-photo { background:
    radial-gradient(circle at 50% 30%, rgba(255,255,255,.78) 0 18%, transparent 18.5%),
    linear-gradient(150deg, rgba(255,255,255,.72), rgba(255,202,197,.28)); }
.asset-note {
  position: absolute;
  left: .2rem;
  bottom: .15rem;
  padding: .38rem .78rem;
  border-radius: 999px;
  background: rgba(255,255,255,.64);
  color: rgba(13,20,36,.55);
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .04em;
  text-transform: uppercase;
}
.waiting .asset-note { opacity: .72; }
.tiny-character { position: absolute; display: block; border: 3px solid var(--ink); background: #fff8f2; }
.tiny-character:before { content: ''; position: absolute; width: 2.1rem; height: 1.85rem; border: 3px solid #111827; border-radius: 50%; background: #111827; }
.tiny-character i { position: absolute; display: block; width: .32rem; height: .32rem; border-radius: 50%; background: var(--coral); box-shadow: 1.1rem 0 0 var(--coral); }
.family-kid { width: 5.1rem; height: 5.8rem; right: 7.2rem; bottom: 4.8rem; border-radius: 46% 54% 42% 58%; transform: rotate(-7deg); }
.family-kid:before { left: 1.3rem; top: -1.9rem; }
.family-kid i { left: 1.45rem; top: 2.05rem; }
.family-adult { width: 6rem; height: 6.9rem; right: 2.2rem; bottom: 2rem; border-radius: 48% 52% 42% 58%; transform: rotate(6deg); }
.family-adult:before { left: 1.65rem; top: -2rem; width: 2.7rem; height: 2.25rem; }
.family-adult i { left: 1.8rem; top: 2.38rem; }
.drawn-line { position: absolute; width: 2.05rem; height: .22rem; border-radius: 999px; background: var(--ink); }
.line-one { right: 12rem; bottom: 12rem; transform: rotate(28deg); }
.line-two { right: 1.1rem; bottom: 12.9rem; transform: rotate(-22deg); }
.floating-heart { position: absolute; right: .35rem; top: 2.8rem; font: 700 2.3rem/1 var(--hand); color: var(--ink); transform: rotate(12deg); }
.quiet-blob { position: absolute; right: 2.2rem; bottom: 2.1rem; width: 9.5rem; height: 9.5rem; border-radius: 50%; background: rgba(255,255,255,.34); }
.waiting .soft-photo { opacity: .55; }
.waiting .floating-heart { opacity: .45; }
.products { width: min(1260px, calc(100% - 2rem)); margin: 0 auto 4.5rem; }
.section-head.left { text-align: left; position: relative; margin-bottom: 1.4rem; }
.section-head p, .label { margin: 0 0 .55rem; color: var(--coral); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: .76rem; }
.section-head h2, .podcast h2 { margin: 0; font: 700 clamp(2.6rem, 4.6vw, 5rem)/.92 var(--hand); letter-spacing: -.035em; }
.shop-link { position: absolute; right: 0; bottom: .35rem; display: inline-flex; padding: .75rem 1rem; border-radius: 999px; background: rgba(255,255,255,.7); font-weight: 800; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.product-card { padding: .65rem; border-radius: 1.35rem; background: rgba(255,255,255,.72); box-shadow: 0 18px 44px rgba(48,30,18,.08); }
.product-visual { display: grid; place-items: center; min-height: 170px; border-radius: 1rem; background: linear-gradient(135deg, var(--pink), #fff5e8); color: var(--muted); text-align: center; font-weight: 700; }
.product-card h3 { margin: .85rem .25rem .45rem; font-size: .92rem; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; padding: .25rem; }
.product-bottom button { border: 0; border-radius: 999px; background: var(--coral); color: #fff; padding: .65rem .8rem; font-weight: 800; cursor: pointer; }
.podcast { width: min(1360px, calc(100% - 2rem)); margin: 0 auto 3.2rem; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2rem; padding: clamp(1.6rem, 3vw, 2.5rem); border-radius: 2.2rem; background: linear-gradient(135deg, #ffdcd7, #fff3ec); box-shadow: var(--shadow); }
.podcast p:last-child { max-width: 620px; line-height: 1.65; color: #202636; }
.footer { width: min(1360px, calc(100% - 2rem)); margin: 0 auto; padding: 2.5rem 0 3rem; display: grid; grid-template-columns: auto 1fr auto; align-items: end; gap: 1.5rem; }
.footer-brand img { width: 95px; height: auto; }
.footer p { margin: 0; color: var(--muted); font-size: .9rem; }
.footer nav { display: flex; gap: 1rem; color: var(--muted); font-size: .84rem; }
@media (max-width: 1120px) {
  .header { grid-template-columns: auto auto; }
  .nav { grid-column: 1 / -1; grid-row: 2; overflow-x: auto; justify-content: flex-start; padding-bottom: .35rem; }
  .actions { justify-self: end; }
  .hero { grid-template-columns: 1fr; }
  .hero-visual { justify-self: center; }
  .univers-grid { grid-template-columns: 1fr; }
  .universe-card { min-height: 310px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 720px) {
  .home-page { background: linear-gradient(180deg, #fffdfa 0%, #fff7ec 100%); }
  .header { position: relative; padding: .75rem 1rem; }
  .logo { width: 96px; min-width: 96px; }
  .actions { gap: .3rem; }
  .icon-link { display: none; }
  .cart span { display: none; }
  .hero { padding: 2rem 1rem 1.2rem; gap: 1.2rem; }
  .eyebrow { font-size: 1.08rem; }
  h1 { font-size: clamp(3rem, 16vw, 4.1rem); }
  .intro { font-size: .98rem; }
  .button-row { flex-direction: column; }
  .btn { width: 100%; }
  .hero-visual { border-radius: 2.2rem; }
  .hero-visual img { min-height: 280px; }
  .promise-strip { grid-template-columns: 1fr 1fr; margin-bottom: 2.8rem; }
  .univers { width: calc(100% - 1rem); }
  .universe-title h2 { font-size: 3rem; }
  .universe-card { grid-template-columns: 1fr; min-height: auto; padding: 1.25rem; }
  .universe-visual { min-height: 210px; }
  .soft-photo { width: 76%; right: 0; }
  .asset-note { display: none; }
  .product-grid { grid-template-columns: 1fr; }
  .section-head.left .shop-link { position: static; margin-top: 1rem; }
  .podcast { grid-template-columns: 1fr; }
  .footer { grid-template-columns: 1fr; text-align: center; justify-items: center; }
  .footer nav { flex-wrap: wrap; justify-content: center; }
}
`;
