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
    color: 'family',
    text: 'Des jeux et des outils pour se parler, s’écouter et grandir ensemble.',
    href: '/com-en-famille',
    label: 'photos, cartes & moments du quotidien'
  },
  {
    title: 'Com’ des entrepreneuses',
    color: 'business',
    text: 'Des cartes et des carnets pour clarifier tes idées, oser te montrer et créer avec plus de justesse.',
    href: '/com-des-entrepreneuses',
    label: 'carnets, idées & visibilité'
  },
  {
    title: 'Papeterie du lien',
    color: 'paper',
    text: 'Des carnets, kits, jeux à imprimer et jolis accessoires pour mettre de la magie dans le quotidien.',
    href: '/papeterie-du-lien',
    label: 'carnets, kits & imprimables'
  }
];

const values = [
  ['♡', 'Des créations\navec amour'],
  ['✦', 'Une approche bienveillante\net sans pression'],
  ['☷', 'Des outils pour la vraie vie'],
  ['☆', 'Une communauté qui inspire']
];

const products = [
  ['Les Petits Liens', '29,00 €', 'Nouveau', '/produits/les-petits-liens', 'photo packshot boîte'],
  ['Mon carnet de clarté', '12,90 €', '', '/produits/mon-carnet-de-clarte', 'photo carnet ouvert'],
  ['Mon kit d’été', '12,90 €', '', '/produits/mon-kit-ete', 'photo pages imprimées'],
  ['Cartes émotions', '24,90 €', '', '/boutique', 'photo cartes étalées']
];

export default function HomePage() {
  return (
    <main className="real-home">
      <style>{styles}</style>

      <header className="real-header">
        <Link href="/" className="real-logo" aria-label="Accueil Com’ entre nous">
          <span>Com’</span>
          <span>entre</span>
          <span>nous</span>
          <b>♥</b>
        </Link>
        <nav aria-label="Navigation principale">
          {nav.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <Link href="/boutique" className="cart-link" aria-label="Voir la boutique">
          <span>2</span>
          🛒
        </Link>
      </header>

      <section className="hero-section">
        <span className="side-blob left" />
        <span className="side-blob right" />
        <span className="sun-doodle" aria-hidden="true" />

        <div className="hero-copy">
          <h1>
            Des mots,<br />
            des cartes et des carnets<br />
            pour <em>créer du lien.</em>
          </h1>
          <p>
            Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées.<br />
            En famille, dans ton quotidien ou dans ton projet.
          </p>
          <div className="hero-actions">
            <Link href="/par-ou-commencer" className="primary-btn">Découvrir nos univers <span>→</span></Link>
            <Link href="/boutique" className="secondary-btn">Voir les nouveautés</Link>
          </div>
        </div>

        <div className="hero-media" aria-label="Espace photo principal à remplacer ensuite">
          <p className="hand-note note-hero">Des petits<br />outils pour<br />de grands<br />moments !</p>
          <div className="photo-board hero-board">
            <span className="photo-grain" />
            <span className="photo-label">Photo mère + enfant<br />à remplacer</span>
            <span className="shirt-message">Les mots<br />aujourd’hui<br />pour demain<br /><i>♡</i></span>
          </div>
          <div className="word-tabs">
            <span>Écouter</span>
            <span>Comprendre</span>
            <span>Ressentir</span>
            <span>Partager</span>
            <span>Avancer</span>
          </div>
          <span className="line one" />
          <span className="line two" />
          <span className="tiny-heart">♡</span>
        </div>
      </section>

      <section className="universes-section" id="univers">
        <h2>Quel est ton univers ?</h2>
        <div className="universe-grid">
          {universes.map((item) => (
            <Link href={item.href} className={`universe-card ${item.color}`} key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="mini-btn">Découvrir →</span>
              </div>
              <div className="card-media">
                <span>{item.label}</span>
              </div>
              <i>♡</i>
            </Link>
          ))}
        </div>
      </section>

      <section className="values-strip" aria-label="Nos valeurs">
        {values.map(([icon, label]) => (
          <div key={label}>
            <span>{icon}</span>
            <p>{label.split('\n').map((line) => <b key={line}>{line}</b>)}</p>
          </div>
        ))}
      </section>

      <section className="products-section" id="nouveautes">
        <h2>Les nouveautés</h2>
        <div className="products-row">
          <div className="product-grid">
            {products.map(([title, price, badge, href, photo], index) => (
              <article className="product-card" key={title}>
                {badge ? <span className="badge">{badge}</span> : null}
                <div className={`product-photo product-${index + 1}`}>
                  <span>{photo}</span>
                </div>
                <div className="product-meta">
                  <div>
                    <h3>{title}</h3>
                    <p>{price}</p>
                  </div>
                  <Link href={href} aria-label={`Voir ${title}`}>🛒</Link>
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

      <section className="podcast-section">
        <div className="podcast-icon">🎙</div>
        <div className="podcast-copy">
          <h2>Com’ entre nous<br />Le podcast</h2>
          <p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids.</p>
          <Link href="/podcast" className="secondary-btn">Écouter le dernier épisode →</Link>
        </div>
        <div className="podcast-photo">
          <span>Photo Marion + Aurélie<br />à remplacer</span>
          <b>Café<br />idées<br />projets<br />♡</b>
        </div>
        <div className="podcast-quote">
          <p>« Des discussions<br />imparfaites, vraies<br />et tellement nous. »</p>
          <Link href="/podcast">Voir tous les épisodes →</Link>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="mail-doodle">✉</div>
        <div>
          <h2>Reçois des idées, des ressources et des coulisses !</h2>
          <p>Et en cadeau, une fiche à imprimer pour un vrai moment de discussion en famille.</p>
        </div>
        <form>
          <input type="email" placeholder="Ton adresse email" aria-label="Ton adresse email" />
          <button type="button">Je m’inscris !</button>
        </form>
      </section>

      <footer className="real-footer">
        <Link href="/" className="footer-logo">Com’<br />entre<br />nous <b>♥</b></Link>
        <p>Des mots, des outils, des humains.</p>
        <div>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <strong>Merci<br />d’être ici ! ♡</strong>
      </footer>
    </main>
  );
}

const styles = `
  :root {
    --cream: #fff7ec;
    --ink: #101827;
    --coral: #ff5c5c;
    --coral-soft: #ffc2bb;
    --mint: #cdeee8;
    --mint-strong: #08a1a0;
    --lavender: #ead9ff;
    --purple: #7f56c6;
    --yellow: #ffe989;
    --peach: #ffe2d7;
    --shadow: 0 22px 55px rgba(32, 24, 17, .10);
    --hand: 'More Sugar', 'Sunshine Day', 'Comic Sans MS', 'Trebuchet MS', cursive;
    --round: Comfortaa, ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  body { margin: 0; background: var(--cream); }

  .real-home {
    min-height: 100vh;
    background:
      radial-gradient(circle at 0% 22%, rgba(255, 218, 109, .92) 0 72px, transparent 74px),
      radial-gradient(circle at 100% 28%, rgba(198, 239, 232, .95) 0 74px, transparent 76px),
      radial-gradient(circle at 88% 100%, rgba(255, 222, 133, .65) 0 80px, transparent 82px),
      linear-gradient(180deg, #fffaf2 0%, #fff7ec 100%);
    color: var(--ink);
    font-family: var(--round);
    overflow-x: hidden;
  }

  .real-header,
  .hero-section,
  .universes-section,
  .values-strip,
  .products-section,
  .podcast-section,
  .newsletter-section,
  .real-footer {
    width: min(1420px, calc(100vw - 72px));
    margin-inline: auto;
  }

  .real-header {
    min-height: 118px;
    display: grid;
    grid-template-columns: 140px 1fr 72px;
    align-items: center;
    gap: 28px;
  }

  .real-logo,
  .footer-logo {
    position: relative;
    width: 106px;
    color: #070b12;
    font-family: var(--hand);
    font-weight: 900;
    font-size: 34px;
    line-height: .73;
    letter-spacing: -1.5px;
    text-decoration: none;
    transform: rotate(-2deg);
  }

  .real-logo span { display: block; }
  .real-logo b, .footer-logo b { color: var(--coral); font-family: var(--round); font-size: 21px; position: absolute; right: -18px; top: -10px; transform: rotate(14deg); }

  .real-header nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(18px, 2.7vw, 44px);
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
  }

  .real-header nav a,
  .real-footer a { color: var(--ink); text-decoration: none; }

  .cart-link {
    justify-self: end;
    position: relative;
    color: var(--ink);
    text-decoration: none;
    font-size: 31px;
    transform: rotate(-4deg);
  }

  .cart-link span {
    position: absolute;
    top: -13px;
    right: -11px;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: var(--coral);
    color: white;
    font-size: 14px;
    font-weight: 900;
    transform: rotate(8deg);
  }

  .hero-section {
    position: relative;
    min-height: 555px;
    display: grid;
    grid-template-columns: minmax(0, .98fr) minmax(480px, .9fr);
    gap: 48px;
    align-items: center;
    padding: 8px 0 28px;
  }

  .hero-copy { position: relative; z-index: 2; padding-left: 110px; }

  .sun-doodle {
    position: absolute;
    left: 62px;
    top: 54px;
    width: 54px;
    height: 54px;
    border: 6px solid #ffac00;
    border-radius: 999px;
    box-shadow: 0 0 0 14px rgba(255, 172, 0, .10);
  }
  .sun-doodle::before, .sun-doodle::after { content: ''; position: absolute; inset: -23px; border-radius: inherit; background: repeating-conic-gradient(from 0deg, #ffac00 0 8deg, transparent 8deg 32deg); z-index: -1; }
  .sun-doodle::after { inset: 14px; background: #ffac00; opacity: .35; }

  .side-blob { position: absolute; pointer-events: none; opacity: .85; }
  .side-blob.left { left: -74px; top: 230px; width: 154px; height: 236px; background: #ffdc77; border-radius: 0 999px 999px 0; }
  .side-blob.right { right: -54px; bottom: 38px; width: 146px; height: 146px; background: #beece7; border-radius: 999px 0 0 999px; }

  .hero-copy h1 {
    margin: 0;
    font-family: var(--hand);
    font-size: clamp(56px, 5.7vw, 88px);
    line-height: .98;
    letter-spacing: -2px;
    max-width: 740px;
    font-weight: 900;
  }

  .hero-copy h1 em {
    position: relative;
    display: inline-block;
    font-style: normal;
    z-index: 1;
  }

  .hero-copy h1 em::before {
    content: '';
    position: absolute;
    left: -10px;
    right: -24px;
    bottom: 7px;
    height: .44em;
    background: var(--coral-soft);
    border-radius: 999px 72% 999px 62%;
    transform: rotate(-1deg);
    z-index: -1;
    opacity: .9;
  }

  .hero-copy p {
    max-width: 590px;
    margin: 30px 0 0;
    font-size: 18px;
    line-height: 1.55;
    font-weight: 650;
  }

  .hero-actions { display: flex; align-items: center; gap: 22px; margin-top: 32px; flex-wrap: wrap; }

  .primary-btn,
  .secondary-btn,
  .mini-btn,
  .shop-note a,
  .podcast-quote a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 54px;
    padding: 0 29px;
    border-radius: 999px;
    font-weight: 900;
    text-decoration: none;
  }

  .primary-btn { background: var(--coral); color: white; box-shadow: 0 14px 25px rgba(255, 92, 92, .22); }
  .secondary-btn, .mini-btn { color: var(--ink); background: rgba(255,255,255,.52); border: 2px solid var(--ink); }

  .hero-media { position: relative; min-height: 460px; }

  .hand-note {
    position: absolute;
    font-family: var(--hand);
    font-size: 31px;
    line-height: .94;
    letter-spacing: -1px;
    transform: rotate(-8deg);
    margin: 0;
    z-index: 4;
  }

  .note-hero { left: -34px; top: 40px; }
  .note-hero::after { content: '♡'; display: block; margin: 10px 0 0 60px; }

  .photo-board {
    position: absolute;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255,255,255,.70), rgba(255,226,215,.75));
    box-shadow: var(--shadow);
  }

  .hero-board {
    right: 82px;
    top: 78px;
    width: min(500px, 75vw);
    height: 340px;
    border-radius: 140px 26px 26px 140px;
  }

  .hero-board::before,
  .hero-board::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 48%;
    height: 82%;
    background: linear-gradient(180deg, rgba(255,255,255,.72), rgba(255,242,234,.90));
    border-radius: 120px 120px 0 0;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
  }
  .hero-board::before { left: 70px; }
  .hero-board::after { right: 0; background: linear-gradient(180deg, #ffc1b8, #ffa39d); }

  .photo-grain {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 34% 9%, rgba(87,47,24,.28) 0 35px, transparent 38px), radial-gradient(circle at 70% 12%, rgba(154,79,58,.22) 0 42px, transparent 44px);
    filter: blur(2px);
    opacity: .48;
  }

  .photo-label {
    position: absolute;
    left: 70px;
    bottom: 58px;
    z-index: 3;
    padding: 13px 16px;
    border-radius: 18px;
    background: rgba(255,255,255,.70);
    font-size: 14px;
    font-weight: 800;
    color: rgba(16,24,39,.60);
  }

  .shirt-message {
    position: absolute;
    left: 226px;
    bottom: 70px;
    z-index: 3;
    font-family: var(--hand);
    font-size: 29px;
    line-height: 1;
    text-align: center;
    font-weight: 900;
  }
  .shirt-message i { display: block; font-style: normal; margin-top: 7px; }

  .word-tabs {
    position: absolute;
    right: 0;
    top: 58px;
    z-index: 6;
    display: grid;
    gap: 12px;
  }
  .word-tabs span {
    min-width: 150px;
    padding: 14px 21px;
    border-radius: 11px;
    font-family: var(--hand);
    font-size: 22px;
    font-weight: 900;
    box-shadow: 0 14px 26px rgba(35,22,18,.08);
    transform: rotate(-4deg);
  }
  .word-tabs span:nth-child(1) { background: #ffd8b8; }
  .word-tabs span:nth-child(2) { background: #b8ebe6; transform: rotate(-3deg); }
  .word-tabs span:nth-child(3) { background: #ffd4d0; transform: rotate(-5deg); }
  .word-tabs span:nth-child(4) { background: #e8d4ff; transform: rotate(-3deg); }
  .word-tabs span:nth-child(5) { background: #fff0aa; transform: rotate(-5deg); }

  .line { position: absolute; width: 50px; height: 5px; border-radius: 999px; background: #05080d; z-index: 5; }
  .line.one { left: 28px; top: 214px; transform: rotate(48deg); }
  .line.two { left: 210px; top: 98px; transform: rotate(96deg); }
  .tiny-heart { position: absolute; right: 92px; bottom: 85px; font-family: var(--hand); font-size: 36px; }

  .universes-section { padding: 18px 0 34px; position: relative; }
  .universes-section h2,
  .products-section h2 {
    margin: 0 0 28px;
    text-align: center;
    font-family: var(--hand);
    font-size: clamp(38px, 4vw, 64px);
    line-height: .9;
  }

  .universe-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }

  .universe-card {
    position: relative;
    min-height: 260px;
    display: grid;
    grid-template-columns: 1fr 170px;
    gap: 10px;
    padding: 34px 26px 26px 34px;
    border-radius: 34px;
    overflow: hidden;
    color: var(--ink);
    text-decoration: none;
    box-shadow: 0 14px 35px rgba(36,25,18,.06);
  }
  .universe-card.family { background: linear-gradient(135deg, #ffe1dc, #fff2ed); }
  .universe-card.business { background: linear-gradient(135deg, #d4f4ef, #effcf9); }
  .universe-card.paper { background: linear-gradient(135deg, #efdfff, #fff4ff); }

  .universe-card h3 {
    margin: 0 0 20px;
    font-family: var(--hand);
    font-size: clamp(36px, 3.4vw, 54px);
    line-height: .84;
    letter-spacing: -1px;
  }
  .family h3 { color: var(--coral); }
  .business h3 { color: #079a9a; }
  .paper h3 { color: var(--purple); }
  .universe-card p { margin: 0 0 22px; font-size: 15px; line-height: 1.55; max-width: 265px; font-weight: 700; }
  .mini-btn { min-height: 42px; padding: 0 20px; font-size: 14px; }
  .universe-card i { position: absolute; right: 36px; top: 46px; font-family: var(--hand); font-size: 38px; font-style: normal; color: var(--coral); }

  .card-media {
    align-self: end;
    height: 166px;
    border-radius: 24px;
    background: rgba(255,255,255,.58);
    box-shadow: inset 0 0 0 2px rgba(255,255,255,.65), 0 16px 24px rgba(0,0,0,.05);
    display: grid;
    place-items: center;
    text-align: center;
    padding: 18px;
    font-size: 13px;
    font-weight: 800;
    color: rgba(16,24,39,.55);
  }

  .values-strip {
    margin-top: 4px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border-radius: 28px;
    background: rgba(255,255,255,.58);
    box-shadow: 0 14px 30px rgba(33,22,15,.05);
    overflow: hidden;
  }
  .values-strip div { min-height: 98px; display: grid; grid-template-columns: 54px 1fr; align-items: center; gap: 14px; padding: 16px 24px; border-right: 1px solid rgba(20,25,32,.12); }
  .values-strip div:last-child { border-right: none; }
  .values-strip span { font-family: var(--hand); font-size: 33px; text-align: center; }
  .values-strip p { margin: 0; font-size: 13px; line-height: 1.35; font-weight: 700; }
  .values-strip b { display: block; font-weight: 700; }

  .products-section { padding: 38px 0 26px; }
  .products-row { display: grid; grid-template-columns: 1fr 215px; gap: 30px; align-items: center; }
  .product-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; }
  .product-card { position: relative; padding: 12px; border-radius: 18px; background: rgba(255,255,255,.68); box-shadow: 0 12px 25px rgba(25,20,14,.07); }
  .badge { position: absolute; top: -12px; left: 26px; z-index: 2; padding: 7px 15px; border-radius: 999px; background: #ffd45f; font-family: var(--hand); font-size: 18px; font-weight: 900; transform: rotate(-7deg); }
  .product-photo { height: 150px; border-radius: 13px; display: grid; place-items: center; background: linear-gradient(135deg, #ffd8cd, #fff4ed); overflow: hidden; color: rgba(16,24,39,.54); font-weight: 850; font-size: 13px; text-align: center; }
  .product-2 { background: linear-gradient(135deg, #e7d4b8, #fff0da); }
  .product-3 { background: linear-gradient(135deg, #ffef9b, #cdeee8); }
  .product-4 { background: linear-gradient(135deg, #ffd0cb, #d5f1ed); }
  .product-photo::before { content: ''; width: 64%; height: 70%; border-radius: 14px; border: 2px solid rgba(255,255,255,.74); background: rgba(255,255,255,.44); box-shadow: 0 12px 22px rgba(0,0,0,.08); grid-area: 1 / 1; transform: rotate(-2deg); }
  .product-photo span { grid-area: 1 / 1; z-index: 2; }
  .product-meta { display: flex; align-items: end; justify-content: space-between; gap: 12px; padding: 12px 2px 0; }
  .product-meta h3 { margin: 0 0 5px; font-size: 15px; line-height: 1.2; }
  .product-meta p { margin: 0; font-size: 14px; font-weight: 900; }
  .product-meta a { width: 43px; height: 43px; display: grid; place-items: center; border-radius: 13px; background: var(--coral); color: white; text-decoration: none; }

  .shop-note { display: grid; gap: 32px; justify-items: center; text-align: center; }
  .shop-note p { margin: 0; font-family: var(--hand); font-size: 33px; line-height: .95; transform: rotate(-7deg); }
  .shop-note p::before { content: ''; display: block; width: 132px; height: 78px; margin: 0 auto -62px; border-radius: 28% 72% 37% 63%; background: rgba(255,203,96,.72); transform: rotate(5deg); }
  .shop-note a, .podcast-quote a { min-height: 47px; padding-inline: 20px; background: rgba(255,255,255,.78); color: var(--ink); font-size: 13px; box-shadow: 0 10px 20px rgba(0,0,0,.05); }

  .podcast-section {
    margin-top: 18px;
    min-height: 245px;
    display: grid;
    grid-template-columns: 86px 1fr minmax(250px, 390px) minmax(220px, 310px);
    align-items: center;
    gap: 26px;
    padding: 32px 42px;
    border-radius: 34px;
    background: linear-gradient(135deg, #ffd8d1, #ffe8df);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .podcast-icon { width: 70px; height: 92px; border-radius: 999px 999px 20px 20px; background: #14aaa8; display: grid; place-items: center; font-size: 42px; box-shadow: inset 0 0 0 3px rgba(0,0,0,.08); }
  .podcast-copy h2 { margin: 0 0 12px; font-family: var(--hand); font-size: 43px; line-height: .88; }
  .podcast-copy p { margin: 0 0 16px; max-width: 480px; font-size: 15px; line-height: 1.45; font-weight: 700; }
  .podcast-copy .secondary-btn { min-height: 46px; padding-inline: 22px; }
  .podcast-photo { position: relative; height: 185px; border-radius: 28px 28px 0 0; background: linear-gradient(135deg, rgba(255,255,255,.50), rgba(255,114,92,.28)); display: grid; place-items: center; box-shadow: inset 0 0 0 2px rgba(255,255,255,.45); color: rgba(16,24,39,.55); font-size: 14px; font-weight: 850; text-align: center; }
  .podcast-photo b { position: absolute; bottom: 18px; left: 38px; padding: 13px 16px; border-radius: 14px; background: rgba(255,255,255,.72); font-family: var(--hand); font-size: 18px; line-height: .92; color: var(--ink); transform: rotate(-4deg); }
  .podcast-quote { display: grid; justify-items: center; gap: 18px; text-align: center; }
  .podcast-quote p { margin: 0; font-family: var(--hand); font-size: 29px; line-height: .95; transform: rotate(-6deg); }

  .newsletter-section {
    margin-top: 28px;
    display: grid;
    grid-template-columns: 92px 1fr minmax(370px, 520px);
    gap: 24px;
    align-items: center;
    min-height: 108px;
    padding: 18px 28px;
    border-radius: 30px;
    background: linear-gradient(90deg, #d6f1ec, #c7eee8);
    box-shadow: 0 14px 32px rgba(20,45,38,.06);
  }
  .mail-doodle { font-family: var(--hand); font-size: 50px; text-align: center; transform: rotate(-8deg); }
  .newsletter-section h2 { margin: 0 0 7px; font-family: var(--hand); font-size: 29px; line-height: 1; }
  .newsletter-section p { margin: 0; font-size: 13px; font-weight: 700; }
  .newsletter-section form { display: grid; grid-template-columns: 1fr 170px; gap: 14px; }
  .newsletter-section input, .newsletter-section button { height: 54px; border: 0; border-radius: 999px; font-family: var(--round); font-weight: 800; }
  .newsletter-section input { padding: 0 24px; background: rgba(255,255,255,.92); color: var(--ink); }
  .newsletter-section button { background: var(--coral); color: white; cursor: pointer; }

  .real-footer { min-height: 165px; display: grid; grid-template-columns: 150px 1fr auto 160px; gap: 24px; align-items: center; padding: 26px 0 46px; }
  .footer-logo { display: block; font-size: 25px; width: 90px; }
  .real-footer p { margin: 48px 0 0 -120px; font-size: 12px; font-weight: 700; }
  .real-footer div { display: flex; gap: 22px; justify-self: center; font-size: 13px; font-weight: 700; }
  .real-footer strong { justify-self: end; font-family: var(--hand); font-size: 26px; line-height: .95; transform: rotate(-6deg); }

  @media (max-width: 1100px) {
    .real-header, .hero-section, .universes-section, .values-strip, .products-section, .podcast-section, .newsletter-section, .real-footer { width: min(100vw - 36px, 820px); }
    .real-header { grid-template-columns: 110px 1fr 54px; min-height: 106px; }
    .real-header nav { justify-content: flex-start; overflow-x: auto; padding-bottom: 8px; }
    .hero-section { grid-template-columns: 1fr; gap: 24px; }
    .hero-copy { padding-left: 84px; }
    .hero-media { min-height: 420px; }
    .universe-grid, .product-grid { grid-template-columns: 1fr; }
    .universe-card { grid-template-columns: 1fr 160px; }
    .values-strip { grid-template-columns: repeat(2, 1fr); }
    .products-row { grid-template-columns: 1fr; }
    .podcast-section { grid-template-columns: 78px 1fr; }
    .podcast-photo, .podcast-quote { grid-column: 1 / -1; }
    .newsletter-section { grid-template-columns: 70px 1fr; }
    .newsletter-section form { grid-column: 1 / -1; }
    .real-footer { grid-template-columns: 1fr; text-align: center; justify-items: center; }
    .real-footer p { margin: -18px 0 0; }
    .real-footer strong { justify-self: center; }
  }

  @media (max-width: 640px) {
    .real-header { grid-template-columns: 86px 1fr 45px; gap: 10px; }
    .real-logo { font-size: 27px; width: 80px; }
    .real-header nav { font-size: 13px; gap: 16px; }
    .hero-copy { padding-left: 0; padding-top: 44px; }
    .sun-doodle { left: 8px; top: 26px; width: 35px; height: 35px; border-width: 4px; }
    .side-blob.left { display: none; }
    .hero-copy h1 { font-size: clamp(46px, 15vw, 64px); }
    .hero-copy p { font-size: 15px; }
    .hero-actions { gap: 12px; }
    .primary-btn, .secondary-btn { width: 100%; }
    .hero-board { left: 0; right: auto; width: calc(100% - 42px); height: 292px; }
    .note-hero { left: 8px; top: 8px; font-size: 24px; }
    .word-tabs { right: 0; top: 75px; transform: scale(.82); transform-origin: right top; }
    .shirt-message { left: 38%; font-size: 23px; }
    .universe-card { grid-template-columns: 1fr; }
    .card-media { height: 122px; }
    .values-strip { grid-template-columns: 1fr; }
    .values-strip div { border-right: 0; border-bottom: 1px solid rgba(20,25,32,.10); }
    .podcast-section { grid-template-columns: 1fr; padding: 26px; }
    .newsletter-section { grid-template-columns: 1fr; }
    .newsletter-section form { grid-template-columns: 1fr; }
  }
`;
