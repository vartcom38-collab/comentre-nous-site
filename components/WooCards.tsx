'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {combineFormats,type ShopProduct,type ShopGroup} from '@/src/lib/woo-grouping';
import styles from './woo-cards.module.css';

type WooProduct=ShopProduct & {
 categories?:{slug:string;name:string}[];
 short_description?:string;
 image?:string;
};
type CatalogGroup=ShopGroup & {category:string};
const allowed=['com-en-famille','com-des-entrepreneuses'];

export async function loadWooCatalog(source:'active'|'commerce'='active'):Promise<CatalogGroup[]>{
 const endpoint=source==='commerce'?'/woo-commerce-catalog.php':'/woo-bridge.php?action=public-products';
 const response=await fetch(endpoint,{cache:'no-store'});
 if(!response.ok)throw Error('Passerelle WooCommerce indisponible');
 const data=await response.json();
 if(!data.ok||!Array.isArray(data.products))throw Error('Catalogue indisponible');
 const products:WooProduct[]=data.products
  .filter((p:WooProduct)=>p.status==='publish')
  .map((p:WooProduct)=>({...p,images:Array.isArray(p.images)?p.images:[],sku:p.sku||''}));
 const selected=source==='active'
  ? products.filter(p=>(p.categories||[]).some(c=>allowed.includes(c.slug)))
  : products;
 return combineFormats(selected).map(group=>{
  const categories=(group.primary as WooProduct).categories||[];
  const category=categories.some(c=>c.slug==='com-des-entrepreneuses')?'entrepreneuses':'famille';
  return {...group,category};
 });
}
export function formatWooPrice(product:ShopProduct){
 const number=Number(String(product.price||'').replace(',','.'));
 return Number.isFinite(number)&&String(product.price||'').trim()!==''
  ?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(number)
  :'Prix à venir';
}
export default function WooCards({category,title}:{category?:'famille'|'entrepreneuses';title?:string}){
 const [groups,setGroups]=useState<CatalogGroup[]>([]);
 const [error,setError]=useState(false);
 const [loading,setLoading]=useState(true);
 const [preview,setPreview]=useState(false);
 useEffect(()=>{
  let cancelled=false;
  const source=typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('source')==='commerce'?'commerce':'active';
  setPreview(source==='commerce');
  setError(false);setLoading(true);
  loadWooCatalog(source).then(items=>{
   if(!cancelled)setGroups(items.filter(item=>!category||item.category===category));
  }).catch(()=>{if(!cancelled)setError(true);})
   .finally(()=>{if(!cancelled)setLoading(false);});
  return()=>{cancelled=true;};
 },[category]);
 return <section id={category==='famille'?'collection':category==='entrepreneuses'?'boutique':undefined} className={styles.section} aria-label={title||'Produits WooCommerce'}>
 {title&&<h2 className={styles.title}>{title}</h2>}
 {preview&&<div role="status" className={styles.preview}><strong>Aperçu du futur catalogue Com’ entre nous</strong><span>Produits récupérés de notre nouveau WooCommerce dans /commerce/. Aucun achat possible sur cet aperçu.</span></div>}
 {loading&&<p role="status" className={styles.message}>On prépare nos créations… ♡</p>}
 {error&&<p role="alert" className={styles.message}>Les produits sont momentanément indisponibles. Vérifie la connexion WooCommerce.</p>}
 {!loading&&!error&&groups.length===0&&<div className={styles.empty}><span>♡</span><h2>De jolies choses se préparent…</h2><p>{preview?'Le nouveau catalogue ne contient encore aucun produit publié. Ton ebook de démonstration reste en brouillon.':'Nos nouveautés arrivent bientôt.'}</p></div>}
 <div className={styles.grid}>
 {groups.map((group,i)=>{
  const product=group.primary as WooProduct;
  const price=group.ebook||group.primary;
  const href='/boutique/produit/?id='+encodeURIComponent(product.id)+(preview?'&source=commerce':'');
  return <article key={group.key} className={styles.card}>
   <Link href={href} className={styles.link}>
    <div className={styles.visual}>
     {product.images?.[0]?.src?<img src={product.images[0].src} alt={product.name}/>:<div className={styles.placeholder}>♡</div>}
     <span className={styles.sticker}>{i%2===0?'À découvrir':'Coup de cœur ♡'}</span>
    </div>
    <div className={styles.copy}>
     <p className={styles.kicker}>{group.category==='entrepreneuses'?'Com’ des entrepreneuses':'Com’ en famille'}</p>
     <h3>{product.name}</h3>
     <p className={styles.format}>{group.ebook&&group.amazon?'Numérique et papier':group.amazon?'Version papier':group.ebook?'Version numérique':'Une création Com’ entre nous'}</p>
     <div className={styles.bottom}><strong>{formatWooPrice(price)}</strong><span>Découvrir ↗</span></div>
    </div>
   </Link>
   {preview&&<p className={styles.noBuy}>Prévisualisation · vente désactivée</p>}
  </article>;
 })}
 </div>
 </section>;
}
