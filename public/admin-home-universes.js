(function(){
  if(typeof window==='undefined')return;
  if(!location.pathname.startsWith('/admin'))return;
  const OWNER='vartcom38-collab',REPO='comentre-nous-site',BRANCH='main',PATH='content/site-sections.json';
  const api=(path,token,init)=>fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`,{...init,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${token}`,...(init&&init.headers||{})}});
  const decode=value=>decodeURIComponent(escape(atob(String(value||'').replace(/\n/g,''))));
  const encode=value=>btoa(unescape(encodeURIComponent(value)));
  let data=null,loading=false;
  async function load(){
    if(data||loading)return;const token=sessionStorage.getItem('comentre_admin_github_token')||'';if(!token)return;
    loading=true;try{const r=await api(`contents/${PATH}?ref=${BRANCH}`,token);if(!r.ok)throw new Error(await r.text());const f=await r.json();data=JSON.parse(decode(f.content));render();}catch(e){console.error('Universe admin load failed',e)}finally{loading=false}
  }
  function input(label,value,oninput,type='input'){
    const wrap=document.createElement('label');wrap.textContent=label;wrap.style.cssText='display:grid;gap:6px;font-size:12px;font-weight:900;margin-bottom:12px';
    const el=document.createElement(type==='textarea'?'textarea':'input');if(type==='textarea')el.rows=3;el.value=value||'';el.style.cssText='width:100%;border:1px solid #e5ddd6;border-radius:12px;padding:11px 12px;background:#fffdf9;font:600 14px Comfortaa,system-ui,sans-serif';el.addEventListener('input',()=>oninput(el.value));wrap.appendChild(el);return wrap;
  }
  function render(){
    if(!data)return;const homeCard=document.querySelector('.home-card');if(!homeCard||document.getElementById('home-universe-editor'))return;
    const root=document.createElement('section');root.id='home-universe-editor';root.style.cssText='margin-top:26px;padding-top:22px;border-top:1px solid #eee5dd';
    root.innerHTML='<h3>Encarts univers de la page d’accueil</h3><p style="margin:-8px 0 18px;color:#6b7280;font-size:12px;line-height:1.6">Ces champs correspondent directement aux trois grands encarts “Quel est ton univers ?” visibles sur l’accueil.</p>';
    root.append(input('Petite phrase au-dessus',data.universeSection.eyebrow,v=>data.universeSection.eyebrow=v));
    root.append(input('Titre de la section',data.universeSection.title,v=>data.universeSection.title=v));
    data.universes.forEach((u,i)=>{
      const box=document.createElement('div');box.style.cssText='margin:18px 0;padding:16px;border-radius:18px;background:'+(i===0?'#fff0ed':i===1?'#e9faf6':'#f4edff');
      const h=document.createElement('h4');h.textContent=u.title;h.style.cssText="margin:0 0 12px;font:700 25px/1 'Patrick Hand',cursive";box.append(h);
      box.append(input('Titre',u.title,v=>{u.title=v;h.textContent=v}));
      box.append(input('Petite phrase / catégorie',u.tag,v=>u.tag=v));
      box.append(input('Texte',u.text,v=>u.text=v,'textarea'));
      box.append(input('Texte du bouton',u.buttonLabel,v=>u.buttonLabel=v));
      box.append(input('Icône',u.icon,v=>u.icon=v));
      box.append(input('Lien',u.href,v=>u.href=v));
      root.append(box);
    });
    homeCard.append(root);
  }
  async function saveUniverses(){
    if(!data)return true;const token=sessionStorage.getItem('comentre_admin_github_token')||'';if(!token)return false;
    try{
      let current=await api(`contents/${PATH}?ref=${BRANCH}`,token);if(!current.ok)throw new Error(await current.text());current=await current.json();
      let res=await api(`contents/${PATH}`,token,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Admin: update homepage universe cards',content:encode(JSON.stringify(data,null,2)+'\n'),sha:current.sha,branch:BRANCH})});
      if(res.status===409){current=await api(`contents/${PATH}?ref=${BRANCH}`,token);current=await current.json();res=await api(`contents/${PATH}`,token,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Admin: update homepage universe cards',content:encode(JSON.stringify(data,null,2)+'\n'),sha:current.sha,branch:BRANCH})});}
      if(!res.ok)throw new Error(await res.text());return true;
    }catch(e){console.error('Universe admin save failed',e);alert('Les encarts univers n’ont pas pu être enregistrés. Recharge la page puis réessaie.');return false}
  }
  document.addEventListener('click',e=>{
    const el=e.target.closest('button,a');if(!el)return;
    if(el.textContent&&el.textContent.trim()==='Page d’accueil')setTimeout(load,50);
    if(el.textContent&&el.textContent.includes('Enregistrer l’accueil')){setTimeout(()=>saveUniverses(),0)}
  },true);
  const obs=new MutationObserver(()=>{if(document.querySelector('.home-card')){load();render();}});obs.observe(document.documentElement,{subtree:true,childList:true});
})();
