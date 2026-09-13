'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import initialContent from '../../../content/site-sections.json';

type SiteContent = typeof initialContent;

const OWNER='vartcom38-collab';
const REPO='comentre-nous-site';
const BRANCH='main';
const PATH='content/site-sections.json';

function encodeBase64(value:string){return btoa(unescape(encodeURIComponent(value)))}
function decodeBase64(value:string){return decodeURIComponent(escape(atob(value.replace(/\n/g,''))))}
async function github(path:string,token:string,init?:RequestInit){const response=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`,{...init,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${token}`,...(init?.headers||{})}});if(!response.ok)throw new Error(`${response.status} ${response.statusText} — ${await response.text()}`);return response.json()}
async function saveJson(value:unknown,token:string){const current=await github(`contents/${PATH}?ref=${BRANCH}`,token);return github(`contents/${PATH}`,token,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Admin: update site content',content:encodeBase64(`${JSON.stringify(value,null,2)}\n`),sha:current.sha,branch:BRANCH})})}

export default function ContentAdminPage(){
  const [token,setToken]=useState('');
  const [content,setContent]=useState<SiteContent>(initialContent);
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{const saved=window.sessionStorage.getItem('comentre_admin_github_token')||'';setToken(saved);if(saved){github(`contents/${PATH}?ref=${BRANCH}`,saved).then(file=>setContent(JSON.parse(decodeBase64(file.content)))).catch(error=>setStatus(`Chargement impossible : ${error.message}`))}},[]);

  function patchUniverse(index:number,patch:Partial<SiteContent['universes'][number]>){setContent(current=>({...current,universes:current.universes.map((item,i)=>i===index?{...item,...patch}:item)}))}
  async function save(){if(!token)return setStatus('Reconnecte GitHub depuis l’admin.');setBusy(true);setStatus('Enregistrement…');try{await saveJson(content,token);setStatus('Contenus enregistrés. Infomaniak va redéployer le site.')}catch(error){setStatus(`Erreur : ${(error as Error).message}`)}finally{setBusy(false)}}

  return <main className="content-admin"><style>{css}</style>
    <header><div><Link href="/admin/">← Tableau de bord</Link><p>Contenus du site</p><h1>Modifier les encarts</h1><span>Tu peux changer directement les mots, phrases et boutons affichés dans les univers.</span></div><button onClick={save} disabled={busy}>Enregistrer les modifications</button></header>
    {status&&<div className="status">{status}</div>}
    <section className="cards">
      {content.universes.map((item,index)=><article className={`editor ${item.tone}`} key={item.id}>
        <div className="preview"><span>{item.icon}</span><small>{item.tag}</small><h2>{item.title}</h2><p>{item.text}</p><b>{item.buttonLabel} →</b></div>
        <div className="fields"><label>Titre<input value={item.title} onChange={e=>patchUniverse(index,{title:e.target.value})}/></label><label>Petite phrase / catégorie<input value={item.tag} onChange={e=>patchUniverse(index,{tag:e.target.value})}/></label><label>Texte<textarea rows={5} value={item.text} onChange={e=>patchUniverse(index,{text:e.target.value})}/></label><div className="two"><label>Texte du bouton<input value={item.buttonLabel} onChange={e=>patchUniverse(index,{buttonLabel:e.target.value})}/></label><label>Icône<input value={item.icon} onChange={e=>patchUniverse(index,{icon:e.target.value})}/></label></div><label>Lien de la page<input value={item.href} onChange={e=>patchUniverse(index,{href:e.target.value})}/></label></div>
      </article>)}
    </section>
    <footer><button onClick={save} disabled={busy}>Enregistrer les modifications</button><Link href="/">Voir le site →</Link></footer>
  </main>
}

const css=`*{box-sizing:border-box}.content-admin{min-height:100vh;background:#fff8f1;color:#111827;padding:28px clamp(16px,4vw,56px) 70px;font-family:Comfortaa,system-ui,sans-serif}.content-admin header{display:flex;justify-content:space-between;gap:24px;align-items:end;max-width:1400px;margin:auto}.content-admin header a{font-size:13px;font-weight:900}.content-admin header p{margin:16px 0 4px;color:#ff5d62;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}.content-admin h1{margin:0;font:700 clamp(40px,5vw,64px)/.95 'Patrick Hand',cursive}.content-admin header span{display:block;margin-top:8px;color:#687083;font-size:13px}.content-admin button{border:0;border-radius:999px;background:#171b2a;color:#fff;padding:12px 18px;font-weight:900;cursor:pointer}.status{max-width:1400px;margin:18px auto 0;background:#dff7f2;padding:12px 16px;border-radius:14px;font-size:13px}.cards{max-width:1400px;margin:24px auto;display:grid;gap:18px}.editor{display:grid;grid-template-columns:minmax(280px,.85fr) minmax(0,1.15fr);gap:20px;background:#fff;padding:18px;border-radius:28px;box-shadow:0 14px 40px rgba(50,35,25,.07)}.preview{min-height:290px;border-radius:22px;padding:28px;display:flex;flex-direction:column;justify-content:flex-end}.editor.coral .preview{background:#ffe0da}.editor.mint .preview{background:#d9f5ef}.editor.lilac .preview{background:#ead9ff}.preview>span{font-size:34px;margin-bottom:auto}.preview small{font-weight:900;text-transform:uppercase;letter-spacing:.08em}.preview h2{margin:8px 0 6px;font:700 38px/1 'Patrick Hand',cursive}.preview p{line-height:1.6}.preview b{margin-top:8px}.fields{padding:8px}.fields label{display:grid;gap:6px;font-size:12px;font-weight:900;margin-bottom:13px}.fields input,.fields textarea{width:100%;border:1px solid #e5ddd6;background:#fffdf9;border-radius:12px;padding:11px 12px;font:600 14px Comfortaa,system-ui,sans-serif}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.content-admin footer{max-width:1400px;margin:20px auto;display:flex;align-items:center;gap:14px}.content-admin footer a{font-weight:900}@media(max-width:800px){.content-admin header{align-items:flex-start;flex-direction:column}.editor{grid-template-columns:1fr}.two{grid-template-columns:1fr}.preview{min-height:240px}}`;
