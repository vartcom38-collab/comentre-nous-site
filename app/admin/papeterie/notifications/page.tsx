'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PapeterieNotificationsPage(){
  const [adminKey,setAdminKey]=useState('');
  const [email,setEmail]=useState('');
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [connected,setConnected]=useState(false);

  useEffect(()=>{
    const saved=window.sessionStorage.getItem('comentre_orders_admin_key')||'';
    if(saved){setAdminKey(saved);load(saved)}
  },[]);

  async function load(key=adminKey){
    if(!key)return;
    setBusy(true);setStatus('Chargement…');
    try{
      const r=await fetch('/api/comentre/order-notifications.php',{headers:{Authorization:`Bearer ${key}`},cache:'no-store'});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||'Connexion impossible');
      setEmail(d.email||'');setConnected(true);setStatus('');
      window.sessionStorage.setItem('comentre_orders_admin_key',key);
    }catch(e){setConnected(false);setStatus((e as Error).message==='unauthorized'?'Clé de sécurité incorrecte.':`Erreur : ${(e as Error).message}`)}finally{setBusy(false)}
  }

  async function save(){
    if(!email.trim())return setStatus('Entre une adresse email.');
    setBusy(true);setStatus('Enregistrement…');
    try{
      const r=await fetch('/api/comentre/order-notifications.php',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${adminKey}`},body:JSON.stringify({action:'save',email:email.trim()})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||'Erreur serveur');
      setEmail(d.email||email.trim());setStatus('Adresse enregistrée. Les prochaines commandes Papeterie seront envoyées ici.');
    }catch(e){setStatus(`Erreur : ${(e as Error).message}`)}finally{setBusy(false)}
  }

  async function test(){
    if(!email.trim())return setStatus('Entre une adresse email.');
    setBusy(true);setStatus('Envoi du mail test…');
    try{
      const r=await fetch('/api/comentre/order-notifications.php',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${adminKey}`},body:JSON.stringify({action:'test',email:email.trim()})});
      const d=await r.json();
      if(!r.ok)throw new Error(d.error==='mail_send_failed'?'Le serveur n’a pas réussi à envoyer le mail test.':d.error||'Erreur serveur');
      setStatus('Mail test envoyé. Vérifie la boîte de réception et les indésirables.');
    }catch(e){setStatus(`Erreur : ${(e as Error).message}`)}finally{setBusy(false)}
  }

  return <main className="notify-admin"><style>{css}</style>
    <header><div><Link href="/admin/papeterie/">← L’atelier d’Aurélie</Link><p>Papeterie · notifications</p><h1>Email des commandes</h1><span>Choisis simplement l’adresse qui doit recevoir chaque nouvelle commande Papeterie.</span></div></header>

    {!connected?<section className="card connect"><h2>Première connexion</h2><p>Pour protéger les commandes, entre la clé Commandes configurée pour l’espace d’Aurélie. Elle restera uniquement dans cette session du navigateur.</p><div className="row"><input type="password" value={adminKey} onChange={e=>setAdminKey(e.target.value)} placeholder="Clé commandes"/><button onClick={()=>load()} disabled={busy}>{busy?'Connexion…':'Continuer'}</button></div></section>:
    <section className="card"><div className="intro"><div><small>Notifications de commandes</small><h2>Où envoyer les nouvelles commandes ?</h2><p>Dès qu’une commande Papeterie est créée, un email part automatiquement vers cette adresse avec la cliente, les produits, le montant et l’adresse de livraison.</p></div><div className="badge">● Actif</div></div><label>Adresse email de réception<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="aurelie@exemple.fr"/></label><div className="actions"><button className="primary" onClick={save} disabled={busy}>{busy?'Patiente…':'Enregistrer'}</button><button onClick={test} disabled={busy||!email.trim()}>Envoyer un email test</button></div><div className="hint">Tu peux changer cette adresse quand tu veux. Les commandes restent aussi visibles dans l’espace de suivi.</div></section>}

    {status&&<div className="status">{status}</div>}
    <div className="links"><Link href="/admin/papeterie/commandes/">Voir les commandes →</Link><Link href="/admin/papeterie/">Retour à l’atelier →</Link></div>
  </main>
}

const css=String.raw`*{box-sizing:border-box}.notify-admin{min-height:100vh;background:#fff8f1;color:#171b2a;padding:32px 18px 70px;font-family:Comfortaa,system-ui,sans-serif}.notify-admin header,.card,.status,.links{width:min(820px,100%);margin-left:auto;margin-right:auto}.notify-admin header{margin-bottom:18px}.notify-admin header a{font-size:12px;font-weight:900;text-decoration:none;color:#171b2a}.notify-admin header p{margin:18px 0 4px;color:#ff7168;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}.notify-admin h1,.notify-admin h2{font-family:'Patrick Hand',cursive}.notify-admin h1{font-size:clamp(42px,7vw,62px);line-height:.95;margin:0}.notify-admin header span{display:block;margin-top:8px;color:#707682;font-size:13px;line-height:1.6}.card{background:#fff;border-radius:24px;padding:24px;box-shadow:0 16px 42px rgba(48,30,18,.07)}.card h2{font-size:32px;margin:0 0 8px}.card p{font-size:12px;line-height:1.7;color:#6e7480}.intro{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.intro small{color:#ff7168;text-transform:uppercase;letter-spacing:.1em;font-size:10px;font-weight:900}.badge{background:#dff7f2;color:#22594d;border-radius:999px;padding:8px 11px;font-size:11px;font-weight:900;white-space:nowrap}.card label{display:grid;gap:7px;margin-top:20px;font-size:12px;font-weight:900}.card input{width:100%;border:1px solid #e5ddd6;background:#fffdfa;border-radius:14px;padding:13px 14px;font:700 14px Comfortaa,system-ui,sans-serif}.row,.actions{display:flex;gap:9px;margin-top:14px}.notify-admin button{border:0;border-radius:999px;padding:12px 17px;font:900 12px Comfortaa,system-ui,sans-serif;cursor:pointer;background:#f1e9e3;color:#171b2a}.notify-admin button.primary,.connect button{background:#171b2a;color:#fff}.notify-admin button:disabled{opacity:.55;cursor:not-allowed}.connect .row input{flex:1}.hint{margin-top:16px;padding:12px 14px;border-radius:14px;background:#fff4ed;color:#6e5550;font-size:11px;line-height:1.6}.status{margin-top:12px;background:#dff7f2;border-radius:14px;padding:12px 14px;font-size:12px;font-weight:800}.links{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.links a{text-decoration:none;background:#fff;border-radius:999px;padding:10px 14px;color:#171b2a;font-size:11px;font-weight:900}@media(max-width:640px){.notify-admin{padding:20px 12px 50px}.intro{flex-direction:column}.row,.actions{flex-direction:column}.badge{align-self:flex-start}}`;
