import Link from 'next/link';
import homeSprite from './homeSprite';

const nav = [
  ['Com’ en famille', '/com-en-famille'],
  ['Com’ des entrepreneuses', '/com-des-entrepreneuses'],
  ['Papeterie du lien', '/papeterie-du-lien'],
  ['Le podcast', '/podcast'],
  ['Les petits cadeaux', '/les-petits-cadeaux'],
  ['À propos', '/a-propos']
] as const;

const products: Array<{ title: string; price: string; href: string; visual: string; badge?: boolean }> = [
  { title: 'Les Petits Liens', price: '29,00 €', href: '/produits/les-petits-liens', visual: 'product-one', badge: true },
  { title: 'Mon carnet de clarté', price: '12,90 €', href: '/produits/mon-carnet-de-clarte', visual: 'product-two' },
  { title: 'Mon kit d’été', price: '12,90 €', href: '/produits/mon-kit-ete', visual: 'product-three' },
  { title: 'Cartes émotions', price: '24,90 €', href: '/boutique', visual: 'product-four' }
];

function Slice({ name }: { name: string }) {
  return <span className={`slice ${name}`} aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <main className="mockup-home">
      <style>{styles}</style>
      <div className="artboard">
        <header className="topbar">
          <Link href="/" className="logo" aria-label="Accueil Com’ entre nous"><Slice name="logo-mark" /></Link>
          <nav aria-label="Navigation principale">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <div className="icons" aria-label="Accès rapides">
            <Link href="/boutique" aria-label="Rechercher" className="icon search" />
            <Link href="/a-propos" aria-label="Compte" className="icon user" />
            <Link href="/boutique" aria-label="Panier" className="cart"><b>2</b><span>🛒</span></Link>
          </div>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <span className="sun" />
          <span className="blob blob-left" />
          <span className="blob blob-right" />
          <div className="hero-copy">
            <h1 id="hero-title">Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
            <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
            <div className="hero-actions">
              <Link href="/par-ou-commencer" className="button primary">Découvrir nos univers <span>→</span></Link>
              <Link href="/boutique" className="button secondary">Voir les nouveautés</Link>
            </div>
          </div>
          <Link href="/par-ou-commencer" className="hero-visual" aria-label="Découvrir les outils Com’ entre nous">
            <Slice name="hero-cluster" />
          </Link>
        </section>

        <section className="universes" id="univers">
          <h2><i />Quel est ton univers ?<i /></h2>
          <div className="universe-grid">
            <Link href="/com-en-famille" className="universe-card" aria-label="Découvrir Com’ en famille"><Slice name="universe-family" /></Link>
            <Link href="/com-des-entrepreneuses" className="universe-card" aria-label="Découvrir Com’ des entrepreneuses"><Slice name="universe-business" /></Link>
            <Link href="/papeterie-du-lien" className="universe-card" aria-label="Découvrir Papeterie du lien"><Slice name="universe-paper" /></Link>
          </div>
        </section>

        <section className="values" aria-label="Nos valeurs">
          <div><strong>♡</strong><p>Des créations<br />avec amour</p></div>
          <div><strong>♧</strong><p>Une approche bienveillante<br />et sans pression</p></div>
          <div><strong>☷</strong><p>Des outils pour la vraie vie</p></div>
          <div><strong>☆</strong><p>Une communauté qui inspire</p></div>
          <aside>Ici,<br />on parle<br />vrai !</aside>
        </section>

        <section className="new-products" id="nouveautes">
          <h2><i />Les nouveautés<i /></h2>
          <div className="products-row">
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.title}>
                  {product.badge ? <strong className="badge">Nouveau</strong> : null}
                  <Link href={product.href} className="product-image" aria-label={`Voir ${product.title}`}><Slice name={product.visual} /></Link>
                  <div className="product-info">
                    <div><h3>{product.title}</h3><p>{product.price}</p></div>
                    <Link href={product.href} className="bag" aria-label={`Ajouter ${product.title}`}>🛒</Link>
                  </div>
                </article>
              ))}
            </div>
            <aside className="shop-card"><p>Des idées<br />dans ta valise !</p><Link href="/boutique">Voir toute la boutique →</Link></aside>
          </div>
        </section>

        <section className="podcast-section">
          <Link href="/podcast" className="podcast-band" aria-label="Découvrir le podcast"><Slice name="podcast-band" /></Link>
        </section>

        <section className="newsletter-band" aria-label="Inscription à la newsletter">
          <Slice name="newsletter-visual" />
          <form>
            <label className="sr-only" htmlFor="email">Ton adresse email</label>
            <input id="email" type="email" placeholder="Ton adresse email" />
            <button type="button">Je m’inscris !</button>
          </form>
        </section>

        <footer className="footer">
          <Slice name="footer-visual" />
          <nav aria-label="Liens secondaires"><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav>
        </footer>
      </div>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700;800&family=Gaegu:wght@400;700&display=swap');
:root{--cream:#fffaf1;--ink:#111827;--red:#ff5b5b;--pink:#ffc5bd;--mint:#caeee8;--yellow:#ffdc72;--hand:'Gaegu','Comic Sans MS',cursive;--round:'Comfortaa',system-ui,sans-serif}*{box-sizing:border-box}body{margin:0;background:var(--cream)}.mockup-home{min-height:100vh;background:#fffaf1;color:var(--ink);font-family:var(--round);overflow-x:hidden}.artboard{position:relative;width:min(1024px,100vw);margin:0 auto;background:linear-gradient(#fffaf3,#fff8ef);overflow:hidden;box-shadow:0 0 0 1px rgba(15,20,28,.02)}.topbar{height:112px;position:relative}.topbar nav{position:absolute;left:188px;right:245px;top:37px;display:flex;align-items:center;justify-content:space-between;gap:18px;font-size:11px;font-weight:800;white-space:nowrap}.topbar a{text-decoration:none;color:inherit}.logo{position:absolute;left:44px;top:19px;display:block}.icons{position:absolute;right:45px;top:28px;display:flex;align-items:center;gap:21px}.icon{position:relative;width:24px;height:24px;display:block}.icon.search:before{content:'';position:absolute;width:15px;height:15px;border:2.5px solid var(--ink);border-radius:50%;left:1px;top:1px}.icon.search:after{content:'';position:absolute;width:9px;height:2.5px;background:var(--ink);border-radius:999px;transform:rotate(45deg);right:2px;bottom:3px}.icon.user:before{content:'';position:absolute;width:10px;height:10px;border:2.4px solid var(--ink);border-radius:50%;left:7px;top:1px}.icon.user:after{content:'';position:absolute;width:18px;height:10px;border:2.4px solid var(--ink);border-top:0;border-radius:0 0 16px 16px;left:3px;bottom:2px}.cart{position:relative;font-size:22px;line-height:1;transform:rotate(-4deg)}.cart b{position:absolute;right:-9px;top:-12px;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--red);color:white;font-size:11px;font-family:var(--round)}.slice{display:block;background-image:url("${homeSprite}");background-repeat:no-repeat;background-size:1000px 1235px}.logo-mark{width:95px;height:94px;background-position:0 0}.hero{position:relative;height:328px}.hero-copy{position:absolute;left:111px;top:13px;width:380px;z-index:3}.hero-copy h1{font-family:var(--hand);font-size:47px;line-height:.91;letter-spacing:-.4px;margin:0;font-weight:700}.hero-copy em{font-style:normal;position:relative;display:inline-block;z-index:1;white-space:nowrap}.hero-copy em:before{content:'';position:absolute;left:-7px;right:-13px;bottom:5px;height:.38em;border-radius:999px;background:var(--pink);z-index:-1;transform:rotate(-1deg)}.hero-copy p{font-size:12.2px;line-height:1.48;font-weight:700;margin:20px 0 0;max-width:350px}.hero-actions{display:flex;gap:16px;margin-top:20px}.button{height:40px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 22px;font-weight:800;font-size:12px;text-decoration:none}.primary{background:var(--red);color:white;box-shadow:0 12px 20px rgba(255,91,91,.18)}.secondary{border:1.8px solid var(--ink);color:var(--ink);background:rgba(255,255,255,.52)}.hero-visual{position:absolute;left:478px;top:-47px;width:510px;height:360px;overflow:hidden;display:block}.hero-cluster{width:600px;height:360px;background-position:-102px 0}.sun{position:absolute;left:47px;top:10px;width:38px;height:38px;border:4px solid #f6a800;border-radius:50%;box-shadow:0 0 0 10px rgba(246,168,0,.10);z-index:2}.sun:before{content:'';position:absolute;inset:-19px;border-radius:inherit;background:repeating-conic-gradient(#f6a800 0 8deg,transparent 8deg 31deg);z-index:-1}.blob{position:absolute;display:block;z-index:1;pointer-events:none}.blob-left{left:-36px;top:121px;width:90px;height:188px;background:var(--yellow);border-radius:0 999px 999px 0}.blob-right{right:-40px;top:202px;width:108px;height:108px;background:var(--mint);border-radius:999px 0 0 999px}.universes{position:relative;padding-top:0;height:314px}.universes h2{margin:0 0 14px;text-align:center;font-family:var(--hand);font-size:39px;line-height:.9;font-weight:700}.universes h2 i,.new-products h2 i{display:inline-block;width:29px;height:4px;border-radius:99px;background:var(--ink);margin:0 13px 9px;transform:rotate(25deg)}.universes h2 i:last-child,.new-products h2 i:last-child{transform:rotate(-25deg)}.universe-grid{display:grid;grid-template-columns:313px 313px 313px;gap:15px;justify-content:center}.universe-card{display:block;width:313px;height:248px;border-radius:30px;overflow:hidden;text-decoration:none;box-shadow:0 16px 34px rgba(42,29,20,.06);transition:.2s ease}.universe-card:hover{transform:translateY(-2px)}.universe-card .slice{width:333px;height:260px}.universe-family{background-position:0 -350px}.universe-business{background-position:-333px -350px}.universe-paper{background-position:-666px -350px}.values{position:relative;height:104px}.values:before{content:'';position:absolute;left:34px;top:9px;width:766px;height:84px;background:rgba(255,255,255,.66);border-radius:25px;box-shadow:0 14px 30px rgba(43,29,18,.05)}.values div{position:relative;z-index:2;float:left;width:191px;height:84px;margin-top:9px;display:grid;place-items:center;text-align:center;border-right:1px solid rgba(17,24,39,.12)}.values div:first-child{margin-left:34px}.values div:nth-child(4){border-right:0}.values strong{font-family:var(--hand);font-size:29px;line-height:1}.values p{margin:4px 0 0;font-size:10.5px;line-height:1.35;font-weight:700}.values aside{position:absolute;right:38px;top:5px;width:145px;height:92px;background:#ffd67c;border-radius:38px 42px 28px 34px;display:grid;place-items:center;text-align:center;font-family:var(--hand);font-size:31px;font-weight:700;line-height:.9;transform:rotate(-5deg)}.values aside:after{content:'♡';position:absolute;right:-18px;top:-6px;font-size:34px}.new-products{height:266px;padding-top:0}.new-products h2{margin:0 0 18px;text-align:center;font-family:var(--hand);font-size:39px;line-height:.9;font-weight:700}.products-row{display:grid;grid-template-columns:785px 154px;gap:22px;justify-content:center}.product-grid{display:grid;grid-template-columns:repeat(4,185px);gap:14px}.product-card{position:relative;height:205px;border-radius:16px;background:rgba(255,255,255,.86);box-shadow:0 15px 32px rgba(38,27,18,.07);padding:8px}.badge{position:absolute;left:18px;top:-14px;z-index:4;background:#ffd456;border-radius:999px;padding:7px 15px;font-family:var(--hand);font-size:18px;transform:rotate(-8deg)}.product-image{height:122px;border-radius:13px;display:block;overflow:hidden;background:#fff0eb}.product-image .slice{width:180px;height:122px}.product-one{background-position:0 -615px}.product-two{background-position:-190px -615px}.product-three{background-position:-386px -615px}.product-four{background-position:-570px -615px}.product-info{height:65px;display:flex;align-items:center;justify-content:space-between;gap:8px}.product-info h3{font-size:12px;line-height:1.18;margin:0 0 3px;font-weight:800}.product-info p{font-size:12px;line-height:1;margin:0;font-weight:800}.bag{width:34px;height:34px;border-radius:11px;background:var(--red);color:white;display:grid;place-items:center;text-decoration:none;font-size:16px}.shop-card{height:205px;border-radius:28px;background:#fff0d3;display:grid;align-content:center;justify-items:center;text-align:center;padding:18px}.shop-card p{margin:0 0 23px;font-family:var(--hand);font-size:31px;font-weight:700;line-height:.88}.shop-card a{min-height:46px;padding:0 19px;border-radius:999px;background:white;text-decoration:none;color:var(--ink);display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:800}.podcast-section{height:204px}.podcast-band{display:block;width:970px;height:191px;margin:0 auto;border-radius:30px;overflow:hidden}.podcast-band .slice{width:1000px;height:210px;background-position:0 -789px}.newsletter-band{position:relative;height:100px}.newsletter-visual{position:absolute;left:28px;top:9px;width:970px;height:90px;background-position:0 -988px;border-radius:26px;overflow:hidden}.newsletter-band form{position:absolute;right:103px;top:35px;display:flex;gap:13px;z-index:2}.newsletter-band input{width:174px;height:39px;border:0;border-radius:999px;background:white;padding:0 22px;font:700 11px var(--round);color:var(--ink);outline:none}.newsletter-band button{height:39px;border:0;border-radius:999px;background:var(--red);color:white;padding:0 29px;font:800 11px var(--round);cursor:pointer}.footer{position:relative;height:108px}.footer-visual{position:absolute;left:0;top:0;width:1000px;height:135px;background-position:0 -1100px}.footer nav{position:absolute;left:382px;top:49px;display:flex;gap:16px;align-items:center;font-size:9px;font-weight:700;z-index:3}.footer nav a{color:inherit;text-decoration:none}.footer nav a + a:before{content:'|';margin-right:16px;color:rgba(17,24,39,.55)}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}@media(max-width:820px){.artboard{width:100%;padding-bottom:30px}.topbar{height:auto;padding:22px 20px 10px;display:flex;align-items:flex-start;gap:16px}.logo,.icons,.topbar nav{position:static}.topbar nav{display:none}.icons{margin-left:auto}.hero{height:auto;padding:22px 20px 24px;display:grid;gap:18px}.hero-copy,.hero-visual{position:relative;left:auto;top:auto;width:100%;padding:0}.hero-copy h1{font-size:43px}.hero-copy p{font-size:13px}.hero-actions{flex-wrap:wrap}.hero-visual{height:260px;transform:scale(.82);transform-origin:left top}.sun,.blob{display:none}.universes{height:auto;padding:8px 20px}.universe-grid{grid-template-columns:1fr;gap:14px}.universe-card{width:100%;height:auto;aspect-ratio:313/248}.universe-card .slice{transform:scale(calc((100vw - 40px) / 313));transform-origin:left top}.values{height:auto;padding:10px 20px;display:grid;gap:8px}.values:before{display:none}.values div{float:none;width:auto;height:auto;margin:0!important;border:0;background:white;border-radius:18px;padding:14px}.values aside{display:none}.new-products{height:auto;padding:20px}.products-row{display:block}.product-grid{grid-template-columns:1fr 1fr}.shop-card{margin-top:14px}.podcast-section,.newsletter-band,.footer{height:auto;padding:12px 20px}.podcast-band,.newsletter-visual,.footer-visual{position:relative;left:auto;top:auto;display:block;width:100%;height:auto;aspect-ratio:970/191;background-size:970px auto}.newsletter-band form{position:relative;right:auto;top:auto;margin:12px 0 0;display:grid}.footer nav{position:relative;left:auto;top:auto;justify-content:center;margin-top:8px}.footer-visual{aspect-ratio:1000/135}}`;
