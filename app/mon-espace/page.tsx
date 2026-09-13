'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { LayoutShell } from '@/components/Site';

type Customer = { id:number; email:string; first_name:string; last_name:string; display_name:string };
type Order = { id:number; number:string; status:string; date_created:string; total:string; currency:string; items:{name:string;quantity:number;total:string}[] };
type Download = { download_name:string; product_name:string; download_url:string; downloads_remaining:string|number; access_expires:string };

const statusLabels: Record<string,string> = {
  pending:'En attente', processing:'En préparation', 'on-hold':'En attente', completed:'Terminée', cancelled:'Annulée', refunded:'Remboursée', failed:'Échouée'
};

export default function CustomerSpacePage() {
  const [customer, setCustomer] = useState<Customer|null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { void restoreSession(); }, []);

  async function request(action:string, options?:RequestInit){
    const response = await fetch(`/customer-account.php?action=${encodeURIComponent(action)}`, { credentials:'same-origin', cache:'no-store', ...options });
    const data = await response.json().catch(()=>({}));
    if(!response.ok || data.ok === false) throw new Error(data.error || 'Une erreur est survenue.');
    return data;
  }

  async function restoreSession(){
    try{
      const data = await request('session');
      if(data.authenticated && data.customer){
        setCustomer(data.customer);
        await loadPrivateData();
      }
    }catch(_){
      setCustomer(null);
    }finally{ setLoading(false); }
  }

  async function loadPrivateData(){
    const [ordersData, downloadsData] = await Promise.all([request('orders'), request('downloads')]);
    setOrders(ordersData.orders || []);
    setDownloads(downloadsData.downloads || []);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '');
    const password = String(form.get('password') || '');
    setBusy(true); setMessage('');
    try{
      const data = await request('login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      setCustomer(data.customer || null);
      await loadPrivateData();
      event.currentTarget.reset();
    }catch(error){ setMessage(error instanceof Error ? error.message : 'Connexion impossible.'); }
    finally{ setBusy(false); }
  }

  async function logout(){
    setBusy(true);
    try{ await request('logout',{method:'POST'}); }catch(_){}
    setCustomer(null); setOrders([]); setDownloads([]); setBusy(false);
  }

  function money(value:string,currency='EUR'){
    const amount = Number(value || 0);
    try{return new Intl.NumberFormat('fr-FR',{style:'currency',currency}).format(amount)}catch(_){return `${value} €`}
  }

  return (
    <LayoutShell>
      <main className="customer-space">
        <style>{styles}</style>

        <section className="customer-hero">
          <div>
            <p className="customer-kicker">Ton espace Com’ entre nous</p>
            <h1>{customer ? `Bonjour ${customer.first_name || '♡'}` : 'Retrouve tout ce que tu as acheté, au même endroit.'}</h1>
            <p className="customer-intro">Commandes, téléchargements et informations de compte restent ici, directement sur Com’ entre nous.</p>
            <div className="customer-actions">
              {customer ? <button type="button" onClick={logout} disabled={busy}>Se déconnecter</button> : <a href="#connexion">Me connecter à mon espace →</a>}
              <Link href="/boutique">Continuer mes découvertes</Link>
            </div>
          </div>
          <div className="customer-visual" aria-hidden="true">
            <span className="customer-heart">♡</span>
            <div className="customer-paper one"><b>Mes commandes</b><small>statut · détails · historique</small></div>
            <div className="customer-paper two"><b>Mes téléchargements</b><small>ressources numériques achetées</small></div>
            <div className="customer-paper three"><b>Mes informations</b><small>adresse · compte · mot de passe</small></div>
          </div>
        </section>

        {!customer && !loading ? <section className="customer-login" id="connexion" aria-labelledby="connexion-title">
          <div className="customer-login-copy">
            <p className="customer-kicker">Connexion cliente</p>
            <h2 id="connexion-title">Se connecter à mon espace</h2>
            <p>Utilise l’adresse e-mail et le mot de passe de ton compte cliente. Tu restes sur Com’ entre nous.</p>
          </div>
          <form onSubmit={handleLogin}>
            <label>E-mail<input type="email" name="email" autoComplete="email" placeholder="ton@email.fr" required /></label>
            <label>Mot de passe<input type="password" name="password" autoComplete="current-password" placeholder="••••••••" required /></label>
            <button type="submit" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter →'}</button>
            {message ? <p className="customer-message" role="status">{message}</p> : null}
          </form>
        </section> : null}

        {loading ? <section className="customer-state">Chargement de ton espace…</section> : null}

        {customer ? <>
          <section className="customer-private" aria-labelledby="orders-title">
            <div className="customer-section-head"><div><p className="customer-kicker">Historique</p><h2 id="orders-title">Mes commandes</h2></div><span>{orders.length} commande{orders.length>1?'s':''}</span></div>
            {orders.length ? <div className="orders-list">{orders.map(order=><article key={order.id} className="order-card"><div className="order-top"><div><small>Commande</small><strong>#{order.number}</strong></div><span>{statusLabels[order.status] || order.status}</span><div className="order-total">{money(order.total,order.currency)}</div></div><p className="order-date">{order.date_created ? new Date(order.date_created).toLocaleDateString('fr-FR') : ''}</p><div className="order-items">{order.items.map((item,index)=><div key={`${order.id}-${index}`}><span>{item.name}</span><b>× {item.quantity}</b></div>)}</div></article>)}</div> : <div className="empty-box">Aucune commande pour le moment. Tes prochains achats apparaîtront ici.</div>}
          </section>

          <section className="customer-private" aria-labelledby="downloads-title">
            <div className="customer-section-head"><div><p className="customer-kicker">Bibliothèque</p><h2 id="downloads-title">Mes téléchargements</h2></div></div>
            {downloads.length ? <div className="downloads-list">{downloads.map((item,index)=><a key={`${item.download_name}-${index}`} href={item.download_url} target="_blank" rel="noreferrer"><div><strong>{item.product_name || item.download_name}</strong><small>{item.download_name}</small></div><span>Télécharger ↓</span></a>)}</div> : <div className="empty-box">Tu n’as pas encore de téléchargement disponible.</div>}
          </section>

          <section className="customer-grid" aria-label="Fonctions de l’espace cliente">
            <article><span>01</span><h2>Mes commandes</h2><p>Retrouve tes achats et leur état d’avancement.</p></article>
            <article><span>02</span><h2>Mes téléchargements</h2><p>Accède à tes ressources numériques achetées.</p></article>
            <article><span>03</span><h2>Mes coordonnées</h2><p>La modification des adresses sera ajoutée directement ici.</p></article>
            <article><span>04</span><h2>Mon compte</h2><p>{customer.email}</p></article>
          </section>
        </> : null}

        <section className="customer-note">
          <div><strong>Petit point utile</strong><p>Les achats réalisés directement chez Com’ entre nous apparaissent ici. Les achats effectués sur Amazon restent dans ton compte Amazon.</p></div>
          {!customer ? <a href="#connexion">Accéder à mon espace →</a> : null}
        </section>
      </main>
    </LayoutShell>
  );
}

const styles = String.raw`
.customer-space{min-height:100vh;background:linear-gradient(180deg,#fffaf4 0%,#fff5ed 100%);color:#171b2a;font-family:Comfortaa,system-ui,sans-serif;padding-bottom:64px;scroll-behavior:smooth}.customer-hero{width:min(1380px,calc(100% - 2rem));margin:0 auto;padding:72px 0 48px;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.85fr);gap:56px;align-items:center}.customer-kicker{margin:0 0 14px;color:#ff5d62;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.customer-hero h1{max-width:760px;margin:0;font:700 clamp(48px,6vw,78px)/.92 'Patrick Hand',cursive;letter-spacing:-.035em}.customer-intro{max-width:700px;margin:24px 0 0;font-size:17px;line-height:1.75;color:#4d5361}.customer-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.customer-actions a,.customer-actions button,.customer-note a{border-radius:999px;padding:14px 19px;font:900 12px Comfortaa,system-ui,sans-serif;text-decoration:none;border:0;cursor:pointer}.customer-actions a:first-child,.customer-actions button,.customer-note a{background:#171b2a;color:#fff}.customer-actions a:last-child{background:#fff;border:1px solid #eadfd6;color:#171b2a}.customer-visual{position:relative;min-height:410px;border-radius:44px;background:linear-gradient(145deg,#ffe0dc,#fff8f1 58%,#dff6f0);box-shadow:0 25px 70px rgba(48,30,18,.12);overflow:hidden}.customer-visual:before{content:'';position:absolute;width:250px;height:250px;border-radius:50%;right:-70px;top:-80px;background:rgba(255,255,255,.52)}.customer-heart{position:absolute;right:34px;top:26px;font:700 48px/1 'Patrick Hand',cursive}.customer-paper{position:absolute;display:grid;gap:8px;width:58%;padding:20px 22px;border-radius:20px;background:rgba(255,255,255,.92);box-shadow:0 18px 36px rgba(48,30,18,.09);transform:rotate(-2deg)}.customer-paper b{font-size:14px}.customer-paper small{color:#7a7f8b;line-height:1.5}.customer-paper.one{left:30px;top:54px}.customer-paper.two{right:28px;top:170px;transform:rotate(3deg)}.customer-paper.three{left:48px;bottom:38px;transform:rotate(1deg)}.customer-login,.customer-private,.customer-state{width:min(1240px,calc(100% - 2rem));margin:0 auto 18px;padding:28px;border-radius:28px;background:#fff;box-shadow:0 16px 42px rgba(48,30,18,.07)}.customer-login{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;scroll-margin-top:100px}.customer-login h2,.customer-section-head h2{margin:0;font:700 42px/1 'Patrick Hand',cursive}.customer-login-copy>p:last-child{max-width:560px;color:#626875;line-height:1.7}.customer-login form{display:grid;gap:12px}.customer-login label{display:grid;gap:7px;font-size:11px;font-weight:900}.customer-login input{width:100%;border:1px solid #e4d9d0;border-radius:14px;padding:13px 14px;font:600 13px Comfortaa,system-ui,sans-serif;background:#fffdfb;color:#171b2a}.customer-login button{border:0;border-radius:999px;padding:14px 18px;background:#ff5d62;color:#fff;font:900 12px Comfortaa,system-ui,sans-serif;cursor:pointer}.customer-login button:disabled{opacity:.55}.customer-message{margin:0;padding:11px 13px;border-radius:14px;background:#fff0ee;color:#8f2018;font-size:11px;line-height:1.55}.customer-state{text-align:center;color:#686e7b;font-size:12px}.customer-section-head{display:flex;justify-content:space-between;gap:18px;align-items:end;margin-bottom:18px}.customer-section-head>span{font-size:11px;font-weight:900;color:#747987}.orders-list,.downloads-list{display:grid;gap:12px}.order-card{padding:18px;border-radius:20px;background:#fffaf6;border:1px solid #eee2da}.order-top{display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center}.order-top div:first-child{display:grid;gap:3px}.order-top small,.order-date{color:#7c818c;font-size:10px}.order-top>span{padding:7px 10px;border-radius:999px;background:#dff6f0;color:#27685f;font-size:10px;font-weight:900}.order-total{font-weight:900}.order-date{margin:8px 0 13px}.order-items{display:grid;gap:7px;padding-top:12px;border-top:1px dashed #dfd1c8}.order-items div{display:flex;justify-content:space-between;gap:10px;font-size:11px}.order-items b{font-size:10px}.downloads-list a{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border-radius:18px;background:#fffaf6;border:1px solid #eee2da;text-decoration:none;color:#171b2a}.downloads-list a div{display:grid;gap:4px}.downloads-list small{color:#7a7f8b}.downloads-list span{font-size:11px;font-weight:900}.empty-box{padding:22px;border-radius:18px;background:#fffaf6;color:#777c87;font-size:12px}.customer-grid{width:min(1240px,calc(100% - 2rem));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.customer-grid article{background:#fff;border-radius:24px;padding:24px;box-shadow:0 14px 34px rgba(48,30,18,.06)}.customer-grid span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fff0ee;color:#ff5d62;font-size:10px;font-weight:900}.customer-grid h2{margin:18px 0 10px;font:700 28px/1 'Patrick Hand',cursive}.customer-grid p{margin:0;color:#626875;font-size:12px;line-height:1.7;word-break:break-word}.customer-note{width:min(1240px,calc(100% - 2rem));margin:18px auto 0;padding:20px 24px;border-radius:24px;background:#dff6f0;display:flex;align-items:center;justify-content:space-between;gap:20px}.customer-note strong{font-size:13px}.customer-note p{margin:5px 0 0;color:#47615d;font-size:11px;line-height:1.6}.customer-note a{white-space:nowrap}@media(max-width:980px){.customer-hero{grid-template-columns:1fr}.customer-visual{min-height:360px}.customer-login{grid-template-columns:1fr}.customer-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:650px){.customer-hero{padding:40px 0 28px;gap:28px}.customer-hero h1{font-size:48px}.customer-intro{font-size:14px}.customer-actions{display:grid}.customer-actions a,.customer-actions button{text-align:center}.customer-visual{min-height:330px;border-radius:28px}.customer-paper{width:72%;padding:16px}.customer-paper.one{left:18px;top:44px}.customer-paper.two{right:16px;top:145px}.customer-paper.three{left:28px;bottom:26px}.customer-login,.customer-private{padding:20px}.customer-login h2,.customer-section-head h2{font-size:36px}.customer-section-head{align-items:flex-start;flex-direction:column}.order-top{grid-template-columns:1fr auto}.order-total{grid-column:1/-1}.customer-grid{grid-template-columns:1fr}.customer-note{align-items:stretch;flex-direction:column}.customer-note a{text-align:center;width:100%}}
`;
