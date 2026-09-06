import { LayoutShell, PageIntro, Newsletter } from '@/components/Site';

const episodes = ['Qui sommes-nous ?', 'C’est quoi Com’entre Nous ?', 'Quand les mots restent coincés', 'Être parent sans mode d’emploi', 'Créer un projet à deux', 'Les émotions dans la vraie vie'];

export default function PodcastPage() {
  return <LayoutShell><main><PageIntro kicker="Le podcast" title="Com’ entre nous, le podcast" text="Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse entre deux cafés froids." /><section className="content-card"><h2>Dernier épisode</h2><div className="episode-card"><p className="tag">Épisode 01</p><h3>Qui sommes-nous ?</h3><p>Notre rencontre, notre histoire, nos déclics, et pourquoi Com’entre Nous est né.</p><a className="dark-btn" href="#">Écouter →</a></div></section><section className="section"><div className="section-title"><h2>Tous les épisodes</h2></div><div className="steps">{episodes.map((episode, index) => <a href="#" key={episode}><span>{String(index + 1).padStart(2, '0')}</span><h3>{episode}</h3><p>Écouter l’épisode →</p></a>)}</div></section><section className="content-card"><h2>Les thèmes</h2><p>Parentalité · Émotions · Communication · Famille · Entrepreneuriat · Créativité · Vie quotidienne · Coulisses</p></section><Newsletter /></main></LayoutShell>;
}
