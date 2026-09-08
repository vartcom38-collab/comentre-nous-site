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
    label: 'famille · émotions · lien',
    note: 'quand les mots restent coincés',
    text: 'Cartes, petits rituels et supports doux pour ouvrir les discussions à la maison.',
    href: '/com-en-famille',
    tone: 'family',
  },
  {
    title: 'Com’ des entrepreneuses',
    label: 'idées · clarté · visibilité',
    note: 'quand ta com a besoin d’air',
    text: 'Des outils pour poser tes idées, retrouver ton fil et communiquer sans te transformer en machine.',
    href: '/com-des-entrepreneuses',
    tone: 'business',
  },
  {
    title: 'La papeterie',
    label: 'bujo · to-do · trackers',
    note: 'quand tout part dans tous les sens',
    text: 'Pages à imprimer, listes, carnets et petits tableaux pour organiser la vraie vie.',
    href: '/papeterie-du-lien',
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
        <div className="univers-board">
          <div className="univers-intro">
            <p className="label">Par où on commence ?</p>
            <h2 id="univers-title">Choisis le coin qui te parle aujourd’hui.</h2>
            <p>On a rangé Com’ entre nous comme une grande table créative : un coin pour la famille, un coin pour tes projets, un coin pour poser les choses sur papier.</p>
            <div className="mini-note">Pas besoin de tout explorer. Tu entres par là où c’est vivant maintenant.</div>
          </div>

          <div className="path-list" aria-label="Les univers Com’ entre nous">
            {univers.map((item, index) => (
              <Link href={item.href} key={item.href} className={`path-card ${item.tone}`}>
                <span className="path-number">0{index + 1}</span>
                <span className="path-label">{item.label}</span>
                <strong>{item.title}</strong>
                <em>{item.note}</em>
                <p>{item.text}</p>
                <b>Entrer →</b>
              </Link>
            ))}
          </div>
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
:root{--cream:#fff9f1;--paper:#fffdfa;--ink:#0d1424;--muted:#5c5760;--coral:#ff565f;--coral-soft:#ffc6c2;--pink:#ffe7e5;--peach:#ffd6b6;--mint:#c9f2ec;--teal:#00989b;--yellow:#ffd768;--lilac:#ead4ff;--violet:#805bd6;--shadow:0 24px 70px rgba(48,30,18,.12);--body:'Comfortaa',system-ui,sans-serif;--hand:'Patrick Hand','Comic Sans MS',cursive}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink)}a{color:inherit;text-decoration:none}button{font:inherit}.home-page{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at -3rem 14rem,rgba(255,198,194,.64) 0 9rem,transparent 9.1rem),radial-gradient(circle at calc(100% + 3rem) 12rem,rgba(201,242,236,.82) 0 9rem,transparent 9.1rem),linear-gradient(180deg,#fffdfa 0%,#fff7ec 100%);font-family:var(--body)}.header{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:clamp(1rem,2.5vw,2.5rem);padding:.72rem clamp(1rem,4vw,4rem);background:rgba(255,253,248,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(13,20,36,.06)}.logo{display:flex;align-items:center;justify-content:center;width:132px;min-width:132px;text-indent:0!important}.logo img{display:block;width:100%;height:auto}.nav{display:flex;justify-content:center;gap:clamp(.9rem,2vw,2.15rem);font-weight:800;font-size:clamp(.76rem,.86vw,.94rem);white-space:nowrap}.nav a{position:relative}.nav a:hover:after{transform:scaleX(1)}.nav a:after{content:'';position:absolute;left:0;right:0;bottom:-.45rem;height:.34rem;border-radius:999px;background:var(--pink);transform:scaleX(0);transform-origin:left;transition:transform .18s ease}.actions{display:flex;align-items:center;gap:.65rem}.icon-link{display:grid;place-items:center;width:2.3rem;height:2.3rem;border-radius:999px;font:700 1.8rem/1 var(--hand)}.cart{display:inline-flex;align-items:center;gap:.52rem;min-height:2.65rem;padding:.65rem .92rem;border:2px solid var(--ink);border-radius:999px;background:#fff;font-weight:800}.cart b{display:grid;place-items:center;min-width:1.35rem;height:1.35rem;border-radius:999px;background:var(--coral);color:white;font-size:.72rem}.hero{width:min(1540px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(420px,.88fr) minmax(560px,1.12fr);align-items:center;gap:clamp(2rem,4vw,4.5rem);padding:clamp(2.6rem,5vw,5.2rem) clamp(1.1rem,5vw,5.2rem) clamp(1.6rem,3vw,2.5rem)}.hero-copy{position:relative;z-index:2}.eyebrow{display:inline-block;margin:0 0 1.45rem;padding:.6rem 1.1rem;background:rgba(255,255,255,.84);border-radius:999px;box-shadow:0 12px 34px rgba(38,24,14,.08);font:700 clamp(1.15rem,1.65vw,1.75rem)/1 var(--hand);transform:rotate(-2deg)}h1{margin:0 0 1.35rem;max-width:740px;font:700 clamp(3.15rem,4.45vw,4.8rem)/.92 var(--hand);letter-spacing:-.045em}mark{display:inline-block;color:inherit;background:linear-gradient(90deg,rgba(255,180,176,.74),rgba(255,206,199,.78));border-radius:999px;padding:0 .16em .04em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.intro{max-width:650px;margin:0;color:#202636;font-size:clamp(1rem,1.12vw,1.18rem);line-height:1.7}.button-row{display:flex;flex-wrap:wrap;gap:1rem;margin-top:2rem}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:3.2rem;padding:.92rem 1.42rem;border-radius:999px;font-weight:800;letter-spacing:-.02em}.primary{background:var(--coral);color:white;box-shadow:0 16px 34px rgba(255,86,95,.24)}.secondary{background:rgba(255,255,255,.78);border:2px solid var(--ink)}.hero-visual{position:relative;justify-self:end;width:min(780px,100%);border-radius:4.5rem 3.4rem 4.2rem 2.8rem;overflow:hidden;background:rgba(255,255,255,.62);box-shadow:var(--shadow);transform:rotate(.3deg)}.hero-visual:before{content:'';position:absolute;inset:1rem;border-radius:3.6rem 2.8rem 3.4rem 2.2rem;border:1px solid rgba(255,255,255,.8);z-index:2;pointer-events:none}.hero-visual img{display:block;width:100%;height:auto;min-height:430px;object-fit:cover}.promise-strip{width:min(1360px,calc(100% - 2rem));margin:0 auto 4.2rem;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;padding:1.1rem 1.4rem;background:rgba(255,233,231,.7);border-radius:2.2rem;box-shadow:0 18px 48px rgba(48,30,18,.08)}.promise-strip div{display:grid;grid-template-columns:auto 1fr;gap:.25rem .8rem;align-items:center;padding:.35rem .8rem}.promise-strip span{grid-row:1/3;font:700 2rem/1 var(--hand)}.promise-strip strong{font-size:.98rem}.promise-strip p{margin:0;color:var(--muted);font-size:.85rem}.univers{width:min(1360px,calc(100% - 2rem));margin:0 auto 4.5rem}.univers-board{position:relative;display:grid;grid-template-columns:minmax(320px,.78fr) minmax(620px,1.22fr);gap:clamp(1.6rem,4vw,4rem);align-items:center;padding:clamp(1.4rem,3.2vw,3.2rem);border-radius:3rem;background:linear-gradient(135deg,rgba(255,255,255,.82),rgba(255,247,238,.68));box-shadow:0 22px 70px rgba(48,30,18,.09);overflow:hidden}.univers-board:before{content:'';position:absolute;left:-5rem;bottom:-7rem;width:18rem;height:18rem;border-radius:999px;background:rgba(255,198,194,.44)}.univers-board:after{content:'';position:absolute;right:-4rem;top:-5rem;width:16rem;height:16rem;border-radius:999px;background:rgba(201,242,236,.62)}.univers-intro,.path-list{position:relative;z-index:1}.label{margin:0 0 .55rem;color:var(--coral);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.76rem}.univers-intro h2,.section-head h2,.podcast h2{margin:0;font:700 clamp(2.45rem,4vw,4.35rem)/.9 var(--hand);letter-spacing:-.04em}.univers-intro p{max-width:520px;margin:1rem 0 0;color:#2a2f3e;font-size:clamp(1rem,1.08vw,1.12rem);line-height:1.65}.mini-note{display:inline-block;margin-top:1.35rem;max-width:430px;padding:.88rem 1rem;border-radius:1.2rem;background:#fff;box-shadow:0 10px 26px rgba(48,30,18,.07);font:700 1.45rem/.95 var(--hand);transform:rotate(-2deg)}.path-list{display:grid;gap:1rem}.path-card{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:'num label action' 'num title action' 'num note action' 'num text action';column-gap:1rem;align-items:center;padding:1.25rem 1.35rem;border-radius:1.55rem;background:#fff;box-shadow:0 14px 34px rgba(48,30,18,.08);transition:transform .18s ease,box-shadow .18s ease}.path-card:hover{transform:translateX(7px) rotate(0deg);box-shadow:0 18px 46px rgba(48,30,18,.12)}.path-card.family{background:linear-gradient(115deg,#fff,#fff4f0 60%,#ffd9d7)}.path-card.business{background:linear-gradient(115deg,#fff,#f3fffc 60%,#c9f2ec)}.path-card.paper{background:linear-gradient(115deg,#fff,#fbf4ff 60%,#ead4ff)}.path-number{grid-area:num;display:grid;place-items:center;width:3.2rem;height:3.2rem;border-radius:999px;background:rgba(255,255,255,.7);font-weight:800;color:#a6a0a0}.path-label{grid-area:label;justify-self:start;margin-bottom:.35rem;padding:.35rem .7rem;border-radius:999px;background:rgba(255,255,255,.72);font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.path-card strong{grid-area:title;font:700 clamp(2rem,3vw,3.15rem)/.88 var(--hand);letter-spacing:-.04em}.path-card.family strong{color:var(--coral)}.path-card.business strong{color:var(--teal)}.path-card.paper strong{color:var(--violet)}.path-card em{grid-area:note;margin-top:.25rem;font:700 1.25rem/.96 var(--hand);font-style:normal;color:#111827}.path-card p{grid-area:text;max-width:520px;margin:.55rem 0 0;color:#303340;line-height:1.55;font-size:.93rem}.path-card b{grid-area:action;align-self:center;white-space:nowrap;padding:.78rem 1rem;border-radius:999px;background:rgba(255,255,255,.76);border:1px solid rgba(13,20,36,.08);font-size:.88rem}.path-card:after{content:'♡';position:absolute;right:1.05rem;bottom:.65rem;color:rgba(13,20,36,.12);font:700 2.5rem/1 var(--hand)}.products{width:min(1260px,calc(100% - 2rem));margin:0 auto 4.5rem}.section-head{text-align:center;margin-bottom:1.7rem}.section-head.left{text-align:left}.section-head p{margin:0 0 .55rem;color:var(--coral);font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:.76rem}.product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem}.product-card{background:white;border-radius:1.6rem;padding:.9rem;box-shadow:0 16px 40px rgba(48,30,18,.08)}.product-visual{height:160px;border-radius:1.2rem;background:linear-gradient(135deg,#ffe5df,#fff8ef 58%,#d7f6f1);display:grid;place-items:center}.product-visual span{max-width:72%;padding:1rem 1.2rem;border-radius:1rem;background:rgba(255,255,255,.76);font:700 1.45rem/.95 var(--hand);text-align:center;transform:rotate(-2deg)}.product-card h3{margin:1rem .25rem .65rem;font-size:1rem;line-height:1.35}.product-bottom{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.25rem}.product-bottom button{border:0;background:var(--coral);color:white;border-radius:999px;padding:.75rem 1rem;font-weight:800;cursor:pointer}.podcast{width:min(1260px,calc(100% - 2rem));margin:0 auto 4rem;display:grid;grid-template-columns:1fr auto;gap:1.5rem;align-items:center;padding:clamp(1.4rem,3.4vw,2.6rem);border-radius:2.4rem;background:#ffd9d1;box-shadow:0 18px 48px rgba(48,30,18,.09)}.podcast p:not(.label){max-width:760px;line-height:1.6}.footer{width:min(1260px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;color:#312b28}.footer-brand{width:86px}.footer-brand img{display:block;width:100%;height:auto}.footer p{margin:0;color:var(--muted)}.footer nav{display:flex;gap:1rem}.footer nav a{font-size:.82rem;font-weight:800}@media(max-width:1120px){.header{grid-template-columns:auto auto;gap:1rem}.nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding:.4rem 0}.hero{grid-template-columns:1fr}.hero-visual{justify-self:start}.promise-strip{grid-template-columns:repeat(2,1fr)}.univers-board{grid-template-columns:1fr}.product-grid{grid-template-columns:1fr}.podcast{grid-template-columns:1fr}.footer{grid-template-columns:1fr}}@media(max-width:700px){.home-page{background:linear-gradient(180deg,#fffdfa,#fff7ec)}.header{position:relative;grid-template-columns:1fr auto;padding:.7rem 1rem}.logo{width:104px;min-width:104px}.actions{gap:.25rem}.icon-link{width:2rem;height:2rem}.cart{font-size:.82rem;padding:.58rem .7rem}.nav{font-size:.75rem;gap:.85rem}.hero{padding:2rem 1rem 1.35rem;gap:1.4rem}.eyebrow{font-size:1.18rem}.hero h1{font-size:clamp(3rem,15vw,4.25rem)}.button-row{display:grid}.btn{width:100%}.hero-visual{border-radius:2.4rem}.hero-visual img{min-height:290px}.promise-strip{grid-template-columns:1fr;margin-bottom:2.2rem}.univers{width:calc(100% - 1.2rem)}.univers-board{padding:1.1rem;border-radius:2rem}.path-card{grid-template-columns:1fr;grid-template-areas:'num' 'label' 'title' 'note' 'text' 'action';padding:1.15rem}.path-card:hover{transform:none}.path-number{width:2.6rem;height:2.6rem}.path-card b{justify-self:start;margin-top:.8rem}.univers-intro h2,.section-head h2,.podcast h2{font-size:2.55rem}.mini-note{font-size:1.22rem}.product-grid{grid-template-columns:1fr}.footer nav{flex-wrap:wrap}}
`;
