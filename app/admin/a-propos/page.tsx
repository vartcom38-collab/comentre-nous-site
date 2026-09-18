'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import initialAbout from '../../../content/about.json';

type AboutContent=typeof initialAbout;
type PersonKey='marion'|'aurelie';

const OWNER='vartcom38-collab';
const REPO='comentre-nous-site';
const BRANCH='main';
const PATH='content/about.json';

function encodeBase64(value:string){return btoa(unescape(encodeURIComponent(value)))}
function decodeBase64(value:string){return decodeURIComponent(escape(atob(value.replace(/\n/g,''))))}
async function github(path:string,token:string,init?:RequestInit){
  const response=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`,{
    ...init,
    headers:{
      Accept:'application/vnd.github+json',
      'X-GitHub-Api-Version':'2022-11-28',
      ...(token?{Authorization:`Bearer ${token}`}:{}),
      ...(init?.headers||{})
    }
  });
  if(!response.ok)throw new Error(`${response.status} ${response.statusText} — ${await response.text()}`);
  return response.json();
}

export default function AboutAdminPage(){
  const[token,setToken]=useState('');
  const[data,setData]=useState<AboutContent>(initialAbout);
  const[status,setStatus]=useState('');
  const[busy,setBusy]=useState(false);

  useEffect(()=>{
    const saved=window.sessionStorage.getItem('comentre_admin_github_token')||window.localStorage.getItem('comentre_admin_github_token')||'';
    setToken(saved);
    if(saved){
      github(`contents/${PATH}?ref=${BRANCH}`,saved)
        .then(file=>setData(JSON.parse(decodeBase64(file.content))))
        .catch(error=>setStatus(`Chargement impossible : ${error.message}`));
    }
  },[]);

  const patch=(who:PersonKey,field:keyof AboutContent['people'][PersonKey],value:string)=>{
    setData(current=>({...current,people:{...current.people,[who]:{...current.people[who],[field]:value}}}));
  };

  async function save(){
    if(!token.trim())return setStatus('Reconnecte GitHub depuis le tableau de bord.');
    setBusy(true);setStatus('Enregistrement…');
    try{
      const current=await github(`contents/${PATH}?ref=${BRANCH}`,token.trim());
      await github(`contents/${PATH}`,token.trim(),{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          message:'Admin: update About profiles',
          content:encodeBase64(`${JSON.stringify(data,null,2)}\n`),
          sha:current.sha,
          branch:BRANCH
        })
      });
      setStatus('Enregistré. La page À propos va être mise à jour automatiquement.');
    }catch(error){
      setStatus(`Erreur : ${(error as Error).message}`);
    }finally{setBusy(false)}
  }

  return <main className="about-admin"><style>{css}</style>
    <div className="wrap">
      <header>
        <div>
          <Link href="/admin/">← Tableau de bord</Link>
          <p>Administration</p>
          <h1>Qui se cache derrière Com’ entre nous ?</h1>
          <span>Marion et Aurélie peuvent modifier leur présentation ici.</span>
        </div>
        <button onClick={save} disabled={busy}>{busy?'Enregistrement…':'Enregistrer'}</button>
      </header>
      {status&&<div className="status">{status}</div>}
      <section className="grid">
        {(['marion','aurelie'] as PersonKey[]).map(who=>{
          const person=data.people[who];
          return <article key={who}>
            <div className="card-title">
              <div className={`avatar ${who}`}>{person.name.slice(0,1)}</div>
              <div><small>Fiche</small><h2>{person.name}</h2></div>
            </div>
            <label>Prénom
              <input value={person.name} onChange={e=>patch(who,'name',e.target.value)}/>
            </label>
            <label>Petit titre
              <input value={person.role} onChange={e=>patch(who,'role',e.target.value)} placeholder="Ex. La tata / La maman"/>
            </label>
            <label>Présentation
              <textarea rows={10} value={person.text} onChange={e=>patch(who,'text',e.target.value)}/>
            </label>
            <label>Petite phrase finale
              <textarea rows={3} value={person.quote} onChange={e=>patch(who,'quote',e.target.value)} placeholder="Facultatif"/>
            </label>
            <label>Photo
              <input value={person.photo} onChange={e=>patch(who,'photo',e.target.value)} placeholder="/uploads/..."/>
            </label>
            <p className="help">Pour la photo, on pourra aussi ajouter ensuite un bouton d’envoi direct si vous voulez éviter de manipuler l’URL.</p>
          </article>
        })}
      </section>
      <footer>
        <button onClick={save} disabled={busy}>Enregistrer les présentations</button>
        <Link href="/a-propos/" target="_blank">Voir la page À propos →</Link>
      </footer>
    </div>
  </main>
}

const css=`*{box-sizing:border-box}.about-admin{min-height:100vh;background:#fff8f1;color:#171b2a;padding:28px clamp(16px,4vw,56px) 70px;font-family:Comfortaa,system-ui,sans-serif}.wrap{max-width:1100px;margin:auto}header{display:flex;justify-content:space-between;gap:20px;align-items:end}header>a:first-child{font-size:12px;font-weight:900}header p{margin:14px 0 3px;color:#ff7168;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}h1,h2{font-family:'Patrick Hand',cursive}h1{font-size:54px;line-height:.95;margin:0;max-width:760px}header span{display:block;margin-top:8px;font-size:12px;color:#6d7280}button{border:0;border-radius:999px;padding:11px 16px;background:#171b2a;color:#fff;font-weight:900;cursor:pointer}.status{margin-top:16px;background:#dff7f2;padding:12px 15px;border-radius:14px;font-size:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:22px}.grid article{background:#fff;border-radius:24px;padding:22px;box-shadow:0 14px 36px rgba(48,30,18,.06)}.card-title{display:flex;align-items:center;gap:12px;margin-bottom:18px}.card-title h2{font-size:36px;margin:0}.card-title small{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#8a8f99}.avatar{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font:700 30px 'Patrick Hand',cursive}.avatar.marion{background:#fde6df}.avatar.aurelie{background:#e8f4ef}label{display:grid;gap:6px;font-size:12px;font-weight:900;margin-bottom:14px}input,textarea{width:100%;border:1px solid #e5ddd6;background:#fffdf9;border-radius:12px;padding:11px 12px;font:600 14px Comfortaa,system-ui,sans-serif;line-height:1.55}.help{font-size:11px;line-height:1.5;color:#777d89;background:#fff8f4;padding:10px 12px;border-radius:12px}footer{display:flex;justify-content:space-between;align-items:center;margin-top:18px}footer a{font-size:12px;font-weight:900}@media(max-width:760px){.about-admin{padding:16px}header{align-items:flex-start;flex-direction:column}h1{font-size:42px}.grid{grid-template-columns:1fr}footer{align-items:flex-start;gap:16px;flex-direction:column}}`;
