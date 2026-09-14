'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/src/data/products';

type PaperTab={id:string;label:string;icon?:string;description?:string;visible?:boolean;order?:number};
type PaperProduct=Product & {paperTabs?:string[]};

function inferredTabs(product:PaperProduct){
  if(product.paperTabs?.length)return product.paperTabs;
  const hay=`${product.type} ${product.title} ${product.tagline} ${product.format}`.toLowerCase();
  const tabs:string[]=[];
  if(/carnet|journal|planner|agenda/.test(hay))tabs.push('journaux');
  if(/recharge|fiche|imprim|page/.test(hay))tabs.push('recharges');
  if(/todo|to-do|organisation|habitude|semaine|planning|budget/.test(hay))tabs.push('organisation');
  if(/coffret|box|ensemble|kit/.test(hay))tabs.push('coffrets');
  return tabs.length?tabs:['organisation'];
}

export default function PaperShop({items,tabs}:{items:PaperProduct[];tabs:PaperTab[]}){
  const visibleTabs=useMemo(()=>tabs.filter(t=>t.visible!==false).sort((a,b)=>(a.order||0)-(b.order||0)),[tabs]);
  const [active,setActive]=useState('all');
  const filtered=useMemo(()=>active==='all'?items:items.filter(item=>inferredTabs(item).includes(active)),[items,active]);
  const activeTab=visibleTabs.find(t=>t.id===active);
  return <>
    <section className="paper-tabs" aria-label="Catégories de papeterie">
      <button className={active==='all'?'active':''} onClick={()=>setActive('all')}><span>▦</span><b>Tout découvrir</b></button>
      {visibleTabs.map(tab=><button key={tab.id} className={active===tab.id?'active':''} onClick={()=>setActive(tab.id)}><span>{tab.icon||'♡'}</span><b>{tab.label}</b></button>)}
    </section>
    <section className="paper-shop" id="collection">
      <div className="paper-shop-head"><div><p className="paper-eyebrow">La collection d’Aurélie</p><h2>{activeTab?activeTab.label:'Nos essentiels papeterie'}</h2><p>{activeTab?.description||'Carnets, recharges et petits outils pour organiser le quotidien avec plus de douceur.'}</p></div><span className="paper-hand-note">De la belle papeterie<br/>pour une vie plus douce ♡</span></div>
      {filtered.length?<div className="paper-grid">{filtered.map(product=><article className="paper-card" key={product.id}><Link href={`/produits/${product.slug}`} className={`paper-cover ${product.color}`}>{product.image?<img src={product.image} alt={product.title}/>:<div className="paper-placeholder"><span>{product.type}</span><b>{product.title}</b><small>♡</small></div>}{product.badge&&<em>{product.badge}</em>}</Link><div className="paper-copy"><p>{product.type}</p><h3>{product.title}</h3><span>{product.shortDescription||product.tagline}</span><strong>{product.price}</strong><Link href={`/produits/${product.slug}`}>Voir le produit →</Link></div></article>)}</div>:<div className="paper-empty"><span>♡</span><h3>Cette partie de la papeterie se prépare.</h3><p>Les prochains produits ajoutés dans l’admin apparaîtront automatiquement ici.</p></div>}
    </section>
  </>;
}
