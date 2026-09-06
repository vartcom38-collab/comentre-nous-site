import { LayoutShell, PageIntro, Newsletter } from '@/components/Site';

const gifts = ['La boîte à mots', 'Jeu des émotions', 'Mini carnet de gratitude', 'Kit de rentrée'];

export default function GiftsPage() {
  return <LayoutShell><main><PageIntro kicker="Ressources gratuites" title="Les petits cadeaux" text="Des ressources gratuites pour semer du lien au quotidien : fiches à imprimer, mini-jeux, petits rituels et idées toutes simples." /><section className="section"><div className="product-grid">{gifts.map((gift) => <article className="gift-card" key={gift}><p className="tag">À télécharger</p><h3>{gift}</h3><p>Un petit support doux et utile pour créer un moment de discussion, d’écoute ou de créativité.</p><a className="dark-btn" href="#">Télécharger →</a></article>)}</div></section><section className="content-card"><h2>Des petits cadeaux pour de grands moments.</h2><p>Cette page servira aussi à faire grandir votre liste email, avec des bonus gratuits vraiment utiles et alignés avec l’univers.</p></section><Newsletter /></main></LayoutShell>;
}
