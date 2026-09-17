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
   <div className="gifts-hero-copy"><p className="gifts-kicker">{page.kicker}</p><h1>{page.title}</h1><div className="gifts-highlight">{page.highlight}</div><p className="gifts-intro">{page.intro}</p><span className="hero-doodle-heart">♡</span></div>
   <div className="gifts-visual"><div className="hero-brush" aria-hidden="true"></div>{page.heroImage?<img src={page.heroImage} alt="Les petits cadeaux Com’ entre nous"/>:<div className="gifts-photo-placeholder"><span>♡</span><b>Le visuel arrive ici</b><small>On ajoutera votre vraie image depuis l’admin.</small></div>}<div className="gift-note">Des idées toutes simples<br/>à télécharger ! ♡</div></div>
  </div></section>

  <section className="gifts-values"><div className="gifts-wrap gifts-values-grid">
   <article className="gift-value-note"><small>à garder sous la main</small><b>Des choses simples,<br/>vraiment utiles.</b></article>
   <article className="gift-value-note"><small>pour la vraie vie</small><b>À imprimer, tester,<br/>adapter à votre façon.</b></article>
   <article className="gift-value-note"><small>sans contrepartie</small><b>Vous prenez ce qui<br/>vous fait du bien ♡</b></article>
  </div></section>

  <section className="gifts-list"><div className="gifts-wrap"><div className="gifts-heading"><div><h2>Nos petits cadeaux</h2><p className="gifts-kicker">À télécharger librement</p></div><span>Des ressources concrètes<br/>pour une vie plus douce ♡</span></div>
   {published.length?<div className="gifts-grid">{published.map(g=><article className="gift-card" key={g.id}>{g.image?<img src={g.image} alt=""/>:<div className="gift-cover"><span>♡</span><b>{g.title}</b></div>}<div className="gift-copy"><p className="gift-tag">{g.category||'Petit cadeau'}</p><h3>{g.title}</h3><p>{g.description}</p>{g.fileUrl?<Link href={`/les-petits-cadeaux/telecharger/#${g.id}`}>Télécharger ♡</Link>:<span className="gift-soon">Bientôt disponible</span>}</div></article>)}</div>:<div className="gifts-empty"><div className="empty-doodle">♡</div><div><h3>Les premiers petits cadeaux se préparent.</h3><p>Dès qu’on ajoute une ressource depuis l’admin, elle apparaîtra ici dans cette mise en page.</p></div></div>}
  </div></section>

  <section className="gifts-closing"><div className="gifts-wrap"><div className="closing-character" aria-hidden="true"><span>♡</span></div><h2>{page.closing}</h2><div className="closing-note">Merci d’être ici<br/>et de faire partie<br/>de cette belle aventure !<br/>♡</div></div></section>
 </main></LayoutShell>
}
