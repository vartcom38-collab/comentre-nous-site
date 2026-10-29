'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
import {loadWooCatalog,formatWooPrice} from '@/components/WooCards';
import type {ShopGroup} from '@/src/lib/woo-grouping';
type G=ShopGroup & {category:string};
type DescribedProduct=ShopGroup['primary'] & {description?:string;short_description?:string};
export default function ProductPage(){
 const [group,setGroup]=useState<G|null>(null);
 const [state,setState]=useState<'loading'|'unavailable'|'not-found'|'ready'>('loading');
 useEffect(()=>{let active=true;const id=Number(new URLSearchParams(window.location.search).get('id'));loadWooCatalog().then(groups=>{
  if(!active)return;
  const found=groups.find(g=>g.primary.id===id||g.ebook?.id===id||g.amazon?.id===id);
  if(found){setGroup(found);setState('ready');}else setState('not-found');
 }).catch(()=>{if(active)setState('unavailable');});return()=>{active=false;};},[]);
 return <LayoutShell><main style={{maxWidth:1180,margin:'3rem auto',padding:20}}>
 {state==='loading'&&<p>Chargement du produit…</p>}
 {state==='unavailable'&&<p>La boutique est momentanément indisponible. Merci de réessayer plus tard.</p>}
 {state==='not-found'&&<p>Ce produit n'est pas disponible à la vente.</p>}
 {group&&state==='ready'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:42}}>
 <div>{group.primary.images?.[0]?.src&&<img src={group.primary.images[0].src} alt={group.primary.name} style={{width:'100%',borderRadius:28}}/>}</div>
 <div><p>{group.category==='famille'?'Com’ en famille':'Com’ des entrepreneuses'}</p><h1>{group.primary.name}</h1>{Boolean((group.primary as DescribedProduct).short_description)&&<div style={{lineHeight:1.8,marginBottom:20}} dangerouslySetInnerHTML={{__html:(group.primary as DescribedProduct).short_description||''}}/>}<h2>Choisir mon format</h2>
 {group.ebook&&<div style={{border:'1px solid #ddd',borderRadius:16,padding:18,marginBottom:15}}><h3>Ebook — {formatWooPrice(group.ebook)}</h3><p>Téléchargement numérique après achat.</p><button type="button" data-woo-add={group.ebook.id} style={{display:'inline-block',border:0,cursor:'pointer',padding:'12px 18px',borderRadius:25,background:'#11182a',color:'white'}}>Ajouter au panier</button> <Link href={"/commande/?id="+group.ebook.id} style={{display:"inline-block",padding:"12px 18px",borderRadius:25,border:"1px solid #11182a",color:"#11182a",marginLeft:8}}>Acheter maintenant</Link></div>}
 {group.amazon&&<div style={{border:'1px solid #ddd',borderRadius:16,padding:18}}><h3>Version papier sur Amazon</h3>{group.amazon.product_url?<a href={group.amazon.product_url} target="_blank" rel="noopener noreferrer">Voir sur Amazon ↗</a>:<p>Cette version n'est pas encore disponible.</p>}</div>}
 {(group.primary as DescribedProduct).description&&<section style={{gridColumn:'1 / -1',lineHeight:1.9,marginTop:14}}><h2>Tout savoir sur ce produit</h2><div dangerouslySetInnerHTML={{__html:(group.primary as DescribedProduct).description||''}}/></section>}
 </div>}
 <p><Link href="/boutique/">← Retour à la boutique</Link></p>
 </main></LayoutShell>;
}
