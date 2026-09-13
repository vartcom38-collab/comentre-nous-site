(() => {
  if (!location.pathname.startsWith('/admin/produit')) return;

  const OWNER='vartcom38-collab', REPO='comentre-nous-site', BRANCH='main';
  const TOKEN_KEY='comentre_admin_github_token';
  const PRODUCTS_PATH='content/products.json';
  const LINKS_PATH='content/woo-links.json';
  let links={}, wooProducts=[], panel=null, messageEl=null, selectEl=null, busy=false, lastSaved='';

  const token=()=>sessionStorage.getItem(TOKEN_KEY)||localStorage.getItem(TOKEN_KEY)||'';
  const productId=()=>new URLSearchParams(location.search).get('id')||'';
  const decode64=v=>decodeURIComponent(escape(atob(String(v||'').replace(/\n/g,''))));
  const encode64=v=>btoa(unescape(encodeURIComponent(v)));

  async function gh(path,init){
    const t=token(); if(!t) throw new Error('Reconnecte GitHub depuis le tableau de bord admin.');
    const r=await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`,{...(init||{}),headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${t}`,...((init&&init.headers)||{})}});
    if(!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json();
  }
  async function loadJson(path){const f=await gh(`contents/${path}?ref=${BRANCH}&t=${Date.now()}`);return{data:JSON.parse(decode64(f.content)),sha:f.sha}}
  async function updateLinks(mutator){
    let last; for(let i=0;i<4;i++)try{const cur=await loadJson(LINKS_PATH);const next=mutator(cur.data||{});await gh(`contents/${LINKS_PATH}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Admin: update WooCommerce product link',content:encode64(`${JSON.stringify(next,null,2)}\n`),sha:cur.sha,branch:BRANCH})});links=next;return next}catch(e){last=e;if(!String(e.message||'').startsWith('409'))throw e;await new Promise(r=>setTimeout(r,450+i*350))}throw last||new Error('Impossible d’enregistrer la liaison.')
  }
  async function woo(action,payload){const r=await fetch(`/woo-bridge.php?action=${encodeURIComponent(action)}`,{method:payload?'POST':'GET',cache:'no-store',headers:payload?{'Content-Type':'application/json',Authorization:`Bearer ${token()}`}:{},body:payload?JSON.stringify(payload):undefined});const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok){const e=new Error(d.error||`WooCommerce : erreur ${r.status}`);e.status=r.status;e.data=d;throw e}return d}
  function abs(url){if(!url)return'';return /^https?:\/\//i.test(url)?url:`${location.origin}${url.startsWith('/')?'':'/'}${url}`}
  async function latestProduct(){const id=productId();if(!id)throw new Error('Enregistre d’abord la fiche produit.');const f=await loadJson(PRODUCTS_PATH);const p=(f.data||[]).find(x=>x.id===id);if(!p)throw new Error('La fiche produit n’est pas encore disponible.');return p}
  function payload(p){return{local_id:p.id,name:p.title,slug:p.slug,short_description:p.shortDescription||p.tagline||'',description:p.longDescription||'',sku:p.sku||'',featured:Boolean(p.featured),status:p.published?'publish':'draft',regular_price:p.price||'',sale_price:p.compareAtPrice?'':'',stock_status:p.stockStatus==='out'?'outofstock':p.stockStatus==='preorder'?'onbackorder':'instock',stock_quantity:Number.isFinite(Number(p.stockQuantity))?Number(p.stockQuantity):0,delivery_type:p.deliveryType||'physical',image:abs(p.image||'')}}
  function modeLabel(mode){return mode==='woo'?'WooCommerce — vente sur le site':mode==='amazon'?'Amazon':mode==='external'?'Lien externe':mode==='stripe'?'Stripe (ancien mode)':'Pas encore choisi'}
  function linkedWoo(){const id=productId(),wid=Number(links[id]||0);return wooProducts.find(p=>Number(p.id)===wid)||null}
  function setMessage(text,mode=''){if(messageEl){messageEl.textContent=text;messageEl.dataset.mode=mode}}

  function ensureWooOption(){
    document.querySelectorAll('label').forEach(label=>{
      if(!/Canal de vente|Mode de vente/i.test(label.textContent||''))return;
      const s=label.querySelector('select');if(!s)return;
      if(!Array.from(s.options).some(o=>o.value==='woo')){const o=document.createElement('option');o.value='woo';o.textContent='WooCommerce — vente sur le site';s.insertBefore(o,s.options[1]||null)}
      const text=Array.from(label.childNodes).find(n=>n.nodeType===Node.TEXT_NODE);if(text)text.textContent='Mode de vente';
    });
    document.querySelectorAll('.payment-help').forEach(el=>{el.innerHTML='<b>Tu remplis tout ici.</b> Choisis WooCommerce pour vendre sur le site avec le paiement, les commandes et la livraison déjà configurés. Choisis Amazon quand le produit doit partir directement vers Amazon.'});
  }

  function renderState(product){
    if(!panel)return; const id=productId(), wid=Number(links[id]||0), linked=linkedWoo();
    const state=panel.querySelector('[data-woo-state]'),actions=panel.querySelector('[data-woo-actions]');if(!state||!actions)return;
    const mode=product?.purchaseChannel||'none';
    if(mode!=='woo'){
      state.innerHTML=`<b>Mode de vente : ${modeLabel(mode)}</b><span>${mode==='amazon'?'Aucun produit WooCommerce ne sera créé. Le bouton client utilisera ton lien Amazon.':'WooCommerce reste inactif pour cette fiche tant que le mode de vente n’est pas WooCommerce.'}</span>`;
      actions.innerHTML=wid?'<button type="button" class="light" data-woo-unlink>Délier l’ancienne liaison Woo</button>':'';
      actions.querySelector('[data-woo-unlink]')?.addEventListener('click',unlinkCurrent);return;
    }
    if(!id){state.innerHTML='<b>WooCommerce : en attente</b><span>Enregistre la fiche : le produit WooCommerce sera créé automatiquement.</span>';actions.innerHTML='';return}
    if(wid){const managed=linked&&linked.managed&&linked.managed_local_id===id;state.innerHTML=`<b>WooCommerce : ${managed?'créé et géré depuis cette fiche':'relié'}</b><span>${linked?`${linked.name} · #${linked.id} · ${linked.price||'—'} €`:`Produit #${wid}`}${managed?' · les prochaines modifications commerciales seront synchronisées.':' · cette ancienne liaison reste protégée.'}</span>`;actions.innerHTML=`<button type="button" data-woo-sync>${managed?'Synchroniser maintenant':'Vérifier la liaison'}</button><button type="button" class="light" data-woo-unlink>Délier</button>`;actions.querySelector('[data-woo-sync]')?.addEventListener('click',()=>syncCurrent(false));actions.querySelector('[data-woo-unlink]')?.addEventListener('click',unlinkCurrent)}
    else{state.innerHTML='<b>WooCommerce : prêt à être créé</b><span>Au prochain enregistrement, un produit WooCommerce sera créé automatiquement avec le prix, le stock, le SKU et le type de produit saisis ici.</span>';actions.innerHTML='<button type="button" data-woo-create>Créer maintenant dans WooCommerce</button>';actions.querySelector('[data-woo-create]')?.addEventListener('click',()=>createCurrent(false))}
  }

  async function refresh(){try{const [lf,wd,p]=await Promise.all([loadJson(LINKS_PATH),woo('products'),latestProduct().catch(()=>null)]);links=lf.data||{};wooProducts=wd.products||[];if(selectEl){selectEl.innerHTML='<option value="">Choisir un produit WooCommerce…</option>'+wooProducts.map(x=>`<option value="${x.id}">${String(x.name||'').replace(/</g,'&lt;')} · ${x.price||'—'} € · #${x.id}</option>`).join('')}renderState(p)}catch(e){setMessage(`WooCommerce : ${e.message}`,'error')}}
  async function createCurrent(auto){if(busy)return;busy=true;try{const p=await latestProduct();if(p.purchaseChannel!=='woo'){setMessage('Cette fiche n’est pas en mode WooCommerce : aucun produit Woo n’a été créé.','safe');return}if(!p.title||p.title==='Nouveau produit')throw new Error('Donne d’abord un vrai nom au produit.');setMessage(auto?'Création automatique dans WooCommerce…':'Création dans WooCommerce…','working');const d=await woo('create-product',payload(p));const wid=Number(d.product&&d.product.id);if(!wid)throw new Error('WooCommerce n’a pas renvoyé d’identifiant produit.');await updateLinks(cur=>({...cur,[p.id]:wid}));setMessage(`Produit WooCommerce créé et relié ✓ #${wid}`,'success');await refresh()}catch(e){setMessage(`WooCommerce : ${e.message}`,'error')}finally{busy=false}}
  async function syncCurrent(auto){if(busy)return;const id=productId(),wid=Number(links[id]||0);if(!id||!wid)return;busy=true;try{const p=await latestProduct();if(p.purchaseChannel!=='woo'){setMessage('Mode Amazon / externe : WooCommerce n’a pas été modifié.','safe');return}setMessage(auto?'Synchronisation WooCommerce…':'Synchronisation en cours…','working');await woo('update-managed-product',{id:wid,...payload(p)});setMessage('Prix, stock et informations commerciales synchronisés avec WooCommerce ✓','success');await refresh()}catch(e){if(e.status===409)setMessage('Ancienne liaison protégée : aucun prix WooCommerce n’a été écrasé.','safe');else setMessage(`WooCommerce : ${e.message}`,'error')}finally{busy=false}}
  async function unlinkCurrent(){const id=productId();if(!id||!links[id])return;if(!confirm('Délier cette fiche ? Le produit WooCommerce restera intact.'))return;try{await updateLinks(cur=>{const n={...cur};delete n[id];return n});setMessage('Liaison supprimée ✓ Le produit WooCommerce est intact.','success');await refresh()}catch(e){setMessage(`Erreur : ${e.message}`,'error')}}

  function ensurePanel(){ensureWooOption();if(document.querySelector('.admin-woo-product-panel-v2'))return;const anchor=document.querySelector('.completion')||document.querySelector('.status');if(!anchor||!anchor.parentElement)return;panel=document.createElement('section');panel.className='admin-woo-product-panel-v2';panel.innerHTML='<div class="awh"><div><small>VENTE & PAIEMENT</small><h2>Connexion boutique</h2></div><span>Tout se pilote depuis cette fiche</span></div><div class="aws" data-woo-state><b>Connexion…</b><span>Chargement.</span></div><div data-woo-actions class="awa"></div><p data-woo-message class="awm"></p>';anchor.parentElement.insertBefore(panel,anchor.nextSibling);messageEl=panel.querySelector('[data-woo-message]');refresh()}
  function onSaved(){const s=document.querySelector('.status'),text=(s?.textContent||'').trim();if(!text||text===lastSaved||!/fiche enregistrée|mis en ligne|retiré du site/i.test(text))return;lastSaved=text;setTimeout(async()=>{const p=await latestProduct().catch(()=>null);if(!p)return;await refresh();if(p.purchaseChannel!=='woo')return;if(links[p.id])await syncCurrent(true);else await createCurrent(true)},900)}

  const style=document.createElement('style');style.textContent='.admin-woo-product-panel-v2{max-width:1500px;margin:0 auto 16px;background:#fff;border:1px solid #dceee9;border-radius:20px;padding:16px 18px;box-shadow:0 10px 28px rgba(48,30,18,.05);font-family:Comfortaa,system-ui,sans-serif}.awh{display:flex;justify-content:space-between;gap:14px;align-items:center}.awh small{font-size:9px;letter-spacing:.12em;color:#0b8f84;font-weight:900}.awh h2{margin:2px 0 0;font:700 28px/1 "Patrick Hand",cursive}.awh>span{font-size:10px;font-weight:900;background:#e9faf6;color:#087f78;padding:7px 10px;border-radius:999px}.aws{display:grid;gap:4px;margin-top:12px;padding:12px 14px;border-radius:14px;background:#f8fbfa}.aws b{font-size:12px}.aws span{font-size:10px;color:#697181;line-height:1.5}.awa{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.awa button{border:0;border-radius:999px;background:#0fa399;color:#fff;padding:9px 12px;font:900 10px Comfortaa,system-ui,sans-serif;cursor:pointer}.awa button.light{background:#f1ece7;color:#171b2a}.awm{margin:8px 0 0;font-size:10px;font-weight:800;color:#677080}.awm[data-mode="error"]{color:#b42318}.awm[data-mode="success"],.awm[data-mode="safe"]{color:#087f78}.awm[data-mode="working"]{color:#946200}@media(max-width:650px){.awh{align-items:flex-start;flex-direction:column}}';document.head.appendChild(style);
  const obs=new MutationObserver(()=>{ensurePanel();ensureWooOption();onSaved()});obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});document.addEventListener('DOMContentLoaded',ensurePanel);setTimeout(ensurePanel,400);
})();