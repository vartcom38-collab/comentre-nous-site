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
    title: 'Com’ en famille',
    text: 'Des jeux et des outils pour se parler, s’écouter et grandir ensemble.',
    href: '/com-en-famille',
    theme: 'family',
    sprite: 'family-img'
  },
  {
    title: 'Com’ des entrepreneuses',
    text: 'Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.',
    href: '/com-des-entrepreneuses',
    theme: 'business',
    sprite: 'business-img'
  },
  {
    title: 'Papeterie du lien',
    text: 'Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.',
    href: '/papeterie-du-lien',
    theme: 'paper',
    sprite: 'paper-img'
  }
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
    <main className="home-art">
      <style>{styles}</style>

      <header className="topbar">
        <Link href="/" className="logo" aria-label="Accueil Com’ entre nous"><Sprite name="logo-img" /></Link>
        <nav>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <div className="icons"><span>⌕</span><span>♡</span><Link href="/boutique"><b>2</b>🛒</Link></div>
      </header>

      <section className="hero">
        <span className="sun" />
        <span className="blob blob-left" />
        <span className="blob blob-right" />
        <div className="hero-text">
          <h1>Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
          <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
          <div className="actions"><Link className="btn red" href="/par-ou-commencer">Découvrir nos univers →</Link><Link className="btn outline" href="/boutique">Voir les nouveautés</Link></div>
        </div>
        <div className="hero-image-wrap">
          <p className="note note-one">Des petits<br />outils pour<br />de grands<br />moments !</p>
          <Sprite name="hero-img" />
          <div className="tabs"><span>Écouter</span><span>Comprendre</span><span>Ressentir</span><span>Partager</span><span>Avancer</span></div>
          <span className="stroke s1" /><span className="stroke s2" /><span className="heart h1">♡</span>
        </div>
      </section>

      <section className="universes">
        <h2><i />Quel est ton univers ?<i /></h2>
        <div className="universe-grid">
          {universes.map((item) => (
            <Link href={item.href} className={`universe ${item.theme}`} key={item.title}>
              <div className="u-copy"><h3>{item.title}</h3><p>{item.text}</p><span>Découvrir →</span></div>
              <Sprite name={item.sprite} />
              <b>♡</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="value-strip">
        <div><strong>♡</strong><p>Des créations<br />avec amour</p></div>
        <div><strong>♧</strong><p>Une approche bienveillante<br />et sans pression</p></div>
        <div><strong>☷</strong><p>Des outils pour la vraie vie</p></div>
        <div><strong>☆</strong><p>Une communauté qui inspire</p></div>
      </section>

      <section className="products">
        <h2><i />Les nouveautés<i /></h2>
        <div className="products-layout">
          <div className="product-grid">
            {products.map(([title, price, badge, href, sprite]) => (
              <article className="product" key={title}>
                {badge ? <span className="badge">{badge}</span> : null}
                <Link href={href} className="photo"><Sprite name={sprite} /></Link>
                <div className="meta"><div><h3>{title}</h3><p>{price}</p></div><Link href={href} className="bag">🛒</Link></div>
              </article>
            ))}
          </div>
          <aside className="shop-note"><p>Des idées<br />dans ta valise !</p><Link href="/boutique">Voir toute la boutique →</Link></aside>
        </div>
      </section>

      <section className="podcast">
        <div className="mic"><Sprite name="mic-img" /></div>
        <div className="pod-copy"><h2>Com’ entre nous<br />Le podcast</h2><p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p><Link className="btn outline" href="/podcast">Écouter le dernier épisode →</Link></div>
        <div className="pod-photo"><Sprite name="podcast-img" /></div>
        <div className="pod-quote"><p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p><Link href="/podcast">Voir tous les épisodes →</Link></div>
      </section>

      <section className="newsletter"><div className="mail">✉</div><div><h2>Reçois des idées, des ressources et des coulisses !</h2><p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p></div><form><input placeholder="Ton adresse email" /><button type="button">Je m’inscris !</button></form></section>

      <footer className="footer"><Link href="/" className="footer-logo"><Sprite name="logo-img" /></Link><p>Des mots, des outils, des humains.</p><nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav><strong>Merci<br />d’être ici ! ♡</strong></footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700;800&family=Patrick+Hand&display=swap');
:root{--cream:#fff8ef;--ink:#101827;--red:#ff5959;--pink:#ffc6bf;--mint:#ccefeb;--teal:#06999a;--lav:#ecd9ff;--purple:#8056c8;--yellow:#ffe98a;--peach:#ffe4da;--hand:'Patrick Hand','Comic Sans MS',cursive;--round:'Comfortaa',system-ui,sans-serif;--shadow:0 18px 42px rgba(54,37,21,.10)}
body{margin:0;background:var(--cream)}
.home-art{min-height:100vh;background:radial-gradient(circle at 0 29%,rgba(255,218,113,.9) 0 75px,transparent 76px),radial-gradient(circle at 100% 27%,rgba(196,239,232,.95) 0 74px,transparent 75px),linear-gradient(#fffaf4,#fff7ed);font-family:var(--round);color:var(--ink);overflow-x:hidden}.topbar,.hero,.universes,.value-strip,.products,.podcast,.newsletter,.footer{width:min(1180px,calc(100vw - 56px));margin-inline:auto}.topbar{height:96px;display:grid;grid-template-columns:118px 1fr 105px;align-items:center}.logo{display:block;width:82px}.topbar nav{display:flex;justify-content:center;gap:30px;white-space:nowrap}.topbar a{color:var(--ink);text-decoration:none;font-size:13px;font-weight:800}.icons{justify-self:end;display:flex;gap:16px;align-items:center;font-size:24px}.icons a{font-size:24px;position:relative}.icons b{position:absolute;right:-10px;top:-12px;background:var(--red);color:white;border-radius:50%;font:800 11px var(--round);width:21px;height:21px;display:grid;place-items:center}.sprite{display:block;background-image:url("${homeSprite}");background-repeat:no-repeat;background-size:624px 450px}.logo-img{width:76px;height:70px;background-position:0 0}.hero-img{width:430px;height:294px;background-position:-82px 0;filter:drop-shadow(0 18px 32px rgba(54,37,21,.12))}.family-img{width:100px;height:137px;background-position:-524px 0}.business-img{width:100px;height:146px;background-position:0 -170px}.paper-img{width:100px;height:122px;background-position:-112px -170px}.product1-img{width:130px;height:99px;background-position:-225px -170px}.product2-img{width:130px;height:94px;background-position:-365px -170px}.product3-img{width:130px;height:97px;background-position:-225px -280px}.product4-img{width:130px;height:97px;background-position:-365px -280px}.podcast-img{width:230px;height:138px;background-position:0 -312px}.mic-img{width:48px;height:81px;background-position:-524px -150px}.hero{position:relative;display:grid;grid-template-columns:515px 1fr;gap:38px;align-items:center;min-height:375px;padding:8px 0 8px}.hero-text{position:relative;z-index:2;padding-left:52px}.hero h1{font-family:var(--hand);font-size:56px;line-height:.9;font-weight:400;letter-spacing:-.5px;margin:0}.hero h1 em{font-style:normal;position:relative;display:inline-block;z-index:1}.hero h1 em:before{content:'';position:absolute;left:-8px;right:-18px;bottom:2px;height:.44em;background:var(--pink);border-radius:999px;z-index:-1;transform:rotate(-1deg)}.hero p{margin:23px 0 0;max-width:450px;font-size:14px;line-height:1.52;font-weight:700}.actions{display:flex;gap:16px;align-items:center;margin-top:24px}.btn{display:inline-flex;min-height:45px;padding:0 23px;border-radius:999px;align-items:center;justify-content:center;text-decoration:none;font-size:13px;font-weight:900}.btn.red{background:var(--red);color:white;box-shadow:0 14px 22px rgba(255,89,89,.2)}.btn.outline{border:1.8px solid var(--ink);color:var(--ink);background:rgba(255,255,255,.55)}.sun{position:absolute;left:0;top:75px;width:43px;height:43px;border:4px solid #ffad00;border-radius:50%;box-shadow:0 0 0 10px rgba(255,173,0,.09)}.sun:before{content:'';position:absolute;inset:-18px;background:repeating-conic-gradient(#ffad00 0 7deg,transparent 7deg 31deg);border-radius:50%;z-index:-1}.blob-left,.blob-right{position:absolute;pointer-events:none}.blob-left{left:-93px;top:190px;width:125px;height:180px;background:#ffdc78;border-radius:0 999px 999px 0}.blob-right{right:-82px;bottom:3px;width:124px;height:124px;background:var(--mint);border-radius:999px 0 0 999px}.hero-image-wrap{position:relative;height:330px}.hero-image-wrap .hero-img{position:absolute;left:62px;top:22px;transform:scale(1.05);transform-origin:top left}.note{font-family:var(--hand);font-size:25px;line-height:.9;margin:0;transform:rotate(-7deg)}.note-one{position:absolute;left:5px;top:24px;z-index:3}.tabs{position:absolute;right:0;top:45px;display:grid;gap:10px;z-index:5}.tabs span{font-family:var(--hand);font-size:20px;padding:9px 21px;border-radius:9px;box-shadow:0 12px 22px rgba(46,31,19,.08);transform:rotate(-4deg);background:#ffd7b8}.tabs span:nth-child(2){background:#bcece7}.tabs span:nth-child(3){background:#ffd4cf}.tabs span:nth-child(4){background:#ead7ff}.tabs span:nth-child(5){background:#fff1ac}.stroke{position:absolute;width:42px;height:4px;background:#0b111a;border-radius:99px}.s1{left:36px;top:210px;transform:rotate(42deg)}.s2{left:270px;top:57px;transform:rotate(90deg)}.heart{position:absolute;right:77px;bottom:42px;font-family:var(--hand);font-size:32px}.universes{padding-top:10px}.universes h2,.products h2{font-family:var(--hand);font-size:43px;line-height:.9;font-weight:400;text-align:center;margin:0 0 22px}.universes h2 i,.products h2 i{display:inline-block;width:26px;height:4px;background:var(--ink);border-radius:99px;margin:0 13px 8px;transform:rotate(24deg)}.universes h2 i:last-child,.products h2 i:last-child{transform:rotate(-24deg)}.universe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.universe{position:relative;min-height:205px;border-radius:30px;overflow:hidden;display:grid;grid-template-columns:1fr 130px;align-items:end;gap:10px;padding:28px 20px 22px 28px;color:var(--ink);text-decoration:none;box-shadow:0 14px 36px rgba(55,37,24,.07)}.family{background:linear-gradient(135deg,#ffe1dc,#fff2ed)}.business{background:linear-gradient(135deg,#d5f2ee,#f0fffb)}.paper{background:linear-gradient(135deg,#efddff,#fff2ff)}.universe h3{font-family:var(--hand);font-size:39px;line-height:.82;font-weight:400;margin:0 0 17px}.family h3{color:var(--red)}.business h3{color:var(--teal)}.paper h3{color:var(--purple)}.universe p{font-size:13px;line-height:1.45;font-weight:700;margin:0 0 15px;max-width:240px}.universe span{display:inline-flex;align-items:center;justify-content:center;border:1.6px solid var(--ink);border-radius:999px;height:38px;padding:0 16px;font-size:12px;font-weight:900;background:rgba(255,255,255,.38)}.universe>.sprite{align-self:end;justify-self:end;transform:scale(1.28);transform-origin:bottom right;filter:drop-shadow(0 10px 16px rgba(31,22,15,.08))}.universe b{position:absolute;right:130px;top:47px;font-family:var(--hand);font-size:30px;color:var(--red)}.value-strip{margin-top:18px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:24px;background:rgba(255,255,255,.55);box-shadow:0 13px 28px rgba(50,35,22,.05);overflow:hidden}.value-strip div{height:77px;display:grid;grid-template-columns:48px 1fr;align-items:center;padding:0 20px;border-right:1px solid rgba(16,24,39,.12)}.value-strip div:last-child{border-right:0}.value-strip strong{font-family:var(--hand);font-size:28px;text-align:center}.value-strip p{font-size:11px;line-height:1.35;font-weight:700;margin:0}.products{padding-top:27px}.products-layout{display:grid;grid-template-columns:1fr 190px;gap:25px;align-items:stretch}.product-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}.product{position:relative;background:rgba(255,255,255,.72);border-radius:20px;padding:11px;box-shadow:0 13px 28px rgba(50,35,22,.08)}.badge{position:absolute;left:16px;top:-11px;z-index:3;background:#ffd15e;border-radius:999px;padding:6px 13px;font-family:var(--hand);font-size:17px;transform:rotate(-8deg)}.photo{height:122px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#ffe0d8,#f3eee5);overflow:hidden}.photo .sprite{transform:scale(1.18);filter:drop-shadow(0 7px 10px rgba(33,22,15,.10))}.meta{display:flex;justify-content:space-between;align-items:end;gap:10px;padding-top:10px}.meta h3{margin:0 0 3px;font-size:12px}.meta p{margin:0;font-size:12px;font-weight:900}.bag{width:38px;height:38px;border-radius:12px;background:var(--red);display:grid;place-items:center;color:white;text-decoration:none}.shop-note{border-radius:24px;background:#fff0d5;display:grid;align-content:center;justify-items:center;text-align:center;padding:20px;gap:25px}.shop-note p{font-family:var(--hand);font-size:31px;line-height:.9;margin:0;transform:rotate(-4deg)}.shop-note a,.pod-quote a{background:white;color:var(--ink);text-decoration:none;border-radius:999px;padding:15px 22px;font-size:12px;font-weight:900}.podcast{margin-top:35px;background:linear-gradient(135deg,#ffd5ce,#ffe5dd);border-radius:32px;min-height:200px;padding:30px 34px;display:grid;grid-template-columns:70px 1fr 250px 235px;gap:25px;align-items:center;box-shadow:var(--shadow)}.mic{width:64px;height:85px;border-radius:999px;background:#16aaa7;display:grid;place-items:center}.pod-copy h2{font-family:var(--hand);font-size:38px;line-height:.9;font-weight:400;margin:0 0 12px}.pod-copy p{font-size:13px;line-height:1.45;font-weight:700;max-width:420px;margin:0 0 14px}.pod-photo{height:140px;display:grid;place-items:center;overflow:hidden;align-self:end}.pod-photo .sprite{transform:scale(1.18);filter:drop-shadow(0 12px 18px rgba(54,37,21,.10))}.pod-quote{display:grid;justify-items:center;gap:20px;text-align:center}.pod-quote p{font-family:var(--hand);font-size:26px;line-height:.92;margin:0;transform:rotate(-4deg)}.newsletter{margin-top:22px;border-radius:28px;background:linear-gradient(90deg,#dcf3ef,#c7eee8);display:grid;grid-template-columns:75px 1fr 390px;gap:22px;align-items:center;min-height:88px;padding:17px 28px}.mail{font-family:var(--hand);font-size:45px;transform:rotate(-8deg);text-align:center}.newsletter h2{font-family:var(--hand);font-size:27px;line-height:1;margin:0 0 6px;font-weight:400}.newsletter p{font-size:11px;font-weight:700;margin:0}.newsletter form{display:grid;grid-template-columns:1fr 145px;gap:13px}.newsletter input,.newsletter button{border:0;border-radius:999px;height:46px;font:800 12px var(--round)}.newsletter input{padding:0 20px;background:rgba(255,255,255,.9)}.newsletter button{background:var(--red);color:white}.footer{height:128px;display:grid;grid-template-columns:100px 1fr auto 140px;gap:20px;align-items:center}.footer-logo .logo-img{width:58px;height:55px;background-size:490px 353px}.footer p{font-size:10px;font-weight:700;margin:43px 0 0 -100px}.footer nav{display:flex;gap:18px;justify-self:center}.footer a{color:var(--ink);text-decoration:none;font-size:11px;font-weight:800}.footer strong{font-family:var(--hand);font-size:23px;line-height:.9;justify-self:end;transform:rotate(-5deg)}@media(max-width:1000px){.topbar,.hero,.universes,.value-strip,.products,.podcast,.newsletter,.footer{width:min(780px,calc(100vw - 30px))}.topbar{grid-template-columns:84px 1fr 70px}.topbar nav{justify-content:flex-start;overflow:auto;gap:20px}.hero{grid-template-columns:1fr;gap:5px}.hero-text{padding-left:48px}.hero-image-wrap{height:330px}.hero-image-wrap .hero-img{left:80px}.universe-grid,.product-grid{grid-template-columns:1fr}.products-layout{grid-template-columns:1fr}.podcast{grid-template-columns:70px 1fr}.pod-photo,.pod-quote{grid-column:1/-1}.newsletter{grid-template-columns:60px 1fr}.newsletter form{grid-column:1/-1}.value-strip{grid-template-columns:repeat(2,1fr)}.footer{grid-template-columns:1fr;justify-items:center;text-align:center;height:auto;padding:30px 0}.footer p{margin:-22px 0 0}.footer strong{justify-self:center}}@media(max-width:560px){.hero-text{padding-left:0}.hero h1{font-size:45px}.sun{display:none}.actions{flex-direction:column;align-items:stretch}.tabs{right:0;transform:scale(.8);transform-origin:top right}.hero-image-wrap .hero-img{left:0;transform:scale(.88)}.note-one{left:4px;top:0}.universe{grid-template-columns:1fr}.universe>.sprite{transform:scale(1.05)}.value-strip{grid-template-columns:1fr}.newsletter{grid-template-columns:1fr}.newsletter form{grid-template-columns:1fr}}
`;
