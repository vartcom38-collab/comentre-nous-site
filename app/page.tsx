import Link from 'next/link';
import homeSprite from './homeSprite';

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
    title: 'Com’ en\nfamille',
    text: 'Des jeux et des outils pour se parler, s’écouter et grandir ensemble.',
    href: '/com-en-famille',
    theme: 'family',
    sprite: 'family-img'
  },
  {
    title: 'Com’ des\nentrepreneuses',
    text: 'Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.',
    href: '/com-des-entrepreneuses',
    theme: 'business',
    sprite: 'business-img'
  },
  {
    title: 'Papeterie\ndu lien',
    text: 'Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.',
    href: '/papeterie-du-lien',
    theme: 'paper',
    sprite: 'paper-img'
  }
];

const values = [
  ['♡', 'Des créations\navec amour'],
  ['✦', 'Une approche bienveillante\net sans pression'],
  ['☷', 'Des outils pour la vraie vie'],
  ['☆', 'Une communauté qui inspire']
];

const products = [
  ['Les Petits Liens', '29,00 €', 'Nouveau', '/produits/les-petits-liens', 'product1-img'],
  ['Mon carnet de clarté', '12,90 €', '', '/produits/mon-carnet-de-clarte', 'product2-img'],
  ['Mon kit d’été', '12,90 €', '', '/produits/mon-kit-ete', 'product3-img'],
  ['Cartes émotions', '24,90 €', '', '/boutique', 'product4-img']
];

function Sprite({ name }: { name: string }) {
  return <span className={`sprite ${name}`} aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <main className="mock-home">
      <style>{styles}</style>

      <header className="topbar">
        <Link href="/" className="logo" aria-label="Accueil Com’ entre nous"><Sprite name="logo-img" /></Link>
        <nav aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link href="/boutique" className="cart" aria-label="Voir la boutique"><span>2</span>🛒</Link>
      </header>

      <section className="hero" id="accueil">
        <span className="sun" />
        <span className="blob blob-left" />
        <span className="blob blob-right" />

        <div className="hero-text">
          <h1>Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
          <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
          <div className="buttons">
            <Link className="btn red" href="/par-ou-commencer">Découvrir nos univers <span>→</span></Link>
            <Link className="btn white" href="/boutique">Voir les nouveautés</Link>
          </div>
        </div>

        <div className="hero-art">
          <Sprite name="hero-img" />
        </div>
      </section>

      <section className="universes" id="univers">
        <h2><span />Quel est ton univers ?<span /></h2>
        <div className="universe-grid">
          {universes.map((item) => (
            <Link key={item.href} href={item.href} className={`universe-card ${item.theme}`}>
              <div className="universe-copy">
                <h3>{item.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
                <p>{item.text}</p>
                <b>Découvrir →</b>
              </div>
              <div className="universe-visual"><Sprite name={item.sprite} /></div>
              <i>♡</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="values" aria-label="Nos valeurs">
        {values.map(([icon, label]) => (
          <div key={label}>
            <strong>{icon}</strong>
            <p>{label.split('\n').map((line) => <span key={line}>{line}</span>)}</p>
          </div>
        ))}
      </section>

      <section className="products" id="nouveautes">
        <h2><span />Les nouveautés<span /></h2>
        <div className="product-row">
          <div className="product-grid">
            {products.map(([title, price, badge, href, sprite]) => (
              <article className="product-card" key={title}>
                {badge ? <span className="badge">{badge}</span> : null}
                <Link href={href} className="product-img"><Sprite name={sprite} /></Link>
                <div className="product-meta">
                  <div><h3>{title}</h3><p>{price}</p></div>
                  <Link href={href} className="bag" aria-label={`Voir ${title}`}>🛒</Link>
                </div>
              </article>
            ))}
          </div>
          <aside className="shop-note">
            <p>Des idées<br />dans ta valise !</p>
            <Link href="/boutique">Voir toute la boutique →</Link>
          </aside>
        </div>
      </section>

      <section className="podcast">
        <div className="mic"><Sprite name="mic-img" /></div>
        <div className="pod-copy">
          <h2>Com’ entre nous<br />Le podcast</h2>
          <p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p>
          <Link className="btn white" href="/podcast">Écouter le dernier épisode →</Link>
        </div>
        <div className="pod-photo"><Sprite name="podcast-img" /></div>
        <div className="pod-quote"><p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p><Link href="/podcast">Voir tous les épisodes →</Link></div>
      </section>

      <section className="newsletter">
        <div className="mail">✉</div>
        <div><h2>Reçois des idées, des ressources et des coulisses !</h2><p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p></div>
        <form><input placeholder="Ton adresse email" aria-label="Ton adresse email" /><button type="button">Je m’inscris !</button></form>
      </section>

      <footer className="footer">
        <Link href="/" className="footer-logo"><Sprite name="logo-img" /></Link>
        <p>Des mots, des outils, des humains.</p>
        <nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
        <strong>Merci<br />d’être ici ! ♡</strong>
      </footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700;800&family=Patrick+Hand&display=swap');
:root{--cream:#fff7ec;--ink:#111827;--red:#ff5b5b;--pink:#ffc7c0;--mint:#ccefe9;--teal:#079c9d;--lav:#ead8ff;--purple:#7c57c3;--yellow:#ffe985;--peach:#ffe5db;--hand:'Patrick Hand','Comic Sans MS',cursive;--round:'Comfortaa',system-ui,sans-serif;--shadow:0 18px 44px rgba(50,35,22,.10)}
*{box-sizing:border-box}body{margin:0;background:var(--cream)}
.mock-home{min-height:100vh;background:radial-gradient(circle at 0 24%,rgba(255,218,111,.92) 0 66px,transparent 68px),radial-gradient(circle at 100% 28%,rgba(190,238,231,.88) 0 72px,transparent 74px),radial-gradient(circle at 88% 100%,rgba(255,222,133,.5) 0 74px,transparent 76px),linear-gradient(#fffaf2,var(--cream));color:var(--ink);font-family:var(--round);overflow:hidden}.topbar,.hero,.universes,.values,.products,.podcast,.newsletter,.footer{width:min(1160px,calc(100vw - 52px));margin-inline:auto}.topbar{height:92px;display:grid;grid-template-columns:94px 1fr 42px;align-items:center;gap:22px}.topbar nav{display:flex;justify-content:center;gap:clamp(17px,2.2vw,32px);white-space:nowrap}.topbar a{color:var(--ink);text-decoration:none;font-size:13.5px;font-weight:800}.cart{position:relative;font-size:25px;justify-self:end;transform:rotate(-5deg)}.cart span{position:absolute;right:-11px;top:-11px;width:23px;height:23px;border-radius:50%;background:var(--red);color:white;display:grid;place-items:center;font-size:12px;font-weight:800}.sprite{display:block;background-image:url("${homeSprite}");background-repeat:no-repeat;background-size:624px 450px}.logo-img{width:75px;height:70px;background-position:0 0}.hero-img{width:502px;height:375px;background-position:-82px 0;border-radius:30px;filter:drop-shadow(0 22px 36px rgba(48,30,18,.10))}.family-img{width:110px;height:138px;background-position:-524px 0}.business-img{width:110px;height:146px;background-position:0 -170px}.paper-img{width:124px;height:126px;background-position:-112px -170px}.product1-img{width:150px;height:104px;background-position:-225px -170px}.product2-img{width:150px;height:104px;background-position:-365px -170px}.product3-img{width:150px;height:104px;background-position:-225px -280px}.product4-img{width:150px;height:104px;background-position:-365px -280px}.podcast-img{width:230px;height:138px;background-position:0 -312px}.mic-img{width:48px;height:81px;background-position:-524px -150px}.hero{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 510px;gap:38px;align-items:center;min-height:440px;padding:20px 0 16px}.hero-text{position:relative;z-index:2;padding-left:92px}.hero-text h1{font-family:var(--hand);font-size:clamp(52px,5.1vw,72px);line-height:.95;letter-spacing:-.6px;margin:0;font-weight:400}.hero-text h1 em{font-style:normal;position:relative;display:inline-block;z-index:1}.hero-text h1 em:before{content:'';position:absolute;left:-8px;right:-17px;bottom:5px;height:.42em;background:var(--pink);border-radius:999px;z-index:-1;transform:rotate(-1.2deg)}.hero-text p{font-size:15.5px;line-height:1.6;font-weight:700;max-width:500px;margin:24px 0 0}.buttons{display:flex;gap:18px;align-items:center;margin-top:26px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 25px;border-radius:999px;text-decoration:none;font-weight:800;font-size:14px}.btn.red{background:var(--red);color:white;box-shadow:0 12px 22px rgba(255,91,91,.22)}.btn.white{border:2px solid var(--ink);color:var(--ink);background:rgba(255,255,255,.55)}.sun{position:absolute;left:54px;top:72px;width:42px;height:42px;border:4px solid #ffae00;border-radius:50%;box-shadow:0 0 0 11px rgba(255,174,0,.08)}.sun:before{content:'';position:absolute;inset:-18px;border-radius:50%;background:repeating-conic-gradient(#ffae00 0 8deg,transparent 8deg 31deg);z-index:-1}.blob{position:absolute;pointer-events:none}.blob-left{left:-68px;top:235px;width:135px;height:210px;border-radius:0 999px 999px 0;background:#ffdc79}.blob-right{right:-58px;bottom:32px;width:122px;height:122px;border-radius:999px 0 0 999px;background:var(--mint)}.hero-art{position:relative;z-index:1;display:flex;justify-content:flex-end;align-items:center}.hero-art .hero-img{transform:translate(10px,4px) scale(.98);transform-origin:center}.universes{padding:5px 0 26px}.universes h2,.products h2{font-family:var(--hand);font-size:clamp(42px,4.5vw,57px);font-weight:400;line-height:.95;text-align:center;margin:0 0 25px}.universes h2 span,.products h2 span{display:inline-block;width:26px;height:4px;border-radius:99px;background:var(--ink);margin:0 15px 10px;transform:rotate(25deg)}.universes h2 span:last-child,.products h2 span:last-child{transform:rotate(-25deg)}.universe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.universe-card{position:relative;min-height:225px;border-radius:28px;padding:28px 22px 20px 27px;display:grid;grid-template-columns:1fr 112px;align-items:end;gap:8px;text-decoration:none;color:var(--ink);overflow:hidden;box-shadow:0 16px 36px rgba(45,30,20,.07)}.universe-card.family{background:linear-gradient(135deg,#ffe0dc,#fff1ed)}.universe-card.business{background:linear-gradient(135deg,#cff1ed,#effbf8)}.universe-card.paper{background:linear-gradient(135deg,#ead8ff,#fff2ff)}.universe-card h3{font-family:var(--hand);font-size:41px;line-height:.82;font-weight:400;margin:0 0 15px}.universe-card h3 span{display:block}.family h3{color:var(--red)}.business h3{color:#04999a}.paper h3{color:var(--purple)}.universe-card p{font-size:13.5px;line-height:1.52;font-weight:700;margin:0 0 16px;max-width:220px}.universe-card b{display:inline-flex;align-items:center;min-height:37px;border:1.7px solid var(--ink);border-radius:999px;padding:0 17px;font-size:12px}.universe-card i{position:absolute;right:24px;top:34px;color:var(--red);font-family:var(--hand);font-style:normal;font-size:31px}.universe-visual{align-self:end;justify-self:end;display:flex;align-items:end;justify-content:end;filter:drop-shadow(0 10px 15px rgba(25,18,12,.05))}.values{margin-top:2px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:26px;background:rgba(255,255,255,.62);box-shadow:0 14px 30px rgba(33,22,15,.05);overflow:hidden}.values div{min-height:83px;display:grid;grid-template-columns:42px 1fr;gap:11px;align-items:center;padding:15px 20px;border-right:1px solid rgba(20,25,32,.12)}.values div:last-child{border-right:0}.values strong{font-family:var(--hand);font-size:29px;font-weight:400;text-align:center}.values p{margin:0;font-size:11.8px;line-height:1.3;font-weight:700}.values p span{display:block}.products{padding:28px 0 21px}.product-row{display:grid;grid-template-columns:1fr 184px;gap:24px;align-items:center}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.product-card{position:relative;padding:10px;border-radius:16px;background:rgba(255,255,255,.72);box-shadow:0 12px 24px rgba(25,20,14,.07)}.badge{position:absolute;top:-11px;left:23px;z-index:3;background:#ffd45f;border-radius:999px;padding:6px 13px;font-family:var(--hand);font-size:18px;transform:rotate(-7deg)}.product-img{height:118px;border-radius:12px;background:#fff5ed;display:grid;place-items:center;overflow:hidden}.product-img .sprite{transform:scale(1.04)}.product-meta{display:flex;justify-content:space-between;align-items:end;gap:9px;padding:10px 0 1px}.product-meta h3{font-size:12.6px;line-height:1.18;margin:0 0 4px}.product-meta p{font-size:12.5px;font-weight:800;margin:0}.bag{width:36px;height:36px;border-radius:11px;background:var(--red);color:white;text-decoration:none;display:grid;place-items:center;font-size:18px}.shop-note{display:grid;gap:25px;text-align:center;justify-items:center}.shop-note p{font-family:var(--hand);font-size:29px;line-height:.94;margin:0;transform:rotate(-7deg);position:relative}.shop-note p:before{content:'';position:absolute;z-index:-1;left:50%;top:6px;width:115px;height:65px;translate:-50% 0;border-radius:28% 72% 37% 63%;background:rgba(255,203,96,.75);transform:rotate(5deg)}.shop-note a,.pod-quote a{min-height:42px;border-radius:999px;background:rgba(255,255,255,.82);box-shadow:0 10px 20px rgba(0,0,0,.05);color:var(--ink);text-decoration:none;display:inline-flex;align-items:center;padding:0 18px;font-size:11.5px;font-weight:800}.podcast{margin-top:16px;min-height:205px;border-radius:30px;background:linear-gradient(135deg,#ffd5ce,#ffe6de);box-shadow:var(--shadow);display:grid;grid-template-columns:70px 1fr 250px 235px;gap:20px;align-items:center;padding:27px 32px;overflow:hidden}.mic{display:flex;justify-content:center}.pod-copy h2{font-family:var(--hand);font-size:38px;line-height:.88;font-weight:400;margin:0 0 10px}.pod-copy p{font-size:13.4px;line-height:1.42;font-weight:700;max-width:390px;margin:0 0 13px}.pod-copy .btn{min-height:42px;font-size:12.5px;padding-inline:20px}.pod-photo{display:flex;align-self:end;justify-content:center;align-items:end;height:158px;overflow:hidden}.pod-photo .sprite{transform:scale(1.08);transform-origin:bottom center}.pod-quote{display:grid;gap:16px;justify-items:center;text-align:center}.pod-quote p{font-family:var(--hand);font-size:26px;line-height:.95;margin:0;transform:rotate(-6deg)}.newsletter{margin-top:24px;min-height:92px;border-radius:27px;background:linear-gradient(90deg,#d8f1ec,#c8eee8);box-shadow:0 14px 30px rgba(20,45,38,.06);display:grid;grid-template-columns:72px 1fr 410px;gap:18px;align-items:center;padding:16px 24px}.mail{font-family:var(--hand);font-size:46px;text-align:center;transform:rotate(-9deg)}.newsletter h2{font-family:var(--hand);font-weight:400;font-size:26px;line-height:1;margin:0 0 5px}.newsletter p{font-size:11.7px;font-weight:700;margin:0}.newsletter form{display:grid;grid-template-columns:1fr 142px;gap:12px}.newsletter input,.newsletter button{height:48px;border:0;border-radius:999px;font-family:var(--round);font-weight:800}.newsletter input{padding:0 20px;background:rgba(255,255,255,.92)}.newsletter button{background:var(--red);color:white;cursor:pointer}.footer{min-height:135px;display:grid;grid-template-columns:95px 1fr auto 125px;gap:20px;align-items:center;padding:22px 0 35px}.footer-logo .logo-img{transform:scale(.72);transform-origin:left center}.footer p{font-size:10.8px;font-weight:700;margin:46px 0 0 -42px}.footer nav{display:flex;gap:18px;justify-self:center}.footer a{color:var(--ink);text-decoration:none;font-size:11.5px;font-weight:700}.footer strong{font-family:var(--hand);font-weight:400;font-size:24px;line-height:.94;justify-self:end;transform:rotate(-7deg)}
@media(max-width:960px){.topbar,.hero,.universes,.values,.products,.podcast,.newsletter,.footer{width:min(760px,calc(100vw - 32px))}.topbar{grid-template-columns:82px 1fr 36px}.topbar nav{justify-content:flex-start;overflow:auto;padding-bottom:5px}.hero{grid-template-columns:1fr;gap:16px}.hero-text{padding-left:58px}.hero-art{justify-content:center}.universe-grid,.product-grid{grid-template-columns:1fr}.product-row,.newsletter{grid-template-columns:1fr}.values{grid-template-columns:repeat(2,1fr)}.podcast{grid-template-columns:58px 1fr}.pod-photo,.pod-quote{grid-column:1/-1}.footer{grid-template-columns:1fr;justify-items:center;text-align:center}.footer p{margin:-20px 0 0}.footer strong{justify-self:center}}
@media(max-width:560px){.topbar{height:auto;min-height:88px}.topbar nav{font-size:12px}.hero-text{padding-left:0;padding-top:38px}.sun{left:6px;top:26px}.blob-left{display:none}.hero-text h1{font-size:47px}.buttons{display:grid}.btn{width:100%}.hero-img{transform:scale(.72)!important}.hero-art{min-height:285px}.universe-card{grid-template-columns:1fr 105px}.values{grid-template-columns:1fr}.values div{border-right:0;border-bottom:1px solid rgba(20,25,32,.10)}.podcast{grid-template-columns:1fr;text-align:center}.newsletter form{grid-template-columns:1fr}.footer nav{flex-wrap:wrap;justify-content:center}}
`;