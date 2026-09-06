const styles = `
  .exact-page {
    min-height: 100vh;
    background: #fffaf1;
    color: #101827;
    font-family: Comfortaa, system-ui, sans-serif;
  }

  .exact-canvas {
    position: relative;
    width: min(100vw, 1360px);
    aspect-ratio: 1024 / 1536;
    margin: 0 auto;
    overflow: hidden;
    background:
      radial-gradient(circle at -4% 22%, #ffd66b 0 6.8%, transparent 7%),
      radial-gradient(circle at 104% 10%, #ffd7d1 0 7%, transparent 7.4%),
      radial-gradient(circle at 105% 31%, #bfeee8 0 7.5%, transparent 8%),
      radial-gradient(circle at 29% 97%, #ffd7d1 0 6%, transparent 6.5%),
      radial-gradient(circle at 77% 98%, #ffd66b 0 5%, transparent 5.6%),
      #fffaf1;
    box-shadow: 0 20px 60px rgba(17, 17, 17, .05);
  }

  .exact-canvas * { box-sizing: border-box; }
  .exact-canvas a { color: inherit; text-decoration: none; }
  .hand { font-family: 'Shadows Into Light Two', 'Caveat', cursive; font-weight: 900; letter-spacing: -.02em; }

  .logo-exact {
    position: absolute;
    left: 4.6%; top: 1.2%;
    width: 8.6%;
    font-size: clamp(24px, 3.35vw, 48px);
    line-height: .72;
    transform: rotate(-4deg);
    z-index: 5;
  }
  .logo-exact i { position: absolute; right: -24%; top: -12%; color: #ff5f5b; font-style: normal; font-size: .75em; }
  .main-nav-exact {
    position: absolute;
    left: 18.5%; top: 2.35%; right: 15.2%;
    display: flex; justify-content: center; gap: 3.1%;
    font-size: clamp(10px, .85vw, 14px);
    font-weight: 800;
    white-space: nowrap;
    z-index: 5;
  }
  .icons-exact { position: absolute; right: 4.8%; top: 1.65%; display: flex; gap: 1.6vw; align-items: center; font-size: clamp(18px, 1.9vw, 28px); z-index: 5; }
  .cart-dot { position: relative; }
  .cart-dot:after { content: '2'; position: absolute; right: -12px; top: -12px; width: 22px; height: 22px; border-radius: 50%; background: #ff5f5b; color: #fff; display: grid; place-items: center; font-size: 12px; font-family: Comfortaa, sans-serif; font-weight: 900; }

  .sun { position: absolute; left: 8.5%; top: 9%; font-size: clamp(44px, 4.3vw, 68px); color: #ffa600; transform: rotate(-8deg); }
  .hero-title { position: absolute; left: 10.9%; top: 9.6%; width: 43.5%; font-size: clamp(40px, 5.2vw, 74px); line-height: .9; margin: 0; z-index: 3; }
  .brush { position: relative; display: inline-block; white-space: nowrap; }
  .brush:before { content: ''; position: absolute; left: -5%; right: -6%; bottom: .03em; height: .44em; background: rgba(255, 105, 98, .42); border-radius: 49% 51% 44% 56%; transform: rotate(-2deg); z-index: -1; }
  .hero-text { position: absolute; left: 10.9%; top: 30.9%; width: 36.8%; font-size: clamp(12px, 1.05vw, 17px); line-height: 1.72; font-weight: 500; margin: 0; }
  .hero-buttons { position: absolute; left: 10.9%; top: 36.6%; display: flex; gap: 16px; align-items: center; z-index: 4; }
  .btn-red, .btn-outline, .btn-soft { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 24px; border-radius: 999px; font-size: clamp(11px, .95vw, 15px); font-weight: 900; }
  .btn-red { color: #fff; background: #ff5f5b; box-shadow: 0 12px 24px rgba(255, 95, 91, .18); }
  .btn-outline { background: rgba(255,255,255,.55); border: 1.8px solid #101827; }
  .btn-soft { background: #f3e5d8; }

  .hero-photo-real {
    position: absolute;
    left: 49.6%; top: 5.8%;
    width: 41.6%; height: 35.2%;
    overflow: hidden;
    border-radius: 47% 53% 4% 4% / 18% 19% 6% 6%;
    background:
      radial-gradient(circle at 36% 18%, #5a2b15 0 5%, transparent 5.3%),
      radial-gradient(circle at 63% 26%, #5a2b15 0 4.4%, transparent 4.8%),
      linear-gradient(90deg, rgba(255,255,255,.95) 0 52%, transparent 52%),
      linear-gradient(135deg, #fff3ec 0%, #ffe1d5 52%, #fff 100%);
    box-shadow: inset 0 -26px 50px rgba(255,255,255,.85);
    z-index: 2;
  }
  .hero-photo-real:before, .hero-photo-real:after { content: ''; position: absolute; bottom: 0; border-radius: 70px 70px 0 0; }
  .hero-photo-real:before { left: 19%; width: 32%; height: 61%; background: linear-gradient(90deg, #fff7ef, #f7eadf); }
  .hero-photo-real:after { left: 48%; width: 30%; height: 50%; background: linear-gradient(135deg, #ff9d95, #ffd0ca); }
  .shirt-text { position: absolute; left: 55.5%; top: 28.1%; z-index: 4; text-align: center; font-size: clamp(22px, 2.4vw, 34px); line-height: .93; transform: rotate(-2deg); }
  .hero-note { position: absolute; left: 47.2%; top: 8.2%; width: 14%; font-size: clamp(20px, 2.1vw, 31px); line-height: .86; transform: rotate(-8deg); z-index: 4; }
  .hero-note:after { content: '♡ ↘'; display: block; margin-top: 8px; }
  .tabs { position: absolute; right: 4.8%; top: 9.2%; display: grid; gap: .8vw; z-index: 4; }
  .tabs span { display: block; padding: .45vw 1.6vw; min-width: 8.6vw; border-radius: 9px; text-align: center; font-size: clamp(17px, 1.85vw, 27px); transform: rotate(-7deg); box-shadow: 0 10px 24px rgba(17,17,17,.06); }
  .tabs span:nth-child(1){ background:#ffd7b8; } .tabs span:nth-child(2){ background:#bfeee8; transform: rotate(-5deg); } .tabs span:nth-child(3){ background:#ffd7d1; } .tabs span:nth-child(4){ background:#ead7ff; transform: rotate(-4deg); } .tabs span:nth-child(5){ background:#fff0be; transform: rotate(-7deg); }
  .doodle-line { position: absolute; width: 4px; height: 42px; background: #111; border-radius: 999px; z-index: 4; }
  .dl1 { left: 47.2%; top: 25.5%; transform: rotate(-52deg); } .dl2 { left: 84.5%; top: 14.5%; transform: rotate(12deg); } .dl3 { left: 87.4%; top: 17.3%; transform: rotate(43deg); }
  .small-heart { position: absolute; font-size: clamp(22px, 2.2vw, 34px); z-index: 4; }
  .h1 { left: 92.5%; top: 23%; } .h2 { left: 19%; top: 31%; }

  .section-title { position: absolute; left: 0; right: 0; top: 43.4%; text-align: center; font-size: clamp(27px, 3.05vw, 45px); z-index: 4; }
  .section-title:before, .section-title:after { content: '⌁'; margin: 0 18px; font-size: .8em; }
  .cards-row { position: absolute; left: 3%; right: 3%; top: 47.2%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6%; }
  .universe-card-exact { min-height: clamp(210px, 20.4vw, 276px); position: relative; border-radius: 34px; padding: 2.4vw 2.1vw; overflow: hidden; box-shadow: 0 14px 34px rgba(17,17,17,.06); }
  .family { background: linear-gradient(135deg,#ffe4df,#fff2ec); } .business { background: linear-gradient(135deg,#d9f5f2,#f2fffc); } .paper { background: linear-gradient(135deg,#ead7ff,#fff2ff); }
  .universe-card-exact h3 { margin: 0 0 1.4vw; font-size: clamp(34px, 3.45vw, 52px); line-height: .86; width: 58%; }
  .family h3{ color:#ff5f5b; } .business h3{ color:#008e92; } .paper h3{ color:#7a59c2; }
  .universe-card-exact p { width: 55%; margin: 0 0 1.4vw; font-size: clamp(11px, .95vw, 15px); line-height: 1.55; }
  .universe-card-exact .pill { display: inline-flex; border: 1.8px solid #101827; border-radius: 999px; padding: .7vw 1.4vw; font-weight: 900; font-size: clamp(10px, .82vw, 13px); background: rgba(255,255,255,.36); }
  .card-illustration { position: absolute; right: 5%; bottom: 6%; width: 38%; height: 65%; border-radius: 28px; background: rgba(255,255,255,.36); border: 2px solid rgba(17,17,17,.08); transform: rotate(2deg); }
  .card-illustration:before { content: '♡'; position: absolute; left: -22%; top: 13%; font-size: clamp(28px,2.5vw,40px); font-family: 'Shadows Into Light Two', cursive; }
  .card-illustration:after { content: ''; position: absolute; inset: 16%; border-radius: 18px; background: linear-gradient(135deg, rgba(255,255,255,.8), rgba(255,255,255,.2)); border: 2px solid rgba(17,17,17,.16); }

  .values-exact { position: absolute; left: 3%; top: 74.5%; width: 76%; min-height: 5.9%; display: grid; grid-template-columns: repeat(4, 1fr); background: rgba(255,255,255,.56); border-radius: 24px; box-shadow: 0 10px 28px rgba(17,17,17,.045); }
  .values-exact div { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: .55vw; border-right: 1px solid rgba(17,17,17,.12); text-align: center; }
  .values-exact div:last-child { border-right: 0; }
  .values-exact span { font-size: clamp(23px, 2.2vw, 34px); font-family: 'Shadows Into Light Two', cursive; }
  .values-exact p { margin: 0; white-space: pre-line; font-size: clamp(9px, .75vw, 12px); line-height: 1.35; }
  .yellow-note { position: absolute; right: 4%; top: 74.4%; width: 14%; height: 7.5%; background: #ffd66b; border-radius: 44% 56% 48% 52%; display: grid; place-items: center; text-align: center; font-size: clamp(22px,2.3vw,34px); line-height: .88; transform: rotate(-7deg); }

  .products-title { position: absolute; left:0; right:0; top: 83.2%; text-align:center; font-size: clamp(31px,3.15vw,46px); }
  .products-title:before, .products-title:after { content:'⌁'; margin:0 16px; font-size:.75em; }
  .products-row { position: absolute; left: 4.4%; top: 87.6%; width: 76.5%; display:grid; grid-template-columns: repeat(4, 1fr); gap: 1.3%; }
  .product-exact { position: relative; background: rgba(255,255,255,.72); border:1px solid rgba(17,17,17,.08); border-radius: 14px; padding: .75vw; box-shadow: 0 8px 20px rgba(17,17,17,.05); min-height: clamp(152px, 15.2vw, 208px); }
  .product-img { height: 68%; border-radius: 10px; background: linear-gradient(135deg,#ffe4df,#fff6e9); display:grid; place-items:center; text-align:center; font-size: clamp(18px, 1.55vw, 24px); line-height:.9; transform: rotate(-.5deg); }
  .product-exact:nth-child(2) .product-img{ background:linear-gradient(135deg,#f2d8b7,#fff4e5); } .product-exact:nth-child(3) .product-img{ background:linear-gradient(135deg,#bfeee8,#fff0be); } .product-exact:nth-child(4) .product-img{ background:linear-gradient(135deg,#ffd7d1,#ead7ff); }
  .badge-exact { position:absolute; left: 18%; top:-6%; background:#ffd66b; border-radius:999px; padding:.35vw .9vw; font-size:clamp(11px,1vw,15px); transform:rotate(-7deg); z-index:3; }
  .prod-copy { display:flex; align-items:end; justify-content:space-between; padding-top:.55vw; gap:.5vw; }
  .prod-copy h3 { margin:0 0 .3vw; font-size:clamp(10px,.82vw,13px); font-weight:900; }
  .prod-copy p { margin:0; font-size:clamp(10px,.82vw,13px); font-weight:900; }
  .cart-btn { width:clamp(30px,2.8vw,42px); height:clamp(30px,2.8vw,42px); border-radius:12px; display:grid; place-items:center; background:#ff5f5b; color:white; }
  .shop-note { position:absolute; right:4%; top:88.4%; width:14%; text-align:center; }
  .shop-note p { font-size:clamp(22px,2.35vw,34px); line-height:.92; margin:0 0 2vw; transform:rotate(-8deg); }

  .podcast-band-exact { position:absolute; left:2.5%; right:2.5%; top:108.7%; height:12.3%; background:linear-gradient(135deg,#ffd7d1,#ffe7e1); border-radius:34px; overflow:hidden; display:grid; grid-template-columns: 10% 35% 32% 23%; align-items:center; padding:0 2.4%; gap:1.4%; }
  .mic-exact { font-size: clamp(48px,5vw,76px); text-align:center; color:#008e92; }
  .podcast-band-exact h2 { margin:0 0 1vw; font-size:clamp(31px,3.1vw,46px); line-height:.88; }
  .podcast-band-exact p { margin:0 0 1vw; font-size:clamp(10px,.82vw,13px); line-height:1.45; }
  .pod-photo { height:82%; border-radius: 120px 120px 0 0; background:linear-gradient(135deg,#f6d6c6,#fff3eb); position:relative; display:grid; place-items:end center; padding-bottom:8%; }
  .pod-photo span { background:#fffdf8; border-radius:16px; padding:.8vw; text-align:center; font-size:clamp(15px,1.35vw,21px); line-height:.85; transform:rotate(-5deg); box-shadow:0 8px 18px rgba(17,17,17,.08); }
  .pod-quote { font-size:clamp(18px,1.8vw,27px); line-height:.95; text-align:center; transform:rotate(-6deg); }
  .pod-quote a { margin-top: 2vw; transform: rotate(6deg); }

  .newsletter-exact { position:absolute; left:2.5%; right:2.5%; top:123.1%; height:7.5%; background:#dff5ef; border-radius:28px; display:grid; grid-template-columns:12% 1fr 38%; align-items:center; gap:1.5%; padding:0 2%; }
  .env-exact { font-size:clamp(45px,4.3vw,66px); text-align:center; transform:rotate(-8deg); }
  .newsletter-exact h2 { margin:0 0 .45vw; font-size:clamp(19px,1.72vw,26px); line-height:1; }
  .newsletter-exact p { margin:0; font-size:clamp(9px,.72vw,12px); }
  .newsletter-exact form { display:flex; gap:1vw; justify-content:flex-end; }
  .newsletter-exact input { border:0; border-radius:999px; min-height:46px; padding:0 1.4vw; width:55%; background:#fff; color:#101827; }
  .newsletter-exact button { border:0; border-radius:999px; min-height:46px; padding:0 1.8vw; background:#ff5f5b; color:#fff; font-weight:900; }

  .footer-exact { position:absolute; left:4.5%; right:4.5%; top:134.9%; display:grid; grid-template-columns:24% 1fr 24%; align-items:end; font-size:clamp(9px,.75vw,12px); }
  .mini-logo { position:relative; display:inline-grid; font-size:clamp(22px,2vw,32px); line-height:.72; transform:rotate(-4deg); margin-bottom:.7vw; }
  .footer-center { display:flex; justify-content:center; gap:1.2vw; }
  .footer-icons { text-align:right; font-size:clamp(18px,1.7vw,26px); }
  .merci { display:block; margin-top:1vw; font-size:clamp(20px,1.8vw,28px); line-height:.9; transform:rotate(-6deg); }

  @media (max-width: 760px) {
    .exact-canvas { width: 100vw; min-width: 390px; }
    .main-nav-exact { display:none; }
    .icons-exact { right:6%; }
    .logo-exact { font-size: 27px; }
    .hero-title { top:8%; left:8%; width:58%; font-size:42px; }
    .hero-text { top:28%; left:8%; width:55%; font-size:11px; }
    .hero-buttons { top:37%; left:8%; flex-direction:column; align-items:flex-start; gap:8px; }
    .hero-photo-real { left:52%; top:11%; width:44%; height:25%; }
    .hero-note, .tabs, .dl1, .dl2, .dl3 { display:none; }
    .cards-row, .products-row { gap:8px; }
    .universe-card-exact { padding:18px 14px; min-height:180px; }
    .universe-card-exact h3 { font-size:28px; }
    .universe-card-exact p { font-size:9px; }
  }
`;

export default function HomePage() {
  return (
    <main className="exact-page">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="exact-canvas">
        <a className="logo-exact hand" href="/" aria-label="Accueil Com’ entre nous">
          <span>Com’</span><span>entre</span><span>nous</span><i>♥</i>
        </a>

        <nav className="main-nav-exact" aria-label="Navigation principale">
          <a href="/com-en-famille">Com’ en famille</a>
          <a href="/com-des-entrepreneuses">Com’ des entrepreneuses</a>
          <a href="/papeterie-du-lien">Papeterie du lien</a>
          <a href="/podcast">Le podcast</a>
          <a href="/les-petits-cadeaux">Les petits cadeaux</a>
          <a href="/a-propos">À propos</a>
        </nav>
        <div className="icons-exact"><span>⌕</span><span>♙</span><a className="cart-dot" href="/boutique">🛒</a></div>

        <div className="sun hand">☼</div>
        <h1 className="hero-title hand">Des mots,<br />des cartes et des carnets<br />pour <span className="brush">créer du lien.</span></h1>
        <p className="hero-text">Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />En famille, dans ton quotidien ou dans ton projet.</p>
        <div className="hero-buttons"><a className="btn-red" href="/par-ou-commencer">Découvrir nos univers&nbsp; →</a><a className="btn-outline" href="/boutique">Voir les nouveautés</a></div>

        <div className="hero-photo-real" />
        <p className="hero-note hand">Des petits<br />outils pour<br />de grands<br />moments !</p>
        <p className="shirt-text hand">Les mots<br />aujourd’hui<br />pour demain<br />♡</p>
        <div className="tabs hand"><span>Écouter</span><span>Comprendre</span><span>Ressentir</span><span>Partager</span><span>Avancer</span></div>
        <span className="doodle-line dl1" /><span className="doodle-line dl2" /><span className="doodle-line dl3" /><span className="small-heart h1 hand">♡</span><span className="small-heart h2 hand">♡</span>

        <h2 className="section-title hand">Quel est ton univers ?</h2>
        <section className="cards-row" aria-label="Univers Com’ entre nous">
          <a className="universe-card-exact family" href="/com-en-famille"><h3 className="hand">Com’ en famille</h3><p>Des jeux et des outils pour se parler, s’écouter et grandir ensemble.</p><span className="pill">Découvrir →</span><div className="card-illustration" /></a>
          <a className="universe-card-exact business" href="/com-des-entrepreneuses"><h3 className="hand">Com’ des entrepreneuses</h3><p>Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.</p><span className="pill">Découvrir →</span><div className="card-illustration" /></a>
          <a className="universe-card-exact paper" href="/papeterie-du-lien"><h3 className="hand">Papeterie du lien</h3><p>Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.</p><span className="pill">Découvrir →</span><div className="card-illustration" /></a>
        </section>

        <section className="values-exact" aria-label="Nos valeurs">
          <div><span>♡</span><p>Des créations\navec amour</p></div><div><span>♧</span><p>Une approche bienveillante\net sans pression</p></div><div><span>☷</span><p>Des outils pour la vraie vie</p></div><div><span>☆</span><p>Une communauté qui inspire</p></div>
        </section>
        <div className="yellow-note hand">Ici,<br />on parle<br />vrai !</div>

        <h2 className="products-title hand">Les nouveautés</h2>
        <section className="products-row" aria-label="Les nouveautés">
          <article className="product-exact"><span className="badge-exact hand">Nouveau</span><div className="product-img hand">Les petits<br />liens</div><div className="prod-copy"><div><h3>Les Petits Liens</h3><p>29,00 €</p></div><a className="cart-btn" href="/produits/les-petits-liens">🛒</a></div></article>
          <article className="product-exact"><div className="product-img hand">Tout commence<br />par une idée<br />♡</div><div className="prod-copy"><div><h3>Mon carnet de clarté</h3><p>12,90 €</p></div><a className="cart-btn" href="/produits/mon-carnet-de-clarte">🛒</a></div></article>
          <article className="product-exact"><div className="product-img hand">Mon kit<br />d’été</div><div className="prod-copy"><div><h3>Mon kit d’été</h3><p>12,90 €</p></div><a className="cart-btn" href="/produits/mon-kit-ete">🛒</a></div></article>
          <article className="product-exact"><div className="product-img hand">Je suis<br />fière de moi</div><div className="prod-copy"><div><h3>Cartes émotions</h3><p>24,90 €</p></div><a className="cart-btn" href="/boutique">🛒</a></div></article>
        </section>
        <aside className="shop-note"><p className="hand">Des idées<br />dans ta valise !</p><a className="btn-soft" href="/boutique">Voir toute la boutique →</a></aside>

        <section className="podcast-band-exact" aria-label="Podcast Com’ entre nous">
          <div className="mic-exact">🎙</div>
          <div><h2 className="hand">Com’ entre nous<br />Le podcast</h2><p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p><a className="btn-outline" href="/podcast">Écouter le dernier épisode →</a></div>
          <div className="pod-photo hand"><span>Café<br />idées<br />projets<br />♡</span></div>
          <div className="pod-quote hand">« Des discussions<br />imparfaites, vraies<br />et tellement nous. »<br /><a className="btn-soft" href="/podcast">Voir tous les épisodes →</a></div>
        </section>

        <section className="newsletter-exact" aria-label="Newsletter">
          <div className="env-exact">✉</div>
          <div><h2 className="hand">Reçois des idées, des ressources et des coulisses !</h2><p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p></div>
          <form><input placeholder="Ton adresse email" /><button>Je m’inscris !</button></form>
        </section>

        <footer className="footer-exact">
          <div><span className="mini-logo hand">Com’<br />entre<br />nous</span><p>Des mots, des outils, des humains.</p></div>
          <div className="footer-center"><a href="/mentions-legales">Mentions légales</a><a href="/contact">Contact</a><a href="/faq">FAQ</a></div>
          <div className="footer-icons">◎ ▶︎ Ⓟ ◉<span className="merci hand">Merci<br />d’être ici ! ♡</span></div>
        </footer>
      </div>
    </main>
  );
}
