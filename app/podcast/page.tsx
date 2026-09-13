import { LayoutShell, PageIntro, Newsletter } from '@/components/Site';
import podcast from '../../content/podcast.json';

function episodeUrl(episode: (typeof podcast.episodes)[number]) {
  return episode.spotifyUrl || episode.appleUrl || episode.youtubeUrl || episode.externalUrl || '#';
}

export default function PodcastPage() {
  const episodes = [...podcast.episodes].filter((episode) => episode.published).sort((a, b) => b.number - a.number);
  const latest = episodes[0];

  return <LayoutShell><main>
    <PageIntro kicker={podcast.page.kicker} title={podcast.page.title} text={podcast.page.intro} />
    <section className="content-card"><h2>Dernier épisode</h2>{latest ? <div className="episode-card">{latest.image && <img src={latest.image} alt="" style={{width:'100%',maxWidth:560,borderRadius:24,marginBottom:18}}/>}<p className="tag">Épisode {String(latest.number).padStart(2, '0')}{latest.duration ? ` · ${latest.duration}` : ''}</p><h3>{latest.title}</h3><p>{latest.description}</p><a className="dark-btn" href={episodeUrl(latest)} target="_blank" rel="noreferrer">Écouter →</a></div> : <p>Le premier épisode arrive bientôt.</p>}</section>
    <section className="section"><div className="section-title"><h2>Tous les épisodes</h2></div>{episodes.length ? <div className="steps">{episodes.map((episode) => <a href={episodeUrl(episode)} target="_blank" rel="noreferrer" key={episode.id}><span>{String(episode.number).padStart(2, '0')}</span><h3>{episode.title}</h3><p>{episode.description || 'Écouter l’épisode →'}</p></a>)}</div> : <p>Aucun épisode publié pour le moment.</p>}</section>
    <section className="content-card"><h2>Les thèmes</h2><p>{podcast.page.themes}</p></section>
    <Newsletter />
  </main></LayoutShell>;
}
