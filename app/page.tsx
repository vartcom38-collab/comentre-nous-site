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
    title: 'Com’ en famille',
    href: '/com-en-famille',
    text: 'Des outils pour se parler, s’écouter et grandir ensemble.',
    note: 'Émotions · moments du quotidien · jeux de lien',
    tone: 'rose',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    text: 'Des supports pour clarifier tes idées, oser te montrer et créer avec justesse.',
    note: 'Idées · visibilité · organisation douce',
    tone: 'mint',
  },
  {
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    text: 'To-do lists, bujo, plannings, trackers et jolies pages à imprimer.',
    note: 'Bujo · listes · carnets · pages pratiques',
    tone: 'lilac',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/products/les-petits-liens', 'Nouveau'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/products/mon-carnet-de-clarte', 'Papier'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/products/mon-kit-dete', 'À imprimer'],
  ['Cartes émotions', 'Outil du quotidien', '24,90 €', '/products/cartes-emotions', 'Famille'],
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

      <header className="header">
        <Link href="/" className="logo" aria-label="Com’ entre nous accueil">
          <span>Com’</span><span>entre</span><span>nous</span><i>♥</i>
        </Link>

        <nav className="nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="actions">
          <Link href="/boutique" aria-label="Recherche" className="plain-action">⌕</Link>
          <Link href="/a-propos" aria-label="Compte" className="plain-action">♡</Link>
          <Link href="/boutique" className="cart" aria-label={`Panier ${cartCount} article${cartCount > 1 ? 's' : ''}`}>
            <span>panier</span><b>{cartCount}</b>
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Des petits outils pour de grands moments !</p>
          <h1>Des mots,<br />des cartes et des carnets<br />pour <mark>créer du lien.</mark></h1>
          <p className="intro">Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées. En famille, dans ton quotidien ou dans tes projets.</p>
          <div className="button-row">
            <Link href="/par-ou-commencer" className="btn primary">Découvrir nos univers →</Link>
            <Link href="/boutique" className="btn secondary">Voir les nouveautés →</Link>
          </div>
        </div>

        <div className="hero-scene" aria-label="Emplacement photo principale">
          <div className="photo-main">
            <span>Photo mère + enfant<br />à intégrer ici</span>
          </div>
          <div className="brushes" aria-hidden="true">
            <span>Écouter</span>
            <span>Comprendre</span>
            <span>Ressentir</span>
            <span>Partager</span>
            <span>Avancer</span>
          </div>
          <p className="side-note">Ici,<br />on parle vrai ! ♡</p>
        </div>
      </section>

      <section className="values-strip" aria-label="Nos valeurs">
        <p><strong>Des créations</strong><span>avec amour</span></p>
        <p><strong>Une approche</strong><span>bienveillante et sans pression</span></p>
        <p><strong>Des outils</strong><span>pour la vraie vie</span></p>
      </section>

      <section className="univers" aria-labelledby="univers-title">
        <h2 id="univers-title">Quel est ton univers ?</h2>
        <div className="univers-grid">
          {univers.map((item) => (
            <Link href={item.href} key={item.href} className={`univers-card ${item.tone}`}>
              <div className="mini-photo"><span>{item.note}</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <em>Découvrir →</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="welcome">
        <div className="paint-card">
          <h2>Bienvenue chez<br />Com’ entre nous !</h2>
          <p>Ici, on imagine des outils simples, beaux et utiles pour aider les familles et les entrepreneuses à créer plus de lien, de douceur et de confiance au quotidien.</p>
          <Link href="/par-ou-commencer" className="brush-link">Découvrir notre univers →</Link>
        </div>
        <div className="polaroid">
          <div className="photo-two"><span>Photo Marion + Aurélie<br />à remplacer</span></div>
          <p>Deux sœurs, une même envie : plus de lien !</p>
        </div>
        <aside className="note-card">Des idées,<br />des mots,<br />des créations<br />pour une vie plus douce.</aside>
      </section>

      <section className="products" aria-labelledby="news-title">
        <div className="section-title">
          <h2 id="news-title">Les nouveautés</h2>
          <Link href="/boutique">Voir toute la boutique →</Link>
        </div>
        <div className="product-grid">
          {products.map(([title, tag, price, href, badge]) => (
            <article className="product-card" key={href}>
              <Link href={href} className="product-visual"><span>{badge}</span><i>{tag}</i></Link>
              <h3><Link href={href}>{title}</Link></h3>
              <div className="product-bottom">
                <strong>{price}</strong>
                <button type="button" onClick={addToCart}>+ panier</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="podcast">
        <div>
          <p className="label">Com’ entre nous · le podcast</p>
          <h2>Des conversations vraies, imparfaites, et tellement nous.</h2>
          <p>Le podcast est à venir. En attendant, on prépare un espace doux pour parler parentalité, émotions, entrepreneuriat, coulisses et cafés froids.</p>
          <Link href="/podcast" className="btn secondary">Découvrir l’espace podcast →</Link>
        </div>
        <div className="podcast-photo"><span>Photo podcast<br />à intégrer</span></div>
      </section>

      <section className="soft-end">
        <p>Parce que chaque petit moment compte…</p>
        <div>
          <h2>On construit la suite doucement.</h2>
          <span>Les visuels définitifs, les vraies photos et les produits seront ajoutés sans casser la structure du site.</span>
        </div>
        <Link href="/boutique" className="brush-link mint">Voir les nouveautés →</Link>
      </section>

      <footer className="footer">
        <div className="footer-brand"><span>Com’</span><span>entre</span><span>nous</span><i>♥</i></div>
        <p>Des mots, des outils, des humains.</p>
        <nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
      </footer>
    </main>
  );
}

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700;800&family=Gaegu:wght@400;700&display=swap');
:root{--cream:#fff8ef;--paper:#fffdfa;--ink:#111827;--muted:#5e5a57;--coral:#ff5a5f;--rose:#ffd9d1;--rose2:#fff0ec;--mint:#d7f5f1;--yellow:#ffe79e;--lilac:#ead7ff;--sand:#f8e5c8;--shadow:0 22px 60px rgba(70,41,20,.12);--body:'Comfortaa',system-ui,sans-serif;--hand:'Gaegu','Comic Sans MS',cursive}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink)}a{color:inherit}.page{min-height:100vh;background:radial-gradient(circle at -5% 18%,#ffd9d1 0 8rem,transparent 8.1rem),radial-gradient(circle at 104% 18%,#d7f5f1 0 8rem,transparent 8.1rem),linear-gradient(180deg,#fffaf4 0%,#fff8ef 100%);font-family:var(--body);overflow-x:hidden}.header{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:2rem;width:100%;padding:1rem clamp(1rem,3vw,3.5rem);background:rgba(255,248,239,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,24,39,.06)}.logo,.footer-brand{position:relative;display:grid;gap:0;text-decoration:none;font:800 clamp(2.2rem,4.2vw,4.6rem)/.72 var(--hand);letter-spacing:-.07em;min-width:7.5rem}.logo i,.footer-brand i{position:absolute;right:-.6rem;top:-.3rem;color:var(--coral);font-style:normal;font-size:.65em}.nav{display:flex;justify-content:center;align-items:center;gap:clamp(.9rem,2.2vw,2.4rem);font-weight:800;font-size:clamp(.74rem,.9vw,.95rem);white-space:nowrap}.nav a{text-decoration:none}.nav a:nth-child(3){background:var(--rose);padding:.65rem 1rem;border-radius:999px}.actions{display:flex;align-items:center;gap:.7rem}.plain-action{width:2.5rem;height:2.5rem;display:grid;place-items:center;text-decoration:none;font:700 2rem/1 var(--hand)}.cart{position:relative;display:grid;place-items:center;width:3.2rem;height:3.2rem;border:2px solid var(--ink);border-radius:1rem;text-decoration:none;font-weight:800}.cart span{font-size:0}.cart:before{content:'sac';font:800 .75rem/1 var(--body);text-transform:uppercase}.cart b{position:absolute;right:-.5rem;top:-.55rem;display:grid;place-items:center;min-width:1.45rem;height:1.45rem;padding:0 .35rem;background:var(--coral);color:white;border-radius:999px;font-size:.75rem}.hero{position:relative;width:min(1480px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,.95fr);align-items:center;gap:clamp(1.5rem,4vw,4rem);padding:clamp(2rem,5vw,5rem) clamp(1rem,5vw,5rem) 2rem}.hero:before{content:'';position:absolute;left:-4rem;top:18%;width:11rem;height:18rem;background:var(--yellow);border-radius:0 999px 999px 0;opacity:.65}.hero-copy{position:relative;z-index:2}.eyebrow{font:700 clamp(2rem,4.2vw,4.8rem)/.9 var(--hand);letter-spacing:-.04em;max-width:20rem;margin:0 0 .6rem;transform:rotate(-4deg)}h1{margin:0 0 1.4rem;font:700 clamp(3.4rem,7vw,8rem)/.78 var(--hand);letter-spacing:-.06em;max-width:790px}mark{color:inherit;background:linear-gradient(90deg,rgba(255,190,182,.55),rgba(255,150,146,.85));border-radius:999px;padding:0 .16em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.intro{max-width:680px;font-size:clamp(1rem,1.5vw,1.45rem);line-height:1.5;margin:0;color:#151b28}.button-row{display:flex;gap:1rem;flex-wrap:wrap;margin-top:2rem}.btn,.brush-link{display:inline-flex;align-items:center;justify-content:center;min-height:3.35rem;padding:.95rem 1.55rem;border-radius:999px;text-decoration:none;font-weight:800}.primary{background:var(--coral);color:white;box-shadow:0 16px 34px rgba(255,90,95,.22)}.secondary{background:rgba(255,255,255,.72);border:2px solid var(--ink)}.hero-scene{position:relative;min-height:560px;display:grid;place-items:center}.photo-main{position:relative;width:min(680px,100%);aspect-ratio:1.23/1;border-radius:50% 50% 2rem 2rem;background:linear-gradient(135deg,#f5e4d8 0%,#fff9f2 42%,#ffd2ca 100%);box-shadow:var(--shadow);overflow:hidden}.photo-main:before{content:'';position:absolute;inset:2rem 2.5rem 0;background:radial-gradient(circle at 36% 28%,#7c4a28 0 10%,transparent 10.5%),radial-gradient(circle at 62% 36%,#9b6439 0 8%,transparent 8.5%),linear-gradient(160deg,#fffdf8 10%,#f2d8c6 42%,#f8a7a4 80%);border-radius:50% 50% 1.4rem 1.4rem;filter:blur(.2px);opacity:.8}.photo-main:after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 28% 20%,rgba(255,255,255,.6),transparent 20%),radial-gradient(circle at 76% 22%,rgba(255,255,255,.55),transparent 24%);mix-blend-mode:soft-light}.photo-main span{position:absolute;left:2rem;bottom:2rem;z-index:2;background:rgba(255,255,255,.78);border-radius:1rem;padding:.8rem 1rem;color:#887066;font-weight:700}.brushes{position:absolute;right:0;top:17%;z-index:5;display:grid;gap:.7rem}.brushes span{display:block;width:max-content;min-width:11rem;text-align:center;padding:.58rem 1.5rem;border-radius:999px;background:var(--rose);font:700 clamp(1.4rem,2.3vw,2.2rem)/1 var(--hand);box-shadow:0 12px 28px rgba(70,41,20,.08);transform:rotate(-3deg)}.brushes span:nth-child(2){background:var(--mint);transform:rotate(2deg)}.brushes span:nth-child(3){background:#ffd4d1}.brushes span:nth-child(4){background:var(--lilac);transform:rotate(2deg)}.brushes span:nth-child(5){background:var(--yellow)}.side-note,.note-card{background:#ffdc7d;border-radius:1.2rem;padding:1.2rem;box-shadow:var(--shadow);font:700 clamp(2rem,3.5vw,3.7rem)/.87 var(--hand);letter-spacing:-.03em;transform:rotate(-5deg);text-align:center}.side-note{position:absolute;right:-1rem;bottom:2rem;z-index:6}.values-strip{width:min(1180px,calc(100% - 2rem));margin:0 auto 2rem;padding:1.2rem;background:rgba(255,255,255,.58);border-radius:2rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;box-shadow:0 12px 34px rgba(70,41,20,.07)}.values-strip p{margin:0;text-align:center;border-right:1px solid rgba(17,24,39,.12)}.values-strip p:last-child{border-right:0}.values-strip strong{display:block;font:700 1.7rem/.9 var(--hand)}.values-strip span{font-size:.9rem;color:var(--muted)}.univers,.products,.welcome,.podcast,.soft-end,.footer{width:min(1360px,calc(100% - 2rem));margin-inline:auto}.univers{padding:1rem 0 3rem}.univers h2,.section-title h2{margin:0 0 1.2rem;text-align:center;font:700 clamp(2.8rem,5vw,5.7rem)/.9 var(--hand);letter-spacing:-.04em}.univers-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}.univers-card{min-height:330px;text-decoration:none;color:var(--ink);border-radius:2rem;padding:1.5rem;box-shadow:var(--shadow);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end}.univers-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 78% 28%,rgba(255,255,255,.8),transparent 26%),linear-gradient(135deg,rgba(255,255,255,.48),rgba(255,255,255,0));opacity:.85}.univers-card:after{content:'♡';position:absolute;right:1.3rem;top:1rem;font:700 3rem/1 var(--hand);color:var(--coral)}.univers-card.rose{background:#ffe7e1}.univers-card.mint{background:#dff7f4}.univers-card.lilac{background:#f0ddff}.mini-photo{position:absolute;right:1.1rem;bottom:1.1rem;width:43%;height:45%;border-radius:1.5rem;background:rgba(255,255,255,.55);display:grid;place-items:center;text-align:center;padding:1rem;color:#6c5f59;font-size:.82rem;line-height:1.35}.univers-card h3{position:relative;z-index:2;max-width:55%;margin:0 0 1rem;font:700 clamp(3rem,4.4vw,4.8rem)/.75 var(--hand);letter-spacing:-.05em;color:var(--coral)}.mint h3{color:#008f8b}.lilac h3{color:#7e56c7}.univers-card p{position:relative;z-index:2;max-width:52%;line-height:1.5;margin:0 0 1.3rem}.univers-card em{position:relative;z-index:2;display:inline-flex;padding:.65rem 1rem;border:2px solid var(--ink);border-radius:999px;font-style:normal;font-weight:800}.welcome{display:grid;grid-template-columns:1fr .82fr .36fr;gap:1.25rem;align-items:center;padding:3rem 0}.paint-card{background:rgba(255,217,209,.74);border-radius:2.2rem;padding:clamp(1.6rem,4vw,3.3rem);box-shadow:var(--shadow)}.paint-card h2{margin:0 0 1.1rem;font:700 clamp(3rem,5vw,5.5rem)/.78 var(--hand);letter-spacing:-.05em}.paint-card p{font-size:clamp(1rem,1.4vw,1.35rem);line-height:1.55}.brush-link{background:var(--rose);font:700 1.8rem/1 var(--hand);transform:rotate(-2deg)}.brush-link.mint{background:var(--mint)}.polaroid{background:white;padding:1rem;box-shadow:var(--shadow);transform:rotate(-1.6deg)}.photo-two{aspect-ratio:1.28/1;background:linear-gradient(135deg,#f5e0d5,#fff8ef 45%,#ffd1ca);display:grid;place-items:center;text-align:center;color:#887066;border-radius:.3rem;font-weight:700}.polaroid p{margin:1rem .4rem .2rem;font:700 clamp(1.7rem,2.6vw,3rem)/.9 var(--hand)}.note-card{background:#ffd4cd;font-size:clamp(1.8rem,3vw,3rem)}.products{padding:2rem 0}.section-title{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:1rem}.section-title h2{text-align:left;margin:0}.section-title a{background:var(--sand);border-radius:999px;padding:.9rem 1.2rem;text-decoration:none;font-weight:800}.product-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}.product-card{background:white;border-radius:1.5rem;padding:1rem;box-shadow:var(--shadow)}.product-visual{height:165px;border-radius:1.2rem;background:linear-gradient(135deg,#ffe8e1,#fff8ef 55%,#d7f5f1);display:grid;place-items:center;text-decoration:none;position:relative;overflow:hidden}.product-visual:before{content:'';position:absolute;inset:1.5rem;border-radius:1rem;background:rgba(255,255,255,.72);transform:rotate(-2deg)}.product-visual span{position:absolute;left:.8rem;top:.8rem;z-index:2;background:var(--yellow);padding:.4rem .7rem;border-radius:999px;transform:rotate(-7deg);font:700 1.25rem/1 var(--hand)}.product-visual i{position:relative;z-index:2;font-style:normal;color:#746962;text-align:center}.product-card h3{margin:1rem 0 .75rem;font-size:1.02rem;line-height:1.3}.product-card h3 a{text-decoration:none}.product-bottom{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.product-bottom button{border:0;background:var(--coral);color:white;border-radius:999px;padding:.75rem 1rem;font:800 .8rem/1 var(--body);cursor:pointer}.podcast{display:grid;grid-template-columns:1.2fr .7fr;gap:1.5rem;align-items:center;margin-top:2rem;padding:clamp(1.5rem,3vw,3rem);border-radius:2.2rem;background:linear-gradient(135deg,#ffd5cf,#ffe9e3);box-shadow:var(--shadow)}.label{text-transform:uppercase;letter-spacing:.12em;font-size:.8rem;font-weight:800;margin:0 0 .7rem}.podcast h2{margin:0 0 1rem;font:700 clamp(2.7rem,4.3vw,5rem)/.82 var(--hand);letter-spacing:-.04em}.podcast p:not(.label){font-size:1.08rem;line-height:1.55}.podcast-photo{min-height:240px;border-radius:1.8rem;background:rgba(255,255,255,.55);display:grid;place-items:center;text-align:center;color:#887066;font-weight:700}.soft-end{display:grid;grid-template-columns:.8fr 1.2fr auto;gap:1.5rem;align-items:center;padding:3rem 0}.soft-end>p{font:700 clamp(2rem,3.8vw,4rem)/.86 var(--hand);transform:rotate(-5deg);margin:0}.soft-end h2{margin:0 0 .4rem;font:700 clamp(2.4rem,4vw,4.2rem)/.9 var(--hand)}.soft-end span{line-height:1.55;color:var(--muted)}.footer{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:1.2rem;padding:2rem 0 3rem;border-top:1px solid rgba(17,24,39,.08)}.footer-brand{font-size:2.6rem;min-width:4.7rem}.footer p{margin:0;color:var(--muted)}.footer nav{display:flex;gap:1rem;flex-wrap:wrap}.footer a{text-decoration:none;font-weight:800}@media(max-width:1180px){.hero{grid-template-columns:1fr}.hero-scene{min-height:430px}.univers-grid{grid-template-columns:1fr}.univers-card h3,.univers-card p{max-width:62%}.welcome{grid-template-columns:1fr 1fr}.note-card{grid-column:1/-1}.product-grid{grid-template-columns:repeat(2,1fr)}.soft-end{grid-template-columns:1fr}}@media(max-width:820px){.header{position:relative;grid-template-columns:1fr auto;gap:1rem}.nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding:.75rem 0 .2rem}.actions{grid-column:2;grid-row:1}.hero{padding:1.4rem 1rem 2rem}.hero:before,.side-note{display:none}.button-row{display:grid}.btn,.brush-link{width:100%;text-align:center}.brushes{position:relative;top:auto;right:auto;grid-template-columns:1fr 1fr;margin-top:1rem}.brushes span{min-width:0;width:100%;font-size:1.45rem}.photo-main{width:100%;border-radius:2rem}.values-strip{grid-template-columns:1fr}.values-strip p{border-right:0;border-bottom:1px solid rgba(17,24,39,.1);padding-bottom:.8rem}.values-strip p:last-child{border-bottom:0}.welcome,.podcast{grid-template-columns:1fr}.section-title{align-items:flex-start;flex-direction:column}.footer{grid-template-columns:1fr}.product-grid{grid-template-columns:1fr}}@media(max-width:520px){.logo{font-size:2.6rem}.plain-action{width:2.1rem}.cart{width:2.7rem;height:2.7rem}.eyebrow{font-size:2.4rem}.intro{font-size:.98rem}.hero-scene{min-height:auto}.brushes{grid-template-columns:1fr}.univers-card{min-height:370px}.univers-card h3,.univers-card p{max-width:100%}.mini-photo{position:relative;right:auto;bottom:auto;width:100%;height:auto;min-height:100px;margin:1rem 0;order:-1}.product-visual{height:140px}}
`;