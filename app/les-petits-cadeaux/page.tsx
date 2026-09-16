import { LayoutShell } from '@/components/Site';
import gifts from '../../content/gifts.json';
import './gifts.css';

export default function GiftsPage(){
 const published=[...gifts.gifts].filter(g=>g.published).sort((a,b)=>(a.order||0)-(b.order||0));
 const page=gifts.page;
 return <LayoutShell><main className="gifts-page">
  <section className="gifts-hero"><div className="gifts-wrap gifts-hero-grid">
   <div><p className="gifts-kicker">{page.kicker}</p><h1>{page.title}</h1><div className="gifts-highlight">{page.highlight}</div><p className="gifts-intro">{page.intro}</p></div>
   <div className="gifts-visual">{page.heroImage?<img src={page.heroImage} alt="Les petits cadeaux Com’ entre nous"/>:<div className="gifts-photo-placeholder"><span>♡</span><b>Notre nouvelle image arrive ici</b><small>On la remplacera depuis l’admin.</small></div>}<div className="gift-note">Des petites attentions<br/>à télécharger ♡</div></div>
  </div></section>

  <section className="gifts-values"><div className="gifts-wrap gifts-values-grid"><article><span>🎁</span><b>100 % gratuit</b></article><article><span>♡</span><b>Des ressources utiles<br/>et bienveillantes</b></article><article><span>💡</span><b>Pour simplifier<br/>le quotidien</b></article><article><span>🌈</span><b>Créé avec amour<br/>par nos soins ♡</b></article></div></section>

  <section className="gifts-list"><div className="gifts-wrap"><div className="gifts-heading"><div><p className="gifts-kicker">À télécharger librement</p><h2>Nos petits cadeaux</h2></div><span>Des ressources concrètes pour une vie plus douce ♡</span></div>
   {published.length?<div className="gifts-grid">{published.map(g=><article className="gift-card" key={g.id}>{g.image?<img src={g.image} alt=""/>:<div className="gift-cover"><span>♡</span><b>{g.title}</b></div>}<div className="gift-copy"><p className="gift-tag">{g.category||'Petit cadeau'}</p><h3>{g.title}</h3><p>{g.description}</p>{g.fileUrl?<a href={g.fileUrl} download={g.downloadName||undefined}>Télécharger ♡</a>:<span className="gift-soon">Bientôt disponible</span>}</div></article>)}</div>:<div className="gifts-empty"><div className="empty-doodle">🎁</div><div><h3>Les premiers petits cadeaux se préparent.</h3><p>Cette page est prête : dès qu’on ajoute une ressource dans l’admin et qu’on la publie, elle apparaît ici automatiquement.</p></div></div>}
  </div></section>

  <section className="gifts-closing"><div className="gifts-wrap"><div className="closing-character" aria-hidden="true">♡</div><h2>{page.closing}</h2><div className="closing-note">Merci d’être ici<br/>et de faire partie<br/>de cette belle aventure ! ♡</div></div></section>
 </main></LayoutShell>
}
