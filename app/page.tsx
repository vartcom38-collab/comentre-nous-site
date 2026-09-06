import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="reset-home">
      <style>{styles}</style>
      <section className="card" aria-label="Com’ entre nous">
        <div className="logo" aria-hidden="true">
          <span>Com’</span>
          <span>entre</span>
          <span>nous</span>
          <i>♥</i>
        </div>
        <p className="eyebrow">Le site se refait une beauté</p>
        <h1>On remet tout à plat.</h1>
        <p className="lead">
          On prépare un espace plus beau, plus clair et plus fidèle à l’univers Com’ entre nous :
          des mots, des outils, des cartes et des carnets pour créer du lien.
        </p>
        <div className="actions">
          <Link href="/boutique">Voir la boutique</Link>
          <Link href="/contact">Nous contacter</Link>
        </div>
      </section>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700;800&family=Gaegu:wght@700&display=swap');
:root{--cream:#fff8ee;--ink:#111827;--coral:#ff5d5d;--pink:#ffd9d3;--mint:#d5f0eb;--yellow:#ffdf7d;--lav:#eadcff;}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink)}
.reset-home{min-height:100vh;display:grid;place-items:center;padding:34px;font-family:'Comfortaa',system-ui,sans-serif;background:radial-gradient(circle at 12% 20%,rgba(255,223,125,.65),transparent 160px),radial-gradient(circle at 86% 24%,rgba(213,240,235,.75),transparent 170px),radial-gradient(circle at 72% 82%,rgba(234,220,255,.75),transparent 180px),linear-gradient(180deg,#fffaf3,#fff4ec)}
.card{position:relative;width:min(760px,100%);border-radius:42px;background:rgba(255,255,255,.72);box-shadow:0 26px 80px rgba(62,39,22,.10);padding:54px 46px;text-align:center;overflow:hidden}
.card:before{content:'';position:absolute;left:-50px;top:90px;width:115px;height:190px;background:var(--yellow);border-radius:0 999px 999px 0;opacity:.9}
.card:after{content:'';position:absolute;right:-52px;bottom:76px;width:130px;height:130px;background:var(--mint);border-radius:999px 0 0 999px;opacity:.95}
.logo{position:relative;width:124px;margin:0 auto 28px;font-family:'Gaegu','Comic Sans MS',cursive;font-size:42px;font-weight:700;line-height:.70;letter-spacing:-1px;transform:rotate(-3deg)}
.logo span{display:block}.logo i{position:absolute;right:0;top:-14px;color:var(--coral);font-style:normal;font-size:28px;transform:rotate(12deg)}
.eyebrow{margin:0 0 14px;text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:800;color:#9b6b61}
h1{margin:0;font-family:'Gaegu','Comic Sans MS',cursive;font-size:72px;line-height:.86;letter-spacing:-1px}
.lead{max-width:590px;margin:24px auto 0;font-size:17px;line-height:1.65;font-weight:700}
.actions{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin-top:34px}
.actions a{min-height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 24px;text-decoration:none;font-weight:800;color:var(--ink);border:2px solid var(--ink);background:white}
.actions a:first-child{background:var(--coral);border-color:var(--coral);color:white;box-shadow:0 12px 25px rgba(255,93,93,.22)}
@media(max-width:680px){.reset-home{padding:18px}.card{padding:42px 24px;border-radius:30px}h1{font-size:52px}.lead{font-size:15px}.logo{width:110px;font-size:36px}.actions a{width:100%}}
`;
