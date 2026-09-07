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
    text: 'Des jeux et des outils pour ouvrir les discussions, accueillir les émotions et créer des petits rituels de lien.',
    tag: 'cartes · émotions · quotidien',
    kind: 'family',
  },
  {
    title: 'Com’ des entrepreneuses',
    href: '/com-des-entrepreneuses',
    text: 'Des supports pour poser tes idées, clarifier tes messages et avancer dans ta com sans te perdre en route.',
    tag: 'idées · visibilité · clarté',
    kind: 'business',
  },
  {
    title: 'La papeterie',
    href: '/papeterie-du-lien',
    text: 'To-do lists, pages de bujo, trackers, plannings et carnets pour organiser ton quotidien avec plus de douceur.',
    tag: 'bujo · to-do · trackers',
    kind: 'paper',
  },
] as const;

const products = [
  ['Les Petits Liens', 'Jeu de cartes famille', '29,00 €', '/products/les-petits-liens'],
  ['Mon carnet de clarté', 'Carnet guidé', '12,90 €', '/products/mon-carnet-de-clarte'],
  ['Mon kit d’été', 'Activités à imprimer', '12,90 €', '/products/mon-kit-dete'],
] as const;

function FamilySketch() {
  return (
    <svg viewBox="0 0 360 250" className="sketch sketch-family" aria-hidden="true">
      <path className="paper-bg" d="M35 34c55-22 238-25 286 6 28 18 30 145 1 172-41 38-243 35-289 4-32-22-29-166 2-182Z" />
      <path className="hair" d="M137 77c-12-23 5-50 35-48 28 2 41 26 30 48" />
      <path className="line" d="M130 94c10-44 80-41 86 2 6 42-23 67-49 65-30-3-47-29-37-67Z" />
      <path className="line" d="M112 163c29 33 83 34 116 0l18 52H92l20-52Z" />
      <path className="fill-yellow" d="M232 145c-12-20 2-42 28-41 25 1 37 23 28 43" />
      <path className="line" d="M225 158c7-33 61-34 69-1 8 35-16 55-39 53-23-2-37-20-30-52Z" />
      <path className="fill-yellow" d="M214 201c30 22 74 21 99 1l12 35H202l12-36Z" />
      <path className="line loose" d="M113 173c27 25 64 38 105 30 33-6 59-26 72-53" />
      <path className="heart" d="M61 98c-19-25 27-38 29-6 8-32 50-14 26 12l-27 29-28-35Z" />
      <path className="accent" d="M296 70l12-25 10 28 26-8-22 21 14 24-28-10-18 23 3-31-25-12 28-10Z" />
      <path className="dash" d="M43 157h24M293 150h28M175 25v24M178 214v23" />
    </svg>
  );
}

function BusinessSketch() {
  return (
    <svg viewBox="0 0 360 250" className="sketch sketch-business" aria-hidden="true">
      <path className="paper-bg minty" d="M31 42c43-30 249-27 296-1 30 17 29 148 2 176-39 40-256 38-298 2-27-24-31-154 0-177Z" />
      <path className="hair dark" d="M170 78c-10-25 6-48 35-48 29 0 43 24 33 50" />
      <path className="line" d="M153 99c8-43 83-46 94-3 10 40-20 68-47 67-29-1-56-24-47-64Z" />
      <path className="line" d="M134 166c39 25 93 26 130-2l13 41H122l12-39Z" />
      <path className="screen" d="M74 161h212c10 0 18 8 18 18v35H56v-35c0-10 8-18 18-18Z" />
      <path className="line" d="M56 216h248l-17 19H73l-17-19Z" />
      <path className="heart small" d="M172 185c-9-13 13-19 15-4 3-15 25-8 13 6l-14 15-14-17Z" />
      <path className="accent" d="M97 73c0-19 15-34 34-34s34 15 34 34c0 17-10 26-19 34H116c-9-8-19-17-19-34Z" />
      <path className="line loose" d="M119 123h24M114 139h35M291 142c14-16 30-27 48-30M305 158c15-4 29-4 43 1" />
      <path className="dash" d="M61 99l-22-16M286 57l22-18M54 133H25M315 86h24" />
    </svg>
  );
}

function PaperSketch() {
  return (
    <svg viewBox="0 0 360 250" className="sketch sketch-paper" aria-hidden="true">
      <path className="paper-bg lilacy" d="M31 34c45-22 248-22 296 3 31 16 33 151 4 180-40 39-259 37-300 0-26-23-31-163 0-183Z" />
      <path className="page-fill" d="M105 32h143c20 0 36 16 36 36v143c0 20-16 36-36 36H105V32Z" />
      <path className="line" d="M105 32h143c20 0 36 16 36 36v143c0 20-16 36-36 36H105V32Z" />
      <path className="line loose" d="M142 79h95M142 111h108M142 143h80M142 175h106" />
      <path className="ring" d="M88 66h33M88 105h33M88 144h33M88 183h33" />
      <path className="pencil" d="M267 47l44 137-17 28-45-139 18-26Z" />
      <path className="heart" d="M154 195c-15-21 22-31 25-5 5-25 40-12 21 12l-22 22-24-29Z" />
      <path className="accent" d="M61 83l8-19 7 20 22-4-17 14 10 19-20-8-15 16 2-22-20-9 23-7Z" />
      <path className="dash" d="M307 73h26M42 154h26M296 211l22 18" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <div className="hero-card" aria-hidden="true">
      <svg viewBox="0 0 520 420" className="hero-art">
        <path className="blob" d="M76 64c71-48 281-52 361 5 75 54 66 236 14 295-70 80-304 63-377 2C8 310 4 112 76 64Z" />
        <path className="adult-hair" d="M190 107c-22-45 9-94 65-91 56 3 83 53 57 98" />
        <path className="ink" d="M168 143c15-86 157-85 173 0 13 70-38 115-88 111-55-4-100-46-85-111Z" />
        <path className="adult-shirt" d="M140 265c66 58 177 59 238 0l39 128H101l39-128Z" />
        <path className="child-hair" d="M334 161c-14-37 11-72 55-69 41 3 59 37 44 74" />
        <path className="ink" d="M318 193c11-60 108-60 119 1 10 53-27 85-62 83-39-2-67-32-57-84Z" />
        <path className="child-shirt" d="M298 292c48 42 125 42 168 2l30 97H269l29-99Z" />
        <path className="ink loose" d="M141 280c56 53 151 68 236 26 35-17 65-42 87-77" />
        <path className="heart hero-heart" d="M90 123c-18-24 25-37 28-7 8-32 47-11 24 15l-25 25-27-33Z" />
        <path className="sun" d="M78 58c0 21-17 38-38 38S2 79 2 58s17-38 38-38 38 17 38 38Z" />
        <path className="sunrays" d="M40 0v16M40 100v16M-18 58h16M82 58h16M0 16l12 12M68 88l12 12M0 100l12-12M68 28l12-12" />
      </svg>
      <div className="postits">
        <span>Écouter</span>
        <span>Comprendre</span>
        <span>Ressentir</span>
        <span>Partager</span>
      </div>
      <p>Les mots<br />d’aujourd’hui<br />pour demain ♡</p>
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
    <main className="page">
      <style>{styles}</style>

      <header className="header">
        <Link href="/" className="logo" aria-label="Com’ entre nous accueil">
          <img src="/logo-comentre-nous.webp" alt="Com’ entre nous" />
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

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Des petits outils pour de grands moments</p>
          <h1>Des mots,<br />des cartes et des carnets<br />pour <mark>créer du lien.</mark></h1>
          <p className="intro">Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées. En famille, dans ton quotidien ou dans tes projets.</p>
          <div className="button-row">
            <Link href="/par-ou-commencer" className="btn primary">Découvrir nos univers →</Link>
            <Link href="/boutique" className="btn secondary">Voir les nouveautés →</Link>
          </div>
        </div>
        <HeroIllustration />
      </section>

      <section className="values-strip" aria-label="Nos valeurs">
        <p><strong>Des créations</strong><span>avec amour</span></p>
        <p><strong>Une approche</strong><span>bienveillante et sans pression</span></p>
        <p><strong>Des outils</strong><span>pour la vraie vie</span></p>
      </section>

      <section className="univers" aria-labelledby="univers-title">
        <div className="section-head">
          <p>Choisis ton coin</p>
          <h2 id="univers-title">Quel est ton univers ?</h2>
        </div>
        <div className="univers-grid">
          {univers.map((item) => (
            <Link href={item.href} key={item.href} className={`univers-card ${item.kind}`}>
              <div className="sticker">
                {item.kind === 'family' && <FamilySketch />}
                {item.kind === 'business' && <BusinessSketch />}
                {item.kind === 'paper' && <PaperSketch />}
              </div>
              <div className="card-copy">
                <span>{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <em>Découvrir →</em>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="products" aria-labelledby="news-title">
        <div className="section-title">
          <p>Boutique en construction</p>
          <h2 id="news-title">Les nouveautés arrivent doucement</h2>
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

      <section className="podcast">
        <div className="podcast-copy">
          <p className="label">Com’ entre nous · le podcast</p>
          <h2>Des conversations vraies, imparfaites, et tellement nous.</h2>
          <p>Le podcast est à venir. En attendant, on prépare un espace doux pour parler parentalité, émotions, entrepreneuriat, coulisses et cafés froids.</p>
          <Link href="/podcast" className="btn secondary">Découvrir l’espace podcast →</Link>
        </div>
        <div className="podcast-sticker"><span>à venir</span><b>🎙️</b></div>
      </section>

      <footer className="footer">
        <div className="footer-brand"><img src="/logo-comentre-nous.webp" alt="Com’ entre nous" /></div>
        <p>Des mots, des outils, des humains.</p>
        <nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
      </footer>
    </main>
  );
}

const styles = String.raw`
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700;800&family=Patrick+Hand&display=swap');
:root{--cream:#fff8ef;--paper:#fffdfa;--ink:#111827;--muted:#5d5a57;--coral:#ff5a5f;--rose:#ffdcd7;--rose-soft:#fff0ec;--mint:#d7f5f1;--mint-deep:#18a7a0;--yellow:#ffe7a5;--lilac:#ead7ff;--sand:#f8e5c8;--shadow:0 22px 60px rgba(61,38,22,.12);--body:'Comfortaa',system-ui,sans-serif;--hand:'Patrick Hand','Comic Sans MS',cursive}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--cream);color:var(--ink)}a{color:inherit}.page{min-height:100vh;background:radial-gradient(circle at -4rem 15rem,#ffd7cf 0 8rem,transparent 8.1rem),radial-gradient(circle at calc(100% + 4rem) 18rem,#c9f1eb 0 8rem,transparent 8.1rem),linear-gradient(180deg,#fffbf6 0%,#fff8ef 100%);font-family:var(--body);overflow-x:hidden}.header{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:2rem;width:100%;padding:.55rem clamp(1rem,3vw,3.2rem);background:rgba(255,248,239,.95);backdrop-filter:blur(18px);border-bottom:1px solid rgba(17,24,39,.06)}.logo{display:flex;align-items:center;justify-content:center;width:clamp(5.2rem,6.4vw,6.9rem);min-width:5.2rem;text-decoration:none}.logo img{display:block;width:100%;height:auto}.nav{display:flex;justify-content:center;align-items:center;gap:clamp(.75rem,2vw,2rem);font-weight:800;font-size:clamp(.73rem,.86vw,.92rem);white-space:nowrap}.nav a{text-decoration:none;position:relative}.nav a:first-child{background:var(--rose-soft);padding:.62rem .95rem;border-radius:999px}.nav a:first-child:after{content:'';position:absolute;left:19%;right:19%;bottom:-.18rem;height:.18rem;background:var(--coral);border-radius:999px;transform:rotate(-3deg)}.actions{display:flex;align-items:center;gap:.75rem}.icon-link{display:grid;place-items:center;width:2.25rem;height:2.25rem;text-decoration:none;font:700 2rem/1 var(--hand)}.cart{position:relative;display:inline-flex;align-items:center;gap:.55rem;min-height:2.75rem;padding:.65rem 1rem .58rem 1.05rem;border:2px solid var(--ink);border-radius:999px;text-decoration:none;font-weight:800;background:white}.cart:before{content:'🛒';font-size:1rem}.cart b{display:grid;place-items:center;min-width:1.35rem;height:1.35rem;padding:0 .35rem;background:var(--coral);color:white;border-radius:999px;font-size:.73rem}.hero{position:relative;width:min(1480px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(340px,.92fr);align-items:center;gap:clamp(2rem,5vw,5rem);padding:clamp(2rem,5vw,4.5rem) clamp(1rem,5vw,5rem) 1.5rem}.hero:before{content:'';position:absolute;left:-4rem;top:19%;width:10rem;height:17rem;background:var(--yellow);border-radius:0 999px 999px 0;opacity:.62}.hero-copy{position:relative;z-index:2}.eyebrow{display:inline-block;margin:0 0 1rem;padding:.55rem 1rem;background:#fff;border:1px solid rgba(17,24,39,.08);border-radius:999px;box-shadow:0 10px 24px rgba(61,38,22,.07);font:700 clamp(1.3rem,2vw,2rem)/1 var(--hand);transform:rotate(-2deg)}h1{margin:0 0 1.35rem;font:700 clamp(3.4rem,6.7vw,7.5rem)/.82 var(--hand);letter-spacing:-.055em;max-width:780px}mark{color:inherit;background:linear-gradient(90deg,rgba(255,190,182,.55),rgba(255,151,146,.88));border-radius:999px;padding:0 .16em;box-decoration-break:clone;-webkit-box-decoration-break:clone}.intro{max-width:670px;font-size:clamp(1rem,1.32vw,1.32rem);line-height:1.55;margin:0;color:#151b28}.button-row{display:flex;gap:1rem;flex-wrap:wrap;margin-top:1.9rem}.btn,.brush-link{display:inline-flex;align-items:center;justify-content:center;min-height:3.25rem;padding:.95rem 1.45rem;border-radius:999px;text-decoration:none;font:800 .95rem/1 var(--body);letter-spacing:-.02em}.primary{background:var(--coral);color:white;box-shadow:0 16px 34px rgba(255,90,95,.22)}.secondary{background:rgba(255,255,255,.72);border:2px solid var(--ink)}.hero-card{position:relative;min-height:520px;display:grid;place-items:center}.hero-art{width:min(620px,100%);filter:drop-shadow(0 24px 35px rgba(61,38,22,.12))}.blob{fill:#fff1eb}.ink,.line,.dash,.ring{fill:none;stroke:var(--ink);stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.loose{stroke-width:5;stroke-dasharray:1000;stroke-dashoffset:0}.adult-hair,.child-hair,.hair{fill:none;stroke:#653817;stroke-width:15;stroke-linecap:round;stroke-linejoin:round}.adult-shirt{fill:#fffdfa;stroke:var(--ink);stroke-width:7;stroke-linejoin:round}.child-shirt,.fill-yellow{fill:#ffd56b;stroke:var(--ink);stroke-width:7;stroke-linejoin:round}.heart{fill:#ffc4bd;stroke:var(--ink);stroke-width:6;stroke-linejoin:round}.hero-heart{transform-origin:center}.sun,.sunrays{fill:none;stroke:#f6aa19;stroke-width:8;stroke-linecap:round}.postits{position:absolute;right:3%;top:18%;display:grid;gap:.75rem}.postits span{display:block;min-width:8.5rem;padding:.58rem 1rem;border-radius:.55rem;font:700 1.55rem/1 var(--hand);text-align:center;box-shadow:0 8px 18px rgba(61,38,22,.08);transform:rotate(-4deg)}.postits span:nth-child(1){background:#ffd8b8}.postits span:nth-child(2){background:#bfeee7;transform:rotate(2deg)}.postits span:nth-child(3){background:#ffd1d2;transform:rotate(-2deg)}.postits span:nth-child(4){background:#e5ccff;transform:rotate(2deg)}.hero-card p{position:absolute;left:7%;bottom:8%;margin:0;padding:.8rem 1.1rem;background:#ffe39a;border-radius:1rem;font:700 2rem/.95 var(--hand);transform:rotate(-7deg);box-shadow:0 10px 25px rgba(61,38,22,.09)}.values-strip{width:min(1180px,calc(100% - 2rem));margin:0 auto 3.5rem;padding:1.2rem clamp(1rem,3vw,2.4rem);display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;background:rgba(255,255,255,.72);border:1px solid rgba(17,24,39,.07);border-radius:2rem;box-shadow:0 12px 30px rgba(61,38,22,.06)}.values-strip p{margin:0;text-align:center}.values-strip strong{display:block;font:800 .95rem/1.2 var(--body)}.values-strip span{display:block;margin-top:.25rem;color:var(--muted);font-size:.82rem}.univers{width:min(1260px,calc(100% - 2rem));margin:0 auto 4rem}.section-head{text-align:center;margin-bottom:1.6rem}.section-head p,.section-title p,.label{margin:0 0 .45rem;color:var(--coral);font-weight:800;text-transform:uppercase;font-size:.76rem;letter-spacing:.08em}.section-head h2,.section-title h2,.podcast h2{margin:0;font:700 clamp(2.6rem,4.5vw,4.8rem)/.9 var(--hand);letter-spacing:-.04em}.univers-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.35rem}.univers-card{position:relative;min-height:440px;display:flex;flex-direction:column;justify-content:space-between;padding:1rem 1rem 1.25rem;text-decoration:none;background:white;border-radius:2rem;box-shadow:var(--shadow);overflow:hidden;transition:transform .2s ease,box-shadow .2s ease}.univers-card:hover{transform:translateY(-5px) rotate(0deg);box-shadow:0 26px 70px rgba(61,38,22,.16)}.univers-card.family{background:linear-gradient(180deg,#fff1ed,#fffaf6);transform:rotate(-1deg)}.univers-card.business{background:linear-gradient(180deg,#eafbf8,#fffaf6);transform:rotate(.7deg)}.univers-card.paper{background:linear-gradient(180deg,#f3e7ff,#fffaf6);transform:rotate(-.4deg)}.sticker{height:215px;border-radius:1.55rem;background:rgba(255,255,255,.56);display:grid;place-items:center;overflow:hidden}.sketch{width:100%;max-width:360px}.paper-bg{fill:#fff3ed}.minty{fill:#ecfffb}.lilacy{fill:#f6eaff}.dark{stroke:#3f2233}.screen{fill:#e9f5f5;stroke:var(--ink);stroke-width:7;stroke-linejoin:round}.page-fill{fill:#fffdfa}.pencil{fill:#ffad93;stroke:var(--ink);stroke-width:6;stroke-linejoin:round}.accent{fill:none;stroke:#ff5a5f;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.small{stroke-width:5}.card-copy{padding:.95rem .35rem 0}.card-copy span{display:inline-block;margin-bottom:.7rem;padding:.42rem .75rem;background:#fff;border-radius:999px;color:#706660;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.05em}.card-copy h3{margin:0 0 .7rem;font:700 clamp(2.1rem,3.6vw,3.6rem)/.88 var(--hand);letter-spacing:-.04em}.card-copy p{margin:0 0 1rem;color:#252b36;line-height:1.5;font-size:.98rem}.card-copy em{font-style:normal;font-weight:800}.products{width:min(1260px,calc(100% - 2rem));margin:0 auto 4rem}.section-title{display:grid;grid-template-columns:1fr auto;align-items:end;gap:1rem;margin-bottom:1.2rem}.section-title p{grid-column:1/-1;margin-bottom:-.3rem}.section-title a{font-weight:800;text-decoration:none;background:white;border:1px solid rgba(17,24,39,.08);padding:.9rem 1.2rem;border-radius:999px}.product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem}.product-card{background:white;border-radius:1.6rem;padding:.85rem;box-shadow:0 16px 40px rgba(61,38,22,.09)}.product-visual{height:180px;border-radius:1.15rem;background:linear-gradient(135deg,#ffe5de,#fff7ee 60%,#d7f5f1);display:grid;place-items:center;text-decoration:none;overflow:hidden}.product-visual span{display:inline-block;max-width:70%;padding:1.2rem 1.4rem;background:rgba(255,255,255,.72);border-radius:1rem;font:700 1.5rem/1.05 var(--hand);text-align:center;transform:rotate(-2deg)}.product-card h3{margin:1rem .25rem .6rem;font-size:1rem;line-height:1.3}.product-card h3 a{text-decoration:none}.product-bottom{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.25rem}.product-bottom button{border:0;background:var(--coral);color:white;border-radius:999px;padding:.75rem 1rem;font:800 .82rem/1 var(--body);cursor:pointer}.podcast{width:min(1260px,calc(100% - 2rem));margin:0 auto 4rem;padding:clamp(1.5rem,4vw,3rem);display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:2rem;align-items:center;background:#ffd9d1;border-radius:2.2rem;box-shadow:var(--shadow)}.podcast-copy p:not(.label){max-width:760px;line-height:1.55}.podcast-sticker{justify-self:end;width:230px;aspect-ratio:1;border-radius:2rem;background:#fff7ee;display:grid;place-items:center;box-shadow:0 12px 28px rgba(61,38,22,.1);transform:rotate(2deg)}.podcast-sticker span{align-self:end;font-weight:800;color:var(--coral);text-transform:uppercase;font-size:.8rem;letter-spacing:.08em}.podcast-sticker b{align-self:start;font-size:5rem}.footer{width:min(1260px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;color:#312b28}.footer-brand{display:flex;align-items:center;width:5.6rem}.footer-brand img{display:block;width:100%;height:auto}.footer p{margin:0;color:var(--muted)}.footer nav{display:flex;gap:1rem}.footer nav a{text-decoration:none;font-size:.82rem;font-weight:800}
@media(max-width:1080px){.header{grid-template-columns:auto auto;gap:1rem}.nav{grid-column:1/-1;justify-content:flex-start;overflow-x:auto;padding:.4rem 0}.hero{grid-template-columns:1fr;padding-top:2rem}.hero-card{min-height:430px}.univers-grid,.product-grid{grid-template-columns:1fr}.univers-card{min-height:unset;display:grid;grid-template-columns:minmax(210px,.9fr) 1fr;gap:1rem;align-items:center}.sticker{height:220px}.podcast{grid-template-columns:1fr}.podcast-sticker{justify-self:start}.footer{grid-template-columns:1fr}}
@media(max-width:680px){.page{background:linear-gradient(180deg,#fffaf4,#fff8ef)}.header{position:relative;grid-template-columns:1fr auto;padding:.6rem 1rem}.logo{width:5rem;min-width:5rem}.actions{gap:.35rem}.icon-link{width:2rem;height:2rem}.cart{padding:.55rem .7rem;font-size:.8rem}.nav{font-size:.76rem;gap:.75rem}.hero{padding:2rem 1rem 1rem;gap:1rem}.hero:before{display:none}.eyebrow{font-size:1.3rem}.intro{font-size:1rem}.button-row{display:grid}.btn{width:100%;min-height:3.1rem}.hero-card{min-height:340px}.postits{right:0;top:12%;gap:.45rem}.postits span{min-width:6.3rem;font-size:1.05rem;padding:.45rem .7rem}.hero-card p{font-size:1.3rem;left:2%;bottom:4%}.values-strip{grid-template-columns:1fr;margin-bottom:2.5rem}.section-head h2,.section-title h2,.podcast h2{font-size:2.55rem}.univers-card{grid-template-columns:1fr;padding:.8rem;border-radius:1.6rem;transform:none!important}.sticker{height:185px}.card-copy h3{font-size:2.65rem}.section-title{grid-template-columns:1fr}.product-visual{height:150px}.podcast{border-radius:1.6rem}.podcast-sticker{width:170px}.footer nav{flex-wrap:wrap}}
`;