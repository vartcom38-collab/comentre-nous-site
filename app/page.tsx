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
    text: 'Des cartes, des jeux et des rituels pour parler, écouter, comprendre et créer du lien au quotidien.',
    tone: 'family',
    tag: 'Famille · émotions',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    text: 'Des supports pour poser tes idées, clarifier ton message et retrouver une com qui te ressemble.',
    tone: 'business',
    tag: 'Idées · visibilité',
  },
  {
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    text: 'To-do lists, bujo, trackers, carnets et pages à imprimer pour organiser la vraie vie sans pression.',
    tone: 'paper',
    tag: 'Bujo · to-do',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/produits/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/produits/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/produits/mon-kit-ete'],
] as const;

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="Espace photo à intégrer">
      <div className="photo-frame">
        <div className="photo-soft-bg" />
        <div className="photo-message">
          <span>photo à intégrer</span>
          <strong>une vraie image douce,<br />humaine, Com’ entre nous</strong>
        </div>
      </div>
      <div className="paper-note note-one">écouter</div>
      <div className="paper-note note-two">ressentir</div>
      <div className="paper-note note-three">partager</div>
      <div className="small-heart">♡</div>
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
    <main className="site-page">
      <style>{styles}</style>

      <header className="topbar">
        <Link href="/" className="brand-logo" aria-label="Com’ entre nous accueil">
          <img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" />
        </Link>

        <nav className="main-nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="shop-actions">
          <Link href="/boutique" aria-label="Recherche" className="round-action">⌕</Link>
          <Link href="/a-propos" aria-label="Compte" className="round-action">♡</Link>
          <Link href="/boutique" className="cart-link" aria-label={`Panier ${cartCount} article${cartCount > 1 ? 's' : ''}`}>
            <span>Panier</span><b>{cartCount}</b>
          </Link>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <p className="hero-kicker">Des petits outils pour de grands moments</p>
          <h1>Des mots, des cartes et des carnets pour <mark>créer du lien.</mark></h1>
          <p className="hero-text">Des outils doux, illustrés et concrets pour trouver les mots, faire circuler les idées et remettre un peu de lien dans la vraie vie.</p>
          <div className="hero-buttons">
            <Link href="/par-ou-commencer" className="button primary-button">Découvrir nos univers →</Link>
            <Link href="/boutique" className="button secondary-button">Voir les nouveautés →</Link>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="mini-values" aria-label="Nos intentions">
        <p><strong>Du concret</strong><span>pas des grandes leçons</span></p>
        <p><strong>Du lien</strong><span>dans la vraie vie</span></p>
        <p><strong>Du doux</strong><span>mais pas gnangnan</span></p>
      </section>

      <section className="univers-section" aria-labelledby="univers-title">
        <div className="section-heading">
          <p>Choisis ton coin</p>
          <h2 id="univers-title">Quel est ton univers ?</h2>
        </div>
        <div className="univers-grid">
          {univers.map((item) => (
            <Link href={item.href} key={item.href} className={`universe-card ${item.tone}`}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <em>Découvrir →</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section" aria-labelledby="news-title">
        <div className="section-title-row">
          <div>
            <p>Boutique en construction</p>
            <h2 id="news-title">Les nouveautés arrivent doucement</h2>
          </div>
          <Link href="/boutique">Voir toute la boutique →</Link>
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

      <section className="podcast-section">
        <div>
          <p>Com’ entre nous · le podcast</p>
          <h2>Des conversations vraies, imparfaites, et tellement nous.</h2>
          <Link href="/podcast" className="button secondary-button">Découvrir l’espace podcast →</Link>
        </div>
        <div className="podcast-card">à venir<br /><b>🎙️</b></div>
      </section>

      <footer className="site-footer">
        <Link href="/" className="footer-logo" aria-label="Com’ entre nous accueil">
          <img src="/logo-comentre-nous.svg?v=transparent-final-20260907" alt="Com’ entre nous" />
        </Link>
        <p>Des mots, des outils, des humains.</p>
        <nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
      </footer>
    </main>
  );
}

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700;800&family=Patrick+Hand&display=swap');
:root{--cream:#fff8ef;--paper:#fffdfa;--ink:#0f1728;--muted:#5f5a56;--coral:#ff5a5f;--rose:#ffd9d2;--rose-soft:#fff1ed;--mint:#d5f4ef;--teal:#179e99;--yellow:#ffe39a;--lilac:#ead8ff;--shadow:0 18px 45px rgba(55,35,22,.10);--body:'Comfortaa',system-ui,sans-serif;--hand:'Patrick Hand','Comic Sans MS',cursive}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink);font-family:var(--body)}a{color:inherit;text-decoration:none}.site-page{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at -70px 190px,rgba(255,217,210,.8) 0 120px,transparent 121px),radial-gradient(circle at calc(100% + 80px) 180px,rgba(213,244,239,.9) 0 130px,transparent 131px),linear-gradient(180deg,#fffaf4 0%,#fff8ef 100%)}
.topbar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:150px minmax(0,1fr) auto;align-items:center;gap:24px;padding:10px clamp(18px,4vw,62px);background:rgba(255,248,239,.94);backdrop-filter:blur(18px);border-bottom:1px solid rgba(15,23,40,.06)}.brand-logo{display:flex;align-items:center;width:132px;min-width:132px}.brand-logo img{display:block;width:100%;height:auto}.main-nav{display:flex;justify-content:center;align-items:center;gap:clamp(14px,2vw,30px);white-space:nowrap;font-size:clamp(12px,.9vw,14px);font-weight:800}.main-nav a{position:relative}.main-nav a:first-child{padding:10px 14px;background:var(--rose-soft);border-radius:999px}.main-nav a:first-child:after{content:'';position:absolute;left:18px;right:18px;bottom:3px;height:4px;border-radius:999px;background:var(--coral);transform:rotate(-2deg)}.shop-actions{display:flex;align-items:center;gap:9px}.round-action{display:grid;place-items:center;width:36px;height:36px;border-radius:999px;font:700 28px/1 var(--hand)}.cart-link{display:inline-flex;align-items:center;gap:9px;min-height:42px;padding:8px 13px;border:2px solid var(--ink);border-radius:999px;background:#fff;font-weight:800;font-size:13px}.cart-link:before{content:'🛒';font-size:15px}.cart-link b{display:grid;place-items:center;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:var(--coral);color:white;font-size:11px}
.hero-section{width:min(1240px,calc(100% - 40px));margin:0 auto;padding:clamp(34px,5vw,72px) 0 38px;display:grid;grid-template-columns:minmax(0,1fr) minmax(330px,430px);gap:clamp(28px,5vw,70px);align-items:center}.hero-copy{position:relative}.hero-kicker{display:inline-block;margin:0 0 18px;padding:10px 18px;border-radius:999px;background:rgba(255,255,255,.78);box-shadow:0 8px 22px rgba(55,35,22,.07);font:700 clamp(22px,2vw,32px)/1 var(--hand);transform:rotate(-2deg)}.hero-copy h1{margin:0;max-width:760px;font:700 clamp(46px,5.05vw,76px)/.94 var(--hand);letter-spacing:-.038em}.hero-copy mark{padding:0 .12em .02em;border-radius:999px;background:linear-gradient(90deg,rgba(255,165,158,.62),rgba(255,90,95,.45));color:inherit;box-decoration-break:clone;-webkit-box-decoration-break:clone}.hero-text{max-width:655px;margin:22px 0 0;font-size:clamp(15px,1.12vw,18px);line-height:1.68;color:#20283a}.hero-buttons{display:flex;flex-wrap:wrap;gap:14px;margin-top:26px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:50px;padding:14px 22px;border-radius:999px;font:800 15px/1 var(--body);letter-spacing:-.02em}.primary-button{background:var(--coral);color:#fff;box-shadow:0 14px 30px rgba(255,90,95,.22)}.secondary-button{background:rgba(255,255,255,.78);border:2px solid var(--ink)}
.hero-visual{position:relative;min-height:410px}.photo-frame{position:absolute;inset:22px 14px 22px 0;border-radius:44px;background:#fffdfa;box-shadow:var(--shadow);overflow:hidden;transform:rotate(1.2deg)}.photo-frame:before{content:'';position:absolute;inset:18px;border-radius:34px;background:linear-gradient(135deg,rgba(255,218,210,.92),rgba(255,248,239,.85) 45%,rgba(213,244,239,.75));}.photo-soft-bg{position:absolute;inset:54px 42px 0;border-radius:48% 52% 13% 13%;background:radial-gradient(circle at 28% 24%,rgba(116,62,32,.38),transparent 16%),radial-gradient(circle at 68% 31%,rgba(116,62,32,.30),transparent 15%),linear-gradient(135deg,rgba(255,255,255,.6),rgba(255,126,120,.42));filter:blur(.2px)}.photo-message{position:absolute;left:34px;right:34px;bottom:30px;padding:18px 20px;border-radius:22px;background:rgba(255,255,255,.76);box-shadow:0 10px 24px rgba(55,35,22,.08)}.photo-message span{display:block;margin-bottom:8px;color:var(--coral);text-transform:uppercase;font-size:11px;font-weight:900;letter-spacing:.08em}.photo-message strong{display:block;font:700 26px/.95 var(--hand);letter-spacing:-.025em}.paper-note{position:absolute;z-index:4;right:0;padding:10px 17px;border-radius:12px;box-shadow:0 10px 22px rgba(55,35,22,.09);font:700 23px/1 var(--hand)}.note-one{top:70px;background:#ffd8b5;transform:rotate(-4deg)}.note-two{top:126px;background:#ffd4d6;transform:rotate(3deg)}.note-three{top:182px;background:#e6d1ff;transform:rotate(-2deg)}.small-heart{position:absolute;z-index:5;left:6px;top:52px;color:var(--coral);font:700 58px/1 var(--hand);transform:rotate(-12deg)}
.mini-values{width:min(1040px,calc(100% - 40px));margin:0 auto 54px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:16px;border-radius:30px;background:rgba(255,255,255,.68);box-shadow:0 10px 28px rgba(55,35,22,.06)}.mini-values p{margin:0;text-align:center}.mini-values strong{display:block;font-weight:900}.mini-values span{display:block;margin-top:4px;color:var(--muted);font-size:13px}.univers-section,.products-section,.podcast-section,.site-footer{width:min(1180px,calc(100% - 40px));margin:0 auto}.section-heading{text-align:center;margin-bottom:24px}.section-heading p,.section-title-row p,.podcast-section p{margin:0 0 7px;color:var(--coral);font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.section-heading h2,.section-title-row h2,.podcast-section h2{margin:0;font:700 clamp(38px,4vw,58px)/.95 var(--hand);letter-spacing:-.04em}.univers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:58px}.universe-card{min-height:270px;padding:28px;border-radius:30px;background:white;box-shadow:var(--shadow);display:flex;flex-direction:column;justify-content:space-between}.universe-card.family{background:#fff1ed}.universe-card.business{background:#eafbfa}.universe-card.paper{background:#f5e9ff}.universe-card span{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.universe-card h3{margin:18px 0 12px;font:700 clamp(34px,3.4vw,48px)/.9 var(--hand);letter-spacing:-.04em}.universe-card p{margin:0;color:#293146;line-height:1.55;font-size:14px}.universe-card em{margin-top:20px;font-style:normal;font-weight:900}.section-title-row{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:18px}.section-title-row a{padding:12px 16px;border-radius:999px;background:white;font-size:13px;font-weight:900}.product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:56px}.product-card{padding:12px;border-radius:26px;background:white;box-shadow:0 14px 34px rgba(55,35,22,.08)}.product-visual{height:155px;border-radius:20px;background:linear-gradient(135deg,#ffe4de,#fff9f2 58%,#d5f4ef);display:grid;place-items:center}.product-visual span{padding:14px 18px;border-radius:18px;background:rgba(255,255,255,.72);font:700 22px/1 var(--hand);transform:rotate(-2deg)}.product-card h3{margin:14px 4px 10px;font-size:15px;line-height:1.35}.product-bottom{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 4px 4px}.product-bottom button{border:0;border-radius:999px;background:var(--coral);color:white;padding:11px 15px;font:800 12px/1 var(--body);cursor:pointer}.podcast-section{margin-bottom:44px;padding:28px;display:grid;grid-template-columns:1fr 190px;gap:26px;align-items:center;border-radius:34px;background:#ffd9d1;box-shadow:var(--shadow)}.podcast-section h2{max-width:760px}.podcast-card{justify-self:end;width:165px;min-height:165px;border-radius:28px;background:#fffaf4;box-shadow:0 10px 26px rgba(55,35,22,.08);display:grid;place-items:center;text-align:center;color:var(--coral);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;transform:rotate(2deg)}.podcast-card b{font-size:54px}.site-footer{padding:22px 0 42px;display:grid;grid-template-columns:auto 1fr auto;gap:18px;align-items:center}.footer-logo{width:92px}.footer-logo img{width:100%;height:auto;display:block}.site-footer p{margin:0;color:var(--muted)}.site-footer nav{display:flex;gap:14px;font-size:12px;font-weight:900}
@media(max-width:1050px){.topbar{grid-template-columns:auto auto}.main-nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding:4px 0}.hero-section{grid-template-columns:1fr}.hero-visual{min-height:360px;max-width:520px}.univers-grid,.product-grid{grid-template-columns:1fr}.podcast-section{grid-template-columns:1fr}.podcast-card{justify-self:start}.site-footer{grid-template-columns:1fr}.mini-values{grid-template-columns:1fr}}
@media(max-width:660px){.site-page{background:linear-gradient(180deg,#fffaf4,#fff8ef)}.topbar{position:relative;padding:10px 16px;gap:12px}.brand-logo{width:104px;min-width:104px}.shop-actions{gap:5px}.round-action{width:32px;height:32px;font-size:23px}.cart-link{min-height:36px;padding:7px 10px}.cart-link span{display:none}.main-nav{font-size:12px;gap:12px}.hero-section{width:calc(100% - 28px);padding:30px 0 26px;gap:22px}.hero-kicker{font-size:22px}.hero-copy h1{font-size:clamp(42px,15vw,58px);line-height:.9}.hero-text{font-size:15px;line-height:1.6}.hero-buttons{display:grid}.button{width:100%;min-height:48px}.hero-visual{min-height:310px}.photo-frame{inset:10px 0 18px 0;border-radius:32px}.photo-message{left:20px;right:20px;bottom:22px}.photo-message strong{font-size:23px}.paper-note{font-size:20px;right:-4px}.note-one{top:54px}.note-two{top:105px}.note-three{top:156px}.small-heart{font-size:48px;left:10px;top:38px}.mini-values,.univers-section,.products-section,.podcast-section,.site-footer{width:calc(100% - 28px)}.section-heading h2,.section-title-row h2,.podcast-section h2{font-size:38px}.universe-card{min-height:230px;padding:24px}.section-title-row{display:block}.section-title-row a{display:inline-flex;margin-top:14px}.podcast-section{padding:22px}.site-footer nav{flex-wrap:wrap}}
`;
