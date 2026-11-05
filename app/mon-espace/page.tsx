'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { LayoutShell } from '@/components/Site';

type Address = { first_name:string; last_name:string; address_1:string; address_2:string; postcode:string; city:string; country:string };
type Customer = { id:number; email:string; first_name:string; last_name:string; display_name:string; billing?:Address; shipping?:Address };
type SpaceTab = 'overview' | 'orders' | 'downloads' | 'addresses' | 'payments' | 'account';
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
  const [activeTab, setActiveTab] = useState<SpaceTab>('overview');
  const [dataError, setDataError] = useState('');
  const [csrf, setCsrf] = useState('');
  const [editingAddress, setEditingAddress] = useState<'billing'|'shipping'|null>(null);
  const [addressForm, setAddressForm] = useState<Address>({first_name:'',last_name:'',address_1:'',address_2:'',postcode:'',city:'',country:'FR'});
  const [addressMessage, setAddressMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({first_name:'',last_name:''});
  const [profileMessage, setProfileMessage] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  useEffect(() => {
    void restoreSession();
  }, []);

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
        setCsrf(data.csrf || '');
        try { await loadPrivateData(); } catch(error) { setDataError(error instanceof Error ? error.message : 'Impossible de charger tes achats.'); }
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
      setCsrf(data.csrf || '');
      setActiveTab('overview');
      try { await loadPrivateData(); } catch(error) { setDataError(error instanceof Error ? error.message : 'Impossible de charger tes achats.'); }
      event.currentTarget.reset();
    }catch(error){ setMessage(error instanceof Error ? error.message : 'Connexion impossible.'); }
    finally{ setBusy(false); }
  }

  async function logout(){
    setBusy(true);
    try{ await request('logout',{method:'POST'}); }catch(_){}
    setCustomer(null); setCsrf(''); setOrders([]); setDownloads([]); setDataError(''); setActiveTab('overview'); setBusy(false);
  }

  function money(value:string,currency='EUR'){
    const amount = Number(value || 0);
    try{return new Intl.NumberFormat('fr-FR',{style:'currency',currency}).format(amount)}catch(_){return `${value} €`}
  }

  async function saveNewPassword(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!csrf) { setPasswordMessage('Actualise ton espace puis réessaie.'); return; }
    const form = event.currentTarget;
    const fields = new FormData(form);
    const current_password = String(fields.get('current_password') || '');
    const new_password = String(fields.get('new_password') || '');
    const confirm_password = String(fields.get('confirm_password') || '');
    if (new_password.length < 12 || new_password !== confirm_password) {
      setPasswordMessage('Le nouveau mot de passe doit contenir au moins 12 caractères et les deux saisies doivent correspondre.');
      return;
    }
    setBusy(true);setPasswordMessage('');
    try {
      const data = await request('change-password', {
        method:'POST',headers:{'Content-Type':'application/json','X-Comentre-CSRF':csrf},
        body:JSON.stringify({current_password,new_password,confirm_password})
      });
      form.reset();
      if (data.reauthenticate) {
        setCustomer(null);setCsrf('');setOrders([]);setDownloads([]);setEditingPassword(false);
        setMessage('Ton mot de passe est modifié ♡ Reconnecte-toi avec ton nouveau mot de passe.');
      }
    } catch(error) {
      setPasswordMessage(error instanceof Error ? error.message : 'Impossible de changer le mot de passe.');
    } finally {setBusy(false);}
  }

  function beginProfileEdit() {
    if (!customer) return;
    setProfileForm({first_name:customer.first_name || '',last_name:customer.last_name || ''});
    setProfileMessage('');
    setEditingProfile(true);
  }

  async function saveProfile(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!csrf) { setProfileMessage('Actualise ton espace avant de modifier tes informations.'); return; }
    setBusy(true);setProfileMessage('');
    try {
      const data = await request('update-profile',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-Comentre-CSRF':csrf},
        body:JSON.stringify(profileForm)
      });
      setCustomer(data.customer);
      setEditingProfile(false);
      setProfileMessage('Tes informations ont bien été enregistrées ♡');
    } catch(error) {
      setProfileMessage(error instanceof Error ? error.message : 'Impossible de modifier tes informations.');
    } finally {setBusy(false);}
  }

  function beginAddressEdit(kind:'billing'|'shipping') {
    if (!customer) return;
    const current = customer[kind];
    setAddressForm({
      first_name:current?.first_name || customer.first_name || '',
      last_name:current?.last_name || customer.last_name || '',
      address_1:current?.address_1 || '', address_2:current?.address_2 || '',
      postcode:current?.postcode || '',city:current?.city || '',country:current?.country || 'FR'
    });
    setEditingAddress(kind);
    setAddressMessage('');
  }

  async function saveAddress(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingAddress || !csrf) { setAddressMessage('Ta session doit être actualisée avant de modifier tes coordonnées.'); return; }
    setBusy(true);setAddressMessage('');
    try {
      const data = await request('update-address', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-Comentre-CSRF':csrf},
        body:JSON.stringify({kind:editingAddress,address:addressForm})
      });
      setCustomer(data.customer);
      setEditingAddress(null);
      setAddressMessage('Ton adresse a bien été enregistrée ♡');
    } catch(error) {
      setAddressMessage(error instanceof Error ? error.message : 'Impossible d’enregistrer ton adresse.');
    } finally {setBusy(false);}
  }

  const wooAccount = 'https://comentrenous.marionbolomey.fr/commerce/mon-compte/';
  const navItems: {key:SpaceTab; title:string; symbol:string}[] = [
    {key:'overview',title:'Vue d’ensemble',symbol:'⌂'},
    {key:'orders',title:'Mes commandes',symbol:'♡'},
    {key:'downloads',title:'Mes téléchargements',symbol:'↓'},
    {key:'addresses',title:'Mes coordonnées',symbol:'✎'},
    {key:'payments',title:'Moyens de paiement',symbol:'◇'},
    {key:'account',title:'Mon compte',symbol:'☺'},
  ];
  function addressText(address?:Address){
    if (!address) return '';
    return [ [address.first_name,address.last_name].filter(Boolean).join(' '),address.address_1,address.address_2,[address.postcode,address.city].filter(Boolean).join(' '), address.country ].filter(Boolean).join(' · ');
  }

  return (
    <LayoutShell>
      <main className="customer-space">
        <style>{styles}</style>

        <section className={`customer-hero${customer ? ' customer-hero-logged' : ''}`}>
          <div>
            <p className="customer-kicker">Ton espace Com’ entre nous</p>
            <h1>{customer ? `Bonjour ${customer.first_name || '♡'}` : 'Retrouve tout ce que tu as acheté, au même endroit.'}</h1>
            <p className="customer-intro">Commandes, téléchargements et informations de compte restent ici, directement sur Com’ entre nous.</p>
            <div className="customer-actions">
              {customer ? <button type="button" onClick={logout} disabled={busy}>Se déconnecter</button> : <a href="#connexion">Me connecter à mon espace →</a>}
              <Link href="/com-en-famille/">Continuer mes découvertes</Link>
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
            <a className="customer-forgot" href="https://comentrenous.marionbolomey.fr/commerce/mon-compte/lost-password/">Mot de passe oublié ?</a>
            <button type="submit" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter →'}</button>
            {message ? <p className="customer-message" role="status">{message}</p> : null}
          </form>
        </section> : null}

        {loading ? <section className="customer-state">Chargement de ton espace…</section> : null}

        {customer ? <section className="customer-dashboard" aria-label="Espace cliente">
          <nav className="customer-sidebar" aria-label="Navigation de mon espace">
            <p className="customer-kicker">Mon petit coin ♡</p>
            <h2>Mon espace</h2>
            <div className="customer-nav-items">
              {navItems.map(item=><button key={item.key} type="button" className={activeTab===item.key?'is-active':''} aria-current={activeTab===item.key?'page':undefined} onClick={()=>setActiveTab(item.key)}>
                <span aria-hidden="true">{item.symbol}</span>{item.title}
                {item.key==='orders' ? <small>{orders.length}</small> : item.key==='downloads' ? <small>{downloads.length}</small> : null}
              </button>)}
              <button type="button" onClick={logout} disabled={busy} className="customer-sidebar-logout"><span aria-hidden="true">↗</span>Se déconnecter</button>
            </div>
            <div className="customer-sidebar-note">De jolis moments à partager, des idées à retrouver et des ressources toujours à portée de main. ♡</div>
          </nav>
          <div className="customer-panel" aria-live="polite">
            {dataError ? <p className="customer-data-error" role="alert">{dataError} <button type="button" onClick={()=>{ setDataError(''); void loadPrivateData().catch(e=>setDataError(e instanceof Error?e.message:'Erreur de chargement')); }}>Réessayer</button></p> : null}
            {activeTab==='overview' ? <>
              <div className="customer-section-head"><div><p className="customer-kicker">Bienvenue chez toi</p><h2>Ton petit tableau de bord ♡</h2></div></div>
              <p className="customer-panel-intro">Tout ce qui compte, réuni au même endroit. Retrouve tes achats et tes créations quand tu veux.</p>
              <div className="customer-overview-grid">
                <button type="button" onClick={()=>setActiveTab('orders')}><span>Mes commandes</span><strong>{orders.length}</strong><small>Voir mon historique →</small></button>
                <button type="button" onClick={()=>setActiveTab('downloads')}><span>Ma bibliothèque</span><strong>{downloads.length}</strong><small>Retrouver mes fichiers →</small></button>
              </div>
              {orders.length ? <div className="customer-last-order"><div><p className="customer-kicker">Mon dernier achat</p><strong>Commande #{orders[0].number}</strong><small>{orders[0].items.map(item=>item.name).join(', ')}</small></div><button type="button" onClick={()=>setActiveTab('orders')}>Voir la commande →</button></div> : <div className="empty-box">Ton prochain achat apparaîtra ici ♡</div>}
              <Link className="customer-discover" href="/com-en-famille/">Continuer mes découvertes →</Link>
            </> : null}
            {activeTab==='orders' ? <>
              <div className="customer-section-head"><div><p className="customer-kicker">Historique</p><h2>Mes commandes</h2></div><span>{orders.length} commande{orders.length>1?'s':''}</span></div>
              {orders.length ? <div className="orders-list">{orders.map(order=><article key={order.id} className="order-card"><div className="order-top"><div><small>Commande</small><strong>#{order.number}</strong></div><span>{statusLabels[order.status] || order.status}</span><div className="order-total">{money(order.total,order.currency)}</div></div><p className="order-date">{order.date_created ? new Date(order.date_created).toLocaleDateString('fr-FR') : ''}</p><div className="order-items">{order.items.map((item,index)=><div key={`${order.id}-${index}`}><span>{item.name}</span><b>× {item.quantity}</b></div>)}</div></article>)}</div> : <div className="empty-box">Aucune commande pour le moment. Tes prochains achats apparaîtront ici.</div>}
            </> : null}
            {activeTab==='downloads' ? <>
              <div className="customer-section-head"><div><p className="customer-kicker">Bibliothèque</p><h2>Mes téléchargements</h2></div><span>{downloads.length} fichier{downloads.length>1?'s':''}</span></div>
              <p className="customer-panel-intro">Tes ebooks et tes ressources numériques, toujours disponibles ici.</p>
              {downloads.length ? <div className="downloads-list">{downloads.map((item,index)=><a key={`${item.download_name}-${index}`} href={item.download_url} target="_blank" rel="noreferrer"><div><strong>{item.product_name || item.download_name}</strong><small>{item.download_name}</small></div><span>Télécharger ↓</span></a>)}</div> : <div className="empty-box">Tu n’as pas encore de téléchargement disponible.</div>}
            </> : null}
            {activeTab==='addresses' ? <>
              <div className="customer-section-head"><div><p className="customer-kicker">Mes informations</p><h2>Mes coordonnées</h2></div></div>
              <p className="customer-panel-intro">Les adresses enregistrées pour tes commandes.</p>
              <div className="customer-address-grid"><article><h3>Adresse de facturation</h3><p>{addressText(customer.billing) || 'Aucune adresse enregistrée.'}</p></article><article><h3>Adresse de livraison</h3><p>{addressText(customer.shipping) || 'Aucune adresse enregistrée.'}</p></article></div>
              {editingAddress ? <form className="customer-address-form" onSubmit={saveAddress}>
                <h3>Modifier mon adresse de {editingAddress==='billing'?'facturation':'livraison'}</h3>
                <div className="customer-form-columns">
                  {([['first_name','Prénom'],['last_name','Nom'],['address_1','Adresse'],['address_2','Complément d’adresse'],['postcode','Code postal'],['city','Ville'],['country','Pays (code à 2 lettres, ex. FR)']] as const).map(([key,title])=>
                    <label key={key}>{title}<input type="text" value={addressForm[key]} required={key!=='address_2'} maxLength={160} onChange={e=>setAddressForm(prev=>({...prev,[key]:e.target.value}))}/></label>)}
                </div>
                <div className="customer-form-actions"><button type="submit" disabled={busy}>{busy?'Enregistrement…':'Enregistrer mes coordonnées ♡'}</button><button type="button" className="customer-form-cancel" onClick={()=>{setEditingAddress(null);setAddressMessage('');}}>Annuler</button></div>
              </form> : <div className="customer-form-actions"><button type="button" onClick={()=>beginAddressEdit('billing')}>Modifier ma facturation →</button><button type="button" onClick={()=>beginAddressEdit('shipping')}>Modifier ma livraison →</button></div>}
              {addressMessage ? <p className="customer-address-message" role="status">{addressMessage}</p> : null}
            </> : null}
            {activeTab==='payments' ? <>
              <div className="customer-section-head"><div><p className="customer-kicker">Paiement</p><h2>Mes moyens de paiement</h2></div></div>
              <p className="customer-panel-intro">Consulte ou gère les moyens de paiement enregistrés auprès de WooCommerce. Aucune donnée bancaire n’est affichée ni enregistrée dans cet espace.</p>
              <a className="customer-native-link" href={wooAccount+'payment-methods/'}>Gérer mes moyens de paiement →</a>
            </> : null}
            {activeTab==='account' ? <>
              <div className="customer-section-head"><div><p className="customer-kicker">Mes informations</p><h2>Mon compte</h2></div></div>
              <div className="customer-account-info"><div><small>Nom</small><strong>{customer.display_name || 'Non renseigné'}</strong></div><div><small>Adresse e-mail</small><strong>{customer.email}</strong></div></div>
              {editingProfile ? <form className="customer-address-form" onSubmit={saveProfile}>
                <h3>Modifier mes informations ♡</h3>
                <div className="customer-form-columns">
                  <label>Prénom<input type="text" maxLength={100} value={profileForm.first_name} required onChange={e=>setProfileForm(prev=>({...prev,first_name:e.target.value}))}/></label>
                  <label>Nom<input type="text" maxLength={100} value={profileForm.last_name} required onChange={e=>setProfileForm(prev=>({...prev,last_name:e.target.value}))}/></label>
                </div>
                <div className="customer-form-actions">
                  <button type="submit" disabled={busy}>{busy?'Enregistrement…':'Enregistrer mes informations ♡'}</button>
                  <button type="button" className="customer-form-cancel" onClick={()=>{setEditingProfile(false);setProfileMessage('');}}>Annuler</button>
                </div>
              </form> : <div className="customer-form-actions"><button type="button" onClick={beginProfileEdit}>Modifier mon prénom et mon nom →</button></div>}
              {profileMessage ? <p className="customer-address-message" role="status">{profileMessage}</p> : null}
              <div className="customer-profile-security">
                <strong>Mon mot de passe</strong>
                <p>Tu peux le modifier ici, sans quitter ton espace. Pour ta sécurité, ton mot de passe actuel est nécessaire et tu te reconnecteras une fois après la modification.</p>
                {editingPassword ? <form className="customer-password-form" onSubmit={saveNewPassword}>
                  <label>Mot de passe actuel<input type="password" name="current_password" autoComplete="current-password" required/></label>
                  <label>Nouveau mot de passe (12 caractères minimum)<input type="password" name="new_password" autoComplete="new-password" minLength={12} required/></label>
                  <label>Confirmer le nouveau mot de passe<input type="password" name="confirm_password" autoComplete="new-password" minLength={12} required/></label>
                  <div className="customer-form-actions"><button type="submit" disabled={busy}>{busy?'Enregistrement…':'Changer mon mot de passe ♡'}</button><button type="button" className="customer-form-cancel" onClick={()=>{setEditingPassword(false);setPasswordMessage('');}}>Annuler</button></div>
                </form> : <div className="customer-form-actions"><button type="button" onClick={()=>{setPasswordMessage('');setEditingPassword(true);}}>Modifier mon mot de passe →</button></div>}
                {passwordMessage ? <p className="customer-data-error" role="alert">{passwordMessage}</p> : null}
                <div className="customer-email-note"><strong>Mon adresse e-mail</strong><p>La modification de l’e-mail reste sécurisée par WooCommerce pour éviter de perdre l’accès aux achats.</p><a href={wooAccount+'edit-account/'}>Modifier mon e-mail →</a></div>
              </div>
            </> : null}
          </div>
        </section> : null}

        <section className="customer-note">
          <div><strong>Petit point utile</strong><p>Les achats réalisés directement chez Com’ entre nous apparaissent ici. Les achats effectués sur Amazon restent dans ton compte Amazon.</p></div>
          {!customer ? <a href="#connexion">Accéder à mon espace →</a> : null}
        </section>
      </main>
    </LayoutShell>
  );
}

const styles = String.raw`
.customer-password-form{display:grid;gap:14px;margin-top:20px}
.customer-password-form label{display:grid;gap:7px;color:#171b2a;font:700 11px/1.5 'Comfortaa',sans-serif}
.customer-password-form input{background:#fffdfb;border:1px solid #e4d9d0;border-radius:13px;padding:13px;color:#171b2a;font:500 12px 'Comfortaa',sans-serif}
.customer-email-note{border-top:1px solid #c9e7de;margin-top:27px;padding-top:19px}
.customer-email-note strong{font-size:23px}

.customer-profile-security{margin-top:28px;padding:22px;border-radius:20px;background:#e8f8f4}
.customer-profile-security strong{font:700 27px/1.2 'Patrick Hand',cursive}
.customer-profile-security p{font:500 11px/1.8 'Comfortaa',sans-serif;color:#45615c}
.customer-profile-security a{font:800 11px/1.5 'Comfortaa',sans-serif;color:#9c4847;text-underline-offset:4px}

.customer-address-form{border-top:1px solid #f0e2d9;margin:24px 0 0;padding:24px 0 0}
.customer-address-form h3{font:700 29px/1.2 'Patrick Hand',cursive;margin:0 0 18px}
.customer-form-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.customer-form-columns label{display:grid;gap:8px;font:700 11px/1.5 'Comfortaa',sans-serif}
.customer-form-columns input{min-width:0;border:1px solid #e4d9d0;border-radius:13px;background:#fffdfb;padding:12px;color:#171b2a;font:500 12px 'Comfortaa',sans-serif}
.customer-form-actions{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0 0}
.customer-form-actions button{border:0;border-radius:999px;background:#171b2a;color:#fff;padding:13px 17px;cursor:pointer;font:700 11px 'Comfortaa',sans-serif}
.customer-form-actions button.customer-form-cancel{background:#fce9e0;color:#171b2a}
.customer-form-actions button:disabled{opacity:.55;cursor:wait}
.customer-address-message{padding:14px 16px;border-radius:13px;background:#e8f8f4;color:#285d55;font:600 11px/1.7 'Comfortaa',sans-serif}
@media(max-width:600px){.customer-form-columns{grid-template-columns:1fr}}

/* Nouveau tableau de bord client : structure inspirée de WooCommerce, identité Com’ entre nous. */
.customer-hero-logged{padding:50px 0 26px;grid-template-columns:minmax(0,1fr) minmax(260px,.46fr);gap:32px}
.customer-hero-logged h1{font-size:clamp(46px,5vw,65px)}
.customer-hero-logged .customer-intro{margin-top:12px;font-size:13px}
.customer-hero-logged .customer-visual{min-height:180px;border-radius:30px}
.customer-hero-logged .customer-paper{display:none}
.customer-hero-logged .customer-heart{font-size:76px;right:45%;top:46px}
.customer-dashboard{width:min(1240px,calc(100% - 2rem));margin:8px auto 0;display:grid;grid-template-columns:265px minmax(0,1fr);gap:20px;align-items:start}
.customer-sidebar,.customer-panel{background:#fff;border-radius:28px;box-shadow:0 16px 42px rgba(48,30,18,.065)}
.customer-sidebar{padding:28px 16px}
.customer-sidebar>.customer-kicker{margin-left:12px}
.customer-sidebar h2{font:700 36px/1.1 'Patrick Hand',cursive;margin:0 12px 24px}
.customer-nav-items{display:grid;gap:7px}
.customer-nav-items button{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:0;border-radius:15px;padding:13px 12px;background:transparent;color:#303443;font:700 12px/1.6 'Comfortaa',sans-serif;cursor:pointer}
.customer-nav-items button>span{font:700 21px/1 'Patrick Hand',cursive;width:27px;text-align:center;color:#b66b72}
.customer-nav-items button small{margin-left:auto;color:#777c87}
.customer-nav-items button:hover,.customer-nav-items button:focus-visible{background:#fff5ef;outline-offset:2px}
.customer-nav-items button.is-active{background:#fce9e0;color:#171b2a}
.customer-nav-items button.is-active>span{color:#e45e65}
.customer-nav-items button.customer-sidebar-logout{margin-top:14px;border-top:1px solid #eee2da;border-radius:0;padding-top:20px}
.customer-sidebar-note{margin:25px 9px 0;padding:18px;border-radius:18px;background:#dff6f0;color:#42645f;font:500 11px/1.8 'Comfortaa',sans-serif}
.customer-panel{padding:clamp(22px,3vw,38px);min-height:450px}
.customer-panel .customer-section-head h2{font-size:clamp(36px,4vw,49px)}
.customer-panel-intro{font:500 12px/1.9 'Comfortaa',sans-serif;color:#646b76;max-width:650px;margin:4px 0 25px}
.customer-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0}
.customer-overview-grid button{display:grid;text-align:left;gap:12px;padding:24px;cursor:pointer;border:1px solid #f0dfd6;background:#fff8f3;border-radius:22px;font-family:'Comfortaa',sans-serif;color:#171b2a}
.customer-overview-grid button:nth-child(2){background:#e8f8f4;border-color:#d5ede7}
.customer-overview-grid button span{font-size:12px;font-weight:800}
.customer-overview-grid button strong{font:700 52px/1 'Patrick Hand',cursive}
.customer-overview-grid button small{font-size:10px;color:#58616c}
.customer-last-order{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:20px;border:1px solid #eedfd6;border-radius:20px;margin:14px 0 26px}
.customer-last-order>div{display:grid;gap:6px}
.customer-last-order .customer-kicker{margin:0 0 5px;font-size:10px}
.customer-last-order strong{font-size:12px}
.customer-last-order small{font-size:11px;color:#646b76;line-height:1.6}
.customer-last-order button{border:0;background:#171b2a;color:#fff;border-radius:999px;padding:12px 16px;cursor:pointer;font:700 10px 'Comfortaa',sans-serif;white-space:nowrap}
.customer-discover,.customer-native-link{display:inline-flex;background:#171b2a;color:#fff!important;text-decoration:none;border-radius:999px;padding:15px 20px;font:700 11px 'Comfortaa',sans-serif}
.customer-address-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:20px 0}
.customer-address-grid article{padding:22px;background:#fffaf6;border:1px solid #eee2da;border-radius:20px}
.customer-address-grid h3{font:700 27px/1.2 'Patrick Hand',cursive;margin:0 0 13px}
.customer-address-grid p{font-size:11px;color:#626875;line-height:1.9;overflow-wrap:anywhere}
.customer-small-note{color:#626875;font:500 11px/1.8 'Comfortaa',sans-serif;margin:22px 0}
.customer-account-info{display:grid;gap:14px;margin:22px 0}
.customer-account-info>div{display:grid;gap:8px;padding:17px 20px;border-radius:16px;background:#fffaf6;border:1px solid #eee2da;overflow-wrap:anywhere}
.customer-account-info small{font-size:10px;color:#737985}
.customer-account-info strong{font-size:12px}
.customer-data-error{padding:14px 16px;background:#fff0ee;border-radius:14px;color:#8f2018;font-size:12px;margin:0 0 20px}
.customer-data-error button{border:0;background:transparent;text-decoration:underline;cursor:pointer;color:inherit;font-weight:800}
@media(max-width:900px){.customer-dashboard{grid-template-columns:1fr}.customer-sidebar{padding:19px}.customer-nav-items{grid-template-columns:repeat(3,minmax(0,1fr))}.customer-nav-items button{font-size:10px;padding:12px 8px}.customer-sidebar-note{display:none}.customer-hero-logged{grid-template-columns:1fr}.customer-hero-logged .customer-visual{display:none}}
@media(max-width:600px){.customer-hero-logged{padding:32px 0 12px}.customer-dashboard{gap:12px}.customer-nav-items{grid-template-columns:repeat(2,minmax(0,1fr));gap:5px}.customer-nav-items button{font-size:10px;gap:5px}.customer-sidebar h2{margin-bottom:14px}.customer-panel{padding:20px;min-height:360px}.customer-overview-grid,.customer-address-grid{grid-template-columns:1fr}.customer-last-order{align-items:flex-start;flex-direction:column}.customer-last-order button{white-space:normal}.customer-panel .order-top{grid-template-columns:1fr auto}}

.customer-space{min-height:100vh;background:linear-gradient(180deg,#fffaf4 0%,#fff5ed 100%);color:#171b2a;font-family:Comfortaa,system-ui,sans-serif;padding-bottom:64px;scroll-behavior:smooth}.customer-hero{width:min(1380px,calc(100% - 2rem));margin:0 auto;padding:72px 0 48px;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.85fr);gap:56px;align-items:center}.customer-kicker{margin:0 0 14px;color:#ff5d62;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.customer-hero h1{max-width:760px;margin:0;font:700 clamp(48px,6vw,78px)/.92 'Patrick Hand',cursive;letter-spacing:-.035em}.customer-intro{max-width:700px;margin:24px 0 0;font-size:17px;line-height:1.75;color:#4d5361}.customer-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.customer-actions a,.customer-actions button,.customer-note a{border-radius:999px;padding:14px 19px;font:900 12px Comfortaa,system-ui,sans-serif;text-decoration:none;border:0;cursor:pointer}.customer-actions a:first-child,.customer-actions button,.customer-note a{background:#171b2a;color:#fff}.customer-actions a:last-child{background:#fff;border:1px solid #eadfd6;color:#171b2a}.customer-visual{position:relative;min-height:410px;border-radius:44px;background:linear-gradient(145deg,#ffe0dc,#fff8f1 58%,#dff6f0);box-shadow:0 25px 70px rgba(48,30,18,.12);overflow:hidden}.customer-visual:before{content:'';position:absolute;width:250px;height:250px;border-radius:50%;right:-70px;top:-80px;background:rgba(255,255,255,.52)}.customer-heart{position:absolute;right:34px;top:26px;font:700 48px/1 'Patrick Hand',cursive}.customer-paper{position:absolute;display:grid;gap:8px;width:58%;padding:20px 22px;border-radius:20px;background:rgba(255,255,255,.92);box-shadow:0 18px 36px rgba(48,30,18,.09);transform:rotate(-2deg)}.customer-paper b{font-size:14px}.customer-paper small{color:#7a7f8b;line-height:1.5}.customer-paper.one{left:30px;top:54px}.customer-paper.two{right:28px;top:170px;transform:rotate(3deg)}.customer-paper.three{left:48px;bottom:38px;transform:rotate(1deg)}.customer-login,.customer-private,.customer-state{width:min(1240px,calc(100% - 2rem));margin:0 auto 18px;padding:28px;border-radius:28px;background:#fff;box-shadow:0 16px 42px rgba(48,30,18,.07)}.customer-login{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;scroll-margin-top:100px}.customer-login h2,.customer-section-head h2{margin:0;font:700 42px/1 'Patrick Hand',cursive}.customer-login-copy>p:last-child{max-width:560px;color:#626875;line-height:1.7}.customer-login form{display:grid;gap:12px}.customer-login label{display:grid;gap:7px;font-size:11px;font-weight:900}.customer-login input{width:100%;border:1px solid #e4d9d0;border-radius:14px;padding:13px 14px;font:600 13px Comfortaa,system-ui,sans-serif;background:#fffdfb;color:#171b2a}.customer-forgot{justify-self:end;color:#a34e50;font:800 11px Comfortaa,system-ui,sans-serif;text-decoration:underline;text-underline-offset:3px}.customer-forgot:focus-visible{outline:2px solid #ff766d;outline-offset:3px}.customer-login button{border:0;border-radius:999px;padding:14px 18px;background:#ff5d62;color:#fff;font:900 12px Comfortaa,system-ui,sans-serif;cursor:pointer}.customer-login button:disabled{opacity:.55}.customer-message{margin:0;padding:11px 13px;border-radius:14px;background:#fff0ee;color:#8f2018;font-size:11px;line-height:1.55}.customer-state{text-align:center;color:#686e7b;font-size:12px}.customer-section-head{display:flex;justify-content:space-between;gap:18px;align-items:end;margin-bottom:18px}.customer-section-head>span{font-size:11px;font-weight:900;color:#747987}.orders-list,.downloads-list{display:grid;gap:12px}.order-card{padding:18px;border-radius:20px;background:#fffaf6;border:1px solid #eee2da}.order-top{display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center}.order-top div:first-child{display:grid;gap:3px}.order-top small,.order-date{color:#7c818c;font-size:10px}.order-top>span{padding:7px 10px;border-radius:999px;background:#dff6f0;color:#27685f;font-size:10px;font-weight:900}.order-total{font-weight:900}.order-date{margin:8px 0 13px}.order-items{display:grid;gap:7px;padding-top:12px;border-top:1px dashed #dfd1c8}.order-items div{display:flex;justify-content:space-between;gap:10px;font-size:11px}.order-items b{font-size:10px}.downloads-list a{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border-radius:18px;background:#fffaf6;border:1px solid #eee2da;text-decoration:none;color:#171b2a}.downloads-list a div{display:grid;gap:4px}.downloads-list small{color:#7a7f8b}.downloads-list span{font-size:11px;font-weight:900}.empty-box{padding:22px;border-radius:18px;background:#fffaf6;color:#777c87;font-size:12px}.customer-grid{width:min(1240px,calc(100% - 2rem));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.customer-grid article{background:#fff;border-radius:24px;padding:24px;box-shadow:0 14px 34px rgba(48,30,18,.06)}.customer-grid span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fff0ee;color:#ff5d62;font-size:10px;font-weight:900}.customer-grid h2{margin:18px 0 10px;font:700 28px/1 'Patrick Hand',cursive}.customer-grid p{margin:0;color:#626875;font-size:12px;line-height:1.7;word-break:break-word}.customer-note{width:min(1240px,calc(100% - 2rem));margin:18px auto 0;padding:20px 24px;border-radius:24px;background:#dff6f0;display:flex;align-items:center;justify-content:space-between;gap:20px}.customer-note strong{font-size:13px}.customer-note p{margin:5px 0 0;color:#47615d;font-size:11px;line-height:1.6}.customer-note a{white-space:nowrap}@media(max-width:980px){.customer-hero{grid-template-columns:1fr}.customer-visual{min-height:360px}.customer-login{grid-template-columns:1fr}.customer-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:650px){.customer-hero{padding:40px 0 28px;gap:28px}.customer-hero h1{font-size:48px}.customer-intro{font-size:14px}.customer-actions{display:grid}.customer-actions a,.customer-actions button{text-align:center}.customer-visual{min-height:330px;border-radius:28px}.customer-paper{width:72%;padding:16px}.customer-paper.one{left:18px;top:44px}.customer-paper.two{right:16px;top:145px}.customer-paper.three{left:28px;bottom:26px}.customer-login,.customer-private{padding:20px}.customer-login h2,.customer-section-head h2{font-size:36px}.customer-section-head{align-items:flex-start;flex-direction:column}.order-top{grid-template-columns:1fr auto}.order-total{grid-column:1/-1}.customer-grid{grid-template-columns:1fr}.customer-note{align-items:stretch;flex-direction:column}.customer-note a{text-align:center;width:100%}}
`;
