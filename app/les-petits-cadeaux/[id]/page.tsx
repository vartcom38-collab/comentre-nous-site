import {notFound} from 'next/navigation';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
import gifts from '../../../content/gifts.json';
import '../gifts.css';

type Gift={id:string;title:string;description:string;category:string;image:string;fileUrl:string;downloadName:string;published:boolean;order:number};
const all=gifts.gifts as Gift[];

export function generateStaticParams(){return all.filter(g=>g.published&&g.fileUrl).map(g=>({id:g.id}))}

export default async function GiftDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const gift=all.find(g=>g.id===id&&g.published);
 if(!gift)notFound();
 return <LayoutShell><main className="gifts-page gift-detail-page"><section className="gift-detail-wrap"><Link className="gift-back" href="/les-petits-cadeaux/">← Tous les petits cadeaux</Link><div className="gift-detail-card"><div className="gift-detail-visual">{gift.image?<img src={gift.image} alt=""/>:<div className="gift-cover"><span>♡</span><b>{gift.title}</b></div>}</div><div className="gift-detail-copy"><p className="gifts-kicker">{gift.category||'Petit cadeau'}</p><h1>{gift.title}</h1><p>{gift.description}</p><div className="gift-download-note"><b>C’est cadeau ♡</b><span>Aucun email à laisser : tu peux télécharger directement ton PDF.</span></div>{gift.fileUrl?<a className="gift-download-button" href={gift.fileUrl} download={gift.downloadName||undefined}>Télécharger mon PDF ♡</a>:<span className="gift-soon">Bientôt disponible</span>}</div></div><div className="gift-detail-footer"><span>Un petit coup de pouce à garder sous la main.</span><b>Com’ entre nous ♡</b></div></section></main></LayoutShell>
}
