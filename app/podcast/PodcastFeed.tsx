'use client';

import { useEffect, useState } from 'react';

type FeedEpisode={id:string;title:string;description:string;publishedAt:string;duration:string;image:string;audioUrl:string;link:string};
type FeedData={connected:boolean;platform:string;feed:{title:string;description:string;image:string;episodes:FeedEpisode[]};feedError:string};

function niceDate(value:string){if(!value)return'';try{return new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value))}catch{return''}}

export default function PodcastFeed(){
 const[data,setData]=useState<FeedData|null>(null);const[error,setError]=useState('');
 useEffect(()=>{fetch('/api/comentre/podcast-feed.php',{cache:'no-store'}).then(r=>r.json()).then(json=>{if(!json.ok)throw new Error(json.error||'Erreur');setData(json)}).catch(e=>setError(e.message))},[]);
 if(error||!data||!data.connected||data.feedError||!data.feed.episodes?.length){return <div className="coming-card"><div className="coming-cover">Com’<br/>entre nous ♡</div><div className="coming-copy"><h3>Bientôt ici !</h3><p>Nos premiers épisodes arrivent très bientôt. Dès que notre plateforme podcast sera reliée, ils apparaîtront ici automatiquement, au fur et à mesure des publications.</p></div></div>}
 return <div className="rss-list">{data.feed.episodes.map((episode,index)=><article className="rss-episode" key={episode.id||`${episode.title}-${index}`}>
  <div className="rss-cover">{episode.image?<img src={episode.image} alt=""/>:<span>Com’<br/>entre nous ♡</span>}</div>
  <div className="rss-copy"><p className="podcast-kicker">{index===0?'Dernier épisode':'Épisode'}{episode.publishedAt?` · ${niceDate(episode.publishedAt)}`:''}{episode.duration?` · ${episode.duration}`:''}</p><h3>{episode.title}</h3><p>{episode.description}</p><div className="rss-actions">{episode.audioUrl&&<audio controls preload="none" src={episode.audioUrl}/>}<a className="podcast-outline" href={episode.link||episode.audioUrl} target="_blank" rel="noreferrer">Ouvrir l’épisode →</a></div></div>
 </article>)}</div>
}
