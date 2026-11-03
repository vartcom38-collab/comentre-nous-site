'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
import styles from './preview.module.css';

type Product={
 id:number;name:string;price:string;downloadable:boolean;image:string;
 short_description?:string;categories:{name:string;slug:string}[];
};
type Catalog={ok:boolean;published_count:number;draft_count:number;products:Product[]};
function euro(value:string){
 const n=Number(value);
 return Number.isFinite(n)&&value!==''?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n):'Prix non défini';
}
export default function WooTestPreview(){
 const [catalog,setCatalog]=useState<Catalog|null>(null);
 const [error,setError]=useState('');
 useEffect(()=>{
  let active=true;
  fetch('/woo-test-catalog.php',{cache:'no-store'})
   .then(async response=>{const data=await response.json();if(!response.ok||!data.ok)throw Error(data.error||'Connexion indisponible');return data as Catalog;})
   .then(data=>{if(active)setCatalog(data);})
   .catch(err=>{if(active)setError(String(err.message||'Connexion indisponible'));});
  return()=>{active=false;};
 },[]);
 return <LayoutShell><main className={styles.page}>
  <nav className={styles.breadcrumb}><Link href="/">Accueil</Link><span>♡</span><Link href="/boutique/">Boutique</Link><span>♡</span><span>Aperçu technique</span></nav>
  <header className={styles.hero}>
   <p className={styles.tag}>Com’ entre nous · nouveau WooCommerce</p>
   <h1>Nos créations, <span>à leur place ♡</span></h1>
   <p>Un aperçu du nouveau catalogue directement dans l’univers graphique de notre site. Aucun achat n’est possible ici : la boutique actuelle reste intacte.</p>
   <span className={styles.doodle}>↝ petit aperçu des coulisses</span>
  </header>
  {error&&<p role="alert" className={styles.message}>Le catalogue de test n’est pas encore accessible : {error}. Il faut installer la dernière version du fichier PHP sur Infomaniak.</p>}
  {!catalog&&!error&&<p role="status" className={styles.message}>On prépare les créations… ♡</p>}
  {catalog&&<>
   <div className={styles.counts}><p><strong>{catalog.published_count}</strong>produit(s) visibles</p><p><strong>{catalog.draft_count}</strong>brouillon(s) conservés à l’abri</p></div>
   {catalog.products.length===0?<div className={styles.empty}><span>♡</span><h2>Les créations arrivent doucement…</h2><p>Ton produit test est encore en brouillon : il n’apparaîtra pas dans le catalogue tant qu’il n’aura pas été publié. Aucun paiement n’est activé.</p></div>:
    <div className={styles.grid}>{catalog.products.map((p,i)=><article className={styles.product} key={p.id}>
     <Link href={'/boutique/produit/?source=test&id='+encodeURIComponent(p.id)} className={styles.link}>
      <div className={styles.picture}>{p.image?<img src={p.image} alt={p.name}/>:<div className={styles.placeholder}>♡</div>}<span className={styles.sticker}>{i%2===0?'Coup de cœur ♡':'À découvrir ✳'}</span></div>
      <p className={styles.category}>{p.categories?.[0]?.name||'Com’ entre nous'}</p>
      <h2>{p.name}</h2>
      {p.short_description&&<p className={styles.description}>{p.short_description}</p>}
      <div className={styles.bottom}><strong>{euro(p.price)}</strong><span>Découvrir la fiche ↗</span></div>
     </Link>
     <p className={styles.disabled}>Aperçu uniquement · achat désactivé</p>
    </article>)}</div>}
  </>}
  <Link href="/boutique/" className={styles.back}>← Retour à la boutique actuelle</Link>
 </main></LayoutShell>;
}
