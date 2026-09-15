import Link from 'next/link';
import products from '../../../content/products.json';

function label(category:string){
  if(category==='famille') return "Com’ en famille";
  if(category==='entrepreneuses') return "Com’ des entrepreneuses";
  if(category==='papeterie') return 'La papeterie';
  return category || 'Autre';
}

export default function AdminProductsPage(){
  const groups=['famille','entrepreneuses','papeterie'];
  return <main className="products-admin"><style>{css}</style>
    <header><div><Link href="/admin/">← Tableau de bord</Link><p>Administration</p><h1>Produits</h1><span>Accès direct aux fiches produits, sans dépendre du tableau de bord.</span></div><Link className="create" href="/admin/produit/?new=famille">+ Créer un produit</Link></header>
    {groups.map(category=>{
      const list=(products as any[]).filter(p=>p.category===category);
      return <section key={category}><div className="section-head"><div><small>{label(category)}</small><h2>{list.length} produit{list.length>1?'s':''}</h2></div><Link href={`/admin/produit/?new=${category}`}>+ Nouveau</Link></div>
        <div className="list">{list.map((p:any)=><article key={p.id}><div className="thumb">{p.image?<img src={p.image} alt=""/>:<span>{p.type||'Produit'}</span>}</div><div className="info"><div><b>{p.published?'Publié':'Brouillon'}</b>{p.workflowStatus&&<em>{p.workflowStatus}</em>}</div><h3>{p.title}</h3><p>{p.tagline||p.shortDescription||'Aucune description courte.'}</p><small>{p.type||'Produit'} · {p.price||'Prix à définir'}</small></div><div className="actions"><Link className="primary" href={`/admin/produit/?id=${p.id}`}>Modifier la fiche</Link>{p.slug&&<Link target="_blank" href={`/produits/${p.slug}/`}>Voir le produit</Link>}</div></article>)}{!list.length&&<div className="empty">Aucun produit dans cet univers.</div>}</div>
      </section>
    })}
  </main>
}

const css=`*{box-sizing:border-box}.products-admin{min-height:100vh;background:#fff8f1;color:#171b2a;padding:28px clamp(16px,4vw,56px) 70px;font-family:Comfortaa,system-ui,sans-serif}.products-admin header{max-width:1300px;margin:auto;display:flex;justify-content:space-between;gap:20px;align-items:end}.products-admin header>a:first-child{font-size:12px;font-weight:900}.products-admin header p{margin:14px 0 3px;color:#ff7168;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900}.products-admin h1,.products-admin h2,.products-admin h3{font-family:'Patrick Hand',cursive}.products-admin h1{font-size:56px;line-height:.95;margin:0}.products-admin header span{font-size:12px;color:#6d7280}.create,.section-head>a,.actions a{display:inline-flex;text-decoration:none;border-radius:999px;padding:11px 16px;font-size:12px;font-weight:900}.create,.section-head>a,.actions .primary{background:#171b2a;color:#fff}.products-admin section{max-width:1300px;margin:30px auto 0}.section-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:12px}.section-head small{color:#ff7168;text-transform:uppercase;letter-spacing:.08em;font-weight:900}.section-head h2{font-size:34px;margin:2px 0 0}.list{display:grid;gap:10px}.list article{display:grid;grid-template-columns:90px 1fr auto;gap:16px;align-items:center;background:#fff;border-radius:20px;padding:12px 14px;box-shadow:0 10px 30px rgba(48,30,18,.05)}.thumb{width:90px;height:78px;border-radius:14px;background:#f4ece6;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:11px;font-weight:900;text-align:center;padding:8px}.thumb img{width:100%;height:100%;object-fit:cover}.info>div{display:flex;gap:6px;align-items:center}.info b,.info em{font-style:normal;font-size:9px;border-radius:999px;padding:4px 7px;background:#dff7f2}.info em{background:#f2ece7}.info h3{font-size:26px;margin:4px 0 2px}.info p,.info small{font-size:11px;color:#6d7280;margin:0}.actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.actions a:not(.primary){background:#f4ece6;color:#171b2a}.empty{background:#fff;border-radius:18px;padding:22px;color:#7a7f87;font-size:12px}@media(max-width:760px){.products-admin{padding:16px}.products-admin header{align-items:flex-start;flex-direction:column}.products-admin h1{font-size:44px}.list article{grid-template-columns:70px 1fr}.thumb{width:70px;height:70px}.actions{grid-column:1/-1;justify-content:flex-start}}`;
