import Link from 'next/link';

const nav = [
  ['Com’ en famille', '/com-en-famille'],
  ['Com’ des entrepreneuses', '/com-des-entrepreneuses'],
  ['Papeterie du lien', '/papeterie-du-lien'],
  ['Le podcast', '/podcast'],
  ['Les petits cadeaux', '/les-petits-cadeaux'],
  ['À propos', '/a-propos']
] as const;

const universes = [
  {
    title: 'Com’ en famille',
    text: 'Des jeux et des outils pour se parler, s’écouter et grandir ensemble.',
    href: '/com-en-famille',
    tone: 'family',
    visual: '👩‍👧'
  },
  {
    title: 'Com’ des entrepreneuses',
    text: 'Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.',
    href: '/com-des-entrepreneuses',
    tone: 'business',
    visual: '☕'
  },
  {
    title: 'Papeterie du lien',
    text: 'Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.',
    href: '/papeterie-du-lien',
    tone: 'paper',
    visual: '📒'
  }
] as const;

const values = [
  ['♡', 'Des créations', 'avec amour'],
  ['♧', 'Une approche bienveillante', 'et sans pression'],
  ['☷', 'Des outils pour', 'la vraie vie'],
  ['☆', 'Une communauté', 'qui inspire']
] as const;

const products = [
  { title: 'Les Petits Liens', price: '29,00 €', badge: 'Nouveau', href: '/produits/les-petits-liens', visual: 'boîte illustrée' },
  { title: 'Mon carnet de clarté', price: '12,90 €', href: '/produits/mon-carnet-de-clarte', visual: 'carnet ouvert' },
  { title: 'Mon kit d’été', price: '12,90 €', href: '/produits/mon-kit-ete', visual: 'pages colorées' },
  { title: 'Cartes émotions', price: '24,90 €', href: '/boutique', visual: 'cartes étalées' }
] as const;

export default function HomePage() {
  return (
    <main className="home-from-mockup">
      <style>{styles}</style>

      <header className="topbar">
        <Link href="/" className="logo-wrap" aria-label="Accueil Com’ entre nous">
          <span>Com’</span><span>entre</span><span>nous</span><b>♥</b>
        </Link>
        <nav className="main-nav" aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link href="/boutique" className="cart" aria-label="Panier"><b>2</b>🛒</Link>
      </header>

      <section className="hero">
        <span className="blob blob-left" />
        <span className="blob blob-right" />
        <span className="sun" aria-hidden="true" />
        <div className="hero-text">
          <h1>Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
          <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
          <div className="actions">
            <Link className="button primary" href="/par-ou-commencer">Découvrir nos univers <span>→</span></Link>
            <Link className="button secondary" href="/boutique">Voir les nouveautés</Link>
          </div>
        </div>
        <div className="hero-picture">
          <p className="hand-note">Des petits<br />outils pour<br />de grands<br />moments !</p>
          <div className="photo-area">
            <div className="photo-card light"><span>Photo mère + enfant<br />à remplacer</span></div>
            <div className="photo-card coral"><strong>Les mots<br />aujourd’hui<br />pour demain<br />♡</strong></div>
          </div>
          <div className="tabs"><span>Écouter</span><span>Comprendre</span><span>Ressentir</span><span>Partager</span><span>Avancer</span></div>
        </div>
      </section>

      <section className="universes" id="univers">
        <h2><span>Quel est ton univers ?</span></h2>
        <div className="universe-grid">
          {universes.map((item) => (
            <Link className={`universe-card ${item.tone}`} href={item.href} key={item.href}>
              <div className="universe-copy"><h3>{item.title}</h3><p>{item.text}</p><span>Découvrir →</span></div>
              <div className="universe-visual"><strong>{item.visual}</strong></div>
              <i>♡</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="values" aria-label="Nos valeurs">
        {values.map(([icon, line1, line2]) => <div key={line1}><span>{icon}</span><p>{line1}<br />{line2}</p></div>)}
      </section>

      <section className="new-products" id="nouveautes">
        <h2>Les nouveautés</h2>
        <div className="products-layout">
          <div className="product-grid">
            {products.map((product) => (
              <article className="product" key={product.title}>
                {'badge' in product && product.badge ? <span className="badge">{product.badge}</span> : null}
                <div className="product-img-wrap"><span>{product.visual}</span></div>
                <div className="product-bottom"><div><h3>{product.title}</h3><p>{product.price}</p></div><Link href={product.href}>🛒</Link></div>
              </article>
            ))}
          </div>
          <aside className="shop-callout"><strong>Ici,<br />on parle<br />vrai !</strong><p>Des idées<br />dans ta valise !</p><Link href="/boutique">Voir toute la boutique →</Link></aside>
        </div>
      </section>

      <section className="podcast-band">
        <div className="mic">🎙</div>
        <div className="podcast-text"><h2>Com’ entre nous<br />Le podcast</h2><p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p><Link className="button secondary" href="/podcast">Écouter le dernier épisode →</Link></div>
        <div className="podcast-photo"><span>Photo Marion + Aurélie<br />à remplacer</span></div>
        <div className="quote"><p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p><Link href="/podcast">Voir tous les épisodes →</Link></div>
      </section>

      <section className="newsletter"><div className="envelope">✉</div><div><h2>Reçois des idées, des ressources et des coulisses !</h2><p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p></div><form><input type="email" placeholder="Ton adresse email" aria-label="Ton adresse email" /><button type="button">Je m’inscris !</button></form></section>

      <footer className="footer"><div className="footer-brand"><span>Com’<br />entre<br />nous ♥</span><p>Des mots, des outils, des humains.</p></div><nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav><strong>Merci<br />d’être ici ! ♡</strong></footer>
    </main>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;600;700;800&family=Gaegu:wght@400;700&display=swap');
  :root{--cream:#fffaf1;--ink:#111827;--coral:#ff5d5d;--coral-soft:#ffc2bb;--mint:#d8f3ee;--teal:#008d8c;--lavender:#efdfff;--purple:#7b57c7;--yellow:#ffe879;--shadow:0 18px 40px rgba(35,23,14,.08);--round:'Comfortaa',ui-rounded,system-ui,sans-serif;--hand:'Gaegu','Comic Sans MS',cursive}body{margin:0;background:var(--cream)}.home-from-mockup{width:min(100%,1180px);margin:0 auto;min-height:100vh;padding:0 30px 42px;color:var(--ink);background:var(--cream);font-family:var(--round);position:relative;overflow:hidden}.topbar{height:118px;display:grid;grid-template-columns:132px 1fr 80px;align-items:center;gap:24px;position:relative;z-index:5}.logo-wrap{position:relative;width:104px;color:#070b12;font-family:var(--hand);font-weight:700;font-size:34px;line-height:.72;letter-spacing:-1px;text-decoration:none;transform:rotate(-3deg)}.logo-wrap span{display:block}.logo-wrap b{position:absolute;top:-12px;right:-14px;color:var(--coral);font-family:var(--round);font-size:21px;transform:rotate(14deg)}.main-nav{display:flex;align-items:center;justify-content:center;gap:clamp(18px,2.6vw,38px);white-space:nowrap}.main-nav a,.footer a{color:var(--ink);text-decoration:none;font-size:14px;font-weight:800}.cart{justify-self:end;color:var(--ink);text-decoration:none;font-size:29px;position:relative}.cart b{position:absolute;top:-13px;right:-12px;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:var(--coral);color:#fff;font:800 12px/1 var(--round)}.hero{position:relative;min-height:380px;display:grid;grid-template-columns:.94fr 1fr;gap:26px;align-items:center;padding:0 0 28px 48px}.hero-text{position:relative;z-index:2}.hero-text h1{margin:0;font-family:var(--hand);font-size:clamp(48px,5.4vw,68px);line-height:.9;font-weight:700;letter-spacing:-1.2px}.hero-text h1 em{position:relative;display:inline-block;font-style:normal;z-index:1}.hero-text h1 em:before{content:'';position:absolute;left:-6px;right:-20px;bottom:7px;height:.42em;border-radius:999px;background:var(--coral-soft);transform:rotate(-1.4deg);z-index:-1}.hero-text p{width:min(100%,500px);margin:24px 0 0;font-size:15px;line-height:1.55;font-weight:700}.actions{display:flex;gap:18px;flex-wrap:wrap;margin-top:24px}.button{min-height:48px;padding:0 26px;display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;text-decoration:none;font-weight:900;font-size:14px}.button.primary{background:var(--coral);color:#fff;box-shadow:0 14px 24px rgba(255,92,92,.22)}.button.secondary{background:rgba(255,255,255,.7);color:var(--ink);border:1.8px solid var(--ink)}.hero-picture{position:relative;min-height:360px}.hand-note{position:absolute;left:0;top:26px;margin:0;font-family:var(--hand);font-size:30px;line-height:.9;transform:rotate(-8deg);z-index:4}.photo-area{position:absolute;left:95px;right:62px;top:70px;height:270px;border-radius:135px 24px 24px 135px;background:#ffe2d7;box-shadow:var(--shadow);overflow:hidden}.photo-card{position:absolute;bottom:0;width:48%;height:78%;border-radius:120px 120px 0 0;display:grid;place-items:center;text-align:center}.photo-card.light{left:50px;background:rgba(255,255,255,.68)}.photo-card.coral{right:0;background:#ffaaa4}.photo-card span{padding:12px 14px;border-radius:15px;background:rgba(255,255,255,.7);font-size:13px;font-weight:800;color:rgba(17,24,39,.58)}.photo-card strong{font-family:var(--hand);font-size:28px;line-height:.95}.tabs{position:absolute;right:0;top:48px;display:grid;gap:10px;z-index:5}.tabs span{min-width:132px;padding:12px 19px;border-radius:10px;font-family:var(--hand);font-size:22px;font-weight:700;box-shadow:0 14px 26px rgba(35,22,18,.08);transform:rotate(-4deg)}.tabs span:nth-child(1){background:#ffd8b8}.tabs span:nth-child(2){background:#b8ebe6}.tabs span:nth-child(3){background:#ffd4d0}.tabs span:nth-child(4){background:#e8d4ff}.tabs span:nth-child(5){background:#fff0aa}.sun{position:absolute;left:18px;top:62px;width:42px;height:42px;border:5px solid #ffb000;border-radius:50%}.sun:before{content:'';position:absolute;inset:-20px;border-radius:inherit;background:repeating-conic-gradient(#ffb000 0 8deg,transparent 8deg 31deg);z-index:-1}.blob{position:absolute;pointer-events:none;opacity:.83}.blob-left{left:-58px;top:170px;width:95px;height:195px;background:#ffda76;border-radius:0 999px 999px 0}.blob-right{right:-42px;top:310px;width:110px;height:110px;background:#bfeee8;border-radius:999px 0 0 999px}.universes{padding:2px 0 18px}.universes h2,.new-products h2{margin:0 0 22px;text-align:center;font-family:var(--hand);font-size:clamp(38px,4.2vw,56px);line-height:.9;font-weight:700}.universes h2 span:before,.universes h2 span:after,.new-products h2:before,.new-products h2:after{content:'⌁';margin:0 14px}.universe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.universe-card{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 130px;gap:10px;min-height:246px;padding:30px 22px 22px 32px;border-radius:32px;color:var(--ink);text-decoration:none;overflow:hidden;box-shadow:var(--shadow)}.universe-card.family{background:linear-gradient(135deg,#ffe0db,#fff0ec)}.universe-card.business{background:linear-gradient(135deg,#d7f4ef,#eefcf8)}.universe-card.paper{background:linear-gradient(135deg,#ecdafe,#fff1ff)}.universe-card h3{margin:0 0 18px;font-family:var(--hand);font-size:clamp(36px,3.4vw,49px);line-height:.82;font-weight:700}.universe-card.family h3{color:var(--coral)}.universe-card.business h3{color:var(--teal)}.universe-card.paper h3{color:var(--purple)}.universe-card p{margin:0 0 18px;font-size:13.5px;line-height:1.55;font-weight:700;max-width:235px}.universe-copy span{display:inline-flex;align-items:center;min-height:39px;border:1.7px solid var(--ink);border-radius:999px;padding:0 18px;font-size:13px;font-weight:900;background:rgba(255,255,255,.42)}.universe-visual{align-self:end;justify-self:end;width:132px;height:150px;border-radius:24px;background:rgba(255,255,255,.55);display:grid;place-items:center;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5)}.universe-visual strong{font-size:62px}.universe-card i{position:absolute;right:44px;top:54px;font-family:var(--hand);color:var(--coral);font-style:normal;font-size:36px}.values{margin-top:10px;min-height:82px;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;border-radius:26px;background:rgba(255,255,255,.58);box-shadow:0 12px 30px rgba(35,23,14,.05)}.values div{display:grid;grid-template-columns:50px 1fr;align-items:center;gap:8px;padding:12px 22px;border-right:1px solid rgba(17,24,39,.12)}.values div:last-child{border-right:0}.values span{font-family:var(--hand);font-size:34px;text-align:center}.values p{margin:0;font-size:12px;line-height:1.32;font-weight:700}.new-products{padding:30px 0 24px}.products-layout{display:grid;grid-template-columns:1fr 205px;gap:26px;align-items:stretch}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}.product{position:relative;border-radius:18px;background:rgba(255,255,255,.74);padding:10px;box-shadow:0 12px 25px rgba(35,23,14,.07)}.badge{position:absolute;top:-12px;left:25px;z-index:2;background:#ffd866;border-radius:999px;padding:6px 13px;font-family:var(--hand);font-size:20px;transform:rotate(-7deg)}.product-img-wrap{height:138px;border-radius:13px;overflow:hidden;background:linear-gradient(135deg,#ffd8cd,#fff4ed);display:grid;place-items:center;text-align:center;font-family:var(--hand);font-size:25px;line-height:.9}.product-bottom{display:flex;justify-content:space-between;align-items:end;gap:12px;padding:10px 0 0 1px}.product-bottom h3{margin:0 0 4px;font-size:13px;line-height:1.2}.product-bottom p{margin:0;font-size:12.5px;font-weight:900}.product-bottom a{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:var(--coral);color:#fff;text-decoration:none}.shop-callout{display:grid;align-content:space-between;justify-items:center;text-align:center;padding:0 0 4px}.shop-callout strong{display:inline-grid;place-items:center;min-width:126px;min-height:92px;padding:8px 16px;background:#ffd679;border-radius:41% 59% 42% 58%;font-family:var(--hand);font-size:30px;line-height:.88;transform:rotate(-7deg)}.shop-callout p{font-family:var(--hand);font-size:28px;line-height:.95;margin:10px 0;transform:rotate(-8deg)}.shop-callout a{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:0 18px;border-radius:999px;background:rgba(255,255,255,.82);color:var(--ink);text-decoration:none;font-size:12px;font-weight:900}.podcast-band{margin-top:4px;min-height:220px;display:grid;grid-template-columns:90px minmax(280px,1fr) 315px 250px;gap:22px;align-items:center;border-radius:34px;padding:26px 34px;background:linear-gradient(135deg,#ffd7d1,#ffe8df);box-shadow:var(--shadow);overflow:hidden}.mic{width:70px;height:102px;border-radius:999px;background:#11aaa8;display:grid;place-items:center;font-size:42px}.podcast-text h2{margin:0 0 11px;font-family:var(--hand);font-size:41px;line-height:.88}.podcast-text p{margin:0 0 14px;font-size:13.5px;line-height:1.45;font-weight:700;max-width:470px}.podcast-photo{height:172px;border-radius:24px;background:rgba(255,255,255,.55);display:grid;place-items:center;text-align:center;font-weight:800;color:rgba(17,24,39,.58)}.quote{text-align:center;display:grid;justify-items:center;gap:18px}.quote p{margin:0;font-family:var(--hand);font-size:27px;line-height:.9;transform:rotate(-6deg)}.quote a{display:inline-flex;min-height:44px;padding:0 19px;align-items:center;border-radius:999px;background:rgba(255,255,255,.83);color:var(--ink);text-decoration:none;font-size:12px;font-weight:900}.newsletter{margin-top:26px;min-height:95px;display:grid;grid-template-columns:98px 1fr 415px;gap:22px;align-items:center;padding:14px 28px;border-radius:28px;background:linear-gradient(90deg,#d7f1ec,#caeee9);box-shadow:0 12px 26px rgba(28,64,58,.06)}.envelope{font-family:var(--hand);font-size:57px;transform:rotate(-9deg);text-align:center}.newsletter h2{margin:0 0 7px;font-family:var(--hand);font-size:28px;line-height:.9}.newsletter p{margin:0;font-size:12px;font-weight:700}.newsletter form{display:grid;grid-template-columns:1fr 150px;gap:12px}.newsletter input,.newsletter button{height:49px;border:0;border-radius:999px;font-family:var(--round);font-weight:800}.newsletter input{padding:0 22px;background:rgba(255,255,255,.92)}.newsletter button{background:var(--coral);color:#fff;cursor:pointer}.footer{min-height:140px;display:grid;grid-template-columns:180px 1fr 170px;gap:24px;align-items:center;padding-top:24px}.footer-brand span{font-family:var(--hand);font-size:24px;line-height:.75;display:block;transform:rotate(-3deg)}.footer-brand p{margin:6px 0 0;font-size:11px;font-weight:700}.footer nav{justify-self:center;display:flex;gap:20px}.footer strong{justify-self:end;font-family:var(--hand);font-size:26px;line-height:.9;transform:rotate(-7deg)}@media(max-width:1040px){.home-from-mockup{padding-inline:20px}.topbar{grid-template-columns:100px 1fr 60px;gap:12px}.main-nav{justify-content:flex-start;overflow-x:auto;padding-bottom:8px}.hero{grid-template-columns:1fr;padding-left:64px}.hero-picture{min-height:390px}.universe-grid,.product-grid{grid-template-columns:1fr}.products-layout{grid-template-columns:1fr}.podcast-band{grid-template-columns:80px 1fr}.podcast-photo,.quote{grid-column:1/-1}.newsletter{grid-template-columns:80px 1fr}.newsletter form{grid-column:1/-1}}@media(max-width:640px){.home-from-mockup{padding-inline:16px}.topbar{height:auto;min-height:92px;grid-template-columns:86px 1fr 45px}.main-nav{grid-column:1/-1;order:3}.hero{padding-left:0;min-height:0}.sun{left:2px;top:8px;width:32px;height:32px;border-width:4px}.hero-text{padding-top:45px}.hero-text h1{font-size:clamp(44px,15vw,62px)}.hero-text p{font-size:14px}.actions .button{width:100%}.blob-left{display:none}.photo-area{left:0;right:48px}.tabs{transform:scale(.78);transform-origin:right top}.universe-card{grid-template-columns:1fr;min-height:0}.values{grid-template-columns:1fr 1fr}.values div:nth-child(even){border-right:0}.product-img-wrap{height:160px}.podcast-band{grid-template-columns:1fr;padding:24px}.newsletter{grid-template-columns:1fr}.newsletter form{grid-template-columns:1fr}.footer{grid-template-columns:1fr;justify-items:center;text-align:center}.footer nav{flex-wrap:wrap;justify-content:center}.footer strong{justify-self:center}}
`;