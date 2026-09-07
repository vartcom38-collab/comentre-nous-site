'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    number: '01',
    title: 'Com’ en famille',
    href: '/com-en-famille',
    intro: 'Pour les parents, les enfants, les émotions, les phrases qu’on cherche et les moments où on aimerait juste créer un peu plus de lien.',
    details: 'Cartes · jeux · rituels · outils du quotidien',
    color: 'rose',
  },
  {
    number: '02',
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    intro: 'Pour poser ses idées, clarifier son message, oser parler de ce qu’on crée et communiquer sans se perdre dans les injonctions.',
    details: 'Idées · visibilité · organisation · intuition',
    color: 'mint',
  },
  {
    number: '03',
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    intro: 'L’endroit des to-do lists, pages de bujo, trackers, plannings, carnets guidés et petits supports à imprimer pour organiser le quotidien.',
    details: 'Bujo · listes · carnets · pages à imprimer',
    color: 'sand',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/products/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/products/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/products/mon-kit-dete'],
] as const;

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
    <main className="page">
      <style>{styles}</style>

      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Accueil Com’ entre nous">
          <span className="wordmark-main">Com’ entre nous</span>
          <span className="wordmark-sub">des mots · des cartes · des carnets</span>
          <i aria-hidden="true">♥</i>
        </Link>

        <nav className="main-nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="header-actions">
          <Link href="/boutique" className="action-text">Recherche</Link>
          <Link href="/a-propos" className="action-text">Compte</Link>
          <Link href="/boutique" className="cart-link" aria-label={`Panier ${cartCount} article${cartCount > 1 ? 's' : ''}`}>
            <span>Panier</span>
            <b>{cartCount}</b>
          </Link>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <p className="small-note">Des petits outils pour de grands moments</p>
          <h1>Créer du lien, sans rendre le quotidien plus compliqué.</h1>
          <p className="hero-intro">Com’ entre nous imagine des ressources sensibles, jolies et concrètes pour mieux se parler, déposer les idées, apprivoiser les émotions et retrouver un peu de douceur dans la vraie vie.</p>
          <div className="button-row">
            <Link href="/par-ou-commencer" className="btn btn-primary">Découvrir les univers</Link>
            <Link href="/boutique" className="btn btn-secondary">Voir les nouveautés</Link>
          </div>
        </div>

        <div className="hero-paper" aria-label="Univers Com’ entre nous">
          <p className="paper-kicker">Ici, on garde</p>
          <ul>
            <li>les mots qui réparent</li>
            <li>les carnets qui aident à y voir clair</li>
            <li>les petites idées qui changent l’ambiance</li>
          </ul>
          <span className="paper-signature">avec douceur, humour et vraie vie.</span>
        </div>
      </section>

      <section className="univers-section" aria-labelledby="univers-title">
        <div className="section-heading">
          <p>Choisir par besoin</p>
          <h2 id="univers-title">Trois portes d’entrée, pas quinze chemins.</h2>
        </div>

        <div className="univers-list">
          {univers.map((item) => (
            <Link href={item.href} className={`universe-card ${item.color}`} key={item.href}>
              <span className="universe-number">{item.number}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.intro}</p>
                <em>{item.details}</em>
              </div>
              <strong>Entrer</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="news-section" aria-labelledby="news-title">
        <div className="section-heading compact">
          <p>Les premiers produits</p>
          <h2 id="news-title">Les nouveautés arrivent doucement.</h2>
        </div>
        <div className="product-list">
          {products.map(([title, label, price, href]) => (
            <article className="product-line" key={href}>
              <Link href={href} className="product-copy">
                <span>{label}</span>
                <h3>{title}</h3>
              </Link>
              <div className="product-buy">
                <strong>{price}</strong>
                <button type="button" onClick={addToCart}>Ajouter</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="podcast-section">
        <div>
          <p className="small-label">Le podcast</p>
          <h2>À venir : des conversations vraies, imparfaites, et très nous.</h2>
        </div>
        <Link href="/podcast" className="btn btn-secondary">Voir l’espace podcast</Link>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Com’ entre nous</strong>
          <p>Des mots, des outils, des humains.</p>
        </div>
        <nav>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
        </nav>
      </footer>
    </main>
  );
}

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700;800&family=Nunito:wght@400;600;700;800;900&display=swap');
:root{--cream:#fff8ef;--paper:#fffdf8;--ink:#111827;--muted:#67605a;--coral:#f25f5c;--rose:#ffe0d8;--mint:#ddf4f0;--sand:#f8dfbd;--line:rgba(17,24,39,.12);--shadow:0 20px 56px rgba(60,35,18,.10);--menu:'Comfortaa',system-ui,sans-serif;--body:'Nunito',system-ui,sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink)}a{color:inherit}.page{min-height:100vh;background:linear-gradient(180deg,#fffaf4 0%,#fff8ef 70%,#fff5ea 100%);font-family:var(--body);overflow-x:hidden}.site-header{position:sticky;top:0;z-index:30;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:1.7rem;width:100%;padding:1.1rem clamp(1rem,3.3vw,3.8rem);background:rgba(255,248,239,.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(17,24,39,.08)}.wordmark{position:relative;text-decoration:none;display:grid;gap:.16rem;min-width:190px}.wordmark-main{font-family:var(--menu);font-weight:800;font-size:clamp(1.4rem,2vw,2rem);letter-spacing:-.07em}.wordmark-sub{font-family:var(--menu);font-weight:700;font-size:.56rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}.wordmark i{position:absolute;right:1.1rem;top:-.78rem;color:var(--coral);font-style:normal;font-size:1.4rem}.main-nav{display:flex;align-items:center;justify-content:center;gap:clamp(.9rem,1.8vw,2rem);font-family:var(--menu);font-weight:800;font-size:clamp(.72rem,.82vw,.92rem);white-space:nowrap}.main-nav a{text-decoration:none}.main-nav a:hover{color:var(--coral)}.header-actions{display:flex;align-items:center;justify-content:flex-end;gap:.65rem;font-family:var(--menu);font-weight:800}.action-text{font-size:.72rem;text-decoration:none}.cart-link{display:flex;align-items:center;gap:.5rem;min-height:2.65rem;padding:.72rem .92rem;border:2px solid var(--ink);border-radius:999px;text-decoration:none;background:#fff}.cart-link span{font-size:.78rem}.cart-link b{display:grid;place-items:center;min-width:1.42rem;height:1.42rem;padding:0 .35rem;border-radius:999px;background:var(--coral);color:white;font-size:.72rem}.hero-section{width:min(1420px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(320px,.72fr);gap:clamp(2rem,5vw,5.5rem);align-items:center;padding:clamp(3rem,7vw,6.8rem) clamp(1.1rem,5vw,5rem) clamp(2.2rem,5vw,4rem)}.small-note,.small-label,.section-heading p{font-family:var(--menu);font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--coral);font-size:.82rem;margin:0 0 1.1rem}.hero-text h1{margin:0 0 1.35rem;max-width:840px;font-family:var(--body);font-weight:900;font-size:clamp(2.65rem,6vw,6.5rem);line-height:.94;letter-spacing:-.08em}.hero-intro{max-width:720px;margin:0;color:#2d302f;font-size:clamp(1.05rem,1.45vw,1.35rem);line-height:1.55}.button-row{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:3.15rem;padding:.95rem 1.45rem;border-radius:999px;text-decoration:none;font-family:var(--menu);font-weight:800;font-size:.9rem}.btn-primary{background:var(--coral);color:white;box-shadow:0 16px 34px rgba(242,95,92,.20)}.btn-secondary{background:#fff;border:2px solid var(--ink)}.hero-paper{position:relative;background:var(--paper);border:1px solid var(--line);border-radius:2.2rem;padding:clamp(1.6rem,3vw,2.4rem);box-shadow:var(--shadow);transform:rotate(1deg)}.hero-paper:before{content:'';position:absolute;left:12%;top:-1.1rem;width:7.5rem;height:2rem;background:rgba(255,224,216,.85);border:1px solid rgba(17,24,39,.08);transform:rotate(-6deg)}.paper-kicker{font-family:var(--menu);font-weight:800;font-size:.8rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:.5rem 0 1rem}.hero-paper ul{margin:0;padding:0;list-style:none;display:grid;gap:1rem}.hero-paper li{font-size:clamp(1.35rem,2.3vw,2.25rem);line-height:1.04;font-weight:900;letter-spacing:-.05em}.hero-paper li:before{content:'— ';color:var(--coral)}.paper-signature{display:block;margin-top:1.35rem;font-family:var(--menu);font-weight:800;background:var(--rose);width:max-content;max-width:100%;padding:.7rem 1rem;border-radius:999px}.values-strip{width:min(1320px,calc(100% - 2rem));margin:0 auto 3rem;padding:1rem 1.2rem;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;justify-content:center;gap:clamp(1rem,4vw,5rem);font-family:var(--menu);font-weight:800;font-size:.82rem}.univers-section,.news-section,.podcast-section,.site-footer{width:min(1320px,calc(100% - 2rem));margin:0 auto}.univers-section{padding:2rem 0 4rem}.section-heading{display:grid;grid-template-columns:minmax(0,.55fr) minmax(0,1fr);gap:2rem;align-items:end;margin-bottom:1.35rem}.section-heading h2{margin:0;font-size:clamp(2rem,3.6vw,4.2rem);line-height:.98;letter-spacing:-.06em}.univers-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.universe-card{position:relative;min-height:420px;display:flex;flex-direction:column;justify-content:space-between;gap:2rem;padding:1.45rem;border:1px solid var(--line);border-radius:1.8rem;background:#fff;box-shadow:0 14px 34px rgba(70,41,20,.08);text-decoration:none;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}.universe-card:hover{transform:translateY(-4px);box-shadow:0 24px 56px rgba(70,41,20,.12)}.universe-card:before{content:'';position:absolute;right:-2.5rem;top:-2.5rem;width:12rem;height:12rem;border-radius:50%;opacity:.9}.universe-card.rose:before{background:var(--rose)}.universe-card.mint:before{background:var(--mint)}.universe-card.sand:before{background:var(--sand)}.universe-number{position:relative;z-index:1;font-family:var(--menu);font-weight:800;font-size:.8rem;color:var(--muted)}.universe-card h3{position:relative;z-index:1;margin:0 0 1rem;font-size:clamp(2rem,3.1vw,3.45rem);line-height:.9;letter-spacing:-.08em}.universe-card p{position:relative;z-index:1;margin:0;color:#2f312f;font-size:1.04rem;line-height:1.52}.universe-card em{position:relative;z-index:1;display:block;margin-top:1.25rem;font-style:normal;font-family:var(--menu);font-weight:800;font-size:.74rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}.universe-card strong{position:relative;z-index:1;font-family:var(--menu);font-size:.85rem;width:max-content;background:#fff;border:2px solid var(--ink);border-radius:999px;padding:.75rem 1rem}.news-section{padding:1rem 0 4rem}.compact{grid-template-columns:1fr auto}.product-list{display:grid;gap:.75rem}.product-line{display:flex;align-items:center;justify-content:space-between;gap:1rem;background:#fff;border:1px solid var(--line);border-radius:1.4rem;padding:1rem 1.1rem;box-shadow:0 10px 26px rgba(70,41,20,.06)}.product-copy{text-decoration:none}.product-copy span{font-family:var(--menu);font-weight:800;font-size:.72rem;color:var(--coral);text-transform:uppercase;letter-spacing:.08em}.product-copy h3{margin:.2rem 0 0;font-size:1.45rem;letter-spacing:-.04em}.product-buy{display:flex;align-items:center;gap:.8rem}.product-buy strong{font-family:var(--menu);font-weight:800}.product-buy button{border:0;border-radius:999px;background:var(--ink);color:white;padding:.85rem 1rem;font-family:var(--menu);font-weight:800;cursor:pointer}.podcast-section{display:flex;justify-content:space-between;align-items:center;gap:2rem;margin-bottom:4rem;padding:2rem;border-radius:2rem;background:var(--mint);border:1px solid rgba(17,24,39,.08)}.podcast-section h2{margin:0;max-width:780px;font-size:clamp(1.9rem,3vw,3.4rem);line-height:.98;letter-spacing:-.06em}.site-footer{display:flex;align-items:center;justify-content:space-between;gap:1rem;border-top:1px solid var(--line);padding:2rem 0 2.8rem;color:var(--muted)}.site-footer strong{font-family:var(--menu);color:var(--ink)}.site-footer p{margin:.2rem 0 0}.site-footer nav{display:flex;gap:1rem;font-family:var(--menu);font-weight:800;font-size:.78rem}.site-footer a{text-decoration:none}@media(max-width:1040px){.site-header{grid-template-columns:1fr auto}.main-nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding-bottom:.25rem}.header-actions{grid-column:2;grid-row:1}.hero-section{grid-template-columns:1fr}.hero-paper{transform:none}.univers-list{grid-template-columns:1fr}.universe-card{min-height:310px}.section-heading{grid-template-columns:1fr}.podcast-section{align-items:flex-start;flex-direction:column}.site-footer{align-items:flex-start;flex-direction:column}}@media(max-width:640px){.site-header{gap:.8rem;padding:.9rem 1rem}.wordmark{min-width:0}.wordmark-main{font-size:1.3rem}.wordmark-sub,.action-text{display:none}.cart-link{min-height:2.35rem;padding:.55rem .7rem}.hero-section{padding:2.4rem 1rem 2rem;gap:1.2rem}.hero-text h1{font-size:clamp(2.8rem,14vw,4.1rem)}.hero-intro{font-size:1rem}.button-row{display:grid}.btn{width:100%}.hero-paper{border-radius:1.35rem}.paper-signature{width:100%;text-align:center}.values-strip{align-items:flex-start;flex-direction:column;gap:.55rem}.univers-section,.news-section{padding-bottom:2.6rem}.universe-card{min-height:0;border-radius:1.35rem;padding:1.2rem}.universe-card h3{font-size:2.25rem}.product-line{align-items:flex-start;flex-direction:column}.product-buy{width:100%;justify-content:space-between}.podcast-section{padding:1.25rem;border-radius:1.35rem}.site-footer nav{flex-wrap:wrap}}
`;
