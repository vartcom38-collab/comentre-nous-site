'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import initialProducts from '../../content/products.json';
import initialHome from '../../content/home.json';

type Product = {
  id: string;
  title: string;
  tagline: string;
  price: string;
  slug: string;
  image: string;
  category: string;
  published: boolean;
  featured: boolean;
  new: boolean;
  createdAt: string;
};

type HomeContent = typeof initialHome;

const OWNER = 'vartcom38-collab';
const REPO = 'comentre-nous-site';
const BRANCH = 'main';
const PRODUCTS_PATH = 'content/products.json';
const HOME_PATH = 'content/home.json';

function encodeBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64(value: string) {
  return decodeURIComponent(escape(atob(value.replace(/\n/g, ''))));
}

async function github(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}${body ? ` — ${body}` : ''}`);
  }
  return response.json();
}

async function saveJson(path: string, value: unknown, token: string, message: string) {
  const current = await github(`contents/${path}?ref=${BRANCH}`, token);
  return github(`contents/${path}`, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: encodeBase64(`${JSON.stringify(value, null, 2)}\n`),
      sha: current.sha,
      branch: BRANCH,
    }),
  });
}

function blankProduct(): Product {
  const now = new Date();
  const id = `produit-${now.getTime()}`;
  return {
    id,
    title: 'Nouveau produit',
    tagline: '',
    price: '',
    slug: id,
    image: '',
    category: 'famille',
    published: false,
    featured: false,
    new: true,
    createdAt: now.toISOString().slice(0, 10),
  };
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts as Product[]);
  const [home, setHome] = useState<HomeContent>(initialHome);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'products' | 'home'>('products');

  useEffect(() => {
    setToken(window.sessionStorage.getItem('comentre_admin_github_token') || '');
  }, []);

  const publishedCount = useMemo(() => products.filter((p) => p.published).length, [products]);

  async function connect() {
    if (!token.trim()) return;
    setBusy(true);
    setStatus('Connexion à GitHub…');
    try {
      const [productsFile, homeFile] = await Promise.all([
        github(`contents/${PRODUCTS_PATH}?ref=${BRANCH}`, token.trim()),
        github(`contents/${HOME_PATH}?ref=${BRANCH}`, token.trim()),
      ]);
      setProducts(JSON.parse(decodeBase64(productsFile.content)));
      setHome(JSON.parse(decodeBase64(homeFile.content)));
      window.sessionStorage.setItem('comentre_admin_github_token', token.trim());
      setStatus('Connecté. Les données du site sont à jour.');
    } catch (error) {
      setStatus(`Connexion impossible : ${(error as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    setProducts((current) => current.map((product, i) => i === index ? { ...product, ...patch } : product));
  }

  async function saveProducts() {
    if (!token) return setStatus('Connecte d’abord ton compte GitHub.');
    setBusy(true);
    setStatus('Enregistrement des produits…');
    try {
      await saveJson(PRODUCTS_PATH, products, token, 'Admin: update products');
      setStatus('Produits enregistrés. Infomaniak va redéployer le site automatiquement.');
    } catch (error) {
      setStatus(`Erreur : ${(error as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function saveHome() {
    if (!token) return setStatus('Connecte d’abord ton compte GitHub.');
    setBusy(true);
    setStatus('Enregistrement de la page d’accueil…');
    try {
      await saveJson(HOME_PATH, home, token, 'Admin: update homepage content');
      setStatus('Accueil enregistré. Infomaniak va redéployer le site automatiquement.');
    } catch (error) {
      setStatus(`Erreur : ${(error as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  async function uploadImage(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !token) {
      if (!token) setStatus('Connecte GitHub avant d’envoyer une image.');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setStatus('Image trop lourde : 4 Mo maximum pour cet espace admin.');
      return;
    }
    setBusy(true);
    setStatus('Envoi de l’image…');
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i += 1) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
      const path = `public/uploads/${Date.now()}-${safeName}`;
      await github(`contents/${path}`, token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Admin: upload ${safeName}`,
          content: base64,
          branch: BRANCH,
        }),
      });
      updateProduct(index, { image: `/${path.replace('public/', '')}` });
      setStatus('Image envoyée. Pense à enregistrer les produits.');
    } catch (error) {
      setStatus(`Erreur image : ${(error as Error).message}`);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <main className="admin-shell">
      <style>{css}</style>
      <aside className="admin-side">
        <Link href="/" className="admin-logo">Com’ entre nous</Link>
        <p className="admin-private">Espace privé</p>
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Produits</button>
        <button className={tab === 'home' ? 'active' : ''} onClick={() => setTab('home')}>Page d’accueil</button>
        <div className="stats"><strong>{products.length}</strong><span>produits</span><strong>{publishedCount}</strong><span>publiés</span></div>
        <Link href="/" className="back">← Voir le site</Link>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <div><p>Administration</p><h1>Le petit atelier du site</h1></div>
          <div className="connect-box">
            <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Jeton GitHub" aria-label="Jeton GitHub" />
            <button onClick={connect} disabled={busy}>Connecter</button>
          </div>
        </header>

        <div className="notice">Le jeton GitHub reste seulement dans cet onglet. Il n’est jamais écrit dans le site ni dans le dépôt. Pour modifier le site, utilise un jeton GitHub finement limité à ce dépôt avec le droit <b>Contents: Read and write</b>.</div>
        {status && <div className="status">{status}</div>}

        {tab === 'products' ? (
          <>
            <div className="toolbar">
              <div><p>Catalogue</p><h2>Produits</h2></div>
              <div className="toolbar-actions">
                <button className="secondary" onClick={() => setProducts((current) => [blankProduct(), ...current])}>+ Nouveau produit</button>
                <button className="save" onClick={saveProducts} disabled={busy}>Enregistrer</button>
              </div>
            </div>

            <div className="product-list">
              {products.map((product, index) => (
                <article className="editor-card" key={product.id}>
                  <div className="editor-image">
                    {product.image ? <img src={product.image} alt="" /> : <span>Aucune image</span>}
                    <label>Changer l’image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => uploadImage(index, e)} /></label>
                  </div>
                  <div className="fields">
                    <div className="field wide"><label>Nom</label><input value={product.title} onChange={(e) => updateProduct(index, { title: e.target.value })} /></div>
                    <div className="field"><label>Petit texte</label><input value={product.tagline} onChange={(e) => updateProduct(index, { tagline: e.target.value })} /></div>
                    <div className="field"><label>Prix</label><input value={product.price} onChange={(e) => updateProduct(index, { price: e.target.value })} /></div>
                    <div className="field"><label>Slug</label><input value={product.slug} onChange={(e) => updateProduct(index, { slug: e.target.value })} /></div>
                    <div className="field"><label>Catégorie</label><select value={product.category} onChange={(e) => updateProduct(index, { category: e.target.value })}><option value="famille">Com’ en famille</option><option value="entrepreneuses">Com’ des entrepreneuses</option><option value="papeterie">Papeterie</option></select></div>
                    <div className="checks wide">
                      <label><input type="checkbox" checked={product.published} onChange={(e) => updateProduct(index, { published: e.target.checked })} /> Publié</label>
                      <label><input type="checkbox" checked={product.new} onChange={(e) => updateProduct(index, { new: e.target.checked })} /> Nouveauté</label>
                      <label><input type="checkbox" checked={product.featured} onChange={(e) => updateProduct(index, { featured: e.target.checked })} /> Coup de cœur</label>
                    </div>
                  </div>
                  <button className="delete" onClick={() => setProducts((current) => current.filter((_, i) => i !== index))}>Supprimer</button>
                </article>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="toolbar"><div><p>Accueil</p><h2>Textes principaux</h2></div><button className="save" onClick={saveHome} disabled={busy}>Enregistrer</button></div>
            <div className="home-editor">
              <h3>Hero</h3>
              <label>Petite accroche<input value={home.hero.eyebrow} onChange={(e) => setHome({ ...home, hero: { ...home.hero, eyebrow: e.target.value } })} /></label>
              <label>Titre<textarea rows={3} value={home.hero.title} onChange={(e) => setHome({ ...home, hero: { ...home.hero, title: e.target.value } })} /></label>
              <label>Texte<textarea rows={4} value={home.hero.intro} onChange={(e) => setHome({ ...home, hero: { ...home.hero, intro: e.target.value } })} /></label>

              <h3>Bloc produits de l’accueil</h3>
              <label>Sur-titre<input value={home.homeProducts.eyebrow} onChange={(e) => setHome({ ...home, homeProducts: { ...home.homeProducts, eyebrow: e.target.value } })} /></label>
              <label>Titre<input value={home.homeProducts.title} onChange={(e) => setHome({ ...home, homeProducts: { ...home.homeProducts, title: e.target.value } })} /></label>
              <label>Mode<select value={home.homeProducts.mode} onChange={(e) => setHome({ ...home, homeProducts: { ...home.homeProducts, mode: e.target.value } })}><option value="newest">Dernières nouveautés automatiquement</option><option value="featured">Coups de cœur sélectionnés</option></select></label>
              <label>Nombre de produits<input type="number" min="1" max="8" value={home.homeProducts.limit} onChange={(e) => setHome({ ...home, homeProducts: { ...home.homeProducts, limit: Number(e.target.value) } })} /></label>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

const css = `
*{box-sizing:border-box}.admin-shell{min-height:100vh;display:grid;grid-template-columns:260px 1fr;background:#fff9f2;color:#101827;font-family:Comfortaa,system-ui,sans-serif}.admin-side{position:sticky;top:0;height:100vh;padding:28px 20px;background:#171b2a;color:white;display:flex;flex-direction:column;gap:8px}.admin-logo{font-family:'Patrick Hand',cursive;font-size:30px;font-weight:800;margin-bottom:2px}.admin-private{margin:0 0 28px;color:#ffb2ae;font-size:12px;text-transform:uppercase;letter-spacing:.14em}.admin-side button{border:0;background:transparent;color:#d8dae2;text-align:left;padding:13px 14px;border-radius:14px;font:700 14px/1.2 inherit;cursor:pointer}.admin-side button.active{background:#ff5d62;color:white}.stats{margin-top:22px;padding:16px;border:1px solid rgba(255,255,255,.12);border-radius:18px;display:grid;grid-template-columns:auto 1fr;gap:5px 10px;color:#cfd2dd}.stats strong{font-size:18px;color:white}.back{margin-top:auto;color:#fff;font-weight:700;font-size:13px}.admin-main{padding:34px clamp(20px,4vw,60px) 70px;min-width:0}.admin-top{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:20px}.admin-top p,.toolbar p{margin:0;color:#ff5d62;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:800}.admin-top h1{margin:4px 0 0;font:700 clamp(34px,4vw,54px)/.95 'Patrick Hand',cursive}.connect-box{display:flex;gap:8px}.connect-box input{min-width:260px}.connect-box button,.save,.secondary{border:0;border-radius:999px;padding:12px 18px;font-weight:800;cursor:pointer}.connect-box button,.save{background:#171b2a;color:white}.secondary{background:#ffe0dd;color:#171b2a}.notice,.status{padding:14px 16px;border-radius:16px;margin:10px 0 16px;font-size:13px;line-height:1.5}.notice{background:#fff;border:1px solid #f1ded5}.status{background:#dff7f2}.toolbar{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:26px 0 16px}.toolbar h2{margin:2px 0 0;font:700 38px/1 'Patrick Hand',cursive}.toolbar-actions{display:flex;gap:8px}.product-list{display:grid;gap:14px}.editor-card{position:relative;display:grid;grid-template-columns:170px 1fr auto;gap:18px;padding:16px;background:white;border:1px solid #f1e4da;border-radius:24px;box-shadow:0 14px 38px rgba(42,28,18,.06)}.editor-image{min-height:150px;border-radius:18px;overflow:hidden;background:#f7eee7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;color:#736d68;font-size:12px}.editor-image img{width:100%;height:120px;object-fit:cover}.editor-image label{cursor:pointer;font-weight:800;color:#101827}.editor-image input{display:none}.fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px}.field,.home-editor label{display:grid;gap:6px;font-size:12px;font-weight:800}.field.wide,.checks.wide{grid-column:1/-1}.field input,.field select,.home-editor input,.home-editor textarea,.home-editor select,.connect-box input{width:100%;border:1px solid #ded7d0;background:#fffdf9;border-radius:12px;padding:11px 12px;font:600 13px/1.3 inherit;color:#101827}.checks{display:flex;flex-wrap:wrap;gap:16px;align-items:center}.checks label{font-size:12px;font-weight:800}.delete{align-self:start;border:0;background:#fff0ef;color:#c23a3a;border-radius:999px;padding:9px 12px;font-weight:800;cursor:pointer}.home-editor{max-width:820px;padding:22px;background:white;border:1px solid #f1e4da;border-radius:24px;display:grid;gap:14px}.home-editor h3{font:700 28px/1 'Patrick Hand',cursive;margin:10px 0 0}.home-editor h3:first-child{margin-top:0}@media(max-width:900px){.admin-shell{grid-template-columns:1fr}.admin-side{position:static;height:auto;display:grid;grid-template-columns:1fr 1fr}.admin-logo,.admin-private,.stats,.back{grid-column:1/-1}.admin-main{padding:22px 14px 60px}.admin-top{align-items:flex-start;flex-direction:column}.connect-box{width:100%}.connect-box input{min-width:0;flex:1}.editor-card{grid-template-columns:1fr}.editor-image{min-height:180px}.editor-image img{height:160px}.fields{grid-template-columns:1fr}.delete{justify-self:start}.toolbar{align-items:flex-start;flex-direction:column}.toolbar-actions{width:100%;flex-wrap:wrap}}@media(max-width:560px){.admin-side{grid-template-columns:1fr}.connect-box{flex-direction:column}.connect-box button{width:100%}.toolbar-actions button{flex:1}.checks{display:grid;gap:9px}}
`;
