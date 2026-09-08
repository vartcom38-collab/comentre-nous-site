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
    button: 'Découvrir',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    kicker: 'Idées · clarté · visibilité',
    text: 'Des cartes et carnets pour clarifier tes idées et créer avec plus de justesse.',
    tone: 'business',
    button: 'Découvrir',
  },
  {
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    kicker: 'Bujo · to-do · trackers',
    text: 'Des carnets, kits et pages à imprimer pour organiser la vraie vie.',
    tone: 'paper',
    button: 'Découvrir',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/produits/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/produits/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/produits/mon-kit-ete'],
  ['Cartes émotions', 'Support à imprimer', '24,90 €', '/produits/cartes-emotions'],
] as const;

type UniverseTone = (typeof univers)[number]['tone'];

function UniverseVisual({ tone }: { tone: UniverseTone }) {
  if (tone === 'paper') {
    return (
      <div className="mini-visual paper-visual" aria-hidden="true">
        <span className="doodle-heart">♡</span>
        <div className="notebook">
          <span />
          <span />
          <span />
          <b>petites idées<br />grands effets</b>
        </div>
        <div className="pencil" />
      </div>
    );
  }

  return (
    <div className={`mini-visual ${tone}-visual`} aria-hidden="true">
      <span className="doodle-heart">♡</span>
      <span className="doodle-line one" />
      <span className="doodle-line two" />
      <div className="person big">
        <i className="bun" />
        <i className="head" />
        <i className="body" />
      </div>
      {tone === 'family' ? (
        <div className="person small">
          <i className="bun" />
          <i className="head" />
          <i className="body" />
        </div>
      ) : (
        <div className="laptop"><span>♡</span></div>
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
        <div className="section-head universe-head">
          <span className="hand-rays">⌁</span>
          <h2 id="univers-title">Quel est ton univers ?</h2>
          <p>Trois espaces pour retrouver le bon outil au bon moment.</p>
        </div>

        <div className="univers-grid">
          {univers.map((item) => (
            <Link href={item.href} key={item.href} className={`universe-card ${item.tone}`}>
              <div className="universe-copy">
                <p className="card-kicker">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p className="card-text">{item.text}</p>
                <span className="card-button">{item.button} →</span>
              </div>
              <UniverseVisual tone={item.tone} />
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
  margin: 0 auto 4.9rem;
  position: relative;
}
.universe-head {
  text-align: center;
  margin-bottom: 1.4rem;
  position: relative;
}
.hand-rays { display: block; font: 700 2.4rem/1 var(--hand); color: var(--ink); transform: rotate(-10deg); }
.section-head p,
.label { margin: 0 0 .55rem; color: var(--coral); font-weight: 800; text-transform: uppercase; letter-spacing: .08em; font-size: .76rem; }
.section-head h2,
.podcast h2 { margin: 0; font: 700 clamp(2.6rem, 4.6vw, 5rem)/.92 var(--hand); letter-spacing: -.035em; }
.universe-head p { max-width: 640px; margin: .45rem auto 0; color: var(--muted); line-height: 1.55; }

.univers-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 1.8vw, 1.45rem);
}
.universe-card {
  position: relative;
  min-height: 330px;
  display: grid;
  grid-template-columns: .98fr 1.05fr;
  align-items: end;
  gap: .35rem;
  overflow: hidden;
  padding: clamp(1.15rem, 2vw, 1.8rem);
  border-radius: 2.1rem;
  box-shadow: 0 22px 55px rgba(48,30,18,.10);
  transition: transform .18s ease, box-shadow .18s ease;
}
.universe-card:hover { transform: translateY(-5px); box-shadow: 0 26px 65px rgba(48,30,18,.14); }
.universe-card.family { background: linear-gradient(135deg, #ffe3df 0%, #fff4ee 68%); }
.universe-card.business { background: linear-gradient(135deg, #d7f4ef 0%, #fff7ef 72%); }
.universe-card.paper { background: linear-gradient(135deg, #ead7ff 0%, #fff7ef 72%); }
.universe-card:before { content: ''; position: absolute; right: -2.4rem; top: -2.4rem; width: 8.8rem; height: 8.8rem; border-radius: 999px; background: rgba(255,255,255,.45); }
.universe-card:after { content: '♡'; position: absolute; right: 1.1rem; top: .85rem; color: rgba(13,20,36,.74); font: 700 2.2rem/1 var(--hand); transform: rotate(12deg); }
.universe-copy { position: relative; z-index: 2; align-self: stretch; display: flex; flex-direction: column; justify-content: flex-end; padding-right: .4rem; }
.card-kicker { margin: 0 auto 1rem 0; padding: .48rem .75rem; border-radius: 999px; background: rgba(255,255,255,.74); font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .05em; }
.universe-card h3 { margin: 0 0 .8rem; font: 700 clamp(2.25rem, 3.4vw, 3.8rem)/.86 var(--hand); letter-spacing: -.04em; }
.universe-card.family h3 { color: var(--pink-deep); }
.universe-card.business h3 { color: var(--teal); }
.universe-card.paper h3 { color: var(--purple); }
.card-text { max-width: 20rem; margin: 0 0 1.35rem; font-size: .96rem; line-height: 1.55; color: #192032; }
.card-button { align-self: flex-start; display: inline-flex; align-items: center; justify-content: center; min-height: 2.55rem; padding: .7rem 1.1rem; border: 1.8px solid var(--ink); border-radius: 999px; background: rgba(255,255,255,.65); font-weight: 800; font-size: .82rem; }

.mini-visual {
  position: relative;
  z-index: 2;
  align-self: stretch;
  min-height: 230px;
}
.doodle-heart { position: absolute; top: 16%; right: 12%; color: var(--ink); font: 700 2.1rem/1 var(--hand); transform: rotate(-9deg); }
.doodle-line { position: absolute; width: 2.4rem; height: .22rem; border-radius: 999px; background: var(--ink); opacity: .9; }
.doodle-line.one { top: 12%; left: 18%; transform: rotate(40deg); }
.doodle-line.two { top: 23%; left: 8%; transform: rotate(12deg); width: 1.7rem; }
.person { position: absolute; }
.person .head { position: absolute; display: block; width: 4.4rem; height: 4.8rem; border: 3px solid var(--ink); border-radius: 48% 52% 48% 52%; background: #ffe4d1; box-shadow: inset -.25rem -.25rem 0 rgba(255,170,150,.22); }
.person .bun { position: absolute; display: block; width: 3rem; height: 2.4rem; border: 3px solid #6e3d20; border-radius: 50%; background: #8a552f; z-index: 2; }
.person .body { position: absolute; display: block; width: 7rem; height: 5.8rem; border: 3px solid var(--ink); border-radius: 3.2rem 3.2rem 1rem 1rem; background: #fffaf5; }
.person.big { width: 11rem; height: 13rem; right: 2.2rem; bottom: .8rem; }
.person.big .bun { left: 3rem; top: .1rem; }
.person.big .head { left: 2.6rem; top: 2rem; }
.person.big .body { left: 1.35rem; top: 6.4rem; }
.person.small { width: 8rem; height: 9.6rem; right: 7.2rem; bottom: .2rem; }
.person.small .bun { width: 2.1rem; height: 1.8rem; left: 2.7rem; top: .4rem; }
.person.small .head { width: 3.2rem; height: 3.5rem; left: 2.2rem; top: 1.8rem; }
.person.small .body { width: 5.3rem; height: 4.4rem; left: 1.25rem; top: 5rem; background: #ffd369; }
.laptop { position: absolute; right: 1.4rem; bottom: 1.2rem; width: 9.2rem; height: 6.2rem; border: 3px solid var(--ink); border-radius: .8rem; background: #fffaf5; box-shadow: .4rem .55rem 0 rgba(13,20,36,.08); display: grid; place-items: center; }
.laptop:after { content: ''; position: absolute; left: -.9rem; right: -.9rem; bottom: -.85rem; height: .75rem; border: 3px solid var(--ink); border-radius: 999px; background: #fff; }
.laptop span { font: 700 1.8rem/1 var(--hand); color: var(--coral); }
.notebook { position: absolute; right: 2.3rem; bottom: 1.1rem; width: 10.2rem; height: 13rem; border: 3px solid var(--ink); border-radius: 1.2rem; background: #fffaf5; transform: rotate(3deg); box-shadow: .6rem .8rem 0 rgba(13,20,36,.08); display: grid; place-items: center; text-align: center; font: 700 1.45rem/1.05 var(--hand); }
.notebook span { position: absolute; left: -.7rem; width: 1.2rem; height: .35rem; border: 2px solid var(--ink); border-radius: 999px; background: white; }
.notebook span:nth-child(1) { top: 2.4rem; }
.notebook span:nth-child(2) { top: 5.8rem; }
.notebook span:nth-child(3) { top: 9.2rem; }
.pencil { position: absolute; right: .6rem; bottom: 1.2rem; width: 1.1rem; height: 10rem; border: 3px solid var(--ink); border-radius: 999px; background: var(--yellow); transform: rotate(14deg); }
.pencil:after { content: ''; position: absolute; bottom: -.85rem; left: 50%; width: 0; height: 0; border-left: .48rem solid transparent; border-right: .48rem solid transparent; border-top: .8rem solid var(--ink); transform: translateX(-50%); }

.products { width: min(1260px, calc(100% - 2rem)); margin: 0 auto 4.5rem; }
.section-head.left { text-align: left; position: relative; margin-bottom: 1.4rem; }
.shop-link { position: absolute; right: 0; bottom: .15rem; display: inline-flex; min-height: 2.9rem; align-items: center; padding: .8rem 1.2rem; border-radius: 999px; background: #fff; box-shadow: 0 12px 28px rgba(48,30,18,.08); font-weight: 800; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.product-card { background: white; border-radius: 1.6rem; padding: .9rem; box-shadow: 0 16px 40px rgba(48,30,18,.08); }
.product-visual { height: 165px; border-radius: 1.2rem; background: linear-gradient(135deg,#ffe4dd,#fff8ef 58%,#d7f6ef); display: grid; place-items: center; overflow: hidden; }
.product-visual span { display: inline-block; max-width: 74%; padding: 1rem 1.2rem; border-radius: 1rem; background: rgba(255,255,255,.72); text-align: center; font: 700 1.35rem/1.05 var(--hand); transform: rotate(-2deg); }
.product-card h3 { margin: .9rem .25rem .6rem; font-size: .95rem; line-height: 1.3; }
.product-bottom { display: flex; align-items: center; justify-content: space-between; gap: .8rem; margin: .25rem; }
.product-bottom button { border: 0; cursor: pointer; background: var(--coral); color: white; border-radius: 999px; padding: .72rem .95rem; font-weight: 800; }

.podcast { width: min(1360px, calc(100% - 2rem)); margin: 0 auto 4rem; padding: clamp(1.5rem, 3vw, 2.8rem); border-radius: 2.4rem; background: linear-gradient(135deg,#ffd7d1,#fff2ec); display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2rem; box-shadow: var(--shadow); }
.podcast p:not(.label) { max-width: 680px; line-height: 1.55; }
.footer { width: min(1260px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 3rem; display: grid; grid-template-columns: auto 1fr auto; gap: 1.5rem; align-items: center; color: #312b28; }
.footer-brand { width: 5.8rem; }
.footer-brand img { display: block; width: 100%; height: auto; }
.footer p { margin: 0; color: var(--muted); }
.footer nav { display: flex; gap: 1rem; }
.footer nav a { font-size: .82rem; font-weight: 800; }

@media (max-width: 1160px) {
  .header { grid-template-columns: auto auto; }
  .nav { grid-column: 1 / -1; justify-content: flex-start; overflow-x: auto; padding: .35rem 0; }
  .hero { grid-template-columns: 1fr; }
  .hero-visual { justify-self: start; width: 100%; max-width: 820px; }
  .univers-grid { grid-template-columns: 1fr; }
  .universe-card { min-height: 280px; }
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .podcast { grid-template-columns: 1fr; }
}

@media (max-width: 700px) {
  .home-page { background: linear-gradient(180deg,#fffdfa,#fff7ec); }
  .header { position: relative; grid-template-columns: 1fr auto; padding: .7rem 1rem; }
  .logo { width: 96px; min-width: 96px; }
  .actions { justify-content: flex-end; }
  .icon-link { display: none; }
  .cart span { display: none; }
  .nav { font-size: .78rem; gap: 1rem; }
  .hero { padding: 2rem 1rem 1.2rem; gap: 1.6rem; }
  h1 { font-size: clamp(3rem, 16vw, 4rem); }
  .button-row { display: grid; grid-template-columns: 1fr; }
  .btn { width: 100%; }
  .hero-visual { border-radius: 2rem; }
  .hero-visual img { min-height: 280px; }
  .promise-strip { grid-template-columns: 1fr 1fr; border-radius: 1.6rem; padding: .95rem; margin-bottom: 3rem; }
  .promise-strip div { grid-template-columns: 1fr; text-align: center; gap: .15rem; }
  .promise-strip span { grid-row: auto; }
  .univers { width: calc(100% - 1.2rem); }
  .universe-card { grid-template-columns: 1fr; min-height: auto; padding: 1.15rem; }
  .mini-visual { min-height: 190px; order: -1; }
  .card-text { max-width: none; }
  .product-grid { grid-template-columns: 1fr; }
  .shop-link { position: static; margin-top: 1rem; }
  .footer { grid-template-columns: 1fr; text-align: center; justify-items: center; }
  .footer nav { flex-wrap: wrap; justify-content: center; }
}
`;
