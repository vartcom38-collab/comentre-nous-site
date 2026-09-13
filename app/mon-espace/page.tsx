'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LayoutShell } from '@/components/Site';

const accountUrl = 'https://comunoracle.marionbolomey.fr/mon-compte/';

export default function CustomerSpacePage() {
  const [opening, setOpening] = useState(false);

  function openAccount() {
    setOpening(true);
    window.location.href = accountUrl;
  }

  return (
    <LayoutShell>
      <main className="customer-space">
        <style>{styles}</style>

        <section className="customer-hero">
          <div>
            <p className="customer-kicker">Ton espace Com’ entre nous</p>
            <h1>Retrouve tout ce que tu as acheté, au même endroit.</h1>
            <p className="customer-intro">Commandes, téléchargements, adresses et informations de compte sont regroupés dans ton espace cliente sécurisé.</p>
            <div className="customer-actions">
              <button type="button" onClick={openAccount} disabled={opening}>{opening ? 'Ouverture…' : 'Me connecter à mon espace →'}</button>
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

        <section className="customer-grid" aria-label="Fonctions de l’espace cliente">
          <article><span>01</span><h2>Mes commandes</h2><p>Retrouve les commandes passées sur notre boutique et leur état d’avancement.</p></article>
          <article><span>02</span><h2>Mes téléchargements</h2><p>Quand un achat comprend un fichier numérique, tu peux le retrouver depuis ton compte.</p></article>
          <article><span>03</span><h2>Mes coordonnées</h2><p>Modifie tes adresses de facturation et de livraison sans devoir tout ressaisir.</p></article>
          <article><span>04</span><h2>Mon compte</h2><p>Gère ton nom, ton e-mail et ton mot de passe dans l’espace sécurisé de la boutique.</p></article>
        </section>

        <section className="customer-note">
          <div><strong>Petit point utile</strong><p>Les achats réalisés directement chez Com’ entre nous apparaissent ici. Les achats effectués sur Amazon restent dans ton compte Amazon.</p></div>
          <button type="button" onClick={openAccount}>Accéder à mes achats →</button>
        </section>
      </main>
    </LayoutShell>
  );
}

const styles = String.raw`
.customer-space{min-height:100vh;background:linear-gradient(180deg,#fffaf4 0%,#fff5ed 100%);color:#171b2a;font-family:Comfortaa,system-ui,sans-serif;padding-bottom:64px}
.customer-hero{width:min(1380px,calc(100% - 2rem));margin:0 auto;padding:72px 0 48px;display:grid;grid-template-columns:minmax(0,1fr) minmax(420px,.85fr);gap:56px;align-items:center}
.customer-kicker{margin:0 0 14px;color:#ff5d62;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}
.customer-hero h1{max-width:760px;margin:0;font:700 clamp(48px,6vw,78px)/.92 'Patrick Hand',cursive;letter-spacing:-.035em}
.customer-intro{max-width:700px;margin:24px 0 0;font-size:17px;line-height:1.75;color:#4d5361}
.customer-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.customer-actions button,.customer-actions a,.customer-note button{border:0;border-radius:999px;padding:14px 19px;font:900 12px Comfortaa,system-ui,sans-serif;cursor:pointer}.customer-actions button,.customer-note button{background:#171b2a;color:#fff}.customer-actions button:disabled{opacity:.6}.customer-actions a{background:#fff;border:1px solid #eadfd6;text-decoration:none;color:#171b2a}
.customer-visual{position:relative;min-height:410px;border-radius:44px;background:linear-gradient(145deg,#ffe0dc,#fff8f1 58%,#dff6f0);box-shadow:0 25px 70px rgba(48,30,18,.12);overflow:hidden}.customer-visual:before{content:'';position:absolute;width:250px;height:250px;border-radius:50%;right:-70px;top:-80px;background:rgba(255,255,255,.52)}.customer-heart{position:absolute;right:34px;top:26px;font:700 48px/1 'Patrick Hand',cursive}.customer-paper{position:absolute;display:grid;gap:8px;width:58%;padding:20px 22px;border-radius:20px;background:rgba(255,255,255,.92);box-shadow:0 18px 36px rgba(48,30,18,.09);transform:rotate(-2deg)}.customer-paper b{font-size:14px}.customer-paper small{color:#7a7f8b;line-height:1.5}.customer-paper.one{left:30px;top:54px}.customer-paper.two{right:28px;top:170px;transform:rotate(3deg)}.customer-paper.three{left:48px;bottom:38px;transform:rotate(1deg)}
.customer-grid{width:min(1240px,calc(100% - 2rem));margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.customer-grid article{background:#fff;border-radius:24px;padding:24px;box-shadow:0 14px 34px rgba(48,30,18,.06)}.customer-grid span{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#fff0ee;color:#ff5d62;font-size:10px;font-weight:900}.customer-grid h2{margin:18px 0 10px;font:700 28px/1 'Patrick Hand',cursive}.customer-grid p{margin:0;color:#626875;font-size:12px;line-height:1.7}
.customer-note{width:min(1240px,calc(100% - 2rem));margin:18px auto 0;padding:20px 24px;border-radius:24px;background:#dff6f0;display:flex;align-items:center;justify-content:space-between;gap:20px}.customer-note strong{font-size:13px}.customer-note p{margin:5px 0 0;color:#47615d;font-size:11px;line-height:1.6}.customer-note button{white-space:nowrap}
@media(max-width:980px){.customer-hero{grid-template-columns:1fr}.customer-visual{min-height:360px}.customer-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:650px){.customer-hero{padding:40px 0 28px;gap:28px}.customer-hero h1{font-size:48px}.customer-intro{font-size:14px}.customer-actions{display:grid}.customer-actions a,.customer-actions button{text-align:center}.customer-visual{min-height:330px;border-radius:28px}.customer-paper{width:72%;padding:16px}.customer-paper.one{left:18px;top:44px}.customer-paper.two{right:16px;top:145px}.customer-paper.three{left:28px;bottom:26px}.customer-grid{grid-template-columns:1fr}.customer-note{align-items:stretch;flex-direction:column}.customer-note button{width:100%}}
`;
