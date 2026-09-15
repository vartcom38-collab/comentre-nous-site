'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import initialHome from '../../../content/home.json';

type HomeContent=typeof initialHome;
const OWNER='vartcom38-collab';
const REPO='comentre-nous-site';
const BRANCH='main';
const PATH='content/home.json';

function encodeBase64(value:string){return btoa(unescape(encodeURIComponent(value)))}
function decodeBase64(value:string){return decodeURIComponent(escape(atob(value.replace(/\n/g,''))))}
async function github(path:string,token:string,init?:RequestInit){const response=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`,{...init,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(token?{Authorization:`Bearer ${token}`}:{}) ,...(init?.headers||{})}});if(!response.ok)throw new Error(`${response.status} ${response.statusText} — ${await response.text()}`);return response.json()}

export default function AdminHomePage(){
  const [token,setToken]=useState('');
  const [home,setHome]=useState<HomeContent>(initialHome);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{const saved=window.sessionStorage.getItem('comentre_admin_github_token')||window.localStorage.getItem('comentre_admin_github_token')||'';setToken(saved);if(saved){github(`contents/${PATH}?ref=${BRANCH}`,saved).then(file=>setHome(JSON.parse(decodeBase64(file.content)))).catch(error=>setStatus(`Chargement impossible : ${error.message}`))}},[]);
  async function save(){if(!token.trim())return setStatus('Reconnecte GitHub depuis le tableau de bord.');setBusy(true);setStatus('Enregistrement…');try{const current=await github(`contents/${PATH}?ref=${BRANCH}`,token.trim());await github(`contents/${PATH}`,token.trim(),{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Admin: update homepage',content:encodeBase64(`${JSON.stringify(home,null,2)}\n`),sha:current.sha,branch:BRANCH})});setStatus('Accueil enregistré. La mise en ligne va se faire automatiquement.')}catch(error){setStatus(`Erreur : ${(error as Error).message}`)}finally{setBusy(false)}}

  return <main className="home-admin"><style>{css}</style>
    <header><div><Link href="/admin/">← Tableau de bord</Link><p>Administration</p><h1>Page d’accueil</h1><span>Modifier le hero et le bloc nouveautés.</span></div><button onClick={save} disabled={busy}>{busy?'Enregistrement…':'Enregistrer l’accueil'}</button></header>
    {status&&<div className="status">{status}</div>}
    <section className="grid"><article><h2>Hero</h2><label>Petite accroche<input value={home.hero.eyebrow} onChange={e=>setHome({...home,hero:{...home.hero,eyebrow:e.target.value}})}/></label><label>Grand titre<textarea rows={3} value={home.hero.title} onChange={e=>setHome({...home,hero:{...home.hero,title:e.target.value}})}/></label><label>Introduction<textarea rows={5} value={home.hero.intro} onChange={e=>setHome({...home,hero:{...home.hero,intro:e.target.value}})}/></label></article>
    <article><h2>Bloc nouveautés</h2><label>Petite accroche<input value={home.homeProducts.eyebrow} onChange={e=>setHome({...home,homeProducts:{...home.homeProducts,eyebrow:e.target.value}})}/></label><label>Titre<input value={home.homeProducts.title} onChange={e=>setHome({...home,homeProducts:{...home.homeProducts,title:e.target.value}})}/></label><div className="two"><label>Mode<select value={home.homeProducts.mode} onChange={e=>setHome({...home,homeProducts:{...home.homeProducts,mode:e.target.value as HomeContent['homeProducts']['mode']}})}><option value="newest">Plus récents</option></select></label><label>Nombre de produits<input type="number" min="1" max="12" value={home.homeProducts.limit} onChange={e=>setHome({...home,homeProducts:{...home.homeProducts,limit:Number(e.target.value)||4}})}/></label></div></article></section>
    <footer><button onClick={save} disabled={busy}>Enregistrer l’accueil</button><Link href="/" target="_blank">Voir le site →</Link></footer>
  </main>
}

const css=`*{box-sizing:border-box}.home-admin{min-height:100vh;background:#fff8f1;color:#171b2a;padding:28px clamp(16px,4vw,56px) 70px;font-family:Comfortaa,system-ui,sans-serif}.home-admin header,.home-admin>.status,.home-admin>.grid,.home-admin footer{max-width:1100px;margin-left:auto;margin-right:auto}.home-admin header{display:flex;justify-content:space-between;gap:20px;align-items:end}.home-admin header>a:first-child{font-size:12px;font-weight:900}.home-admin header p{margin:14px 0 3px;color:#ff7168;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}.home-admin h1,.home-admin h2{font-family:'Patrick Hand',cursive}.home-admin h1{font-size:56px;line-height:.95;margin:0}.home-admin h2{font-size:34px;margin:0 0 18px}.home-admin header span{font-size:12px;color:#6d7280}.home-admin button{border:0;border-radius:999px;padding:11px 16px;background:#171b2a;color:#fff;font-weight:900;cursor:pointer}.status{margin-top:16px;background:#dff7f2;padding:12px 15px;border-radius:14px;font-size:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px}.grid article{background:#fff;border-radius:22px;padding:22px;box-shadow:0 14px 36px rgba(48,30,18,.06)}.home-admin label{display:grid;gap:6px;font-size:12px;font-weight:900;margin-bottom:14px}.home-admin input,.home-admin textarea,.home-admin select{width:100%;border:1px solid #e5ddd6;background:#fffdf9;border-radius:12px;padding:11px 12px;font:600 14px Comfortaa,system-ui,sans-serif}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.home-admin footer{display:flex;justify-content:space-between;align-items:center;margin-top:18px}.home-admin footer a{font-size:12px;font-weight:900}@media(max-width:760px){.home-admin{padding:16px}.home-admin header{align-items:flex-start;flex-direction:column}.home-admin h1{font-size:44px}.grid,.two{grid-template-columns:1fr}}`;
