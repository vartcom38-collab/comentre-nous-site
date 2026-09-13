import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Administration — Com' entre nous",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>
    <nav className="admin-global-nav">
      <Link href="/admin/">Tableau de bord</Link>
      <Link href="/admin/contenus/">Contenus du site</Link>
      <Link href="/admin/podcast/">Podcast</Link>
      <Link href="/boutique/">Voir la boutique</Link>
      <Link href="/">Voir le site</Link>
    </nav>
    {children}
    <style>{`.admin-global-nav{position:relative;z-index:9999;display:flex;gap:8px;align-items:center;overflow:auto;padding:9px 14px;background:#0f1320;border-bottom:1px solid rgba(255,255,255,.1);font-family:Comfortaa,system-ui,sans-serif}.admin-global-nav a{white-space:nowrap;color:#fff;text-decoration:none;font-size:11px;font-weight:900;padding:8px 11px;border-radius:999px;background:rgba(255,255,255,.08)}.admin-global-nav a:hover{background:#ff5d62}@media(max-width:650px){.admin-global-nav{padding:7px 8px}.admin-global-nav a{font-size:10px;padding:7px 9px}}`}</style>
  </>;
}
