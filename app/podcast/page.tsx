import { LayoutShell } from '@/components/Site';
import podcast from '../../content/podcast.json';
import './podcast.css';

function episodeUrl(episode: (typeof podcast.episodes)[number]) {
  return episode.spotifyUrl || episode.appleUrl || episode.youtubeUrl || episode.externalUrl || '#';
}

export default function PodcastPage() {
  const episodes = [...podcast.episodes].filter((episode) => episode.published).sort((a, b) => b.number - a.number);
  const latest = episodes[0];
  const page = podcast.page;
  const platforms = [
    {label:'Spotify',icon:'◉',url:page.spotifyUrl},
    {label:'Apple Podcasts',icon:'◌',url:page.appleUrl},
    {label:'YouTube',icon:'▶',url:page.youtubeUrl},
  ];
  const promises = [
    ['🎧','Des sujets du quotidien','qui nous parlent à toutes'],
    ['💬','Des échanges sincères','et bienveillants'],
    ['♡','Des idées concrètes','à ramener dans la vraie vie'],
    ['☕','Une bonne dose','de bonne humeur'],
    ['✦','Des invité·es','inspirant·es'],
  ];

  return <LayoutShell><main className="podcast-page">
    <section className="podcast-hero"><div className="podcast-wrap podcast-hero-grid">
      <div>
        <p className="podcast-kicker">{page.kicker}</p>
        <h1 className="podcast-title">{page.title}</h1>
        <div className="podcast-highlight">{page.intro}</div>
        <p className="podcast-intro">{page.body}</p>
        <div className="podcast-actions"><span className="podcast-pill">🎙 Le podcast arrive bientôt</span><a className="podcast-outline" href="#episodes">Voir l’espace épisodes</a></div>
      </div>
      <div className="podcast-photo"><img src={podcast.homepage.image} alt="Marion et Aurélie, Com’ entre nous"/><div className="podcast-note">Deux voix, une même envie : partager, soutenir, inspirer</div></div>
    </div></section>

    <section className="promise-strip"><div className="podcast-wrap promise-grid">{promises.map(([icon,title,text])=><article className="promise-card" key={title}><span className="promise-icon">{icon}</span><b>{title}<br/>{text}</b></article>)}</div></section>

    <section className="episodes-zone" id="episodes"><div className="podcast-wrap">
      <h2 className="section-hand-title">Les épisodes</h2><p className="section-sub">À écouter bientôt sur votre plateforme préférée</p>
      {latest ? <div className="coming-card"><div className="coming-cover">{latest.image?<img src={latest.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:18}}/>:<span>Com’<br/>entre nous ♡</span>}</div><div className="coming-copy"><p className="podcast-kicker">Épisode {String(latest.number).padStart(2,'0')}{latest.duration?` · ${latest.duration}`:''}</p><h3>{latest.title}</h3><p>{latest.description}</p><a className="podcast-pill" href={episodeUrl(latest)} target="_blank" rel="noreferrer">Écouter l’épisode →</a></div></div> : <div className="coming-card"><div className="coming-cover">Com’<br/>entre nous ♡</div><div className="coming-copy"><h3>Bientôt ici !</h3><p>Nos premiers épisodes arrivent très bientôt. Dès que le podcast sera connecté, cette zone affichera automatiquement l’aperçu des épisodes et les liens d’écoute.</p><div className="platforms">{platforms.map(platform=>platform.url?<a className="platform" href={platform.url} target="_blank" rel="noreferrer" key={platform.label}><span>{platform.icon}</span>{platform.label}</a>:<span className="platform disabled" key={platform.label}><span>{platform.icon}</span>{platform.label} · bientôt</span>)}</div></div></div>}
    </div></section>

    <section className="why-zone"><div className="podcast-wrap why-card"><div><h2>{page.whyTitle}</h2><p>{page.whyText}</p></div><div className="why-note">{page.closing}<br/>♡</div></div></section>

    <section className="themes-zone"><div className="podcast-wrap"><p className="section-sub" style={{textAlign:'center'}}>On parlera notamment de</p><div className="theme-cloud">{page.themes.split('·').map(theme=><span key={theme.trim()}>{theme.trim()}</span>)}</div></div></section>

    <section className="podcast-closing"><p>{page.platformLabel}</p><div className="platforms" style={{justifyContent:'center'}}>{platforms.map(platform=>platform.url?<a className="platform" href={platform.url} target="_blank" rel="noreferrer" key={platform.label}>{platform.icon} {platform.label}</a>:<span className="platform disabled" key={platform.label}>{platform.icon} {platform.label}</span>)}</div><span>♡</span></section>
  </main></LayoutShell>;
}
