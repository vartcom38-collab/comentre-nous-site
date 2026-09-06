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
    <main className="home-page">
      <style>{styles}</style>

      <header className="home-header">
        <Link href="/" className="logo-link" aria-label="Accueil Com’ entre nous">
          <Sprite name="logo-img" />
        </Link>
        <nav aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link href="/boutique" className="cart-link" aria-label="Voir la boutique"><span>2</span>🛒</Link>
      </header>

      <section className="hero">
        <span className="edge-blob left" />
        <span className="edge-blob right" />
        <span className="sun" />

        <div className="hero-copy">
          <h1>Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
          <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
          <div className="hero-actions">
            <Link className="primary" href="/par-ou-commencer">Découvrir nos univers <span>→</span></Link>
            <Link className="secondary" href="/boutique">Voir les nouveautés</Link>
          </div>
        </div>

        <div className="hero-visual">
          <p className="hand-note">Des petits<br />outils pour<br />de grands<br />moments !</p>
          <Sprite name="hero-img" />
          <div className="tabs">
            <span>Écouter</span><span>Comprendre</span><span>Ressentir</span><span>Partager</span><span>Avancer</span>
          </div>
          <i className="line one" /><i className="line two" /><i className="heart">♡</i>
        </div>
      </section>

      <section className="universes" id="univers">
        <h2><span />Quel est ton univers ?<span /></h2>
        <div className="universe-grid">
          {universes.map((item) => (
            <Link key={item.href} href={item.href} className={`universe-card ${item.theme}`}>
              <div className="universe-text">
                <h3>{item.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
                <p>{item.text}</p>
                <b>Découvrir →</b>
              </div>
              <Sprite name={item.sprite} />
              <i>♡</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="values">
        {values.map(([icon, label]) => (
          <div key={label}>
            <strong>{icon}</strong>
            <p>{label.split('\n').map((line) => <span key={line}>{line}</span>)}</p>
          </div>
        ))}
      </section>

      <section className="products" id="nouveautes">
        <h2>Les nouveautés</h2>
        <div className="product-wrap">
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
        <div className="podcast-copy">
          <h2>Com’ entre nous<br />Le podcast</h2>
          <p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p>
          <Link className="secondary" href="/podcast">Écouter le dernier épisode →</Link>
        </div>
        <Sprite name="podcast-img" />
        <div className="quote"><p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p><Link href="/podcast">Voir tous les épisodes →</Link></div>
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
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700&family=Patrick+Hand&display=swap');
:root{--cream:#fff7ec;--ink:#111827;--red:#ff5b5b;--pink:#ffc7c0;--mint:#ccefe9;--teal:#079c9d;--lav:#ead8ff;--purple:#7c57c3;--yellow:#ffe985;--peach:#ffe5db;--hand:'Patrick Hand','Comic Sans MS',cursive;--round:'Comfortaa',system-ui,sans-serif;--shadow:0 18px 48px rgba(50,35,22,.10)}
body{margin:0;background:var(--cream)}
.home-page{min-height:100vh;background:radial-gradient(circle at 0 25%,rgba(255,218,111,.9) 0 72px,transparent 73px),radial-gradient(circle at 100% 29%,rgba(190,238,231,.9) 0 82px,transparent 83px),linear-gradient(#fffaf2,var(--cream));color:var(--ink);font-family:var(--round);overflow:hidden}.home-header,.hero,.universes,.values,.products,.podcast,.newsletter,.footer{width:min(1420px,calc(100vw - 70px));margin-inline:auto}.home-header{height:112px;display:grid;grid-template-columns:120px 1fr 60px;align-items:center;gap:28px}.home-header nav{display:flex;justify-content:center;gap:clamp(18px,2.5vw,42px);white-space:nowrap}.home-header a{color:var(--ink);text-decoration:none;font-weight:700}.cart-link{position:relative;font-size:28px;justify-self:end}.cart-link span{position:absolute;top:-12px;right:-12px;background:var(--red);color:white;border-radius:999px;font-size:13px;width:25px;height:25px;display:grid;place-items:center}.sprite{display:block;background-image:url("${homeSprite}");background-repeat:no-repeat;background-size:624px 450px}.logo-img{width:75px;height:70px;background-position:0 0;filter:contrast(1.03)}.hero-img{width:430px;height:294px;background-position:-82px 0;border-radius:34px;filter:drop-shadow(0 24px 42px rgba(54,31,17,.11))}.family-img{width:100px;height:137px;background-position:-524px 0}.business-img{width:100px;height:146px;background-position:0 -170px}.paper-img{width:100px;height:122px;background-position:-112px -170px}.product1-img{width:130px;height:99px;background-position:-225px -170px}.product2-img{width:130px;height:94px;background-position:-365px -170px}.product3-img{width:130px;height:97px;background-position:-225px -280px}.product4-img{width:130px;height:97px;background-position:-365px -280px}.podcast-img{width:230px;height:138px;background-position:0 -312px}.mic-img{width:48px;height:81px;background-position:-524px -150px}.hero{position:relative;min-height:510px;display:grid;grid-template-columns:1fr 590px;align-items:center;gap:50px;padding:18px 0 22px}.hero-copy{position:relative;padding-left:110px;z-index:2}.hero-copy h1{font-family:var(--hand);font-size:clamp(60px,5.7vw,92px);line-height:.92;letter-spacing:-1px;margin:0;font-weight:400}.hero-copy h1 em{font-style:normal;position:relative;display:inline-block;z-index:1}.hero-copy h1 em:before{content:'';position:absolute;left:-10px;right:-20px;bottom:5px;height:.43em;background:var(--pink);border-radius:999px;z-index:-1;transform:rotate(-1deg)}.hero-copy p{font-size:18px;line-height:1.55;font-weight:700;max-width:610px;margin:30px 0 0}.hero-actions{display:flex;gap:22px;align-items:center;margin-top:31px}.primary,.secondary,.universe-card b,.shop-note a,.quote a{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 28px;border-radius:999px;text-decoration:none;font-weight:700}.primary{background:var(--red);color:white;box-shadow:0 14px 24px rgba(255,91,91,.22)}.secondary{border:2px solid var(--ink);color:var(--ink);background:rgba(255,255,255,.55)}.sun{position:absolute;left:64px;top:76px;width:50px;height:50px;border:5px solid #ffae00;border-radius:50%;box-shadow:0 0 0 13px rgba(255,174,0,.08)}.sun:before{content:'';position:absolute;inset:-21px;border-radius:50%;background:repeating-conic-gradient(#ffae00 0 8deg,transparent 8deg 30deg);z-index:-1}.edge-blob{position:absolute;pointer-events:none}.edge-blob.left{left:-74px;top:250px;width:155px;height:225px;border-radius:0 999px 999px 0;background:#ffdc79}.edge-blob.right{right:-62px;bottom:42px;width:142px;height:142px;border-radius:999px 0 0 999px;background:var(--mint)}.hero-visual{position:relative;min-height:400px}.hero-visual .hero-img{position:absolute;right:105px;top:68px;transform:scale(1.15);transform-origin:top right}.hand-note{position:absolute;left:0;top:36px;margin:0;font-family:var(--hand);font-size:32px;line-height:.92;transform:rotate(-6deg);z-index:3}.hand-note:after{content:'♡';display:block;margin:8px 0 0 72px}.tabs{position:absolute;right:0;top:48px;display:grid;gap:12px;z-index:4}.tabs span{font-family:var(--hand);font-size:24px;padding:11px 26px;border-radius:10px;box-shadow:0 10px 22px rgba(32,24,18,.08);transform:rotate(-4deg);background:#ffd8b9}.tabs span:nth-child(2){background:#bdeee8;transform:rotate(-3deg)}.tabs span:nth-child(3){background:#ffd5d0}.tabs span:nth-child(4){background:#ead6ff}.tabs span:nth-child(5){background:#fff0ad}.line{position:absolute;width:46px;height:5px;background:#0b1018;border-radius:99px}.line.one{left:92px;top:235px;transform:rotate(42deg)}.line.two{left:245px;top:82px;transform:rotate(95deg)}.heart{position:absolute;right:92px;bottom:70px;font-family:var(--hand);font-size:36px;font-style:normal}.universes{padding:16px 0 26px}.universes h2,.products h2{font-family:var(--hand);font-size:58px;line-height:.9;text-align:center;font-weight:400;margin:0 0 30px}.universes h2 span{display:inline-block;width:34px;height:4px;background:#0c1118;border-radius:99px;margin:0 18px 10px;transform:rotate(25deg)}.universes h2 span:last-child{transform:rotate(-25deg)}.universe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.universe-card{position:relative;min-height:260px;border-radius:34px;padding:36px 25px 24px 34px;display:grid;grid-template-columns:1fr 120px;align-items:end;gap:10px;color:var(--ink);text-decoration:none;box-shadow:0 16px 38px rgba(45,30,20,.07);overflow:hidden}.universe-card.family{background:linear-gradient(135deg,#ffe0dc,#fff1ed)}.universe-card.business{background:linear-gradient(135deg,#d6f4ef,#f0fffb)}.universe-card.paper{background:linear-gradient(135deg,#ecdfff,#fff3ff)}.universe-card h3{font-family:var(--hand);font-size:51px;line-height:.82;font-weight:400;margin:0 0 19px}.universe-card h3 span{display:block}.family h3{color:var(--red)}.business h3{color:var(--teal)}.paper h3{color:var(--purple)}.universe-card p{font-size:15px;line-height:1.5;font-weight:700;margin:0 0 18px;max-width:285px}.universe-card b{min-height:42px;padding:0 20px;border:2px solid var(--ink);font-size:13px;background:rgba(255,255,255,.38)}.universe-card .sprite{justify-self:end;align-self:end;transform:scale(1.22);transform-origin:bottom right;filter:drop-shadow(0 12px 15px rgba(37,24,18,.10))}.universe-card>i{position:absolute;right:38px;top:48px;font-family:var(--hand);font-size:40px;font-style:normal;color:var(--red)}.values{display:grid;grid-template-columns:repeat(4,1fr);margin-top:12px;border-radius:28px;background:rgba(255,255,255,.62);box-shadow:0 14px 30px rgba(40,27,17,.05);overflow:hidden}.values div{display:grid;grid-template-columns:48px 1fr;align-items:center;gap:12px;min-height:95px;padding:12px 26px;border-right:1px solid rgba(18,24,33,.12)}.values div:last-child{border-right:0}.values strong{font-family:var(--hand);font-size:35px;text-align:center}.values p{margin:0;font-size:13px;font-weight:700;line-height:1.35}.values p span{display:block}.products{padding:38px 0 26px}.product-wrap{display:grid;grid-template-columns:1fr 220px;gap:30px;align-items:center}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.product-card{position:relative;padding:12px;border-radius:18px;background:rgba(255,255,255,.72);box-shadow:0 12px 26px rgba(36,24,15,.07)}.badge{position:absolute;top:-12px;left:28px;z-index:2;background:#ffd45b;border-radius:999px;padding:7px 15px;font-family:var(--hand);font-size:19px;transform:rotate(-7deg)}.product-img{height:145px;border-radius:14px;display:grid;place-items:center;overflow:hidden;background:#fff4ee}.product-img .sprite{transform:scale(1.2)}.product-meta{display:flex;align-items:end;justify-content:space-between;gap:12px;padding:12px 0 0}.product-meta h3{font-size:15px;line-height:1.18;margin:0 0 5px}.product-meta p{margin:0;font-size:14px;font-weight:700}.bag{width:42px;height:42px;border-radius:13px;background:var(--red);display:grid;place-items:center;text-decoration:none;color:white}.shop-note{text-align:center;display:grid;justify-items:center;gap:30px}.shop-note p{font-family:var(--hand);font-size:33px;line-height:.92;margin:0;transform:rotate(-7deg)}.shop-note p:before{content:'';display:block;width:132px;height:80px;background:#ffd06f;border-radius:30% 70% 40% 60%;margin:0 auto -62px;opacity:.7}.shop-note a,.quote a{background:rgba(255,255,255,.75);color:var(--ink);min-height:46px;padding:0 20px;font-size:13px;box-shadow:0 10px 20px rgba(20,15,10,.05)}.podcast{min-height:242px;display:grid;grid-template-columns:76px 1fr 270px 305px;align-items:center;gap:28px;margin-top:18px;padding:32px 42px;border-radius:34px;background:linear-gradient(135deg,#ffd8d1,#ffe8df);box-shadow:var(--shadow);box-sizing:border-box}.mic{display:grid;place-items:center}.podcast-copy h2{font-family:var(--hand);font-size:45px;line-height:.86;font-weight:400;margin:0 0 12px}.podcast-copy p{max-width:490px;font-size:15px;line-height:1.45;font-weight:700;margin:0 0 16px}.podcast .podcast-img{transform:scale(1.18);transform-origin:center;filter:drop-shadow(0 12px 18px rgba(30,18,12,.10))}.quote{display:grid;justify-items:center;text-align:center;gap:18px}.quote p{font-family:var(--hand);font-size:30px;line-height:.92;margin:0;transform:rotate(-5deg)}.newsletter{display:grid;grid-template-columns:88px 1fr 520px;gap:24px;align-items:center;min-height:105px;margin-top:28px;padding:18px 28px;border-radius:30px;background:linear-gradient(90deg,#d8f1ec,#c7eee8);box-shadow:0 14px 32px rgba(20,45,38,.06);box-sizing:border-box}.mail{font-family:var(--hand);font-size:52px;transform:rotate(-8deg);text-align:center}.newsletter h2{font-family:var(--hand);font-size:30px;font-weight:400;line-height:1;margin:0 0 7px}.newsletter p{font-size:13px;font-weight:700;margin:0}.newsletter form{display:grid;grid-template-columns:1fr 170px;gap:14px}.newsletter input,.newsletter button{height:54px;border:0;border-radius:999px;font-family:var(--round);font-weight:700}.newsletter input{padding:0 24px;background:rgba(255,255,255,.92)}.newsletter button{background:var(--red);color:white}.footer{min-height:155px;display:grid;grid-template-columns:110px 1fr auto 140px;align-items:center;gap:25px;padding:26px 0 44px}.footer-logo .logo-img{transform:scale(.7);transform-origin:left center}.footer p{margin-left:-30px;font-size:12px;font-weight:700}.footer nav{display:flex;gap:22px;justify-self:center}.footer nav a{color:var(--ink);text-decoration:none;font-size:13px;font-weight:700}.footer strong{font-family:var(--hand);font-size:27px;line-height:.9;font-weight:400;text-align:center;transform:rotate(-6deg)}
@media(max-width:1120px){.home-header,.hero,.universes,.values,.products,.podcast,.newsletter,.footer{width:min(820px,calc(100vw - 36px))}.home-header{grid-template-columns:90px 1fr 48px}.home-header nav{justify-content:flex-start;overflow:auto;padding-bottom:8px}.hero{grid-template-columns:1fr;gap:18px}.hero-copy{padding-left:75px}.hero-visual{min-height:360px}.hero-visual .hero-img{left:90px;right:auto;transform:scale(.92)}.tabs{right:20px}.universe-grid,.product-grid{grid-template-columns:1fr}.values{grid-template-columns:repeat(2,1fr)}.product-wrap{grid-template-columns:1fr}.podcast{grid-template-columns:72px 1fr}.podcast-img,.quote{grid-column:1/-1}.newsletter{grid-template-columns:70px 1fr}.newsletter form{grid-column:1/-1}.footer{grid-template-columns:1fr;justify-items:center;text-align:center}.footer p{margin:-26px 0 0}}@media(max-width:640px){.home-header{height:96px;grid-template-columns:70px 1fr 42px}.home-header nav{font-size:13px;gap:16px}.logo-img{transform:scale(.82);transform-origin:left center}.hero-copy{padding:38px 0 0}.hero-copy h1{font-size:54px}.hero-copy p{font-size:15px}.hero-actions{display:grid}.sun{left:8px;top:28px;width:36px;height:36px;border-width:4px}.edge-blob.left{display:none}.hero-visual .hero-img{left:0;top:78px;transform:scale(.78);transform-origin:left top}.tabs{right:-8px;top:86px;transform:scale(.74);transform-origin:right top}.hand-note{font-size:24px;left:8px;top:12px}.universes h2,.products h2{font-size:43px}.universe-card{grid-template-columns:1fr;min-height:330px}.universe-card .sprite{transform:scale(1.06)}.values{grid-template-columns:1fr}.values div{border-right:0;border-bottom:1px solid rgba(18,24,33,.1)}.podcast{grid-template-columns:1fr;padding:25px}.newsletter{grid-template-columns:1fr}.newsletter form{grid-template-columns:1fr}}
`;
