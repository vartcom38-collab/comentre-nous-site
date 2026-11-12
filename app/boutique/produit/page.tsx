'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
import {formatWooPrice,fetchWooProducts} from '@/components/WooCards';
import type {ShopGroup} from '@/src/lib/woo-grouping';
import {combineFormats} from '@/src/lib/woo-grouping';
import styles from './product.module.css';

type ProductGroup=ShopGroup & {category:string};
type DescribedProduct=ShopGroup['primary'] & {description?:string;short_description?:string};

export default function ProductPage(){
 const [group,setGroup]=useState<ProductGroup|null>(null);
 const [isStaging,setIsStaging]=useState(false);
 const [state,setState]=useState<'loading'|'unavailable'|'not-found'|'ready'>('loading');
 useEffect(()=>{
  let active=true;
  const params=new URLSearchParams(window.location.search);
  const id=Number(params.get('id'));
  const source=params.get('source');
  // Le catalogue officiel est /commerce/. Vente désactivée jusqu'au test du panier et des paiements.
  const staging=true;
  // Une seule source de vérité : les produits publiés sur /commerce/.
  setIsStaging(staging);
  const promise:Promise<ProductGroup[]>=fetchWooProducts().then(products=>
    combineFormats(products).map(g=>({ ...g,category:(products.find(p=>p.id===g.primary.id)?.categories||[]).some(c=>c.slug==='com-des-entrepreneuses')?'entrepreneuses':'famille' }))
  );
  promise.then(groups=>{
   if(!active)return;
   const found=groups.find(g=>g.primary.id===id||g.ebook?.id===id||g.amazon?.id===id);
   if(found){setGroup(found);setState('ready');}
   else setState('not-found');
  }).catch(()=>{if(active)setState('unavailable');});
  return()=>{active=false;};
 },[]);
 const primary=group?.primary as DescribedProduct|undefined;
 const name=primary?.name||'';
 const image=primary?.images?.[0]?.src;
 const hasDigital=Boolean(group?.ebook);
 const canTestBuy=group?.ebook?.id===14;
 const hasPaper=Boolean(group?.amazon);
 return <LayoutShell><main className={styles.page}>
  <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
   <Link href="/">Accueil</Link><span>♡</span><Link href={group?.category==='entrepreneuses'?'/com-des-entrepreneuses/':'/com-en-famille/'}>{group?.category==='entrepreneuses'?'Com’ des entrepreneuses':'Com’ en famille'}</Link>
   {group&&<><span>♡</span><span>{group.primary.name}</span></>}
  </nav>

  {state==='unavailable'&&<p className={styles.message} role="alert">La boutique est momentanément indisponible. Réessaie dans quelques instants.</p>}
  {state==='not-found'&&<p className={styles.message}>Ce produit n’est pas disponible pour le moment. <Link href="/com-en-famille/">Découvrir nos créations</Link></p>}
  {group&&primary&&state==='ready'&&<>
   {isStaging&&<div role="status" style={{background:"#fff1bf",borderRadius:20,padding:"17px 23px",marginBottom:28,fontSize:12,lineHeight:1.8}}><strong>APERÇU DE LA NOUVELLE BOUTIQUE · TEST UNIQUEMENT</strong><div>Tu visualises la fiche dans l’identité Com’ entre nous. Les ebooks publiés peuvent être ajoutés au panier pour vérifier le parcours d’achat. Les paiements réels ne sont pas encore confirmés.</div></div>}
   <div className={styles.hero}>
    <div className={styles.visual}>
     <div className={styles.photo}>
      {image?<img src={image} alt={name} />:<div className={styles.placeholder}>Une création à découvrir ♡</div>}
     </div>
     <span className={styles.sticker}>Fait avec le cœur ♡</span>
    </div>
    <div className={styles.copy}>
     <span className={styles.eyebrow}>{group.category==='famille'?'Com’ en famille':'Com’ des entrepreneuses'}</span>
     <h1>{name}</h1>
     {primary.short_description&&<div className={styles.lead} dangerouslySetInnerHTML={{__html:primary.short_description}}/>}
     {(group.ebook||group.primary)?.price&&<p className={styles.price}>{formatWooPrice(group.ebook||group.primary)}</p>}
     <div className={styles.softNote}><span>✳</span><div>Des créations imaginées pour accompagner les moments du quotidien, à ton rythme.</div></div>
     <div className={styles.formats}>
      <h2 className={styles.formatsTitle}>Choisis ton format</h2>
      {hasDigital&&group.ebook&&<div className={styles.format}>
       <div className={styles.formatHead}><h3>♡ Version numérique</h3><strong>{formatWooPrice(group.ebook)}</strong></div>
       <p>Un produit téléchargeable à retrouver après confirmation de ton achat.</p>
       {canTestBuy?<button type="button" data-woo-add={group.ebook.id} className={styles.buy}>Ajouter au panier · TEST ♡</button>:<span style={{display:"inline-block",background:"#ead7ff",borderRadius:999,padding:"14px 20px",fontSize:12,fontWeight:800}}>Disponible prochainement ♡</span>}
      </div>}
      {hasPaper&&group.amazon&&<div className={styles.format+' '+styles.alt}>
       <div className={styles.formatHead}><h3>✳ Version papier</h3></div>
       <p>Une édition physique, proposée sur Amazon lorsqu’elle est disponible.</p>
       {!isStaging&&group.amazon.product_url?<a className={styles.amazonLink} href={group.amazon.product_url} target="_blank" rel="noopener noreferrer">Voir la version papier ↗</a>:<p>Cette version arrive bientôt.</p>}
      </div>}
     </div>
    </div>
   </div>
   {primary.description&&<section className={styles.details}>
    <h2>Ce qu’on a imaginé pour toi…</h2>
    <div className={styles.description} dangerouslySetInnerHTML={{__html:primary.description}}/>
   </section>}
   <section className={styles.reassurance} aria-label="Informations utiles">
    <article><strong>Un petit moment pour soi ♡</strong><p>Des créations à découvrir à ton rythme, sans pression.</p></article>
    <article><strong>Le format qui te ressemble</strong><p>Choisis le format disponible qui correspond à tes envies.</p></article>
    <article><strong>Une question ?</strong><p>Notre équipe est là pour t’accompagner avant ton achat.</p></article>
   </section>
  </>}
  <Link className={styles.back} href={group?.category==='entrepreneuses'?'/com-des-entrepreneuses/':'/com-en-famille/'}>← Revenir aux créations</Link>
 </main></LayoutShell>;
}
