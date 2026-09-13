import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Administration — Com' entre nous",
  robots: { index: false, follow: false, nocache: true },
};

const persistentTokenScript = `
(() => {
  const key = 'comentre_admin_github_token';
  const syncToken = () => {
    try {
      const persistent = window.localStorage.getItem(key) || '';
      const session = window.sessionStorage.getItem(key) || '';
      if (persistent && !session) {
        window.sessionStorage.setItem(key, persistent);
      } else if (session && session !== persistent) {
        window.localStorage.setItem(key, session);
      }
    } catch (_) {}
  };
  syncToken();
  window.setInterval(syncToken, 1000);
  window.addEventListener('pagehide', syncToken);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') syncToken();
  });
})();
`;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>
    <script dangerouslySetInnerHTML={{ __html: persistentTokenScript }} />
    <nav className="admin-global-nav">
      <Link href="/admin/">Tableau de bord</Link>
      <Link href="/admin/contenus/">Contenus du site</Link>
      <Link href="/admin/podcast/">Podcast</Link>
      <Link href="/boutique/">Voir la boutique</Link>
      <Link href="/">Voir le site</Link>
    </nav>
    <div className="admin-quick-access" aria-label="Accès rapides administration">
      <Link href="/admin/contenus/">✎ Contenus du site</Link>
      <Link href="/admin/podcast/">◉ Podcast</Link>
    </div>
    {children}
    <style>{`
      .admin-global-nav{position:relative;z-index:9999;display:flex;gap:8px;align-items:center;overflow:auto;padding:9px 14px;background:#0f1320;border-bottom:1px solid rgba(255,255,255,.1);font-family:Comfortaa,system-ui,sans-serif}
      .admin-global-nav a{white-space:nowrap;color:#fff;text-decoration:none;font-size:11px;font-weight:900;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.08)}
      .admin-global-nav a:hover{background:#ff5d62}
      .admin-quick-access{position:fixed;right:18px;bottom:18px;z-index:100000;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;font-family:Comfortaa,system-ui,sans-serif;pointer-events:auto}
      .admin-quick-access a{display:inline-flex;align-items:center;gap:6px;background:#171b2a;color:#fff;text-decoration:none;border-radius:999px;padding:12px 16px;font-size:12px;font-weight:900;box-shadow:0 12px 30px rgba(23,27,42,.22)}
      .admin-quick-access a:first-child{background:#ff5d62}
      @media(max-width:650px){.admin-global-nav{padding:7px 8px}.admin-global-nav a{font-size:10px;padding:7px 9px}.admin-quick-access{left:10px;right:10px;bottom:10px}.admin-quick-access a{flex:1;justify-content:center;padding:11px 12px}}
    `}</style>
  </>;
}
