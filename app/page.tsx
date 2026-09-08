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
    handwritten: 'pour se parler, s’écouter et grandir ensemble',
    text: 'Des jeux, des cartes et des petits rituels pour ouvrir la discussion sans forcer et remettre du lien dans les moments du quotidien.',
    tone: 'family',
    button: 'Découvrir côté famille',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    kicker: 'Idées · clarté · visibilité',
    handwritten: 'pour poser ta com sans te perdre',
    text: 'Des cartes, carnets et supports pour clarifier tes idées, trouver tes mots et communiquer avec plus de naturel.',
    tone: 'business',
    button: 'Découvrir côté entrepreneuse',
  },
  {
    title: 'Papeterie du lien',
    href: '/papeterie-du-lien',
    kicker: 'Bujo · to-do · trackers',
    handwritten: 'pour mettre de l’ordre dans la vraie vie',
    text: 'Des pages à imprimer, listes, carnets et petits tableaux doux pour organiser le quotidien, les idées, les envies et tout ce qu’on garde en tête.',
    tone: 'paper',
    button: 'Découvrir côté papier',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/produits/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/produits/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/produits/mon-kit-ete'],
  ['Cartes émotions', 'Support à imprimer', '24,90 €', '/produits/cartes-emotions'],
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
        <div><span>♡</span><strong>Des créations</strong><p>avec amour</p></div>
        <div><span>✦</span><strong>Une approche</strong><p>bienveillante</p></div>
        <div><span>⌁</span><strong>Des outils</strong><p>pour la vraie vie</p></div>
        <div><span>☾</span><strong>Une communauté</strong><p>qui inspire</p></div>
      </section>

      <section className="univers" aria-labelledby="univers-title">
        <div className="univers-title-block">
          <span className="tiny-spark">✦</span>
          <h2 id="univers-title">Quel est ton univers ?</h2>
          <p>Trois portes d’entrée pour trouver le bon outil, selon ton moment, ton besoin, ton énergie.</p>
        </div>

        <div className="univers-grid">
          {univers.map((item, index) => (
            <Link href={item.href} key={item.href} className={`universe-card ${item.tone}`}>
              <div className="universe-copy">
                <p className="card-kicker">{item.kicker}</p>
                <h3>{item.title}</h3>
                <p className="hand-note">{item.handwritten}</p>
                <p className="card-text">{item.text}</p>
                <span className="card-button">{item.button} →</span>
              </div>
              <div className="universe-visual" aria-hidden="true">
                <span className="image-badge">image à intégrer</span>
                <span className="blob-one" />
                <span className="blob-two" />
                <span className="mini-heart">♡</span>
                <span className="doodle-line line-a" />
                <span className="doodle-line line-b" />
                <span className="visual-number">0{index + 1}</span>
              </div>
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
:root{--cream:#fff9f1;--paper:#fffdfa;--ink:#0d1424;--muted:#5c5760;--coral:#ff565f;--coral-soft:#ffc6c2;--pink:#ffe7e5;--peach:#ffd6b6;--mint:#c9f2ec;--mint-strong:#009b97;--yellow:#ffd768;--lilac:#ead4ff;--purple:#7f59d8;--shadow:0 24px 70px rgba(48,30,18,.12);--body:'Comfortaa',system-ui,sans-serif;--hand:'Patrick Hand','Comic Sans MS',cursive}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink)}a{color:inherit;text-decoration:none}button{font:inherit}.home-page{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at -3rem 14rem,rgba(255,198,194,.64) 0 9rem,transparent 9.1rem),radial-gradient(circle at calc(100% + 3rem) 12rem,rgba(201,242,236,.82) 0 9rem,transparent 9.1rem),linear-gradient(180deg,#fffdfa 0%,#fff7ec 100%);font-family:var(--body)}.header{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:clamp(1rem,2.5vw,2.5rem);padding:.72rem clamp(1rem,4vw,4rem);background:rgba(255,253,248,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,20,36,.06)}.logo{display:flex;align-items:center;justify-content:center;width:132px;min-width:132px;text-indent:0!important}.logo img{display:block;width:100%;height:auto}.nav{display:flex;justify-content:center;gap:clamp(.9rem,2vw,2.15rem);font-weight:800;font-size:clamp(.76rem,.86vw,.94rem);white-space:nowrap}.nav a{position:relative}.nav a:hover:after{transform:scaleX(1)}.nav a:after{content:'';position:absolute;left:0;right:0;bottom:-.45rem;height:.34rem;border-radius:999px;background:var(--pink);transform:scaleX(0);transform-origin:left;transition:transform .18s ease}.actions{display:flex;align-items:center;gap:.65rem}.icon-link{display:grid;place-items:center;width:2.3rem;height:2.3rem;border-radius:999px;font:700 1.8rem/1 var(--hand)}.cart{display:inline-flex;align-items:center;gap:.52rem;min-height:2.65rem;padding:.65rem .92rem;border:2px solid var(--ink);border-radius:999px;background:#fff;font-weight:800}.cart b{display:grid;place-items:center;min-width:1.35rem;height:1.35rem;border-radius:999px;background:var(--coral);color:white;font-size:.72rem}.hero{width:min(1540px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(420px,.88fr) minmax(560px,1.12fr);align-items:center;gap:clamp(2rem,4vw,4.5rem);padding:clamp(2.6rem,5vw,5.2rem) clamp(1.1rem,5vw,5.2rem) clamp(1.6rem,3vw,2.5rem)}.hero-copy{position:relative;z-index:2}.eyebrow{display:inline-block;margin:0 0 1.45rem;padding:.6rem 1.1rem;background:rgba(255,255,255,.84);border-radius:999px;box-shadow:0 12px 34px rgba(38,24,14,.08);font:700 clamp(1.15rem,1.65vw,1.75rem)/1 var(--hand);transform:rotate(-2deg)}h1{margin:0 0 1.35rem;max-width:740px;font:700 clamp(3.15rem,4.45vw,4.8rem)/.92 var(--hand);letter-spacing:-.045em}mark{display:inline-block;color:inherit;background:linear-gradient(90deg,rgba(255,180,176,.74),rgba(255,206,199,.78));border-radius:999px;padding:0 .16em .04em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.intro{max-width:650px;margin:0;color:#202636;font-size:clamp(1rem,1.12vw,1.18rem);line-height:1.7}.button-row{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:3.2rem;padding:.92rem 1.42rem;border-radius:999px;font-weight:800;letter-spacing:-.02em}.primary{background:var(--coral);color:white;box-shadow:0 16px 34px rgba(255,86,95,.24)}.secondary{background:rgba(255,255,255,.78);border:2px solid var(--ink)}.hero-visual{position:relative;justify-self:end;width:min(780px,100%);border-radius:4.5rem 3.4rem 4.2rem 2.8rem;overflow:hidden;background:rgba(255,255,255,.62);box-shadow:var(--shadow);transform:rotate(.3deg)}.hero-visual:before{content:'';position:absolute;inset:1rem;border-radius:3.6rem 2.8rem 3.4rem 2.2rem;border:1px solid rgba(255,255,255,.8);z-index:2;pointer-events:none}.hero-visual img{display:block;width:100%;height:auto;min-height:430px;object-fit:cover}.promise-strip{width:min(1360px,calc(100% - 2rem));margin:0 auto 4.2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;padding:1.1rem 1.4rem;background:rgba(255,233,231,.7);border-radius:2.2rem;box-shadow:0 18px 48px rgba(48,30,18,.08)}.promise-strip div{display:grid;grid-template-columns:auto 1fr;gap:.25rem .8rem;align-items:center;padding:.35rem .8rem}.promise-strip span{grid-row:1/3;font:700 2rem/1 var(--hand)}.promise-strip strong{font-size:.98rem}.promise-strip p{margin:0;color:var(--muted);font-size:.85rem}.univers{position:relative;width:min(1480px,calc(100% - 2rem));margin:0 auto 4.8rem}.univers:before{content:'';position:absolute;left:50%;top:8.2rem;width:min(980px,80vw);height:1.6rem;background:rgba(255,214,104,.34);border-radius:999px;transform:translateX(-50%) rotate(-1deg);z-index:0}.univers-title-block{position:relative;z-index:1;text-align:center;margin:0 auto 1.9rem;max-width:880px}.tiny-spark{display:block;width:max-content;margin:0 auto .2rem;color:var(--coral);font-weight:800;letter-spacing:.18em}.univers-title-block h2{margin:0;font:700 clamp(3rem,5vw,5.8rem)/.85 var(--hand);letter-spacing:-.045em}.univers-title-block p{margin:.6rem auto 0;max-width:760px;color:var(--muted);font-size:clamp(.98rem,1.1vw,1.12rem);line-height:1.65}.univers-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.35rem;align-items:stretch}.universe-card{position:relative;min-height:360px;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(150px,.92fr);align-items:end;overflow:hidden;padding:1.75rem;border-radius:2.4rem;background:#fff;box-shadow:0 22px 56px rgba(48,30,18,.1);isolation:isolate;transition:transform .18s ease,box-shadow .18s ease}.universe-card:before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.58),rgba(255,255,255,.16));z-index:-2}.universe-card:after{content:'♡';position:absolute;right:1.25rem;bottom:.8rem;font:700 3.6rem/1 var(--hand);color:rgba(13,20,36,.18);transform:rotate(-9deg);z-index:-1}.universe-card:hover{transform:translateY(-6px);box-shadow:0 30px 70px rgba(48,30,18,.14)}.universe-card.family{background:linear-gradient(135deg,#ffe4dd 0%,#fff6ef 58%,#fff 100%)}.universe-card.business{background:linear-gradient(135deg,#d9f7f2 0%,#f8fffc 58%,#fff 100%)}.universe-card.paper{background:linear-gradient(135deg,#ead8ff 0%,#fff7f8 58%,#fff 100%)}.universe-copy{position:relative;z-index:2}.card-kicker{display:inline-flex;align-items:center;margin:0 0 1rem;padding:.48rem .82rem;border-radius:999px;background:rgba(255,255,255,.74);font-size:.69rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.universe-card h3{margin:0 0 .8rem;font:700 clamp(2.35rem,3.2vw,4.1rem)/.84 var(--hand);letter-spacing:-.04em}.family h3{color:var(--coral)}.business h3{color:var(--mint-strong)}.paper h3{color:var(--purple)}.hand-note{display:inline-block;max-width:15rem;margin:0 0 1rem;padding:.62rem .85rem;background:rgba(255,255,255,.78);border-radius:1rem;font:700 clamp(1.18rem,1.65vw,1.65rem)/.95 var(--hand);transform:rotate(-2deg);box-shadow:0 12px 28px rgba(48,30,18,.07)}.card-text{margin:0 0 1.4rem;max-width:22rem;color:#222838;font-size:.94rem;line-height:1.62}.card-button{display:inline-flex;align-items:center;justify-content:center;min-height:2.65rem;padding:.72rem 1.05rem;border:2px solid var(--ink);border-radius:999px;background:rgba(255,255,255,.55);font-size:.82rem;font-weight:800}.universe-visual{position:relative;align-self:stretch;min-height:220px;border-radius:2rem;background:rgba(255,255,255,.42);overflow:hidden}.universe-visual:before{content:'';position:absolute;inset:12%;border-radius:45% 55% 52% 48%;background:rgba(255,255,255,.58);box-shadow:inset 0 0 0 1px rgba(255,255,255,.7);transform:rotate(-4deg)}.universe-visual:after{content:'';position:absolute;right:-10%;bottom:-14%;width:78%;aspect-ratio:1;border-radius:48% 52% 44% 56%;background:rgba(255,255,255,.45);transform:rotate(12deg)}.family .universe-visual{background:linear-gradient(160deg,rgba(255,198,194,.5),rgba(255,255,255,.35))}.business .universe-visual{background:linear-gradient(160deg,rgba(158,232,223,.55),rgba(255,255,255,.35))}.paper .universe-visual{background:linear-gradient(160deg,rgba(218,194,255,.55),rgba(255,255,255,.35))}.image-badge{position:absolute;left:50%;top:50%;z-index:3;transform:translate(-50%,-50%) rotate(-3deg);padding:.58rem .82rem;border-radius:999px;background:rgba(255,255,255,.78);color:rgba(13,20,36,.44);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}.blob-one,.blob-two{position:absolute;z-index:2;border-radius:999px;background:rgba(255,255,255,.45);filter:blur(.2px)}.blob-one{right:10%;top:16%;width:5.2rem;height:5.2rem}.blob-two{left:12%;bottom:18%;width:7rem;height:7rem}.mini-heart{position:absolute;right:18%;bottom:24%;z-index:4;font:700 3rem/1 var(--hand);color:var(--coral);transform:rotate(10deg)}.paper .mini-heart{color:var(--purple)}.business .mini-heart{color:var(--mint-strong)}.doodle-line{position:absolute;z-index:3;width:3.6rem;height:.28rem;border-radius:999px;background:var(--ink);opacity:.78}.line-a{right:18%;top:26%;transform:rotate(64deg)}.line-b{left:14%;top:30%;transform:rotate(-22deg)}.visual-number{position:absolute;right:1rem;top:.85rem;color:rgba(13,20,36,.16);font:700 5rem/.8 var(--hand)}.products{width:min(1260px,calc(100% - 2rem));margin:0 auto 4.5rem}.section-head{position:relative;margin-bottom:1.7rem}.section-head.left{display:grid;grid-template-columns:1fr auto;align-items:end;gap:1rem}.section-head p,.label{margin:0 0 .55rem;color:var(--coral);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.76rem}.section-head h2,.podcast h2{margin:0;font:700 clamp(2.5rem,4.5vw,4.8rem)/.95 var(--hand);letter-spacing:-.035em}.shop-link{grid-row:1/3;align-self:center;justify-self:end;display:inline-flex;align-items:center;justify-content:center;padding:.88rem 1.2rem;border-radius:999px;background:#fff;box-shadow:0 12px 28px rgba(48,30,18,.07);font-weight:800}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem}.product-card{background:white;border-radius:1.6rem;padding:.9rem;box-shadow:0 16px 40px rgba(48,30,18,.08)}.product-visual{height:160px;border-radius:1.2rem;background:linear-gradient(135deg,#ffe5df,#fff8ef 58%,#d7f6f1);display:grid;place-items:center}.product-visual span{display:inline-block;max-width:76%;padding:.85rem 1rem;border-radius:1rem;background:rgba(255,255,255,.7);font:700 1.28rem/1.05 var(--hand);text-align:center;transform:rotate(-2deg)}.product-card h3{margin:.9rem .2rem .55rem;font-size:.94rem}.product-bottom{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin:.2rem}.product-bottom strong{font-size:.9rem}.product-bottom button{border:0;background:var(--coral);color:white;border-radius:999px;padding:.7rem .9rem;font-weight:800;cursor:pointer}.podcast{width:min(1360px,calc(100% - 2rem));margin:0 auto 4.5rem;padding:clamp(1.7rem,4vw,3.2rem);display:grid;grid-template-columns:1fr auto;gap:2rem;align-items:center;background:linear-gradient(135deg,#ffd9d1,#fff0eb);border-radius:2.4rem;box-shadow:var(--shadow)}.podcast p:not(.label){max-width:760px;line-height:1.65;color:#292f3b}.footer{width:min(1260px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;color:#312b28}.footer-brand{display:flex;align-items:center;width:5.6rem}.footer-brand img{display:block;width:100%;height:auto}.footer p{margin:0;color:var(--muted)}.footer nav{display:flex;gap:1rem}.footer nav a{font-size:.82rem;font-weight:800}@media(max-width:1180px){.header{grid-template-columns:auto auto;gap:1rem}.nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding:.4rem 0}.hero{grid-template-columns:1fr}.hero-visual{justify-self:start}.univers-grid{grid-template-columns:1fr}.universe-card{min-height:310px}.product-grid{grid-template-columns:repeat(2,1fr)}.podcast{grid-template-columns:1fr}.section-head.left{grid-template-columns:1fr}.shop-link{grid-row:auto;justify-self:start}.footer{grid-template-columns:1fr}}@media(max-width:720px){.home-page{background:linear-gradient(180deg,#fffdfa,#fff7ec)}.header{position:relative;grid-template-columns:1fr auto;padding:.7rem 1rem}.logo{width:86px;min-width:86px;justify-self:start}.actions{justify-self:end}.icon-link{display:none}.cart span{display:none}.nav{grid-column:1/-1;order:3;gap:.65rem;font-size:.73rem}.nav a{padding:.54rem .75rem;border-radius:999px;background:rgba(255,255,255,.62)}.hero{padding:1.4rem 1rem 1rem;gap:1.5rem}.eyebrow{font-size:1.05rem;margin-bottom:.9rem}h1{font-size:clamp(2.7rem,16vw,4.2rem);line-height:.88}.intro{font-size:.98rem;line-height:1.58}.button-row{display:grid;grid-template-columns:1fr;margin-top:1.3rem}.btn{width:100%}.hero-visual{border-radius:2rem;width:100%;transform:none}.hero-visual:before{display:none}.hero-visual img{min-height:0}.promise-strip{grid-template-columns:1fr 1fr;width:calc(100% - 1rem);margin-bottom:2.8rem;padding:.85rem;border-radius:1.5rem}.promise-strip div{padding:.45rem}.promise-strip strong{font-size:.82rem}.promise-strip p{font-size:.73rem}.univers{width:calc(100% - 1rem);margin-bottom:3rem}.univers:before{display:none}.univers-title-block{text-align:left;margin-bottom:1rem}.tiny-spark{margin-left:0}.univers-title-block h2{font-size:3rem}.univers-title-block p{font-size:.92rem}.universe-card{grid-template-columns:1fr;min-height:auto;padding:1.1rem;border-radius:1.8rem}.universe-visual{min-height:180px;order:-1}.hand-note{font-size:1.22rem}.card-text{font-size:.9rem}.product-grid{grid-template-columns:1fr}.products{width:calc(100% - 1rem)}.podcast{width:calc(100% - 1rem);border-radius:1.7rem;padding:1.3rem}.footer{width:calc(100% - 2rem);gap:.9rem}.footer nav{flex-wrap:wrap}.footer-brand{width:4.5rem}}`;
