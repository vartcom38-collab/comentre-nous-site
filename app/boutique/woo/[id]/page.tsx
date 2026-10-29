import {notFound} from 'next/navigation';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
import {wooCatalog,wooImage,wooPrice} from '@/src/lib/woo-public';
export const dynamic='force-dynamic';
export default async function WooProductPage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!/^\d+$/.test(id))notFound();
 let groups;try{groups=await wooCatalog()}catch(error){console.error('WooCommerce unavailable',error);return <LayoutShell><main style={{maxWidth:900,margin:'5rem auto',padding:20}}><h1>La boutique est momentanément indisponible</h1><p>Les achats ne sont pas accessibles tant que le catalogue ne répond pas.</p><Link href="/boutique">Retour à la boutique</Link></main></LayoutShell>;}
 const group=groups.find(g=>g.primary.id===Number(id)||g.ebook?.id===Number(id)||g.amazon?.id===Number(id));
 if(!group)notFound();
 const image=wooImage(group.primary);
 return <LayoutShell><main style={{maxWidth:1180,margin:'3rem auto',padding:20,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:42}}>
 <div>{image&&<img src={image} alt={group.primary.name} style={{width:'100%',borderRadius:28}}/>}</div>
 <div><p>{group.category==='famille'?'Com’ en famille':'Com’ des entrepreneuses'}</p><h1>{group.primary.name}</h1>
 <div dangerouslySetInnerHTML={{__html:(group.primary as typeof group.primary & {short_description?:string}).short_description||''}}/>
 <h2>Choisir mon format</h2>
 {group.ebook&&<div style={{border:'1px solid #ddd',borderRadius:16,padding:18,marginBottom:15}}><h3>Ebook — {wooPrice(group.ebook)}</h3><p>Version numérique, paiement et livraison gérés par WooCommerce.</p><a href={group.ebook.permalink} style={{display:'inline-block',padding:'12px 18px',borderRadius:25,background:'#11182a',color:'white'}}>Acheter l’ebook</a></div>}
 {group.amazon&&<div style={{border:'1px solid #ddd',borderRadius:16,padding:18}}><h3>Version papier sur Amazon</h3><p>Commande et livraison sur Amazon.</p>{group.amazon.product_url?<a href={group.amazon.product_url} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'12px 18px',borderRadius:25,background:'#11182a',color:'white'}}>Voir sur Amazon ↗</a>:<p>Cette version n’est pas encore disponible à l’achat.</p>}</div>}
 <p><Link href="/boutique">← Retour à la boutique</Link></p></div>
 </main></LayoutShell>;
}