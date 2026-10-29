'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {combineFormats,type ShopProduct, type ShopGroup} from '@/src/lib/woo-grouping';

type WooProduct=ShopProduct & {categories?:{slug:string;name:string}[]};
type CatalogGroup=ShopGroup & {category:string};
const allowed=['com-en-famille','com-des-entrepreneuses'];
export async function loadWooCatalog():Promise<CatalogGroup[]>{
 const response=await fetch('/woo-bridge.php?action=public-products',{cache:'no-store'});
 if(!response.ok)throw Error('Passerelle indisponible');
 const data=await response.json();
 if(!data.ok||!Array.isArray(data.products))throw Error('Catalogue indisponible');
 const products:WooProduct[]=data.products.filter((p:WooProduct)=>p.status==='publish'&&(p.categories||[]).some(c=>allowed.includes(c.slug)));
 return combineFormats(products).map(group=>{
  const categories=(group.primary as WooProduct).categories||[];
  const category=categories.some(c=>c.slug==='com-en-famille')?'famille':'entrepreneuses';
  return {...group,category};
 });
}
export function formatWooPrice(product:ShopProduct){
 const number=Number(String(product.price||'').replace(',','.'));
 return Number.isFinite(number)&&String(product.price||'').trim()!==''?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(number):'Prix à venir';
}
export default function WooCards({category,title}:{category?:'famille'|'entrepreneuses';title?:string}){
 const [groups,setGroups]=useState<CatalogGroup[]>([]);
 const [error,setError]=useState(false);
 const [loading,setLoading]=useState(true);
 useEffect(()=>{let cancelled=false;loadWooCatalog().then(items=>{if(!cancelled)setGroups(items.filter(item=>!category||item.category===category));}).catch(()=>{if(!cancelled)setError(true);}).finally(()=>{if(!cancelled)setLoading(false);});return()=>{cancelled=true;};},[category]);
 return <section id={category==='famille'?'collection':category==='entrepreneuses'?'boutique':undefined} className="section" aria-label={title||'Produits WooCommerce'} style={{maxWidth:1300,margin:'2rem auto',padding:'1rem'}}>
 {title&&<h2>{title}</h2>}
 {loading&&<p>Chargement des produits…</p>}
 {error&&<p>Les produits sont momentanément indisponibles. Merci de réessayer un peu plus tard.</p>}
 {!loading&&!error&&groups.length===0&&<p>Nos nouveautés arrivent bientôt. ♡</p>}
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
 {groups.map(group=><article key={group.key} style={{background:'#fff',borderRadius:24,padding:16,boxShadow:'0 10px 36px #0000000d'}}>
 <Link href={'/boutique/produit/?id='+encodeURIComponent(group.primary.id)} style={{textDecoration:'none',color:'inherit'}}>
 {group.primary.images?.[0]?.src?<img src={group.primary.images[0].src} alt={group.primary.name} style={{width:'100%',aspectRatio:'4/3',objectFit:'cover',borderRadius:16}}/>:<div style={{aspectRatio:'4/3',background:'#fff1ea',borderRadius:16}}/>}
 <h3 style={{fontSize:'1.25rem',margin:'14px 0 6px'}}>{group.primary.name}</h3>
 <p>{group.ebook&&group.amazon?'Ebook et version papier':group.amazon?'Version papier':'Version numérique'}</p>
 <strong>{formatWooPrice(group.ebook||group.primary)}</strong>
 <p style={{textDecoration:'underline',fontWeight:700}}>Découvrir le produit →</p></Link>
 </article>)}</div></section>;
}
