import Link from 'next/link';
import { LayoutShell } from '@/components/Site';
import { products } from '@/src/data/products';
import FamilyShop from './FamilyShop';

export default function FamilyPage() {
  const items = products.filter((product) => product.universe === "Com' en famille");

  return (
    <LayoutShell>
      <main className="family-page">
        <style>{styles}</style>

        <section className="family-hero">
          <div className="family-hero-copy">
            <p className="family-eyebrow">♡ Com’ en famille</p>
            <h1><span>Des outils pour</span><span>grandir, s’exprimer</span><span>et se comprendre.</span></h1>
            <p>Des supports ludiques, doux et concrets pour aider les enfants et les parents à mieux communiquer dans la vraie vie.</p>
            <div className="family-hero-actions">
              <a href="#collection" className="family-primary">Découvrir les outils →</a>
              <Link href="/a-propos" className="family-secondary">Notre approche</Link>
            </div>
          </div>
          <div className="family-hero-visual">
            <img src="/uploads/family-hero-com-en-famille.png?v=1" alt="Un moment complice en famille autour de cartes d’émotions" />
            <span className="family-note">Des petits outils<br />pour de grands échanges ♡</span>
            <div className="family-bubble"><span>Écouter</span><span>Exprimer</span><span>Partager</span><span>Grandir</span></div>
          </div>
        </section>

        <section className="family-promises" aria-label="Ce qui guide Com en famille">
          <div><span>✦</span><strong>Des outils concrets</strong><p>pour la vie de tous les jours</p></div>
          <div><span>♡</span><strong>Pensés avec bienveillance</strong><p>sans discours culpabilisant</p></div>
          <div><span>⌁</span><strong>Pour les enfants et les parents</strong><p>chacun trouve sa place</p></div>
          <div><span>☼</span><strong>Ludiques et inspirants</strong><p>pour donner envie d’échanger</p></div>
        </section>

        <section className="family-why">
          <div className="family-character-panel" aria-label="Espace réservé aux personnages Com entre nous">
            <span className="family-heart-one">♡</span>
            <span className="family-heart-two">♡</span>
            <div className="family-character-card"><b>Nos personnages</b><p>Ici, on mettra vos vrais personnages illustrés Com’ entre nous.</p></div>
          </div>
          <div className="family-why-copy">
            <p className="family-eyebrow">Créer du lien au quotidien</p>
            <h2>Parce que les mots créent des liens…</h2>
            <p>Com’ en famille rassemble des outils pensés pour ouvrir la discussion, aider à mettre des mots sur ce qui se passe à l’intérieur et créer des moments de complicité, sans transformer le quotidien en séance pédagogique.</p>
            <Link href="/a-propos" className="family-secondary">Découvrir notre démarche →</Link>
          </div>
          <div className="family-situations">
            <h3>Pour quelles situations ?</h3>
            <ul>
              <li>Mieux traverser les émotions</li>
              <li>Apaiser les tensions du quotidien</li>
              <li>Favoriser l’écoute et l’empathie</li>
              <li>Renforcer la confiance en soi</li>
              <li>Créer des moments de complicité</li>
              <li>Aborder les sujets importants plus facilement</li>
            </ul>
          </div>
        </section>

        <section className="family-bridge">
          <p>Pas besoin d’avoir les mots parfaits.</p>
          <h2>Il suffit parfois d’un petit support pour que la conversation commence.</h2>
        </section>

        <FamilyShop items={items} />

        <section className="family-closing">
          <div><span>♡</span><p>« Des conversations d’aujourd’hui pour des liens plus forts demain. »</p></div>
          <a href="#collection" className="family-primary">Voir toute la collection →</a>
        </section>
      </main>
    </LayoutShell>
  );
}

const styles = String.raw`
.family-page{background:linear-gradient(180deg,#fffaf4 0%,#fff8ef 100%);color:#11182a;font-family:var(--body,Comfortaa,system-ui,sans-serif);overflow:hidden}.family-page h1,.family-page h2,.family-page h3{font-family:var(--hand,'Patrick Hand',cursive);letter-spacing:-.02em}.family-eyebrow{font-size:.75rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0 0 1rem}.family-hero{width:min(1450px,calc(100% - 2rem));margin:1.25rem auto 0;display:grid;grid-template-columns:minmax(0,.92fr) minmax(520px,1.08fr);align-items:center;gap:clamp(2rem,4vw,5rem);padding:clamp(2.4rem,5vw,5.5rem) clamp(1.2rem,4vw,4.5rem);border-radius:2.8rem;background:linear-gradient(135deg,#fff8ee,#ffe9e4 54%,#e5f5ef);box-shadow:0 28px 80px rgba(52,34,19,.08)}.family-hero-copy h1{font-size:clamp(3.35rem,4.8vw,5.3rem);line-height:.96;letter-spacing:0;margin:0 0 1.55rem;max-width:760px}.family-hero-copy h1 span{display:block;white-space:nowrap}.family-hero-copy>p:not(.family-eyebrow){font-size:clamp(1rem,1.2vw,1.16rem);line-height:1.75;max-width:640px}.family-hero-actions{display:flex;flex-wrap:wrap;gap:.9rem;margin-top:1.8rem}.family-primary,.family-secondary{display:inline-flex;align-items:center;justify-content:center;min-height:3.05rem;border-radius:999px;padding:.82rem 1.25rem;font-weight:900}.family-primary{background:#ff766d;color:#fff;box-shadow:0 14px 28px rgba(255,118,109,.25)}.family-secondary{border:2px solid #11182a;background:#fff;color:#11182a}.family-hero-visual{position:relative;min-height:500px;border-radius:3rem 2.2rem 3.4rem 2.6rem;overflow:hidden;background:#fff;box-shadow:0 22px 60px rgba(52,34,19,.13)}.family-hero-visual img{width:100%;height:100%;min-height:500px;object-fit:cover;display:block}.family-note{position:absolute;left:1.5rem;top:1.45rem;background:rgba(255,255,255,.92);padding:.9rem 1rem;border-radius:1.2rem;font:700 1.45rem/1.05 var(--hand,'Patrick Hand',cursive);transform:rotate(-4deg);box-shadow:0 10px 24px rgba(30,20,10,.1)}.family-bubble{position:absolute;right:1.3rem;top:1.5rem;width:155px;height:190px;border-radius:46% 54% 52% 48%;background:rgba(255,193,185,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4rem;font:700 1.28rem/1 var(--hand,'Patrick Hand',cursive);transform:rotate(4deg)}.family-promises{width:min(1320px,calc(100% - 2rem));margin:2rem auto 0;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.family-promises div{text-align:center;padding:1.2rem}.family-promises span{display:grid;place-items:center;width:4rem;height:4rem;margin:0 auto .9rem;border-radius:50%;background:#ffe5dd;font-size:1.8rem}.family-promises div:nth-child(2) span{background:#ffe9ef}.family-promises div:nth-child(3) span{background:#fff0b9}.family-promises div:nth-child(4) span{background:#dcf4e6}.family-promises strong{display:block;font-size:.9rem}.family-promises p{font-size:.8rem;line-height:1.5;margin:.35rem 0 0;color:#5d6170}.family-why{width:min(1380px,calc(100% - 2rem));margin:3.2rem auto;display:grid;grid-template-columns:.82fr 1.1fr .9fr;gap:clamp(1.2rem,3vw,3.2rem);align-items:center}.family-character-panel{min-height:330px;border-radius:2.4rem;background:linear-gradient(145deg,#ffe0d8,#fff2e9);position:relative;display:grid;place-items:center;overflow:hidden}.family-character-card{width:68%;padding:1.4rem;border:2px dashed rgba(17,24,42,.32);border-radius:1.5rem;background:rgba(255,255,255,.68);text-align:center}.family-character-card b{font:700 2rem/1 var(--hand,'Patrick Hand',cursive)}.family-character-card p{font-size:.78rem;line-height:1.55}.family-heart-one,.family-heart-two{position:absolute;font:700 2.2rem var(--hand,'Patrick Hand',cursive)}.family-heart-one{left:1.4rem;top:1rem;transform:rotate(-10deg)}.family-heart-two{right:1.5rem;bottom:1.3rem;transform:rotate(10deg)}.family-why-copy h2,.family-situations h3,.family-shop h2,.family-bridge h2{font-size:clamp(2.7rem,4vw,4.4rem);line-height:.98;margin:.2rem 0 1rem}.family-why-copy>p:not(.family-eyebrow){line-height:1.8;color:#444b5a}.family-situations{padding:2rem;border-radius:2rem;background:#e8f7f2;box-shadow:0 16px 40px rgba(31,67,58,.07)}.family-situations h3{font-size:2.5rem}.family-situations ul{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:.8rem}.family-situations li{font-size:.85rem;line-height:1.5;padding-left:1.5rem;position:relative}.family-situations li:before{content:'✓';position:absolute;left:0;font-weight:900}.family-bridge{width:min(1180px,calc(100% - 2rem));margin:4rem auto 2rem;text-align:center;padding:2.8rem 1.5rem;border-radius:2.5rem;background:linear-gradient(90deg,#fff1e9,#eaf7f3)}.family-bridge p{font-size:.75rem;text-transform:uppercase;letter-spacing:.14em;font-weight:900}.family-bridge h2{max-width:850px;margin:.5rem auto 0}.family-shop{width:min(1380px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 3rem}.family-shop-head{display:flex;justify-content:space-between;align-items:end;gap:2rem}.family-shop-head>div:first-child{max-width:760px}.family-shop-head h2{margin:.25rem 0 .6rem}.family-shop-head p{line-height:1.65;color:#555c68}.family-sort{display:grid;gap:.45rem;min-width:300px}.family-sort label{font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.family-sort select{min-height:3rem;border:1.5px solid #11182a;border-radius:999px;background:#fff;padding:0 1rem;font:700 .82rem var(--body,Comfortaa,sans-serif)}.family-filter-chips{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.5rem 0}.family-filter-chips button{border:1.5px solid #11182a;border-radius:999px;background:#fff;padding:.6rem .95rem;font-weight:800;cursor:pointer}.family-filter-chips button.active{background:#11182a;color:#fff}.family-product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.3rem;margin-top:1.8rem}.family-product-card{background:#fff;border-radius:2rem;padding:.9rem;box-shadow:0 18px 50px rgba(50,32,20,.08)}.family-product-image{display:block;position:relative;aspect-ratio:4/3;border-radius:1.5rem;overflow:hidden;background:#ffe9df}.family-product-image.mint{background:#ddf5ee}.family-product-image.yellow{background:#fff0b9}.family-product-image img{width:100%;height:100%;object-fit:cover;display:block}.family-product-image em{position:absolute;left:.75rem;top:.75rem;background:#11182a;color:white;border-radius:999px;padding:.45rem .7rem;font-style:normal;font-size:.68rem;font-weight:900}.family-product-placeholder{display:grid;place-items:center;width:100%;height:100%;font:700 3.5rem var(--hand,'Patrick Hand',cursive)}.family-product-copy{padding:.9rem .4rem .35rem}.family-product-copy>p{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;font-weight:900;color:#747986}.family-product-copy h3{font-size:2rem;margin:.35rem 0 1rem}.family-product-bottom{display:flex;justify-content:space-between;gap:1rem;align-items:center}.family-product-bottom a{font-size:.78rem;font-weight:900}.family-empty-shop{text-align:center;padding:3rem 1.5rem;border:2px dashed #e2d8cf;border-radius:2rem;background:#fff;margin-top:1.6rem}.family-empty-shop span{font:700 3rem var(--hand,'Patrick Hand',cursive)}.family-empty-shop h3{font-size:2.4rem;margin:.3rem 0}.family-empty-shop p{font-size:.85rem;color:#676c77}.family-closing{width:min(1380px,calc(100% - 2rem));margin:1rem auto 4rem;padding:2.2rem 2.5rem;border-radius:2.4rem;background:linear-gradient(90deg,#e5f6f1,#fff1e7);display:flex;justify-content:space-between;align-items:center;gap:2rem}.family-closing div{display:flex;align-items:center;gap:1rem}.family-closing div span{font:700 2.5rem var(--hand,'Patrick Hand',cursive)}.family-closing p{font:700 clamp(2rem,3vw,3.2rem)/1 var(--hand,'Patrick Hand',cursive);margin:0;max-width:800px}@media(max-width:980px){.family-hero{grid-template-columns:1fr}.family-hero-copy h1{font-size:clamp(3.2rem,8vw,4.8rem)}.family-hero-copy h1 span{white-space:normal}.family-hero-visual{min-height:420px}.family-promises{grid-template-columns:repeat(2,1fr)}.family-why{grid-template-columns:1fr 1fr}.family-situations{grid-column:1/-1}.family-product-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:680px){.family-hero{width:calc(100% - 1rem);padding:1.5rem;border-radius:1.8rem}.family-hero-copy h1{font-size:3.05rem;line-height:1}.family-hero-visual,.family-hero-visual img{min-height:340px}.family-note{font-size:1.1rem}.family-bubble{width:120px;height:150px;font-size:1rem}.family-promises{grid-template-columns:1fr 1fr}.family-why{grid-template-columns:1fr}.family-shop-head{display:grid}.family-sort{min-width:0;width:100%}.family-product-grid{grid-template-columns:1fr}.family-closing{display:grid;padding:1.6rem}.family-closing div{align-items:flex-start}}
`;
