'use client';

import {useEffect,useState} from 'react';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
import gifts from '../../../content/gifts.json';
import '../gifts.css';

type Gift={id:string;title:string;description:string;category:string;image:string;fileUrl:string;downloadName:string;published:boolean;order:number};
const all=gifts.gifts as Gift[];

export default function GiftDownloadPage(){
 const [gift,setGift]=useState<Gift|null>(null);
 useEffect(()=>{const id=window.location.hash.replace(/^#/,'');setGift(all.find(g=>g.id===id&&g.published)||null)},[]);
 return <LayoutShell><main className="gifts-page gift-detail-page"><section className="gift-detail-wrap"><Link className="gift-back" href="/les-petits-cadeaux/">← Tous les petits cadeaux</Link>{gift?<><div className="gift-detail-card"><div className="gift-detail-visual">{gift.image?<img src={gift.image} alt=""/>:<div className="gift-cover"><span>♡</span><b>{gift.title}</b></div>}</div><div className="gift-detail-copy"><p className="gifts-kicker">{gift.category||'Petit cadeau'}</p><h1>{gift.title}</h1><p>{gift.description}</p><div className="gift-download-note"><b>C’est cadeau ♡</b><span>Aucun email à laisser : tu peux télécharger directement ton PDF.</span></div>{gift.fileUrl?<a className="gift-download-button" href={gift.fileUrl} download={gift.downloadName||undefined}>Télécharger mon PDF ♡</a>:<span className="gift-soon">Bientôt disponible</span>}</div></div><div className="gift-detail-footer"><span>Un petit coup de pouce à garder sous la main.</span><b>Com’ entre nous ♡</b></div></>:<div className="gifts-empty"><div className="empty-doodle">🎁</div><div><h3>Ce petit cadeau n’est pas disponible.</h3><p>Retourne à la page des petits cadeaux pour voir les ressources actuellement en ligne.</p></div></div>}</section></main></LayoutShell>
}
