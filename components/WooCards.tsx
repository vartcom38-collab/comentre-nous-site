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
const categorySlugs={famille:'com-en-famille',entrepreneuses:'com-des-entrepreneuses'} as const;

const CATALOG_CACHE_KEY='comentre-woo-catalog-published-v3';
const CATALOG_TTL_MS=2*60*1000;
let inFlight:Promise<WooProduct[]>|null=null;
let memoryCache:{at:number;products:WooProduct[]}|null=null;

// Les données publiques déjà consultées sont réutilisées au lieu de bloquer
// chaque navigation sur une nouvelle requête PHP/WooCommerce.
export function cachedWooProducts():WooProduct[]|null{
 if(memoryCache&&Date.now()-memoryCache.at<CATALOG_TTL_MS)return memoryCache.products;
 if(typeof window==='undefined')return null;
 try{
  const stored=JSON.parse(sessionStorage.getItem(CATALOG_CACHE_KEY)||'null');
  if(stored&&Array.isArray(stored.products)&&Date.now()-stored.at<CATALOG_TTL_MS){
   memoryCache=stored;
   return stored.products;
  }
 }catch{/* Stockage privé désactivé : on charge normalement. */}
 return null;
}
export async function fetchWooProducts():Promise<WooProduct[]>{
 const cached=cachedWooProducts();
 if(cached)return cached;
 if(inFlight)return inFlight;
 inFlight=(async()=>{
  const response=await fetch('/woo-commerce-catalog.php',{cache:'no-store'});
  if(!response.ok)throw Error('Passerelle WooCommerce indisponible');
  const data=await response.json();
  if(!data.ok||!Array.isArray(data.products))throw Error('Catalogue indisponible');
  const products:WooProduct[]=data.products
   .filter((p:WooProduct)=>p.status==='publish')
   .map((p:WooProduct)=>({...p,images:Array.isArray(p.images)?p.images:[],sku:p.sku||''}));
  memoryCache={at:Date.now(),products};
  try{sessionStorage.setItem(CATALOG_CACHE_KEY,JSON.stringify(memoryCache));}catch{/* Facultatif */}
  return products;
 })();
 try{return await inFlight;}finally{inFlight=null;}
}
export async function loadWooCatalog(_source:'active'|'commerce'='active'):Promise<CatalogGroup[]>{
 const products=await fetchWooProducts();
 const selected=products.filter(p=>(p.categories||[]).some(c=>Object.values(categorySlugs).includes(c.slug as typeof categorySlugs[keyof typeof categorySlugs])));
 return combineFormats(selected).flatMap(group=>{
  const categories=(group.primary as WooProduct).categories||[];
  const category=categories.some(c=>c.slug===categorySlugs.entrepreneuses)
   ? 'entrepreneuses'
   : categories.some(c=>c.slug===categorySlugs.famille) ? 'famille' : null;
  return category ? [{...group,category}] : [];
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

 {error&&<p role="alert" className={styles.message}>Les produits sont momentanément indisponibles. Vérifie la connexion WooCommerce.</p>}
 {!loading&&!error&&groups.length===0&&<div className={styles.empty}><span>♡</span><h2>De jolies choses se préparent…</h2><p>{preview?'Aucun produit n’est publié dans notre nouveau WooCommerce pour le moment.':'Nos nouveautés arrivent bientôt. Les produits en brouillon restent invisibles.'}</p></div>}
 <div className={styles.grid}>
 {groups.map((group,i)=>{
  const product=group.primary as WooProduct;
  const price=group.ebook||group.primary;
  const purchasable=group.ebook||(group.primary.type==='simple'?group.primary:undefined);
  const href='/boutique/produit/?id='+encodeURIComponent(product.id)+'&source=commerce';
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
   {purchasable&&purchasable.status==='publish'&&Number(purchasable.price)>0? <div style={{display:'grid',gap:8,padding:'0 18px 20px'}}>
     <button type="button" data-woo-add={purchasable.id} style={{background:'#171b2a',color:'#fff',border:0,borderRadius:999,padding:'13px 18px',fontFamily:'Comfortaa,sans-serif',fontSize:12,fontWeight:800,cursor:'pointer'}}>Ajouter au panier ♡</button>

   </div> : group.amazon?.product_url ? <div style={{padding:'0 12px 15px'}}><a href={group.amazon.product_url} target="_blank" rel="noopener noreferrer" className={styles.noBuy}>Voir la version papier ↗</a></div> : <p className={styles.noBuy}>Disponible prochainement ♡</p>}
  </article>;
 })}
 </div>
 </section>;
}
