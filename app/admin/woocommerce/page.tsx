'use client';

import { useEffect, useMemo, useState } from 'react';
import initialProducts from '../../../content/products.json';
import initialLinks from '../../../content/woo-links.json';

type WooProduct = {
  id:number|null;
  name:string;
  slug:string;
  status:string;
  price:string;
  regular_price:string;
  sale_price:string;
  stock_status:string;
  stock_quantity:number|null;
  featured:boolean;
  permalink:string;
  images:Array<{id:number|null;src:string;alt:string}>;
  categories:Array<{id:number|null;name:string;slug:string}>;
  meta_data:Array<{id?:number;key?:string;value?:unknown}>;
};

type WooResponse={ok:boolean;count?:number;products?:WooProduct[];error?:string;product?:Partial<WooProduct>};
type LocalProduct=(typeof initialProducts)[number];
type WooLinks=Record<string,number>;

const OWNER='vartcom38-collab';
const REPO='comentre-nous-site';
const BRANCH='main';
const LINKS_PATH='content/woo-links.json';

function encodeBase64(value:string){return btoa(unescape(encodeURIComponent(value)))}
function localPrice(value:string){const cleaned=(value||'').replace(/\s/g,'').replace('€','').replace(',','.').replace(/[^0-9.]/g,'');const amount=Number.parseFloat(cleaned);return Number.isFinite(amount)?amount.toFixed(2):''}
function wooStock(status:string){if(status==='out')return'outofstock';if(status==='preorder')return'onbackorder';return'instock'}
async function github(path:string,token:string,init?:RequestInit){const response=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`,{...init,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${token}`,...(init?.headers||{})}});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return response.json()}

export default function WooCommerceAdminPage(){
  const [products,setProducts]=useState<WooProduct[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [query,setQuery]=useState('');
  const [token,setToken]=useState('');
  const [links,setLinks]=useState<WooLinks>(initialLinks as WooLinks);
  const [localId,setLocalId]=useState((initialProducts as LocalProduct[])[0]?.id||'');
  const [wooId,setWooId]=useState('');
  const [linkStatus,setLinkStatus]=useState('');
  const [syncing,setSyncing]=useState(false);

  async function load(){
    setLoading(true);setError('');
    try{
      const response=await fetch(`/woo-bridge.php?action=products&ts=${Date.now()}`,{cache:'no-store'});
      const data=await response.json() as WooResponse;
      if(!response.ok||!data.ok)throw new Error(data.error||'Connexion WooCommerce impossible');
      setProducts(data.products||[]);
      if(!wooId&&data.products?.[0]?.id)setWooId(String(data.products[0].id));
    }catch(err){setError((err as Error).message)}finally{setLoading(false)}
  }

  useEffect(()=>{setToken(window.sessionStorage.getItem('comentre_admin_github_token')||'');load()},[]);
  const filtered=useMemo(()=>products.filter(p=>`${p.name} ${p.slug} ${p.categories.map(c=>c.name).join(' ')}`.toLowerCase().includes(query.toLowerCase())),[products,query]);
  const published=products.filter(p=>p.status==='publish').length;
  const out=products.filter(p=>p.stock_status==='outofstock').length;
  const featured=products.filter(p=>p.featured).length;
  const localProducts=initialProducts as LocalProduct[];
  const localProduct=localProducts.find(p=>p.id===localId);
  const selectedWoo=products.find(p=>String(p.id)===wooId);
  const linkedWooId=localId?links[localId]:undefined;
  const linkedWoo=products.find(p=>p.id===linkedWooId);

  async function saveLink(){
    if(!token)return setLinkStatus('Reconnecte GitHub depuis le tableau de bord admin.');
    if(!localId||!wooId)return setLinkStatus('Choisis une fiche du nouveau site et un produit WooCommerce.');
    setLinkStatus('Enregistrement de la liaison…');
    try{
      const next={...links,[localId]:Number(wooId)};
      const current=await github(`contents/${LINKS_PATH}?ref=${BRANCH}`,token);
      await github(`contents/${LINKS_PATH}`,token,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Admin: link product to WooCommerce',content:encodeBase64(`${JSON.stringify(next,null,2)}\n`),sha:current.sha,branch:BRANCH})});
      setLinks(next);
      setLinkStatus('Liaison enregistrée ✓ Aucun produit n’a encore été modifié.');
    }catch(err){setLinkStatus(`Erreur liaison : ${(err as Error).message}`)}
  }

  async function syncCommercial(){
    if(!token)return setLinkStatus('Reconnecte GitHub depuis le tableau de bord admin.');
    if(!localProduct||!linkedWooId)return setLinkStatus('Enregistre d’abord la liaison entre les deux fiches.');
    const price=localPrice(localProduct.price||'');
    if(!price)return setLinkStatus('Le prix de la fiche Com’ entre nous doit être renseigné avant le test.');
    if(!window.confirm(`Synchroniser maintenant les informations commerciales de “${localProduct.title}” vers WooCommerce ?`))return;
    setSyncing(true);setLinkStatus('Synchronisation avec WooCommerce…');
    try{
      const payload:{id:number;regular_price:string;featured:boolean;status:string;stock_status:string;stock_quantity?:number}={
        id:linkedWooId,
        regular_price:price,
        featured:Boolean(localProduct.featured),
        status:localProduct.published?'publish':'draft',
        stock_status:wooStock(localProduct.stockStatus),
      };
      if((localProduct.stockQuantity??0)>0)payload.stock_quantity=localProduct.stockQuantity;
      const response=await fetch('/woo-bridge.php?action=update-product',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(payload)});
      const data=await response.json() as WooResponse;
      if(!response.ok||!data.ok)throw new Error(data.error||'Synchronisation WooCommerce impossible');
      setLinkStatus('Synchronisation réussie ✓ Prix, stock, statut et mise en avant sont passés dans WooCommerce.');
      await load();
    }catch(err){setLinkStatus(`Erreur synchronisation : ${(err as Error).message}`)}finally{setSyncing(false)}
  }

  return <main className="woo-admin"><style>{css}</style>
    <header className="woo-head"><div><p>Connexion boutique</p><h1>WooCommerce</h1><span>WooCommerce gère la vente. Notre admin garde l’identité, les badges et les univers.</span></div><button onClick={load} disabled={loading}>{loading?'Actualisation…':'↻ Actualiser'}</button></header>
    {error&&<div className="woo-error">{error}</div>}

    <section className="woo-linker"><div className="linker-title"><div><p>Premier branchement test</p><h2>Relier une fiche Com’ entre nous à WooCommerce</h2><span>On ne bascule pas tout le catalogue : on teste un seul produit d’abord.</span></div><b>TEST SÉCURISÉ</b></div><div className="link-grid"><label>Fiche sur le nouveau site<select value={localId} onChange={e=>setLocalId(e.target.value)}>{localProducts.map(p=><option key={p.id} value={p.id}>{p.title} · {p.price||'prix à définir'}</option>)}</select></label><label>Produit WooCommerce<select value={wooId} onChange={e=>setWooId(e.target.value)}>{products.map(p=><option key={p.id??p.slug} value={String(p.id)}>{p.name} · {p.price?`${p.price} €`:'sans prix'}</option>)}</select></label></div><div className="link-actions"><button onClick={saveLink}>Enregistrer la liaison</button>{linkedWooId&&<button className="sync" onClick={syncCommercial} disabled={syncing}>{syncing?'Synchronisation…':'Tester la synchro commerciale'}</button>}</div>{localProduct&&<div className="compare"><div><small>Notre fiche</small><b>{localProduct.title}</b><span>Prix {localProduct.price||'—'} · {localProduct.published?'Publié':'Brouillon'} · {localProduct.featured?'Coup de cœur':'Standard'}</span></div><strong>→</strong><div><small>WooCommerce {linkedWoo?'relié':'à relier'}</small><b>{linkedWoo?.name||selectedWoo?.name||'Choisir un produit'}</b><span>{linkedWoo?`Prix ${linkedWoo.price||'—'} € · ${linkedWoo.stock_status}`:'La liaison seule ne modifie rien.'}</span></div></div>}{linkStatus&&<div className="link-status">{linkStatus}</div>}</section>

    <section className="woo-stats"><div><b>{products.length}</b><span>Produits récupérés</span></div><div><b>{published}</b><span>Publiés</span></div><div><b>{featured}</b><span>Mis en avant Woo</span></div><div><b>{out}</b><span>En rupture</span></div></section>
    <div className="woo-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un produit WooCommerce…"/><span>{filtered.length} résultat{filtered.length>1?'s':''}</span></div>
    {loading?<div className="woo-empty">Connexion à WooCommerce…</div>:filtered.length===0?<div className="woo-empty">Aucun produit trouvé.</div>:<section className="woo-list">{filtered.map(product=><article key={product.id??product.slug} className="woo-row"><div className="woo-image">{product.images?.[0]?.src?<img src={product.images[0].src} alt={product.images[0].alt||product.name}/>:<span>Sans image</span>}</div><div className="woo-info"><div className="woo-badges"><span className={product.status==='publish'?'live':''}>{product.status==='publish'?'Publié':product.status}</span>{product.featured&&<span className="featured">★ Mis en avant</span>}<span>{product.stock_status==='instock'?'En stock':product.stock_status==='outofstock'?'Rupture':product.stock_status}</span></div><h2>{product.name}</h2><p>{product.categories.map(c=>c.name).join(' · ')||'Sans catégorie'}</p><strong>{product.price?`${product.price} €`:'Prix non défini'}</strong>{product.stock_quantity!==null&&<small>Stock : {product.stock_quantity}</small>}</div><div className="woo-actions">{product.permalink&&<a href={product.permalink} target="_blank" rel="noreferrer">Voir sur l’ancienne boutique ↗</a>}<span>Woo ID #{product.id}</span></div></article>)}</section>}
    <section className="woo-next"><b>Ce qui reste chez Com’ entre nous</b><p>Badge “À imprimer”, Coup de cœur, univers, textes éditoriaux et design restent dans notre système. WooCommerce reçoit uniquement la partie commerciale que l’on décide de synchroniser.</p></section>
  </main>
}

const css=`*{box-sizing:border-box}.woo-admin{min-height:100vh;background:#fff8f1;color:#171b2a;padding:34px clamp(18px,5vw,70px) 90px;font-family:Comfortaa,system-ui,sans-serif}.woo-head{display:flex;justify-content:space-between;align-items:end;gap:20px;max-width:1400px;margin:auto}.woo-head p,.linker-title p{margin:0;color:#ff5d62;text-transform:uppercase;letter-spacing:.13em;font-size:11px;font-weight:900}.woo-head h1{margin:5px 0;font:700 clamp(44px,6vw,72px)/.9 'Patrick Hand',cursive}.woo-head span,.linker-title span{font-size:13px;color:#656b79}.woo-head button,.link-actions button{border:0;border-radius:999px;background:#171b2a;color:#fff;padding:12px 18px;font-weight:900;cursor:pointer}.woo-error,.woo-empty{max-width:1400px;margin:18px auto;padding:18px;border-radius:18px;background:#fff0ef;color:#8f2018}.woo-empty{background:#fff;color:#687082;text-align:center}.woo-linker{max-width:1400px;margin:24px auto 14px;background:#fff;padding:22px;border-radius:24px;box-shadow:0 12px 34px rgba(50,35,25,.06)}.linker-title{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.linker-title h2{margin:4px 0 6px;font:700 34px/1 'Patrick Hand',cursive}.linker-title>b{background:#e9faf6;color:#087f78;border-radius:999px;padding:8px 11px;font-size:9px}.link-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.link-grid label{display:grid;gap:7px;font-size:11px;font-weight:900}.link-grid select{width:100%;border:1px solid #e5dad2;border-radius:13px;background:#fffdf9;padding:12px;font:600 12px Comfortaa,system-ui,sans-serif}.link-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.link-actions .sync{background:#0fa399}.compare{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin-top:16px;padding:15px;border-radius:18px;background:#fff8f1}.compare div{display:grid;gap:4px}.compare small{font-size:9px;text-transform:uppercase;color:#8a8f9c;font-weight:900}.compare b{font-size:13px}.compare span{font-size:10px;color:#687082}.compare>strong{font-size:24px}.link-status{margin-top:12px;background:#e9faf6;border-radius:14px;padding:12px;font-size:11px;font-weight:800}.woo-stats{max-width:1400px;margin:14px auto;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.woo-stats div{background:#fff;padding:18px;border-radius:20px;box-shadow:0 10px 28px rgba(50,35,25,.05);display:grid;gap:4px}.woo-stats b{font:700 34px/1 'Patrick Hand',cursive}.woo-stats span{font-size:11px;color:#6b7280}.woo-toolbar{max-width:1400px;margin:0 auto 14px;display:flex;align-items:center;gap:12px}.woo-toolbar input{flex:1;border:1px solid #e5dad2;background:#fff;border-radius:999px;padding:12px 15px;font:600 13px Comfortaa,system-ui,sans-serif}.woo-toolbar span{font-size:11px;color:#777}.woo-list{max-width:1400px;margin:auto;display:grid;gap:12px}.woo-row{background:#fff;border-radius:22px;padding:14px;display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:16px;align-items:center;box-shadow:0 12px 34px rgba(50,35,25,.06)}.woo-image{height:105px;border-radius:16px;background:#f2ece7;overflow:hidden;display:grid;place-items:center;font-size:11px;color:#8a8f9c}.woo-image img{width:100%;height:100%;object-fit:cover}.woo-info h2{margin:7px 0 3px;font-size:19px}.woo-info p{margin:0 0 7px;font-size:12px;color:#6a7080}.woo-info strong{display:inline-block;margin-right:12px}.woo-info small{color:#777}.woo-badges{display:flex;gap:6px;flex-wrap:wrap}.woo-badges span{font-size:9px;font-weight:900;padding:5px 8px;border-radius:999px;background:#f1ece7}.woo-badges .live{background:#dff7f2;color:#087f78}.woo-badges .featured{background:#fff2c7;color:#765900}.woo-actions{display:grid;gap:8px;justify-items:end}.woo-actions a{background:#171b2a;color:#fff;text-decoration:none;border-radius:999px;padding:9px 12px;font-size:10px;font-weight:900}.woo-actions span{font-size:10px;color:#8b8f99}.woo-next{max-width:1400px;margin:20px auto 0;padding:18px 20px;border-radius:20px;background:#e9faf6}.woo-next b{font-size:12px}.woo-next p{margin:5px 0 0;font-size:12px;line-height:1.6}@media(max-width:800px){.woo-head,.linker-title{align-items:flex-start;flex-direction:column}.link-grid{grid-template-columns:1fr}.compare{grid-template-columns:1fr}.compare>strong{transform:rotate(90deg);justify-self:center}.woo-stats{grid-template-columns:1fr 1fr}.woo-row{grid-template-columns:90px 1fr}.woo-actions{grid-column:1/-1;justify-items:start}}@media(max-width:520px){.woo-row{grid-template-columns:1fr}.woo-image{height:190px}.woo-toolbar{align-items:stretch;flex-direction:column}}`;
