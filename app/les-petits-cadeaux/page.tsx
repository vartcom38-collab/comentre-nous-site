import { LayoutShell } from '@/components/Site';
import Link from 'next/link';
import gifts from '../../content/gifts.json';
import './gifts.css';

type Gift={id:string;title:string;description:string;category:string;image:string;fileUrl:string;downloadName:string;published:boolean;order:number};

export default function GiftsPage(){
 const published=[...(gifts.gifts as Gift[])].filter(g=>g.published).sort((a,b)=>(a.order||0)-(b.order||0));
 const page=gifts.page;
 return <LayoutShell><main className="gifts-page">
  <section className="gifts-hero"><div className="gifts-wrap gifts-hero-grid">
   <div className="gifts-hero-copy"><p className="gifts-kicker">{page.kicker}</p><h1>{page.title}</h1><div className="gifts-highlight">{page.highlight}</div><p className="gifts-intro">{page.intro}</p><div className="hero-scribble">à prendre, imprimer, tester… et garder si ça vous aide ♡</div></div>
   <div className="gifts-visual">{page.heroImage?<img src={page.heroImage} alt="Les petits cadeaux Com’ entre nous"/>:<div className="gifts-paper-scene" aria-label="Aperçu de l’univers des petits cadeaux"><div className="paper-sheet sheet-back"/><div className="paper-sheet sheet-main"><span className="paper-mini">un petit quelque chose pour…</span><b>les jours où<br/>on manque d’idées</b><div className="paper-line"/><small>à imprimer · à tester · à votre façon</small></div><div className="paper-note note-a">pas besoin que ce soit parfait</div><div className="paper-note note-b">juste utile ♡</div><div className="paper-doodle doodle-one">↝</div><div className="paper-doodle doodle-two">✦</div></div>}<div className="gift-note">Des petites attentions<br/>à télécharger ♡</div></div>
  </div></section>

  <section className="gifts-values"><div className="gifts-wrap gifts-values-grid">
   <article className="gift-value-note note-one"><small>à garder sous la main</small><b>Des choses simples,<br/>vraiment utiles.</b></article>
   <article className="gift-value-note note-two"><small>pour la vraie vie</small><b>À imprimer, tester,<br/>adapter à votre façon.</b></article>
   <article className="gift-value-note note-three"><small>sans contrepartie</small><b>Vous prenez ce qui<br/>vous fait du bien ♡</b></article>
  </div></section>

  <section className="gifts-list"><div className="gifts-wrap"><div className="gifts-heading"><div><p className="gifts-kicker">À télécharger librement</p><h2>Nos petits cadeaux</h2></div><span>Pas de collection pour faire joli : seulement des choses qu’on aurait envie d’avoir sous la main nous aussi.</span></div>
   {published.length?<div className="gifts-grid">{published.map(g=><article className="gift-card" key={g.id}>{g.image?<img src={g.image} alt=""/>:<div className="gift-cover"><span className="gift-cover-mark">com’ entre nous</span><b>{g.title}</b><small>{g.category||'petit cadeau'}</small></div>}<div className="gift-copy"><p className="gift-tag">{g.category||'Petit cadeau'}</p><h3>{g.title}</h3><p>{g.description}</p>{g.fileUrl?<Link href={`/les-petits-cadeaux/telecharger/#${g.id}`}>Découvrir & télécharger ♡</Link>:<span className="gift-soon">Bientôt disponible</span>}</div></article>)}</div>:<div className="gifts-empty"><div className="empty-sketch"><span>un peu de patience</span><b>on prépare<br/>les premiers ♡</b><i>↝</i></div><div><h3>Les premiers petits cadeaux se préparent.</h3><p>On préfère commencer avec peu de choses, mais des ressources qu’on trouve vraiment utiles. Elles apparaîtront ici au fur et à mesure.</p></div></div>}
  </div></section>

  <section className="gifts-closing"><div className="gifts-wrap"><div className="closing-sketch" aria-hidden="true"><span>petite note</span><b>servez-vous ♡</b><i>~~~~</i></div><h2>{page.closing}</h2><div className="closing-note">Vous pouvez revenir piocher ici quand vous voulez.<br/><b>On ajoutera de nouvelles choses au fil du temps.</b></div></div></section>
 </main></LayoutShell>
}
