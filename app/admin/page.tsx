'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import initialProducts from '../../content/products.json';
import initialHome from '../../content/home.json';

type Product = (typeof initialProducts)[number];
type HomeContent = typeof initialHome;

const OWNER = 'vartcom38-collab';
const REPO = 'comentre-nous-site';
const BRANCH = 'main';
const PRODUCTS_PATH = 'content/products.json';
const HOME_PATH = 'content/home.json';

function encodeBase64(value: string) { return btoa(unescape(encodeURIComponent(value))); }
function decodeBase64(value: string) { return decodeURIComponent(escape(atob(value.replace(/\n/g, '')))); }
async function github(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
    ...init,
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers || {}) },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${await response.text()}`);
  return response.json();
}
async function saveJson(path: string, value: unknown, token: string, message: string) {
  const current = await github(`contents/${path}?ref=${BRANCH}`, token);
  return github(`contents/${path}`, token, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: encodeBase64(`${JSON.stringify(value, null, 2)}\n`), sha: current.sha, branch: BRANCH }),
  });
}

function newProduct(): Product {
  const stamp = Date.now();
  const day = new Date().toISOString().slice(0,10);
  return {
    id: `produit-${stamp}`, title: 'Nouveau produit', tagline: '', price: '', compareAtPrice: '', slug: `nouveau-produit-${stamp}`,
    image: '', gallery: [], category: 'famille', universe: "Com' en famille", type: 'Cartes', color: 'coral', badge: '', age: '', format: '',
    deliveryType: 'physical', stockStatus: 'draft', stockQuantity: 0, sku: '', shortDescription: '', longDescription: '', highlights: [], included: [], usage: '', care: '',
    buyLabel: 'Découvrir', buyUrl: '', seoTitle: '', seoDescription: '', published: false, featured: false, new: true, createdAt: day, updatedAt: day,
  } as Product;
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts as Product[]);
  const [home, setHome] = useState<HomeContent>(initialHome);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'products'|'home'>('products');

  useEffect(() => { setToken(window.sessionStorage.getItem('comentre_admin_github_token') || ''); }, []);
  const publishedCount = useMemo(() => products.filter((p)=>p.published).length,[products]);

  async function connect() {
    if (!token.trim()) return;
    setBusy(true); setStatus('Connexion…');
    try {
      const [pf,hf] = await Promise.all([github(`contents/${PRODUCTS_PATH}?ref=${BRANCH}`,token.trim()),github(`contents/${HOME_PATH}?ref=${BRANCH}`,token.trim())]);
      setProducts(JSON.parse(decodeBase64(pf.content))); setHome(JSON.parse(decodeBase64(hf.content)));
      window.sessionStorage.setItem('comentre_admin_github_token',token.trim()); setStatus('Connecté. Les données sont à jour.');
    } catch(error){ setStatus(`Connexion impossible : ${(error as Error).message}`);} finally{setBusy(false)}
  }

  async function createProduct() {
    if (!token) return setStatus('Connecte GitHub avant de créer un produit.');
    const product = newProduct(); const next = [product,...products];
    setBusy(true); setStatus('Création de la fiche…');
    try { await saveJson(PRODUCTS_PATH,next,token,'Admin: create product'); setProducts(next); window.location.href=`/admin/produit/?id=${product.id}`; }
    catch(error){setStatus(`Erreur : ${(error as Error).message}`);setBusy(false)}
  }

  async function togglePublish(index:number) {
    if(!token) return setStatus('Connecte GitHub.');
    const next=products.map((p,i)=>i===index?{...p,published:!p.published,updatedAt:new Date().toISOString().slice(0,10)}:p);
    setBusy(true);
    try{await saveJson(PRODUCTS_PATH,next,token,next[index].published?'Admin: publish product':'Admin: unpublish product');setProducts(next);setStatus(next[index].published?'Produit mis en ligne.':'Produit retiré du site.');}
    catch(error){setStatus(`Erreur : ${(error as Error).message}`)}finally{setBusy(false)}
  }

  async function duplicateProduct(index:number){
    if(!token)return setStatus('Connecte GitHub.');
    const source=products[index]; const stamp=Date.now();
    const copy={...source,id:`${source.id}-copie-${stamp}`,slug:`${source.slug}-copie-${stamp}`,title:`${source.title} — copie`,published:false,featured:false,new:false,createdAt:new Date().toISOString().slice(0,10),updatedAt:new Date().toISOString().slice(0,10)};
    const next=[copy,...products]; setBusy(true);
    try{await saveJson(PRODUCTS_PATH,next,token,'Admin: duplicate product');setProducts(next);setStatus('Fiche dupliquée.');}
    catch(error){setStatus(`Erreur : ${(error as Error).message}`)}finally{setBusy(false)}
  }

  async function deleteProduct(index:number){
    if(!token||!confirm('Supprimer cette fiche produit ?'))return;
    const next=products.filter((_,i)=>i!==index);setBusy(true);
    try{await saveJson(PRODUCTS_PATH,next,token,'Admin: delete product');setProducts(next);setStatus('Fiche supprimée.');}
    catch(error){setStatus(`Erreur : ${(error as Error).message}`)}finally{setBusy(false)}
  }

  async function saveHome(){
    if(!token)return setStatus('Connecte GitHub.');setBusy(true);
    try{await saveJson(HOME_PATH,home,token,'Admin: update homepage');setStatus('Accueil enregistré.');}
    catch(error){setStatus(`Erreur : ${(error as Error).message}`)}finally{setBusy(false)}
  }

  return <main className="admin-shell"><style>{css}</style>
    <aside className="side"><Link href="/" className="brand">Com’ entre nous</Link><span className="private">Espace privé</span>
      <button className={tab==='products'?'active':''} onClick={()=>setTab('products')}>Produits</button>
      <button className={tab==='home'?'active':''} onClick={()=>setTab('home')}>Page d’accueil</button>
      <div className="stats"><b>{products.length}</b><span>fiches</span><b>{publishedCount}</b><span>publiées</span></div><Link href="/" className="back">← Voir le site</Link>
    </aside>
    <section className="main">
      <header className="top"><div><p>Administration</p><h1>Le petit atelier du site</h1></div><div className="connect"><input type="password" value={token} onChange={(e)=>setToken(e.target.value)} placeholder="Jeton GitHub"/><button onClick={connect} disabled={busy}>Connecter</button></div></header>
      {status&&<div className="status">{status}</div>}

      {tab==='products'?<>
        <div className="toolbar"><div><p>Catalogue</p><h2>Fiches produits</h2><span>Chaque produit a maintenant sa propre fiche complète avec aperçu, images, contenu, stock et SEO.</span></div><button className="create" onClick={createProduct} disabled={busy}>+ Créer un produit</button></div>
        <div className="product-list">{products.map((p,index)=><article className="product-row" key={p.id}>
          <div className={`thumb ${p.color}`}>{p.image?<img src={p.image} alt=""/>:<span>{p.type}</span>}</div>
          <div className="info"><div className="badges"><span className={p.published?'live':'draft'}>{p.published?'Publié':'Brouillon'}</span>{p.new&&<span>Nouveauté</span>}{p.featured&&<span>Coup de cœur</span>}</div><h3>{p.title}</h3><p>{p.tagline||p.shortDescription||'Aucune description courte.'}</p><small>{p.universe} · {p.type} · {p.price||'Prix à définir'}</small></div>
          <div className="actions"><Link className="primary" href={`/admin/produit/?id=${p.id}`}>Modifier la fiche</Link><button onClick={()=>window.open(`/produits/${p.slug}/`,'_blank')}>Aperçu</button><button onClick={()=>togglePublish(index)}>{p.published?'Retirer du site':'Mettre en ligne'}</button><button onClick={()=>duplicateProduct(index)}>Dupliquer</button><button className="danger" onClick={()=>deleteProduct(index)}>Supprimer</button></div>
        </article>)}</div>
      </>:<>
        <div className="toolbar"><div><p>Accueil</p><h2>Contenu de la page d’accueil</h2></div><button className="create" onClick={saveHome} disabled={busy}>Enregistrer l’accueil</button></div>
        <div className="home-card"><h3>Hero</h3><label>Petite accroche<input value={home.hero.eyebrow} onChange={(e)=>setHome({...home,hero:{...home.hero,eyebrow:e.target.value}})}/></label><label>Titre<textarea rows={3} value={home.hero.title} onChange={(e)=>setHome({...home,hero:{...home.hero,title:e.target.value}})}/></label><label>Texte<textarea rows={4} value={home.hero.intro} onChange={(e)=>setHome({...home,hero:{...home.hero,intro:e.target.value}})}/></label><h3>Bloc produits</h3><label>Sur-titre<input value={home.homeProducts.eyebrow} onChange={(e)=>setHome({...home,homeProducts:{...home.homeProducts,eyebrow:e.target.value}})}/></label><label>Titre<input value={home.homeProducts.title} onChange={(e)=>setHome({...home,homeProducts:{...home.homeProducts,title:e.target.value}})}/></label><label>Affichage<select value={home.homeProducts.mode} onChange={(e)=>setHome({...home,homeProducts:{...home.homeProducts,mode:e.target.value}})}><option value="newest">Nouveautés automatiques</option><option value="featured">Coups de cœur sélectionnés</option></select></label><label>Nombre de produits<input type="number" min="1" max="8" value={home.homeProducts.limit} onChange={(e)=>setHome({...home,homeProducts:{...home.homeProducts,limit:Number(e.target.value)}})}/></label></div>
      </>}
    </section>
  </main>
}

const css=`*{box-sizing:border-box}.admin-shell{min-height:100vh;display:grid;grid-template-columns:240px 1fr;background:#fff8f1;color:#111827;font-family:Comfortaa,system-ui,sans-serif}.side{position:sticky;top:0;height:100vh;background:#171b2a;color:white;padding:26px 18px;display:flex;flex-direction:column;gap:8px}.brand{font:700 31px/1 'Patrick Hand',cursive}.private{font-size:11px;color:#ffb7b3;text-transform:uppercase;letter-spacing:.14em;margin-bottom:24px}.side button{border:0;background:transparent;color:#d7dae4;padding:13px;text-align:left;border-radius:12px;font-weight:800;cursor:pointer}.side button.active{background:#ff5d62;color:white}.stats{margin-top:18px;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px;display:grid;grid-template-columns:auto 1fr;gap:5px 10px}.back{margin-top:auto;font-size:13px;font-weight:800}.main{padding:32px clamp(18px,4vw,56px) 70px;min-width:0}.top{display:flex;justify-content:space-between;gap:18px;align-items:center}.top p,.toolbar p{margin:0;color:#ff5d62;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}.top h1{margin:4px 0 0;font:700 clamp(36px,4vw,56px)/.95 'Patrick Hand',cursive}.connect{display:flex;gap:8px}.connect input{min-width:250px;border:1px solid #e3d8cf;border-radius:999px;padding:11px 14px}.connect button,.create{border:0;border-radius:999px;background:#171b2a;color:white;padding:12px 17px;font-weight:900;cursor:pointer}.status{margin:16px 0;padding:12px 15px;background:#dff7f2;border-radius:14px;font-size:13px}.toolbar{margin:28px 0 16px;display:flex;justify-content:space-between;align-items:end;gap:18px}.toolbar h2{margin:3px 0 5px;font:700 42px/1 'Patrick Hand',cursive}.toolbar span{font-size:13px;color:#616779}.product-list{display:grid;gap:12px}.product-row{background:white;border-radius:22px;padding:14px;display:grid;grid-template-columns:130px minmax(0,1fr) auto;gap:16px;align-items:center;box-shadow:0 12px 34px rgba(50,35,25,.06)}.thumb{height:105px;border-radius:16px;display:grid;place-items:center;overflow:hidden;font-family:'Patrick Hand',cursive;font-size:22px}.thumb img{width:100%;height:100%;object-fit:cover}.thumb.coral{background:#ffe0da}.thumb.mint{background:#d9f5ef}.thumb.lilac{background:#ead9ff}.thumb.yellow{background:#ffedb6}.thumb.blue{background:#dcecff}.info h3{margin:7px 0 4px;font-size:18px}.info p{margin:0 0 6px;color:#596071;font-size:13px}.info small{color:#848999}.badges{display:flex;gap:6px;flex-wrap:wrap}.badges span{font-size:10px;font-weight:900;background:#f1ece7;border-radius:999px;padding:5px 8px}.badges .live{background:#d9f6ef;color:#087f78}.badges .draft{background:#f1ece7;color:#777}.actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;max-width:380px}.actions a,.actions button{border:1px solid #e8ded5;background:#fff;border-radius:999px;padding:9px 12px;font-size:11px;font-weight:900;cursor:pointer}.actions .primary{background:#171b2a;color:white;border-color:#171b2a}.actions .danger{color:#b42318;background:#fff0ef}.home-card{max-width:850px;background:white;padding:24px;border-radius:24px;box-shadow:0 12px 34px rgba(50,35,25,.06)}.home-card h3{font:700 30px/1 'Patrick Hand',cursive;margin:10px 0 16px}.home-card label{display:grid;gap:6px;font-size:12px;font-weight:900;margin-bottom:14px}.home-card input,.home-card textarea,.home-card select{border:1px solid #e5ddd6;border-radius:12px;padding:11px 12px;background:#fffdf9;font:600 14px Comfortaa,system-ui,sans-serif}@media(max-width:900px){.admin-shell{grid-template-columns:1fr}.side{position:static;height:auto;flex-direction:row;align-items:center;overflow:auto}.private,.stats,.back{display:none}.brand{margin-right:auto}.main{padding:18px}.top{align-items:flex-start;flex-direction:column}.connect{width:100%}.connect input{min-width:0;flex:1}.product-row{grid-template-columns:90px 1fr}.thumb{height:85px}.actions{grid-column:1/-1;justify-content:flex-start;max-width:none}}@media(max-width:560px){.side{padding:12px}.brand{font-size:25px}.top h1{font-size:40px}.toolbar{align-items:flex-start;flex-direction:column}.product-row{grid-template-columns:1fr}.thumb{height:170px}.actions a,.actions button{flex:1;text-align:center}.connect{flex-direction:column}}`;