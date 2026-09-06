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

const products = [
  { title: 'Les Petits Liens', price: '29,00 €', href: '/produits/les-petits-liens', shot: 'shot-product1', badge: 'Nouveau' },
  { title: 'Mon carnet de clarté', price: '12,90 €', href: '/produits/mon-carnet-de-clarte', shot: 'shot-product2' },
  { title: 'Mon kit d’été', price: '12,90 €', href: '/produits/mon-kit-ete', shot: 'shot-product3' },
  { title: 'Cartes émotions', price: '24,90 €', href: '/boutique', shot: 'shot-product4' }
] as const;

function Shot({ name, label }: { name: string; label?: string }) {
  return <span className={`shot ${name}`} role={label ? 'img' : undefined} aria-label={label} />;
}

export default function HomePage() {
  return (
    <main className="home-mockup-coded">
      <style>{styles}</style>

      <header className="topbar">
        <Link href="/" className="logo" aria-label="Accueil Com’ entre nous"><Shot name="shot-logo" label="Com’ entre nous" /></Link>
        <nav aria-label="Navigation principale">
          {nav.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
        </nav>
        <Link href="/boutique" className="cart" aria-label="Voir la boutique"><b>2</b>🛒</Link>
      </header>

      <section className="hero">
        <span className="side-yellow" />
        <span className="side-mint" />
        <span className="sun" />
        <div className="hero-copy">
          <h1>Des mots,<br />des cartes et des carnets<br />pour <em>créer du lien.</em></h1>
          <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
          <div className="actions">
            <Link href="/par-ou-commencer" className="btn primary">Découvrir nos univers <span>→</span></Link>
            <Link href="/boutique" className="btn secondary">Voir les nouveautés</Link>
          </div>
        </div>
        <Link href="/par-ou-commencer" className="hero-shot" aria-label="Découvrir nos univers"><Shot name="shot-hero" /></Link>
      </section>

      <section className="universes" id="univers">
        <h2><i />Quel est ton univers ?<i /></h2>
        <div className="universe-grid">
          <Link href="/com-en-famille" className="universe-card family">
            <div><h3>Com’ en<br />famille</h3><p>Des jeux et des outils pour se parler, s’écouter et grandir ensemble.</p><b>Découvrir →</b></div><Shot name="shot-family" /><span>♡</span>
          </Link>
          <Link href="/com-des-entrepreneuses" className="universe-card business">
            <div><h3>Com’ des<br />entrepreneuses</h3><p>Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.</p><b>Découvrir →</b></div><Shot name="shot-business" /><span>♡</span>
          </Link>
          <Link href="/papeterie-du-lien" className="universe-card paper">
            <div><h3>Papeterie<br />du lien</h3><p>Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.</p><b>Découvrir →</b></div><Shot name="shot-paper" /><span>♡</span>
          </Link>
        </div>
      </section>

      <section className="values" aria-label="Nos valeurs">
        <div><strong>♡</strong><p>Des créations<br />avec amour</p></div>
        <div><strong>♧</strong><p>Une approche bienveillante<br />et sans pression</p></div>
        <div><strong>☷</strong><p>Des outils pour la vraie vie</p></div>
        <div><strong>☆</strong><p>Une communauté qui inspire</p></div>
      </section>

      <section className="new-products" id="nouveautes">
        <h2><i />Les nouveautés<i /></h2>
        <div className="products-layout">
          <div className="product-grid">
            {products.map((product) => (
              <article className="product" key={product.title}>
                {'badge' in product && product.badge ? <strong className="badge">{product.badge}</strong> : null}
                <Link href={product.href} className="product-shot"><Shot name={product.shot} /></Link>
                <div className="product-bottom"><div><h3>{product.title}</h3><p>{product.price}</p></div><Link href={product.href} className="bag">🛒</Link></div>
              </article>
            ))}
          </div>
          <aside className="shop-note"><p>Des idées<br />dans ta valise !</p><Link href="/boutique">Voir toute la boutique →</Link></aside>
        </div>
      </section>

      <section className="podcast">
        <Shot name="shot-mic" />
        <div className="podcast-copy"><h2>Com’ entre nous<br />Le podcast</h2><p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p><Link href="/podcast" className="btn secondary">Écouter le dernier épisode →</Link></div>
        <Shot name="shot-podcast" />
        <div className="quote"><p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p><Link href="/podcast">Voir tous les épisodes →</Link></div>
      </section>

      <section className="newsletter"><div className="letter">✉</div><div><h2>Reçois des idées, des ressources et des coulisses !</h2><p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p></div><form><input type="email" placeholder="Ton adresse email" aria-label="Ton adresse email" /><button type="button">Je m’inscris !</button></form></section>
      <footer className="footer"><div><Shot name="shot-logo" /><p>Des mots, des outils, des humains.</p></div><nav><Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></nav><strong>Merci<br />d’être ici ! ♡</strong></footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700;800&family=Gaegu:wght@400;700&display=swap');
:root{--cream:#fffaf1;--ink:#111827;--coral:#ff5d5d;--pink:#ffc5bd;--mint:#d4f1ec;--teal:#06999a;--lav:#ead8ff;--purple:#8059c8;--yellow:#ffe384;--hand:'Gaegu','Comic Sans MS',cursive;--round:'Comfortaa',system-ui,sans-serif}body{margin:0;background:var(--cream)}.home-mockup-coded{min-height:100vh;background:radial-gradient(circle at 0 25%,rgba(255,219,118,.95) 0 64px,transparent 65px),radial-gradient(circle at 100% 31%,rgba(198,239,232,.9) 0 72px,transparent 73px),linear-gradient(#fffaf2,#fff7ef);color:var(--ink);font-family:var(--round);overflow-x:hidden}.topbar,.hero,.universes,.values,.new-products,.podcast,.newsletter,.footer{width:min(1024px,calc(100vw - 36px));margin-inline:auto}.topbar{height:104px;display:grid;grid-template-columns:120px 1fr 54px;align-items:center;gap:18px}.topbar nav{display:flex;justify-content:center;align-items:center;gap:28px;font-size:12px;font-weight:800;white-space:nowrap}.topbar a{text-decoration:none;color:inherit}.cart{position:relative;font-size:25px;justify-self:end;transform:rotate(-5deg)}.cart b{position:absolute;right:-10px;top:-10px;width:22px;height:22px;border-radius:50%;background:var(--coral);color:white;display:grid;place-items:center;font-size:11px;font-family:var(--round)}.shot{display:block;background-image:url("${homeSprite}");background-repeat:no-repeat;background-size:745px 522px}.shot-logo{width:88px;height:88px;background-position:0 0}.shot-hero{width:548px;height:188px;background-position:-88px 0}.shot-family{width:126px;height:180px;background-position:-619px 0}.shot-business{width:128px;height:168px;background-position:0 -190px}.shot-paper{width:148px;height:168px;background-position:-130px -190px}.shot-product1{width:170px;height:122px;background-position:-279px -190px}.shot-product2{width:170px;height:122px;background-position:-450px -190px}.shot-product3{width:170px;height:122px;background-position:-279px -313px}.shot-product4{width:170px;height:122px;background-position:-450px -313px}.shot-podcast{width:280px;height:165px;background-position:0 -355px}.shot-mic{width:67px;height:118px;background-position:-622px -190px}.hero{position:relative;display:grid;grid-template-columns:442px 548px;gap:26px;align-items:start;min-height:350px}.hero-copy{position:relative;z-index:2;padding:23px 0 0 76px}.hero-copy h1{margin:0;font-family:var(--hand);font-size:52px;line-height:.88;letter-spacing:-.5px;font-weight:700;max-width:430px}.hero-copy h1 em{font-style:normal;position:relative;z-index:1;white-space:nowrap}.hero-copy h1 em:before{content:'';position:absolute;left:-8px;right:-12px;bottom:8px;height:.38em;border-radius:999px;background:var(--pink);z-index:-1}.hero-copy p{margin:24px 0 0;max-width:390px;font-size:14px;line-height:1.45;font-weight:700}.actions{display:flex;gap:14px;align-items:center;margin-top:21px}.btn{min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;padding:0 22px;text-decoration:none;font-weight:800;font-size:13px}.primary{background:var(--coral);color:white;box-shadow:0 12px 22px rgba(255,93,93,.22)}.secondary{border:1.8px solid var(--ink);background:rgba(255,255,255,.38);color:var(--ink)}.hero-shot{margin-top:20px;display:block;filter:drop-shadow(0 16px 28px rgba(52,32,21,.06));transform:scale(1.02);transform-origin:top left}.sun{position:absolute;left:44px;top:46px;width:44px;height:44px;border:5px solid #ffae00;border-radius:50%;box-shadow:0 0 0 12px rgba(255,174,0,.10)}.sun:before{content:'';position:absolute;inset:-22px;border-radius:inherit;background:repeating-conic-gradient(#ffae00 0 8deg,transparent 8deg 30deg);z-index:-1}.side-yellow{position:absolute;left:-58px;top:200px;width:116px;height:220px;background:#ffdf81;border-radius:0 999px 999px 0}.side-mint{position:absolute;right:-55px;top:256px;width:118px;height:118px;background:#bfeee7;border-radius:999px 0 0 999px}.universes{padding-top:2px}.universes h2,.new-products h2{margin:0 0 21px;text-align:center;font-family:var(--hand);font-size:43px;line-height:.9;font-weight:700}.universes h2 i,.new-products h2 i{display:inline-block;width:28px;height:4px;background:var(--ink);border-radius:99px;margin:0 12px 10px;transform:rotate(25deg)}.universes h2 i:last-child,.new-products h2 i:last-child{transform:rotate(-25deg)}.universe-grid{display:grid;grid-template-columns:repeat(3,314px);gap:14px;justify-content:center}.universe-card{position:relative;min-height:242px;border-radius:28px;overflow:hidden;display:grid;grid-template-columns:1fr 130px;align-items:end;gap:4px;padding:26px 12px 20px 30px;text-decoration:none;color:inherit;box-shadow:0 16px 30px rgba(44,28,18,.06)}.universe-card.family{background:#ffe3de}.universe-card.business{background:#d7f4ef}.universe-card.paper{background:#efdefe}.universe-card h3{margin:0 0 16px;font-family:var(--hand);font-weight:700;font-size:38px;line-height:.86}.family h3{color:var(--coral)}.business h3{color:var(--teal)}.paper h3{color:var(--purple)}.universe-card p{margin:0 0 18px;font-size:12px;line-height:1.43;font-weight:700;max-width:155px}.universe-card b{display:inline-flex;align-items:center;min-height:35px;padding:0 17px;border-radius:999px;border:1.6px solid var(--ink);font-size:11px}.universe-card span:not(.shot){position:absolute;right:38px;top:55px;color:var(--coral);font-family:var(--hand);font-size:32px}.universe-card .shot{align-self:end;justify-self:end}.values{margin-top:22px;min-height:84px;display:grid;grid-template-columns:repeat(4,1fr);border-radius:24px;background:rgba(255,255,255,.62);box-shadow:0 16px 28px rgba(40,25,15,.05);overflow:hidden}.values div{display:grid;grid-template-columns:50px 1fr;align-items:center;gap:8px;padding:13px 18px;border-right:1px solid rgba(15,20,28,.12)}.values div:last-child{border-right:0}.values strong{font-family:var(--hand);font-size:31px;text-align:center}.values p{margin:0;font-size:11px;line-height:1.4;font-weight:700}.new-products{padding:28px 0 22px}.products-layout{display:grid;grid-template-columns:800px 150px;gap:22px;align-items:stretch;justify-content:center}.product-grid{display:grid;grid-template-columns:repeat(4,185px);gap:14px}.product{position:relative;min-height:202px;padding:8px;border-radius:16px;background:rgba(255,255,255,.86);box-shadow:0 15px 30px rgba(38,27,18,.07)}.badge{position:absolute;top:-13px;left:20px;z-index:2;display:inline-flex;padding:7px 14px;border-radius:999px;background:#ffd55d;font-family:var(--hand);font-size:18px;transform:rotate(-7deg)}.product-shot{height:122px;border-radius:13px;display:grid;place-items:center;overflow:hidden;background:#fff1ec}.product-bottom{display:flex;justify-content:space-between;gap:8px;align-items:end;padding-top:12px}.product-bottom h3{margin:0 0 4px;font-size:12px;line-height:1.1}.product-bottom p{margin:0;font-size:12px;font-weight:800}.bag{width:37px;height:37px;border-radius:12px;display:grid;place-items:center;background:var(--coral);color:white;text-decoration:none}.shop-note{border-radius:25px;background:#fff0cf;display:grid;align-content:center;justify-items:center;gap:22px;padding:20px 12px}.shop-note p{margin:0;font-family:var(--hand);font-size:29px;line-height:.9;text-align:center;transform:rotate(-4deg)}.shop-note a{display:flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:999px;background:white;text-decoration:none;color:inherit;font-size:12px;font-weight:800;text-align:center}.podcast{margin-top:10px;min-height:197px;border-radius:32px;background:#ffd9d2;display:grid;grid-template-columns:82px 1fr 280px 220px;gap:20px;align-items:center;padding:0 34px;box-shadow:0 18px 36px rgba(50,30,20,.06);overflow:hidden}.podcast-copy h2{margin:0 0 10px;font-family:var(--hand);font-size:37px;line-height:.86}.podcast-copy p{margin:0 0 14px;font-size:12px;line-height:1.45;font-weight:700;max-width:360px}.quote{text-align:center}.quote p{margin:0 0 17px;font-family:var(--hand);font-size:28px;line-height:.92;transform:rotate(-5deg)}.quote a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 22px;border-radius:999px;background:white;text-decoration:none;color:inherit;font-size:12px;font-weight:800}.newsletter{margin-top:22px;min-height:86px;border-radius:24px;background:#d4f0eb;display:grid;grid-template-columns:95px 1fr 310px;gap:16px;align-items:center;padding:0 28px}.letter{font-family:var(--hand);font-size:56px;transform:rotate(-10deg);text-align:center}.newsletter h2{margin:0 0 6px;font-family:var(--hand);font-size:27px;line-height:.95}.newsletter p{margin:0;font-size:11px;font-weight:700}.newsletter form{display:grid;grid-template-columns:1fr 128px;gap:12px}.newsletter input,.newsletter button{height:43px;border:0;border-radius:999px;font-family:var(--round);font-weight:800}.newsletter input{padding:0 18px;background:white}.newsletter button{background:var(--coral);color:white}.footer{min-height:110px;display:grid;grid-template-columns:150px 1fr 140px;gap:20px;align-items:center}.footer .shot-logo{transform:scale(.62);transform-origin:left top}.footer p{margin:-28px 0 0;font-size:10px;font-weight:700}.footer nav{display:flex;justify-content:center;gap:22px;font-size:11px;font-weight:700}.footer a{text-decoration:none;color:inherit}.footer strong{justify-self:end;font-family:var(--hand);font-size:24px;line-height:.9;transform:rotate(-6deg)}@media(max-width:760px){.topbar,.hero,.universes,.values,.new-products,.podcast,.newsletter,.footer{width:min(100vw - 24px,430px)}.topbar{grid-template-columns:72px 1fr 40px;height:auto;padding:16px 0}.topbar nav{overflow:auto;justify-content:flex-start;gap:16px;font-size:11px}.shot-logo{transform:scale(.72);transform-origin:left top}.hero{display:block;min-height:auto}.hero-copy{padding:0}.hero-copy h1{font-size:44px}.hero-copy p{font-size:13px}.actions{flex-direction:column;align-items:stretch}.hero-shot{transform:scale(.72);transform-origin:left top;height:140px}.sun,.side-yellow,.side-mint{display:none}.universe-grid{grid-template-columns:314px}.values{grid-template-columns:1fr}.values div{border-right:0;border-bottom:1px solid rgba(15,20,28,.10)}.products-layout{grid-template-columns:1fr}.product-grid{grid-template-columns:repeat(2,185px);justify-content:center}.podcast{grid-template-columns:1fr;padding:24px}.newsletter{grid-template-columns:1fr;padding:22px}.newsletter form{grid-template-columns:1fr}.footer{grid-template-columns:1fr;justify-items:center;text-align:center}.footer p{margin:-34px 0 0}.footer strong{justify-self:center}}
`;