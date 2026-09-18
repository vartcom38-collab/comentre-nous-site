import { LayoutShell } from '@/components/Site';
import Link from 'next/link';
import './about.css';

export default function AboutPage() {
  return (
    <LayoutShell>
      <main className="about-page">
        <section className="about-hero">
          <div className="about-wrap about-hero-grid">
            <div className="about-hero-copy">
              <p className="about-kicker">→ À propos</p>
              <h1>Derrière Com’ entre nous, il y a surtout… nous <span>♡</span></h1>
              <p className="about-lead">Deux femmes, deux parcours, une même envie : créer des supports utiles, vrais et pensés pour la vie de tous les jours.</p>
              <a className="about-primary" href="#notre-histoire">Découvrir notre histoire →</a>
            </div>
            <div className="about-hero-visual">
              <div className="about-brush" aria-hidden="true" />
              <img src="/uploads/petits-cadeaux-hero-photo.png?v=20260918b" alt="Le duo derrière Com’ entre nous" />
              <div className="about-photo-note">Une aventure<br/>à deux ♡</div>
              <span className="about-doodle d1">♡</span>
              <span className="about-doodle d2">⌇</span>
            </div>
          </div>
        </section>

        <section className="about-story" id="notre-histoire">
          <div className="about-wrap about-story-grid">
            <div className="about-illustration-card">
              <div className="about-drawn-duo" aria-hidden="true">
                <span className="draw-head draw-head-a" />
                <span className="draw-head draw-head-b" />
                <span className="draw-body draw-body-a" />
                <span className="draw-body draw-body-b" />
              </div>
              <p>Deux parcours,<br/>une belle rencontre ♡</p>
            </div>
            <div className="about-story-copy">
              <h2>Notre histoire</h2>
              <p>C’est d’abord une amitié, une envie commune de créer, de partager et de faire une différence, à notre échelle.</p>
              <p>On s’est rencontrées au détour de nos vies de mamans et d’entrepreneuses, et très vite, l’envie de construire quelque chose ensemble s’est imposée comme une évidence. Com’ entre nous est né de nos discussions, de nos idées, de nos petits et grands défis du quotidien, et surtout de la conviction que les bons supports peuvent vraiment changer la façon dont on échange.</p>
            </div>
            <div className="about-quote">
              <span>“</span>
              <p>Des idées qui font du bien, des supports qui rassemblent.</p>
              <b>♡</b>
            </div>
          </div>
        </section>

        <section className="about-people">
          <div className="about-wrap">
            <div className="about-heading">
              <h2>Qui se cache derrière Com’ entre nous ?</h2>
              <p>Deux personnalités complémentaires, un même élan pour imaginer des projets qui vous ressemblent.</p>
            </div>
            <div className="about-people-grid">
              <article className="about-person marion">
                <div className="about-person-photo">
                  <img src="/uploads/petits-cadeaux-hero-photo.png?v=20260918b" alt="" />
                </div>
                <div className="about-person-copy">
                  <h3>Marion</h3>
                  <p className="about-role">Le studio, les idées, l’élan</p>
                  <p>Toujours un carnet à la main, des idées plein la tête et le cœur tourné vers les autres. Je m’occupe de la création des supports, de l’univers visuel et de tout ce qui fait vivre nos idées. J’aime imaginer, dessiner, tester, recommencer… et voir vos retours qui nous boostent chaque jour !</p>
                  <strong>“Rêver, créer, partager… et recommencer !”</strong>
                </div>
              </article>

              <article className="about-person aurelie">
                <div className="about-person-photo">
                  <img src="/uploads/petits-cadeaux-hero-photo.png?v=20260918b" alt="" />
                </div>
                <div className="about-person-copy">
                  <h3>Aurélie</h3>
                  <p className="about-role">La papeterie, le concret, le quotidien</p>
                  <p>J’aime mettre de l’ordre dans les idées, les transformer en projets concrets et les rendre accessibles à toutes. Je m’occupe de la partie plus opérationnelle, de la boutique et je veille à ce que chaque création soit utile, chaleureuse et ancrée dans le réel.</p>
                  <strong>“Des petits pas concrets pour de grands changements.”</strong>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="about-wrap">
            <div className="about-heading">
              <h2>Ce qui nous rassemble</h2>
              <p>Des valeurs qui guident nos choix, nos créations et notre quotidien.</p>
            </div>
            <div className="about-values-grid">
              <article><span>♧</span><h3>La famille</h3><p>Parce qu’elle est notre plus grande source d’inspiration et d’apprentissage.</p></article>
              <article><span>♡</span><h3>La communication</h3><p>Pour des liens plus simples, plus vrais, au quotidien.</p></article>
              <article><span>✦</span><h3>La créativité</h3><p>Une façon de voir la vie et de trouver des solutions autrement.</p></article>
              <article><span>❧</span><h3>Les projets qui ont du sens</h3><p>Ceux qui font du bien, qui rassemblent et qui contribuent à un quotidien plus léger.</p></article>
            </div>
          </div>
        </section>

        <section className="about-work">
          <div className="about-wrap about-work-grid">
            <div>
              <h2>Notre façon de travailler</h2>
              <p>On imagine, on échange, on teste, on ajuste… souvent entre deux cafés, une lessive et une réunion d’école ! Notre créativité se nourrit de notre quotidien, de vos retours et de toutes ces petites situations de vie qui méritent des supports plus simples, plus vrais et plus humains.</p>
            </div>
            <div className="about-sticky">“Une idée à 22h42,<br/>trois vocaux, quatre<br/>captures d’écran…<br/>et c’est parti. ♡”</div>
            <div className="about-mug" aria-hidden="true"><span>☕</span><small>Notre quotidien<br/>en une tasse !</small></div>
          </div>
        </section>

        <section className="about-closing">
          <div className="about-wrap about-closing-inner">
            <div className="about-heart-figure" aria-hidden="true">♡</div>
            <div>
              <h2>“Bienvenue chez nous.<br/>Prenez ce qui vous parle, restez pour le reste. ♡”</h2>
              <p>Merci d’être là, de faire partie de cette belle aventure et de donner du sens à ce que nous créons chaque jour.</p>
            </div>
            <Link href="/com-en-famille" className="about-primary">Découvrir nos univers →</Link>
          </div>
        </section>
      </main>
    </LayoutShell>
  );
}
