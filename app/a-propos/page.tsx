import { LayoutShell } from '@/components/Site';
import Link from 'next/link';
import about from '../../content/about.json';
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
              <p className="about-lead">Deux femmes, deux parcours, une même envie : imaginer des supports utiles, pensés pour accompagner le quotidien.</p>
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
          <div className="about-wrap about-story-grid about-story-text-only">
            <div className="about-story-copy">
              <h2>Notre histoire</h2>
              <p>À la base, on ne se connaissait pas. On vivait à des kilomètres l’une de l’autre, avec des vies très différentes : Aurélie, maman de trois enfants, et Marion, pas maman… mais clairement <strong>la tata</strong>.</p>
              <p>On s’est rencontrées grâce à un accompagnement entre entrepreneuses. Au fil des échanges, on a commencé à créer ensemble, un peu sans plan précis au départ. Et très vite, on s’est rendu compte que ça fonctionnait bien : Marion avait imaginé un premier outil, Aurélie pouvait venir l’enrichir avec son univers de papeterie, et nos idées se complétaient naturellement.</p>
              <p>C’est comme ça que <strong>Com’ entre nous</strong> a commencé à prendre forme.</p>
              <p>Petit à petit, le projet est devenu plus grand que ce premier produit. On avait envie de partir de nos expériences différentes — celle d’une maman et celle d’une tata — pour créer des supports qui facilitent les échanges, ouvrent la discussion et accompagnent les moments importants de la vie.</p>
              <p>Et surtout, on ne veut pas parler uniquement aux parents. Demain, <strong>Com’ entre nous</strong> pourra aussi imaginer des outils autour de la grossesse, du couple, de la famille, de l’entrepreneuriat ou d’autres étapes de vie, toujours avec la même intention : <strong>aider à avancer, à mieux se comprendre et à mieux communiquer</strong>, avec l’appui de professionnels lorsque les sujets le demandent.</p>
              <p className="about-story-signoff"><strong>Deux parcours très différents, des kilomètres entre nous… et finalement une même envie de créer des choses qui ont du sens. ♡</strong></p>
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
                  <h3>{about.people.marion.name}</h3>
                  <p className="about-role">{about.people.marion.role}</p>
                  <p>{about.people.marion.text}</p>
                  {about.people.marion.quote && <strong>“{about.people.marion.quote}”</strong>}
                </div>
              </article>

              <article className="about-person aurelie">
                <div className="about-person-photo">
                  <img src="/uploads/petits-cadeaux-hero-photo.png?v=20260918b" alt="" />
                </div>
                <div className="about-person-copy">
                  <h3>{about.people.aurelie.name}</h3>
                  <p className="about-role">{about.people.aurelie.role}</p>
                  <p>{about.people.aurelie.text}</p>
                  {about.people.aurelie.quote && <strong>“{about.people.aurelie.quote}”</strong>}
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
