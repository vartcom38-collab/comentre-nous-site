'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';

type Product={id:number;name:string;price:string;downloadable:boolean;image:string;categories:string[]};
type Catalog={ok:boolean;published_count:number;draft_count:number;products:Product[]};
function euro(value:string){const n=Number(value);return Number.isFinite(n)&&value!==''?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n):'Prix non défini';}
export default function WooTestPreview(){
 const [catalog,setCatalog]=useState<Catalog|null>(null);
 const [error,setError]=useState('');
 useEffect(()=>{let active=true;fetch('/woo-test-catalog.php',{cache:'no-store'})
 .then(async response=>{const data=await response.json();if(!response.ok||!data.ok)throw Error(data.error||'Connexion indisponible');return data as Catalog;})
 .then(data=>{if(active)setCatalog(data);})
 .catch(err=>{if(active)setError(String(err.message||'Connexion indisponible'));});
 return()=>{active=false;};},[]);
 return <LayoutShell><main style={{maxWidth:1120,margin:'3rem auto',padding:'0 20px 80px'}}>
 <div style={{background:'#fff0e8',borderRadius:28,padding:'30px 28px',marginBottom:32}}>
  <p style={{letterSpacing:'.12em',fontSize:12,fontWeight:800}}>COM’ ENTRE NOUS · APERÇU TECHNIQUE</p>
  <h1 style={{fontSize:'clamp(32px,5vw,52px)',margin:'10px 0'}}>La nouvelle boutique WooCommerce</h1>
  <p style={{lineHeight:1.8,maxWidth:760}}>Cette page affiche uniquement les produits publiés dans notre nouvelle boutique de test. Rien ici ne permet de commander ou de payer. La boutique actuelle reste inchangée.</p>
 </div>
 {error&&<p role="alert" style={{background:'#fff0e8',padding:22,borderRadius:18}}>Impossible de charger l'aperçu : {error}. Vérifier que le fichier de test a été déployé sur Infomaniak.</p>}
 {!catalog&&!error&&<p>Connexion au catalogue de test…</p>}
 {catalog&&<><section style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:32}}>
  <div style={{padding:22,background:'#fff',borderRadius:18,flex:'1 1 210px'}}><strong style={{fontSize:34}}>{catalog.published_count}</strong><p>Produit(s) publiés</p></div>
  <div style={{padding:22,background:'#fff',borderRadius:18,flex:'1 1 210px'}}><strong style={{fontSize:34}}>{catalog.draft_count}</strong><p>Brouillon(s) non visibles des clientes</p></div>
 </section>
 {catalog.products.length===0?<div style={{background:'#fff',padding:28,borderRadius:20}}><h2>Aucun produit publié pour l'instant</h2><p>Ton ebook de test reste en brouillon : c'est normal qu'il n'apparaisse pas ici. Nous n'allons pas le publier avant d'avoir sécurisé le paiement.</p></div>:
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>{catalog.products.map(p=><article key={p.id} style={{background:'#fff',padding:18,borderRadius:22}}>
 {p.image?<img src={p.image} alt="" style={{width:'100%',aspectRatio:'4/3',objectFit:'cover',borderRadius:15}}/>:<div style={{aspectRatio:'4/3',background:'#fce9e0',borderRadius:15}}/>}
 <h2 style={{fontSize:20}}>{p.name}</h2><p>{p.downloadable?'Fichier numérique':'Produit'}</p><strong>{euro(p.price)}</strong><p style={{fontSize:12,color:'#76717a'}}>Aperçu uniquement — vente désactivée</p></article>)}</div>}
 </>}
 <p style={{marginTop:36}}><Link href="/boutique/">← Retour à la boutique actuelle</Link></p>
 </main></LayoutShell>;
}
