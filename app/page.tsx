import Link from 'next/link';

const dreamImage = 'https://lh3.googleusercontent.com/d/1PSvjzzZnTI_jsdCgN9uzCVRFvNRTjJqF=w2048';

const nav = [
  ['Com’ en famille', '/com-en-famille'],
  ['Com’ des entrepreneuses', '/com-des-entrepreneuses'],
  ['La papeterie', '/papeterie-du-lien'],
  ['Le podcast', '/podcast'],
  ['Les petits cadeaux', '/les-petits-cadeaux'],
  ['À propos', '/a-propos'],
] as const;

const cards = [
  ['Com’\nen famille', 'Des outils pour le quotidien', '/com-en-famille', 'family'],
  ['Com’ des\nentrepreneuses', 'Créer, oser, se soutenir', '/com-des-entrepreneuses', 'business'],
  ['La\npapeterie', 'To-do lists, bujo, plannings et jolis outils', '/papeterie-du-lien', 'paper'],
  ['Le\npodcast', 'Des discussions vraies et inspirantes', '/podcast', 'podcast'],
  ['Les petits\ncadeaux', 'Des attentions qui font du bien', '/les-petits-cadeaux', 'gifts'],
  ['À\npropos', 'Notre histoire, nos valeurs', '/a-propos', 'about'],
] as const;

const hotspots = [
  { href: '/', label: 'Accueil', className: 'logo-link' },
  { href: '/com-en-famille', label: 'Com’ en famille', className: 'nav-family' },
  { href: '/com-des-entrepreneuses', label: 'Com’ des entrepreneuses', className: 'nav-business' },
  { href: '/papeterie-du-lien', label: 'La papeterie', className: 'nav-paper' },
  { href: '/podcast', label: 'Le podcast', className: 'nav-podcast' },
  { href: '/les-petits-cadeaux', label: 'Les petits cadeaux', className: 'nav-gifts' },
  { href: '/a-propos', label: 'À propos', className: 'nav-about' },
  { href: '/boutique', label: 'Recherche', className: 'icon-search' },
  { href: '/a-propos', label: 'Compte', className: 'icon-account' },
  { href: '/boutique', label: 'Panier', className: 'icon-cart' },
  { href: '/com-en-famille', label: 'Com’ en famille', className: 'card-family' },
  { href: '/com-des-entrepreneuses', label: 'Com’ des entrepreneuses', className: 'card-business' },
  { href: '/papeterie-du-lien', label: 'La papeterie', className: 'card-paper' },
  { href: '/podcast', label: 'Le podcast', className: 'card-podcast' },
  { href: '/les-petits-cadeaux', label: 'Les petits cadeaux', className: 'card-gifts' },
  { href: '/a-propos', label: 'À propos', className: 'card-about' },
  { href: '/par-ou-commencer', label: 'Découvrir notre univers', className: 'cta-discover' },
  { href: '/boutique', label: 'Voir les nouveautés', className: 'cta-news' },
] as const;

export default function HomePage() {
  return (
    <main className="dream-page">
      <style>{styles}</style>
      <section className="visual-board" aria-label="Accueil Com’ entre nous">
        <div className="fallback-site" aria-hidden="true">
          <header className="topbar">
            <div className="brand">Com’<br />entre<br />nous<span>♥</span><small>Des mots, des cartes<br />et des carnets pour créer du lien</small></div>
            <nav>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
            <div className="icons"><span>⌕</span><span>♡</span><span>▢</span></div>
          </header>

          <section className="hero">
            <div className="hero-copy">
              <p className="side-note">Des petits<br />outils pour<br />de grands<br />moments !</p>
              <h1>Des mots,<br />des cartes et des carnets<br />pour <mark>créer du lien.</mark></h1>
              <p className="intro">Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.</p>
              <div className="buttons"><Link href="/par-ou-commencer">Découvrir notre univers →</Link><Link href="/boutique">Voir les nouveautés →</Link></div>
            </div>
            <div className="photo-card"><div className="photo-soft"><span>Photo douce<br />mère + enfant</span></div><p>Écouter<br />Comprendre<br />Ressentir<br />Partager<br />Grandir ensemble</p></div>
          </section>

          <section className="card-row">{cards.map(([title, text, href, kind]) => <Link className={`paper-card ${kind}`} href={href} key={href}><span className="paper-photo" /><strong>{title}</strong><em>{text}</em><b>→</b></Link>)}</section>

          <section className="welcome">
            <div className="paint"><h2>Bienvenue chez<br />Com’ entre nous ! ♥</h2><p>Ici, on imagine des outils simples, beaux et utiles pour aider les familles et les entrepreneuses à créer plus de lien, de douceur et de confiance au quotidien.</p><Link href="/par-ou-commencer">Découvrir notre univers →</Link></div>
            <div className="polaroid"><div /> <p>Deux sœurs,<br />une même envie :<br />plus de lien !</p></div>
            <aside>Des idées,<br />des mots,<br />des créations<br />pour une vie<br />plus douce.</aside>
          </section>

          <section className="coffee"><p>Parce que chaque petit moment compte…</p><div><span>Tout commence par une idée…</span></div><Link href="/boutique">Voir les nouveautés →</Link></section>

          <section className="values"><p>♡<br /><strong>Des outils concrets</strong><br />pour le quotidien</p><p>♥<br /><strong>Une approche bienveillante</strong><br />et sans jugement</p><p>☆<br /><strong>Une communauté engagée</strong><br />et inspirante</p></section>
        </div>
        <img className="dream-img" src={dreamImage} alt="Com’ entre nous — page d’accueil" draggable="false" />
        {hotspots.map((link) => <Link key={`${link.href}-${link.className}`} href={link.href} aria-label={link.label} className={`hotspot ${link.className}`} />)}
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}html,body{margin:0;background:#fff8ef;color:#111827}.dream-page{min-height:100vh;background:#fff8ef;overflow-x:hidden}.visual-board{position:relative;width:min(1024px,100vw);margin:0 auto;background:#fff8ef;min-height:1400px}.dream-img{position:absolute;z-index:4;inset:0;width:100%;height:auto;display:block;user-select:none}.fallback-site{position:relative;z-index:1;min-height:1536px;padding:18px 22px 40px;background:#fff8ef;font-family:Arial, sans-serif;color:#101827;overflow:hidden}.fallback-site:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 7% 19%,#f6cabf 0 8%,transparent 9%),radial-gradient(circle at 91% 17%,#d5f3ef 0 13%,transparent 14%),radial-gradient(circle at 78% 90%,#fbd6c9 0 17%,transparent 18%);opacity:.75}.topbar,.hero,.card-row,.welcome,.coffee,.values{position:relative;z-index:2}.topbar{display:flex;align-items:flex-start;gap:28px}.brand{font:900 44px/0.78 Arial Black,Arial,sans-serif;letter-spacing:-2px;min-width:150px}.brand span{color:#ff5b61;font-size:30px;position:relative;top:-42px;left:86px}.brand small{display:block;margin-top:12px;font:700 9px/1.25 Arial,sans-serif;letter-spacing:.4px;text-transform:uppercase}.topbar nav{flex:1;display:flex;justify-content:center;gap:22px;padding-top:17px}.topbar a{color:#111827;text-decoration:none;font:700 12px/1 Arial,sans-serif;text-transform:uppercase}.icons{display:flex;gap:20px;font-size:31px;padding-top:11px}.hero{display:grid;grid-template-columns:46% 54%;min-height:430px;margin-top:20px}.hero-copy{padding:48px 0 0 10px}.side-note{position:absolute;left:152px;top:14px;font:700 34px/1.05 Comic Sans MS,cursive;transform:rotate(-7deg)}h1{margin:120px 0 18px;font:900 52px/1.03 Comic Sans MS,cursive;letter-spacing:-2px}mark{background:#f7b7ae;border-radius:999px;padding:0 12px;color:#101827}.intro{font:400 20px/1.35 Arial,sans-serif;max-width:430px}.buttons{display:flex;gap:17px;margin-top:25px}.buttons a,.paint a,.coffee a{display:inline-flex;border-radius:999px;padding:17px 24px;background:#f8bcae;color:#101827;text-decoration:none;font:700 18px/1 Arial,sans-serif}.buttons a:first-child{background:#ff5b61;color:white}.photo-card{position:relative;min-height:430px}.photo-soft{position:absolute;right:10px;top:10px;width:520px;height:390px;border-radius:0 0 210px 210px;background:linear-gradient(135deg,#f4d4c6,#f7eee5 55%,#f7b7ae);box-shadow:0 18px 42px rgba(100,54,28,.12);display:grid;place-items:center}.photo-soft span{font:700 24px/1.15 Comic Sans MS,cursive;color:#7d665d;text-align:center}.photo-card p{position:absolute;right:30px;top:70px;font:700 30px/1.35 Comic Sans MS,cursive;background:rgba(255,255,255,.5);padding:15px 20px;border-radius:20px;transform:rotate(-4deg)}.card-row{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:10px}.paper-card{min-height:230px;background:#f8ecdc;color:#101827;text-decoration:none;border-radius:6px;padding:12px 12px 18px;text-align:center;box-shadow:0 10px 25px rgba(65,35,20,.12);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;position:relative}.paper-photo{position:absolute;top:10px;left:10px;right:10px;height:88px;border-radius:8px;background:linear-gradient(135deg,#f8d2c8,#fff6ed)}.business .paper-photo{background:linear-gradient(135deg,#d8f4ef,#fff6ed)}.paper .paper-photo{background:linear-gradient(135deg,#f4dfc4,#fff6ed)}.podcast .paper-photo{background:linear-gradient(135deg,#d7f1ef,#f7d1ca)}.gifts .paper-photo{background:linear-gradient(135deg,#f2d0bc,#fff6ed)}.about .paper-photo{background:linear-gradient(135deg,#e9f0d4,#f9d4cc)}.paper-card strong{white-space:pre-line;font:800 27px/1.0 Comic Sans MS,cursive}.paper-card em{font:700 11px/1.25 Arial,sans-serif;text-transform:uppercase;font-style:normal;margin-top:8px}.paper-card b{margin-top:12px;background:#e5ad81;border-radius:50%;width:30px;height:30px;display:grid;place-items:center}.welcome{display:grid;grid-template-columns:39% 39% 20%;gap:20px;margin-top:45px;align-items:center}.paint{background:#f7cfc8;border-radius:36px;padding:40px 34px}.paint h2{font:900 41px/1.05 Comic Sans MS,cursive;margin:0 0 18px}.paint p{font:400 18px/1.45 Arial,sans-serif}.paint a{margin-top:14px;background:#efb397}.polaroid{background:white;padding:16px;box-shadow:0 12px 35px rgba(65,35,20,.15);transform:rotate(-2deg)}.polaroid div{height:250px;background:linear-gradient(135deg,#f3d8c9,#f8eee6 60%,#f8b9ae);display:grid;place-items:center}.polaroid p{font:700 27px/1.1 Comic Sans MS,cursive;margin:12px 6px}.welcome aside{background:#f6c8c1;border-radius:4px;padding:35px 22px;font:700 28px/1.25 Comic Sans MS,cursive;transform:rotate(2deg)}.coffee{margin-top:38px;min-height:230px;background:linear-gradient(90deg,#fff4e9,#ead2bf);border-radius:4px;padding:48px 40px;display:grid;grid-template-columns:30% 38% 26%;gap:20px;align-items:center}.coffee p{font:700 31px/1.1 Comic Sans MS,cursive;transform:rotate(-7deg)}.coffee div{height:180px;border-radius:28px;background:linear-gradient(135deg,#d5ad87,#fff6ed);display:grid;place-items:center}.coffee div span{font:700 25px/1.1 Comic Sans MS,cursive}.coffee a{justify-self:center;background:#bfece7}.values{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:36px;text-align:center}.values p{font:400 18px/1.35 Arial,sans-serif}.values strong{font:700 25px/1.1 Comic Sans MS,cursive}.hotspot{position:absolute;z-index:10;display:block;border-radius:999px;text-indent:-9999px;overflow:hidden}.hotspot:focus-visible{outline:3px solid rgba(255,87,92,.72);outline-offset:3px;background:rgba(255,255,255,.16)}@media(hover:hover){.hotspot:hover{outline:2px dashed rgba(255,87,92,.28);outline-offset:3px}}
.logo-link{left:2.7%;top:.8%;width:12.4%;height:9.7%;border-radius:22px}.nav-family{left:18.0%;top:1.7%;width:11.0%;height:3.5%}.nav-business{left:30.0%;top:1.7%;width:15.0%;height:3.5%}.nav-paper{left:45.7%;top:1.7%;width:11.2%;height:3.5%}.nav-podcast{left:57.0%;top:1.7%;width:8.5%;height:3.5%}.nav-gifts{left:65.8%;top:1.7%;width:12.6%;height:3.5%}.nav-about{left:78.8%;top:1.7%;width:8.4%;height:3.5%}.icon-search{left:87.8%;top:1.1%;width:3.8%;height:4.2%}.icon-account{left:92.2%;top:1.1%;width:3.1%;height:4.2%}.icon-cart{left:96.0%;top:.9%;width:3.6%;height:4.4%}.card-family{left:1.2%;top:31.0%;width:15.5%;height:16.3%;border-radius:16px}.card-business{left:17.8%;top:31.0%;width:15.6%;height:16.3%;border-radius:16px}.card-paper{left:34.7%;top:31.0%;width:15.7%;height:16.3%;border-radius:16px}.card-podcast{left:51.5%;top:31.0%;width:15.1%;height:16.3%;border-radius:16px}.card-gifts{left:67.8%;top:31.0%;width:15.4%;height:16.3%;border-radius:16px}.card-about{left:84.1%;top:31.0%;width:15.0%;height:16.3%;border-radius:16px}.cta-discover{left:8.0%;top:65.0%;width:26.5%;height:4.4%;border-radius:50px}.cta-news{left:73.0%;top:74.7%;width:22.5%;height:4.6%;border-radius:50px}@media(max-width:760px){.visual-board{width:100vw;min-height:1150px}.fallback-site{padding:14px;min-height:1150px}.topbar{gap:10px}.brand{font-size:29px;min-width:92px}.brand small{display:none}.topbar nav{display:none}.icons{margin-left:auto}.hero{grid-template-columns:1fr}.hero-copy{padding-top:10px}.side-note{position:static;font-size:24px;margin:20px 0 0;transform:rotate(-4deg)}h1{margin:16px 0;font-size:38px}.intro{font-size:17px}.photo-card{min-height:300px}.photo-soft{left:8%;right:auto;width:84%;height:270px}.photo-card p{right:24px;top:38px;font-size:23px}.card-row{grid-template-columns:repeat(2,1fr);}.welcome{grid-template-columns:1fr}.coffee{grid-template-columns:1fr}.values{grid-template-columns:1fr}.nav-family,.nav-business,.nav-paper,.nav-podcast,.nav-gifts,.nav-about{display:none}.dream-img{display:none}}
`;