import { LayoutShell } from '@/components/Site';
import { products } from '@/src/data/products';
import EntrepreneurShop from './EntrepreneurShop';

export default function EntrepreneursPage() {
  const items = products.filter((product) => product.universe === "Com' des entrepreneuses");

  return (
    <LayoutShell>
      <main className="entre-page">
        <style>{styles}</style>

        <section className="entre-hero">
          <div className="entre-hero-copy">
            <p className="entre-eyebrow">♡ Com’ des entrepreneuses</p>
            <h1><span>Des outils pour</span><span>une vie pro qui</span><span>te ressemble.</span></h1>
            <p>Des supports concrets, inspirants et bienveillants pour t’aider à structurer tes idées, avancer à ton rythme et construire un projet qui te ressemble.</p>
            <a href="#boutique" className="entre-primary">Découvrir la boutique →</a>
          </div>

          <div className="entre-hero-visual">
            <img src="/uploads/entrepreneurs-hero-com-murmure.png?v=1" alt="Entrepreneuse dans son espace de travail, accompagnée de petits personnages dessinés" />
          </div>
        </section>

        <section className="entre-promises" aria-label="Ce qui guide Com des entrepreneuses">
          <div><span>✦</span><strong>Des outils concrets et inspirants</strong><p>pensés pour passer de l’idée à l’action</p></div>
          <div><span>♡</span><strong>Pensés par et pour des entrepreneuses</strong><p>avec une vraie vie derrière le projet</p></div>
          <div><span>☼</span><strong>Pour avancer à ton rythme</strong><p>sans pression ni injonction à tout faire</p></div>
          <div><span>⌁</span><strong>Des projets alignés avec tes valeurs</strong><p>pour créer sans te perdre en route</p></div>
        </section>

        <EntrepreneurShop items={items} />
      </main>
    </LayoutShell>
  );
}

const styles = String.raw`
.entre-page{background:linear-gradient(180deg,#fffaf6 0%,#fff8f2 100%);color:#11182a;font-family:var(--body,Comfortaa,system-ui,sans-serif);overflow:hidden}.entre-page h1,.entre-page h2,.entre-page h3{font-family:var(--hand,'Patrick Hand',cursive);letter-spacing:-.02em}.entre-eyebrow{font-size:.75rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin:0 0 1rem}.entre-hero{width:min(1450px,calc(100% - 2rem));margin:1.25rem auto 0;display:grid;grid-template-columns:minmax(0,.95fr) minmax(520px,1.05fr);align-items:center;gap:clamp(2rem,4vw,5rem);padding:clamp(2.4rem,5vw,5.5rem) clamp(1.2rem,4vw,4.5rem);border-radius:2.8rem;background:linear-gradient(135deg,#fff7ef,#ffe8e3 58%,#f8efe8);box-shadow:0 28px 80px rgba(52,34,19,.08)}.entre-hero-copy h1{font-size:clamp(3.35rem,4.9vw,5.35rem);line-height:.96;letter-spacing:0;margin:0 0 1.55rem;max-width:760px}.entre-hero-copy h1 span{display:block;white-space:nowrap}.entre-hero-copy>p:not(.entre-eyebrow){font-size:clamp(1rem,1.2vw,1.16rem);line-height:1.75;max-width:640px}.entre-primary{display:inline-flex;align-items:center;justify-content:center;min-height:3.05rem;margin-top:1.8rem;border-radius:999px;padding:.82rem 1.25rem;background:#ff766d;color:#fff;font-weight:900;box-shadow:0 14px 28px rgba(255,118,109,.25)}.entre-hero-visual{position:relative;min-height:500px;border-radius:3rem 2.2rem 3.4rem 2.6rem;overflow:hidden;background:#fff;box-shadow:0 22px 60px rgba(52,34,19,.12)}.entre-hero-visual img{display:block;width:100%;height:100%;min-height:500px;object-fit:cover;object-position:center}.entre-promises{width:min(1320px,calc(100% - 2rem));margin:2rem auto 0;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}.entre-promises div{text-align:center;padding:1.25rem}.entre-promises span{display:grid;place-items:center;width:4rem;height:4rem;margin:0 auto .9rem;border-radius:50%;background:#ffe6df;font-size:1.8rem}.entre-promises div:nth-child(2) span{background:#ffe9ef}.entre-promises div:nth-child(3) span{background:#fff0c8}.entre-promises div:nth-child(4) span{background:#e3f2ea}.entre-promises strong{display:block;font-size:.9rem}.entre-promises p{font-size:.8rem;line-height:1.5;margin:.35rem 0 0;color:#5d6170}.entre-shop{width:min(1380px,calc(100% - 2rem));margin:3.4rem auto 0;padding:2rem 0 4rem}.entre-shop-head{display:flex;justify-content:space-between;align-items:end;gap:2rem}.entre-shop-head>div:first-child{max-width:760px}.entre-shop-head h2{font-size:clamp(2.7rem,4vw,4.4rem);line-height:.98;margin:.25rem 0 .6rem}.entre-shop-head p{line-height:1.65;color:#555c68}.entre-sort{display:grid;gap:.45rem;min-width:300px}.entre-sort label{font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.entre-sort select{min-height:3rem;border:1.5px solid #11182a;border-radius:999px;background:#fff;padding:0 1rem;font:700 .82rem var(--body,Comfortaa,sans-serif)}.entre-filter-chips{display:flex;flex-wrap:wrap;gap:.6rem;margin:1.5rem 0}.entre-filter-chips button{border:1.5px solid #11182a;border-radius:999px;background:#fff;padding:.6rem .95rem;font-weight:800;cursor:pointer}.entre-filter-chips button.active{background:#11182a;color:#fff}.entre-product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.35rem;margin-top:1.8rem}.entre-product-card{background:#fff;border-radius:2rem;padding:.9rem;box-shadow:0 18px 50px rgba(50,32,20,.08);transition:transform .2s ease,box-shadow .2s ease}.entre-product-card:hover{transform:translateY(-5px);box-shadow:0 24px 64px rgba(50,32,20,.12)}.entre-product-image{display:block;position:relative;aspect-ratio:4/3;border-radius:1.5rem;overflow:hidden;background:#f8e5df}.entre-product-image.mint{background:#def1ea}.entre-product-image.yellow{background:#fff0bf}.entre-product-image.lilac{background:#ece2f8}.entre-product-image img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s ease}.entre-product-card:hover .entre-product-image img{transform:scale(1.02)}.entre-product-image em{position:absolute;left:.75rem;top:.75rem;background:#ff7168;color:white;border-radius:999px;padding:.45rem .75rem;font-style:normal;font-size:.68rem;font-weight:900}.entre-product-placeholder{display:grid;place-items:center;width:100%;height:100%;font:700 4rem var(--hand,'Patrick Hand',cursive)}.entre-product-copy{padding:1rem .45rem .45rem}.entre-product-copy>p{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;font-weight:900;color:#747986;margin:0}.entre-product-copy h3{font-size:2.1rem;line-height:1;margin:.4rem 0 .7rem}.entre-product-copy>span{display:block;font-size:.84rem;line-height:1.65;color:#626773;min-height:2.7em}.entre-product-bottom{display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f0e9e3}.entre-product-bottom strong{font-size:1.08rem}.entre-product-bottom a{font-size:.78rem;font-weight:900}.entre-empty-shop{text-align:center;padding:3rem 1.5rem;border:2px dashed #e2d8cf;border-radius:2rem;background:#fff;margin-top:1.6rem}.entre-empty-shop span{font:700 3rem var(--hand,'Patrick Hand',cursive)}.entre-empty-shop h3{font-size:2.4rem;margin:.3rem 0}.entre-empty-shop p{font-size:.85rem;color:#676c77}@media(max-width:980px){.entre-hero{grid-template-columns:1fr}.entre-hero-copy h1{font-size:clamp(3.2rem,8vw,4.8rem)}.entre-hero-copy h1 span{white-space:normal}.entre-hero-visual,.entre-hero-visual img{min-height:420px}.entre-promises{grid-template-columns:repeat(2,1fr)}.entre-product-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:680px){.entre-hero{width:calc(100% - 1rem);padding:1.5rem;border-radius:1.8rem}.entre-hero-copy h1{font-size:3.05rem;line-height:1}.entre-hero-visual,.entre-hero-visual img{min-height:340px}.entre-promises{grid-template-columns:1fr 1fr}.entre-shop-head{display:grid}.entre-sort{min-width:0;width:100%}.entre-product-grid{grid-template-columns:1fr}}
`;
