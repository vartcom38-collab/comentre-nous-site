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
    tag: 'Famille · émotions · lien',
    note: 'pour les soirs où les mots restent coincés',
    text: 'Des cartes, des petits rituels et des outils pour parler autrement, écouter vraiment et créer des moments qui font du bien à la maison.',
    cta: 'Entrer côté famille',
    tone: 'family',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    tag: 'Idées · clarté · visibilité',
    note: 'pour poser ta com sans te perdre',
    text: 'Des supports pour clarifier tes messages, retrouver ton fil, organiser tes idées et communiquer avec plus de naturel, sans te transformer en machine.',
    cta: 'Entrer côté entrepreneuse',
    tone: 'business',
  },
  {
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    tag: 'Bujo · to-do · trackers',
    note: 'pour mettre de l’ordre dans la vraie vie',
    text: 'Des pages à imprimer, des listes, des carnets et des petits tableaux doux pour organiser le quotidien, les idées, les envies et les mille trucs à ne pas oublier.',
    cta: 'Entrer côté papier',
    tone: 'paper',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/produits/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/produits/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/produits/mon-kit-ete'],
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
        <div><span>♡</span><strong>Des outils concrets</strong><p>pour le quotidien</p></div>
        <div><span>✦</span><strong>Des idées simples</strong><p>à mettre en place</p></div>
        <div><span>⌁</span><strong>Pour toute la famille</strong><p>petits et grands</p></div>
        <div><span>☾</span><strong>Sans pression</strong><p>juste du lien</p></div>
      </section>

      <section className="univers" aria-labelledby="univers-title">
        <div className="section-head univers-head">
          <p>Trois portes d’entrée</p>
          <h2 id="univers-title">Tu viens chercher quoi aujourd’hui&nbsp;?</h2>
          <span>On a rangé l’espace comme une maison : un coin pour la famille, un coin pour les projets, un coin pour poser les choses sur papier.</span>
        </div>

        <div className="univers-grid">
          {univers.map((item, index) => (
            <Link href={item.href} key={item.href} className={`univers-card ${item.tone}`}>
              <div className="card-top">
                <small>0{index + 1}</small>
                <span>{item.tag}</span>
              </div>
              <div className="paper-note">{item.note}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <em>{item.cta} →</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="products" aria-labelledby="news-title">
        <div className="section-head left">
          <p>Boutique en construction</p>
          <h2 id="news-title">Les nouveautés arrivent doucement</h2>
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
:root{--cream:#fff9f1;--paper:#fffdfa;--ink:#0d1424;--muted:#5c5760;--coral:#ff565f;--coral-soft:#ffc6c2;--pink:#ffe7e5;--peach:#ffd6b6;--mint:#c9f2ec;--yellow:#ffd768;--lilac:#ead4ff;--shadow:0 24px 70px rgba(48,30,18,.12);--body:'Comfortaa',system-ui,sans-serif;--hand:'Patrick Hand','Comic Sans MS',cursive}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink)}a{color:inherit;text-decoration:none}button{font:inherit}.home-page{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at -3rem 14rem,rgba(255,198,194,.64) 0 9rem,transparent 9.1rem),radial-gradient(circle at calc(100% + 3rem) 12rem,rgba(201,242,236,.82) 0 9rem,transparent 9.1rem),linear-gradient(180deg,#fffdfa 0%,#fff7ec 100%);font-family:var(--body)}.header{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:clamp(1rem,2.5vw,2.5rem);padding:.72rem clamp(1rem,4vw,4rem);background:rgba(255,253,248,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,20,36,.06)}.logo{display:flex!important;align-items:center!important;justify-content:center!important;width:132px!important;min-width:132px!important;height:auto!important;background:none!important;text-indent:0!important}.logo img{display:block!important;width:100%!important;height:auto!important;opacity:1!important;visibility:visible!important}.nav{display:flex;justify-content:center;gap:clamp(.9rem,2vw,2.15rem);font-weight:800;font-size:clamp(.76rem,.86vw,.94rem);white-space:nowrap}.nav a{position:relative}.nav a:hover:after{transform:scaleX(1)}.nav a:after{content:'';position:absolute;left:0;right:0;bottom:-.45rem;height:.34rem;border-radius:999px;background:var(--pink);transform:scaleX(0);transform-origin:left;transition:transform .18s ease}.actions{display:flex;align-items:center;gap:.65rem}.icon-link{display:grid;place-items:center;width:2.3rem;height:2.3rem;border-radius:999px;font:700 1.8rem/1 var(--hand)}.cart{display:inline-flex;align-items:center;gap:.52rem;min-height:2.65rem;padding:.65rem .92rem;border:2px solid var(--ink);border-radius:999px;background:#fff;font-weight:800}.cart b{display:grid;place-items:center;min-width:1.35rem;height:1.35rem;border-radius:999px;background:var(--coral);color:white;font-size:.72rem}.hero{width:min(1540px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(420px,.88fr) minmax(560px,1.12fr);align-items:center;gap:clamp(2rem,4vw,4.5rem);padding:clamp(2.6rem,5vw,5.2rem) clamp(1.1rem,5vw,5.2rem) clamp(1.6rem,3vw,2.5rem)}.hero-copy{position:relative;z-index:2}.eyebrow{display:inline-block;margin:0 0 1.45rem;padding:.6rem 1.1rem;background:rgba(255,255,255,.84);border-radius:999px;box-shadow:0 12px 34px rgba(38,24,14,.08);font:700 clamp(1.15rem,1.65vw,1.75rem)/1 var(--hand);transform:rotate(-2deg)}h1{margin:0 0 1.35rem;max-width:740px;font:700 clamp(3.15rem,4.45vw,4.8rem)/.92 var(--hand);letter-spacing:-.045em}mark{display:inline-block;color:inherit;background:linear-gradient(90deg,rgba(255,180,176,.74),rgba(255,206,199,.78));border-radius:999px;padding:0 .16em .04em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.intro{max-width:650px;margin:0;color:#202636;font-size:clamp(1rem,1.12vw,1.18rem);line-height:1.7}.button-row{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:3.2rem;padding:.92rem 1.42rem;border-radius:999px;font-weight:800;letter-spacing:-.02em}.primary{background:var(--coral);color:white;box-shadow:0 16px 34px rgba(255,86,95,.24)}.secondary{background:rgba(255,255,255,.78);border:2px solid var(--ink)}.hero-visual{position:relative;justify-self:end;width:min(780px,100%);border-radius:4.5rem 3.4rem 4.2rem 2.8rem;overflow:hidden;background:rgba(255,255,255,.62);box-shadow:var(--shadow);transform:rotate(.3deg)}.hero-visual:before{content:'';position:absolute;inset:1rem;border-radius:3.6rem 2.8rem 3.4rem 2.2rem;border:1px solid rgba(255,255,255,.8);z-index:2;pointer-events:none}.hero-visual img{display:block;width:100%;height:auto;min-height:430px;object-fit:cover}.promise-strip{width:min(1360px,calc(100% - 2rem));margin:0 auto 4.2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;padding:1.1rem 1.4rem;background:rgba(255,233,231,.7);border-radius:2.2rem;box-shadow:0 18px 48px rgba(48,30,18,.08)}.promise-strip div{display:grid;grid-template-columns:auto 1fr;gap:.25rem .8rem;align-items:center;padding:.35rem .8rem}.promise-strip span{grid-row:1/3;font:700 2rem/1 var(--hand)}.promise-strip strong{font-size:.98rem}.promise-strip p{margin:0;color:var(--muted);font-size:.85rem}.univers,.products{width:min(1260px,calc(100% - 2rem));margin:0 auto 4.5rem}.section-head{text-align:center;margin-bottom:1.9rem}.section-head.left{text-align:left}.section-head p,.label{margin:0 0 .55rem;color:var(--coral);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.76rem}.section-head h2,.podcast h2{margin:0;font:700 clamp(2.5rem,4.5vw,4.8rem)/.95 var(--hand);letter-spacing:-.035em}.univers-head{max-width:850px;margin-left:auto;margin-right:auto}.univers-head span{display:block;max-width:780px;margin:.8rem auto 0;color:var(--muted);font-size:1rem;line-height:1.65}.univers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.15rem;align-items:stretch}.univers-card{position:relative;min-height:360px;padding:1.35rem 1.35rem 1.45rem;border-radius:2.15rem;background:rgba(255,255,255,.74);box-shadow:0 18px 50px rgba(48,30,18,.08);overflow:hidden;display:flex;flex-direction:column;transition:transform .18s ease,box-shadow .18s ease}.univers-card:before{content:'';position:absolute;right:-3.5rem;top:-3.5rem;width:10rem;height:10rem;border-radius:999px;opacity:.72}.univers-card:after{content:'♡';position:absolute;right:1.1rem;bottom:.8rem;font:700 3.8rem/1 var(--hand);opacity:.12;transform:rotate(-10deg)}.univers-card:hover{transform:translateY(-5px);box-shadow:0 24px 70px rgba(48,30,18,.12)}.univers-card.family{background:linear-gradient(145deg,#fff7f1 0%,#ffe5e1 100%)}.univers-card.business{background:linear-gradient(145deg,#fffaf2 0%,#dff8f4 100%)}.univers-card.paper{background:linear-gradient(145deg,#fff8f6 0%,#f0ddff 100%)}.univers-card.family:before{background:var(--coral-soft)}.univers-card.business:before{background:var(--mint)}.univers-card.paper:before{background:var(--lilac)}.card-top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1.1rem}.card-top small{font-weight:800;color:rgba(13,20,36,.38);font-size:.85rem}.card-top span{display:inline-block;padding:.44rem .78rem;border-radius:999px;background:rgba(255,255,255,.72);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.paper-note{position:relative;z-index:2;display:inline-block;align-self:flex-start;max-width:265px;margin:0 0 1.35rem;padding:.72rem .9rem;border-radius:1rem;background:rgba(255,255,255,.68);box-shadow:0 10px 24px rgba(48,30,18,.06);font:700 clamp(1.15rem,1.65vw,1.55rem)/.95 var(--hand);transform:rotate(-2deg)}.business .paper-note{transform:rotate(1.5deg)}.paper .paper-note{transform:rotate(-1deg)}.univers-card h3{position:relative;z-index:2;margin:auto 0 .85rem;font:700 clamp(2.25rem,3.25vw,3.45rem)/.88 var(--hand);letter-spacing:-.04em}.univers-card p{position:relative;z-index:2;margin:0 0 1.35rem;color:#222838;line-height:1.62;font-size:.98rem}.univers-card em{position:relative;z-index:2;font-style:normal;font-weight:800;margin-top:auto}.product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}.product-card{background:white;border-radius:1.6rem;padding:.9rem;box-shadow:0 16px 40px rgba(48,30,18,.08)}.product-visual{height:160px;border-radius:1.2rem;background:linear-gradient(135deg,#ffe5df,#fff8ef 58%,#d7f6f1);display:grid;place-items:center}.product-visual span{max-width:75%;padding:1rem 1.2rem;border-radius:1rem;background:rgba(255,255,255,.72);font:700 1.35rem/1.05 var(--hand);text-align:center;transform:rotate(-2deg)}.product-card h3{margin:1rem .2rem .7rem;font-size:1rem}.product-bottom{display:flex;align-items:center;justify-content:space-between;gap:1rem}.product-bottom button{border:0;border-radius:999px;background:var(--coral);color:#fff;padding:.75rem 1rem;font-weight:800;cursor:pointer}.podcast{width:min(1260px,calc(100% - 2rem));margin:0 auto 4rem;padding:clamp(1.5rem,4vw,3rem);border-radius:2.2rem;background:rgba(255,216,210,.74);display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center;box-shadow:0 18px 50px rgba(48,30,18,.08)}.podcast p:not(.label){max-width:690px;line-height:1.6}.footer{width:min(1260px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center}.footer-brand{width:95px!important;min-width:95px!important;background:none!important}.footer-brand img{display:block!important;width:100%!important;height:auto!important}.footer p{margin:0;color:var(--muted)}.footer nav{display:flex;gap:1rem;font-size:.82rem;font-weight:800}
@media(max-width:1120px){.header{grid-template-columns:auto auto}.nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding:.2rem 0 .5rem}.hero{grid-template-columns:1fr;gap:2rem}.hero-visual{justify-self:center}.promise-strip{grid-template-columns:repeat(2,1fr)}.univers-grid,.product-grid{grid-template-columns:1fr}.univers-card{min-height:unset}.podcast{grid-template-columns:1fr}.footer{grid-template-columns:1fr}}
@media(max-width:680px){.home-page{background:linear-gradient(180deg,#fffdfa,#fff7ec)}.header{position:relative;padding:.75rem 1rem;gap:.8rem}.logo{width:96px!important;min-width:96px!important}.actions{gap:.25rem}.icon-link{width:2rem;height:2rem}.cart{padding:.55rem .68rem;font-size:.78rem}.cart span{display:none}.nav{font-size:.74rem;gap:.85rem}.hero{padding:2rem 1rem 1.3rem}.eyebrow{font-size:1.2rem}.hero h1{font-size:clamp(3rem,17vw,4.1rem);line-height:.88}.button-row{display:grid}.btn{width:100%;min-height:3.05rem}.hero-visual{border-radius:2.2rem;width:100%;transform:none}.hero-visual img{min-height:260px}.hero-visual:before{inset:.6rem;border-radius:1.75rem}.promise-strip{grid-template-columns:1fr;margin-bottom:3rem;border-radius:1.5rem}.univers,.products{width:calc(100% - 1.5rem);margin-bottom:3.2rem}.section-head h2,.podcast h2{font-size:2.75rem}.univers-card{border-radius:1.6rem;padding:1.15rem}.paper-note{font-size:1.28rem}.univers-card h3{font-size:2.7rem}.product-grid{gap:1rem}.podcast{width:calc(100% - 1.5rem);border-radius:1.6rem}.footer nav{flex-wrap:wrap}}
`;
