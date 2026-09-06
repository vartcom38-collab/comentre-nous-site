import Link from 'next/link';

const nav = [
  ['Com’ en famille', '/com-en-famille'],
  ['Com’ des entrepreneuses', '/com-des-entrepreneuses'],
  ['Papeterie du lien', '/papeterie-du-lien'],
  ['Le podcast', '/podcast'],
  ['Les petits cadeaux', '/les-petits-cadeaux'],
  ['À propos', '/a-propos']
];

const universes = [
  {
    title: 'Com’ en famille',
    kicker: 'Parents · enfants · émotions',
    text: 'Des jeux, cartes et rituels pour ouvrir la discussion sans pression.',
    href: '/com-en-famille',
    theme: 'family'
  },
  {
    title: 'Com’ des entrepreneuses',
    kicker: 'Idées · visibilité · clarté',
    text: 'Des supports pour poser tes mots, clarifier tes offres et oser te montrer.',
    href: '/com-des-entrepreneuses',
    theme: 'business'
  },
  {
    title: 'Papeterie du lien',
    kicker: 'Carnets · kits · imprimables',
    text: 'Des objets doux, utiles et beaux pour mettre du lien dans le quotidien.',
    href: '/papeterie-du-lien',
    theme: 'paper'
  }
];

const products = [
  ['Les Petits Liens', '29,00 €', 'Jeu de cartes famille', '/produits/les-petits-liens', 'Nouveau'],
  ['Mon carnet de clarté', '12,90 €', 'Carnet guidé', '/produits/mon-carnet-de-clarte', ''],
  ['Mon kit d’été', '12,90 €', 'Activités à imprimer', '/produits/mon-kit-ete', ''],
  ['Cartes émotions', '24,90 €', 'Outil du quotidien', '/boutique', '']
];

export default function HomePage() {
  return (
    <main className="home-clean">
      <style>{styles}</style>

      <header className="site-header">
        <Link href="/" className="brand" aria-label="Accueil Com’ entre nous">
          <span>Com’</span><span>entre</span><span>nous</span><b>♥</b>
        </Link>
        <nav aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link href="/boutique" className="cart" aria-label="Boutique"><small>2</small>Panier</Link>
      </header>

      <section className="hero-clean">
        <div className="hero-text">
          <p className="eyebrow">Des outils doux, vrais, et un peu magiques.</p>
          <h1>Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
          <p className="intro">Pour parler plus simplement de ce qui compte : les émotions, les idées, les petits chaos du quotidien et les grands moments de vie.</p>
          <div className="actions">
            <Link href="/par-ou-commencer" className="btn primary">Découvrir nos univers <span>→</span></Link>
            <Link href="/boutique" className="btn ghost">Voir les nouveautés</Link>
          </div>
        </div>

        <div className="hero-board" aria-label="Visuel principal">
          <div className="note note-one">Écouter<br />vraiment</div>
          <div className="note note-two">Trouver<br />les mots</div>
          <div className="photo-card main-photo">
            <span>Photo mère + enfant<br />à ajouter</span>
          </div>
          <div className="photo-card small-photo">
            <span>Cartes · carnets<br />moments vrais</span>
          </div>
          <p className="handline">Les mots d’aujourd’hui<br />pour demain ♡</p>
        </div>
      </section>

      <section className="choose">
        <div className="section-title">
          <span></span>
          <h2>Quel est ton univers ?</h2>
          <span></span>
        </div>
        <div className="universe-grid">
          {universes.map((item) => (
            <Link href={item.href} className={`universe ${item.theme}`} key={item.href}>
              <p>{item.kicker}</p>
              <h3>{item.title}</h3>
              <b>{item.text}</b>
              <small>Découvrir →</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="promise-strip">
        <div><strong>♡</strong><span>Des créations avec amour</span></div>
        <div><strong>✦</strong><span>Une approche bienveillante</span></div>
        <div><strong>☷</strong><span>Des outils pour la vraie vie</span></div>
        <div><strong>☆</strong><span>Une communauté qui inspire</span></div>
      </section>

      <section className="shop-preview">
        <div className="section-title products-title">
          <span></span>
          <h2>Les nouveautés</h2>
          <span></span>
        </div>
        <div className="product-layout">
          <div className="product-grid">
            {products.map(([title, price, type, href, badge], index) => (
              <article className="product" key={title}>
                {badge ? <em>{badge}</em> : null}
                <Link href={href} className={`product-visual product-${index + 1}`} aria-label={`Voir ${title}`}>
                  <span>{type}</span>
                </Link>
                <div className="product-info">
                  <div><h3>{title}</h3><p>{price}</p></div>
                  <Link href={href}>→</Link>
                </div>
              </article>
            ))}
          </div>
          <aside className="shop-card">
            <p>Des idées<br />dans ta valise !</p>
            <Link href="/boutique">Voir toute la boutique →</Link>
          </aside>
        </div>
      </section>

      <section className="podcast-band">
        <div className="mic">🎙</div>
        <div>
          <p className="eyebrow">Com’ entre nous · le podcast</p>
          <h2>Des conversations vraies, imparfaites, et tellement nous.</h2>
          <p>Parentalité, émotions, entrepreneuriat, coulisses, cafés froids et mots qui font du bien.</p>
          <Link href="/podcast" className="btn ghost">Écouter le dernier épisode →</Link>
        </div>
        <div className="podcast-photo"><span>Photo Marion + Aurélie<br />à ajouter</span></div>
      </section>

      <section className="newsletter">
        <div className="mail">✉</div>
        <div>
          <h2>Reçois des idées, des ressources et des coulisses.</h2>
          <p>Une dose de lien, de vrai, et de petits outils à tester dans la vraie vie.</p>
        </div>
        <form>
          <input aria-label="Ton adresse email" placeholder="Ton adresse email" />
          <button type="button">Je m’inscris !</button>
        </form>
      </section>

      <footer className="footer-clean">
        <Link href="/" className="footer-brand">Com’<br />entre<br />nous <b>♥</b></Link>
        <p>Des mots, des outils, des humains.</p>
        <nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
        <strong>Merci<br />d’être ici ♡</strong>
      </footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;600;700;800&family=Patrick+Hand&display=swap');
:root{--cream:#fff7ec;--cream2:#fffaf3;--ink:#101827;--red:#ff5d5b;--rose:#ffd8d2;--rose2:#fff0ed;--mint:#d5f2ee;--teal:#049898;--lav:#eadcff;--purple:#7c5cc6;--yellow:#ffe58a;--peach:#ffe2cf;--shadow:0 22px 60px rgba(42,31,23,.10);--round:'Comfortaa',system-ui,sans-serif;--hand:'Patrick Hand','Comic Sans MS',cursive}body{margin:0;background:var(--cream);}.home-clean{font-family:var(--round);color:var(--ink);background:radial-gradient(circle at -20px 230px,#ffdf87 0 96px,transparent 98px),radial-gradient(circle at calc(100% + 10px) 420px,#caeee8 0 110px,transparent 112px),linear-gradient(180deg,var(--cream2),var(--cream));min-height:100vh;overflow:hidden}.site-header,.hero-clean,.choose,.promise-strip,.shop-preview,.podcast-band,.newsletter,.footer-clean{width:min(1240px,calc(100vw - 56px));margin-inline:auto}.site-header{height:104px;display:grid;grid-template-columns:110px 1fr 92px;align-items:center;gap:20px}.brand,.footer-brand{position:relative;color:#070b12;text-decoration:none;font-family:var(--hand);font-size:34px;line-height:.72;font-weight:400;letter-spacing:-1px;transform:rotate(-2deg);width:82px;display:block}.brand span{display:block}.brand b,.footer-brand b{position:absolute;right:-15px;top:-13px;color:var(--red);font-family:var(--round);font-size:19px;transform:rotate(15deg)}.site-header nav{display:flex;justify-content:center;gap:clamp(17px,2.4vw,34px);white-space:nowrap}.site-header nav a,.footer-clean a{font-size:14px;font-weight:800;text-decoration:none;color:var(--ink)}.cart{justify-self:end;position:relative;border:1.5px solid rgba(16,24,39,.18);border-radius:999px;padding:11px 17px;color:var(--ink);text-decoration:none;font-size:13px;font-weight:800;background:rgba(255,255,255,.58)}.cart small{position:absolute;top:-12px;right:-10px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:var(--red);color:white;font-size:12px}.hero-clean{display:grid;grid-template-columns:1.02fr .98fr;align-items:center;gap:58px;min-height:560px;padding:18px 0 38px}.hero-text{max-width:650px}.eyebrow{margin:0 0 18px;font-size:13px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:rgba(16,24,39,.62)}.hero-text h1{font-family:var(--hand);font-size:clamp(64px,6vw,98px);line-height:.88;font-weight:400;letter-spacing:-1.8px;margin:0}.hero-text h1 em{position:relative;font-style:normal;display:inline-block;z-index:1}.hero-text h1 em:before{content:'';position:absolute;left:-10px;right:-18px;bottom:7px;height:.45em;background:#ffaaa5;border-radius:999px 70% 999px 80%;z-index:-1;opacity:.9;transform:rotate(-1.2deg)}.intro{max-width:560px;margin:28px 0 0;font-size:18px;line-height:1.62;font-weight:700}.actions{display:flex;gap:18px;flex-wrap:wrap;margin-top:30px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 26px;border-radius:999px;text-decoration:none;font-weight:900}.primary{background:var(--red);color:white;box-shadow:0 16px 28px rgba(255,93,91,.23)}.ghost{background:rgba(255,255,255,.62);border:2px solid var(--ink);color:var(--ink)}.hero-board{position:relative;min-height:430px;border-radius:42px;background:linear-gradient(135deg,rgba(255,255,255,.56),rgba(255,224,212,.68));box-shadow:var(--shadow);overflow:hidden}.hero-board:before{content:'';position:absolute;inset:auto -40px -70px 110px;height:360px;background:linear-gradient(135deg,#fff7ef,#ffb2a7);border-radius:180px 180px 0 0;opacity:.82}.hero-board:after{content:'';position:absolute;right:-70px;top:-60px;width:260px;height:260px;border-radius:50%;background:#ffcac2;filter:blur(4px);opacity:.42}.photo-card{position:absolute;border-radius:28px;background:rgba(255,255,255,.75);box-shadow:0 20px 40px rgba(41,30,21,.11);display:grid;place-items:center;text-align:center;font-size:13px;font-weight:900;color:rgba(16,24,39,.48);border:1px solid rgba(255,255,255,.72);overflow:hidden}.photo-card:before{content:'';position:absolute;inset:18px;border-radius:22px;background:linear-gradient(135deg,#ffe8dd,#fff8f0 48%,#d7f0ec);opacity:.9}.photo-card span{position:relative}.main-photo{left:70px;top:70px;width:330px;height:280px;transform:rotate(-1.5deg)}.small-photo{right:52px;bottom:54px;width:210px;height:170px;transform:rotate(3deg)}.note{position:absolute;z-index:4;border-radius:14px;padding:13px 20px;font-family:var(--hand);font-size:26px;line-height:.9;box-shadow:0 14px 24px rgba(32,24,18,.09)}.note-one{right:42px;top:48px;background:#ffd4b6;transform:rotate(-4deg)}.note-two{left:34px;bottom:50px;background:#c7eee8;transform:rotate(4deg)}.handline{position:absolute;z-index:5;left:230px;top:162px;margin:0;font-family:var(--hand);font-size:35px;line-height:.95;text-align:center;transform:rotate(-3deg)}.section-title{display:flex;align-items:center;justify-content:center;gap:18px;margin:0 0 28px}.section-title span{width:34px;height:4px;border-radius:99px;background:var(--ink);transform:rotate(25deg)}.section-title span:last-child{transform:rotate(-25deg)}.section-title h2{font-family:var(--hand);font-size:56px;line-height:.9;font-weight:400;margin:0}.choose{padding:10px 0 30px}.universe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.universe{min-height:258px;border-radius:34px;padding:32px 30px;display:flex;flex-direction:column;justify-content:space-between;color:var(--ink);text-decoration:none;box-shadow:0 18px 38px rgba(41,30,20,.07);position:relative;overflow:hidden}.universe:after{content:'♡';position:absolute;right:30px;top:26px;font-family:var(--hand);font-size:42px;color:var(--red);transform:rotate(10deg)}.universe.family{background:linear-gradient(135deg,#ffe1db,#fff1ec)}.universe.business{background:linear-gradient(135deg,#d6f3ef,#f2fffb)}.universe.paper{background:linear-gradient(135deg,#eadcff,#fff5fb)}.universe p{margin:0;font-size:12px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:rgba(16,24,39,.54)}.universe h3{font-family:var(--hand);font-size:52px;line-height:.86;font-weight:400;margin:16px 0 18px;max-width:310px}.family h3{color:var(--red)}.business h3{color:var(--teal)}.paper h3{color:var(--purple)}.universe b{max-width:290px;font-size:15px;line-height:1.52}.universe small{margin-top:22px;width:max-content;min-height:42px;padding:0 19px;border:2px solid var(--ink);border-radius:999px;display:inline-flex;align-items:center;font-weight:900;background:rgba(255,255,255,.45)}.promise-strip{margin-top:8px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:30px;background:rgba(255,255,255,.58);box-shadow:0 14px 34px rgba(31,22,15,.05);overflow:hidden}.promise-strip div{min-height:92px;padding:18px 22px;display:grid;grid-template-columns:44px 1fr;align-items:center;border-right:1px solid rgba(16,24,39,.10)}.promise-strip div:last-child{border-right:0}.promise-strip strong{font-family:var(--hand);font-size:32px;text-align:center}.promise-strip span{font-size:13px;font-weight:800;line-height:1.35}.shop-preview{padding:38px 0 28px}.products-title{margin-bottom:22px}.product-layout{display:grid;grid-template-columns:1fr 210px;gap:28px;align-items:center}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.product{position:relative;border-radius:22px;background:rgba(255,255,255,.72);box-shadow:0 16px 32px rgba(40,28,18,.08);padding:12px}.product em{position:absolute;left:22px;top:-13px;background:#ffd45f;border-radius:999px;padding:7px 13px;font-family:var(--hand);font-size:20px;font-style:normal;z-index:3;transform:rotate(-7deg)}.product-visual{height:146px;border-radius:16px;background:linear-gradient(135deg,#ffe0d6,#fff8ed);display:grid;place-items:center;text-decoration:none;color:rgba(16,24,39,.50);font-size:12px;font-weight:900;text-align:center;position:relative;overflow:hidden}.product-visual:before{content:'';position:absolute;width:72%;height:64%;border-radius:16px;background:rgba(255,255,255,.58);box-shadow:0 12px 22px rgba(37,27,18,.08);transform:rotate(-3deg)}.product-visual span{position:relative;z-index:1}.product-2{background:linear-gradient(135deg,#efe0c9,#fff3df)}.product-3{background:linear-gradient(135deg,#fff0a6,#d6f1eb)}.product-4{background:linear-gradient(135deg,#ffd5d1,#dfefe9)}.product-info{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;padding:13px 3px 2px}.product h3{font-size:14px;line-height:1.2;margin:0 0 6px}.product p{font-size:13px;font-weight:900;margin:0}.product-info a{width:38px;height:38px;border-radius:12px;background:var(--red);color:white;text-decoration:none;display:grid;place-items:center;font-weight:900}.shop-card{min-height:210px;border-radius:28px;background:#fff2dd;display:grid;align-content:center;justify-items:center;text-align:center;padding:22px;box-shadow:0 16px 34px rgba(43,30,20,.06)}.shop-card p{font-family:var(--hand);font-size:34px;line-height:.9;margin:0 0 24px;transform:rotate(-5deg)}.shop-card a{color:var(--ink);font-size:13px;font-weight:900;text-decoration:none;background:white;border-radius:999px;padding:14px 18px}.podcast-band{margin-top:16px;border-radius:34px;background:linear-gradient(135deg,#ffd7d0,#ffece5);box-shadow:var(--shadow);display:grid;grid-template-columns:80px 1fr 310px;gap:26px;align-items:center;padding:34px 42px}.mic{width:66px;height:86px;border-radius:999px;background:#16aaa8;display:grid;place-items:center;font-size:37px}.podcast-band h2{font-family:var(--hand);font-size:45px;line-height:.95;font-weight:400;margin:0 0 10px}.podcast-band p:not(.eyebrow){font-size:15px;line-height:1.55;font-weight:700;margin:0 0 16px;max-width:580px}.podcast-photo{height:190px;border-radius:28px;background:linear-gradient(135deg,rgba(255,255,255,.78),rgba(255,145,130,.30));box-shadow:inset 0 0 0 1px rgba(255,255,255,.75);display:grid;place-items:center;text-align:center;color:rgba(16,24,39,.48);font-size:13px;font-weight:900}.newsletter{margin-top:28px;border-radius:30px;background:linear-gradient(90deg,#d8f1ec,#c9eee8);display:grid;grid-template-columns:72px 1fr 460px;align-items:center;gap:22px;padding:22px 28px}.mail{font-family:var(--hand);font-size:48px;text-align:center;transform:rotate(-8deg)}.newsletter h2{font-family:var(--hand);font-size:31px;line-height:1;font-weight:400;margin:0 0 8px}.newsletter p{font-size:13px;line-height:1.4;font-weight:800;margin:0}.newsletter form{display:grid;grid-template-columns:1fr 160px;gap:12px}.newsletter input,.newsletter button{height:52px;border:0;border-radius:999px;font-family:var(--round);font-weight:800}.newsletter input{padding:0 22px;background:rgba(255,255,255,.9)}.newsletter button{background:var(--red);color:white}.footer-clean{min-height:155px;display:grid;grid-template-columns:105px 1fr auto 140px;gap:24px;align-items:center;padding:28px 0 44px}.footer-brand{font-size:27px}.footer-clean p{font-size:12px;font-weight:800;margin:42px 0 0 -98px}.footer-clean nav{display:flex;gap:20px;font-size:12px;justify-self:center}.footer-clean strong{justify-self:end;font-family:var(--hand);font-size:27px;line-height:.92;font-weight:400;transform:rotate(-6deg)}@media(max-width:1050px){.site-header,.hero-clean,.choose,.promise-strip,.shop-preview,.podcast-band,.newsletter,.footer-clean{width:min(840px,calc(100vw - 36px))}.site-header{grid-template-columns:86px 1fr 68px}.site-header nav{justify-content:flex-start;overflow-x:auto;padding-bottom:8px}.hero-clean{grid-template-columns:1fr;gap:24px}.hero-board{min-height:380px}.universe-grid,.product-grid{grid-template-columns:1fr}.promise-strip{grid-template-columns:repeat(2,1fr)}.product-layout{grid-template-columns:1fr}.podcast-band{grid-template-columns:70px 1fr}.podcast-photo{grid-column:1/-1}.newsletter{grid-template-columns:60px 1fr}.newsletter form{grid-column:1/-1}.footer-clean{grid-template-columns:1fr;text-align:center;justify-items:center}.footer-clean p{margin:-14px 0 0}.footer-clean strong{justify-self:center}}@media(max-width:620px){.home-clean{background:linear-gradient(180deg,var(--cream2),var(--cream))}.site-header{height:auto;padding:20px 0;grid-template-columns:78px 1fr}.cart{grid-column:2;justify-self:end}.site-header nav{grid-column:1/-1}.brand{font-size:28px}.hero-clean{min-height:auto;padding:22px 0 30px}.hero-text h1{font-size:54px}.intro{font-size:15px}.btn{width:100%}.hero-board{min-height:330px;border-radius:30px}.main-photo{left:24px;top:70px;width:240px;height:220px}.small-photo{right:18px;bottom:28px;width:160px;height:130px}.handline{left:110px;top:150px;font-size:27px}.note{font-size:21px}.note-one{right:20px;top:26px}.note-two{left:18px;bottom:26px}.section-title h2{font-size:43px}.universe h3{font-size:43px}.promise-strip{grid-template-columns:1fr}.promise-strip div{border-right:0;border-bottom:1px solid rgba(16,24,39,.10)}.podcast-band{grid-template-columns:1fr;padding:28px}.newsletter{grid-template-columns:1fr}.newsletter form{grid-template-columns:1fr}.footer-clean nav{flex-wrap:wrap;justify-content:center}}
`;
