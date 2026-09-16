import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import MobileMenu from './MobileMenu';
import HomeContentBridge from './HomeContentBridge';
import HomeUniverseBridge from './HomeUniverseBridge';
import HomeNeedsBridge from './HomeNeedsBridge';
import HomeFoundersBridge from './HomeFoundersBridge';
import SeasonalDecor from './SeasonalDecor';
import './globals.css';
import './font-fix.css';
import './universe-polish.css';
import './site-responsive.css';
import './mobile-menu.css';
import './footer-cleanup.css';
import './shared-shell.css';
import './family-polish.css';
import './family-shop-polish.css';
import './papeterie-hero.css';
import './seasonal-decor.css';

export const metadata: Metadata = {
  title: "Com' entre nous — Des outils pour créer du lien",
  description: "Des cartes, carnets, kits et ressources pour mieux se parler, s’écouter et créer du lien."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <MobileMenu />
        <HomeContentBridge />
        <HomeUniverseBridge />
        <HomeNeedsBridge />
        <HomeFoundersBridge />
        <SeasonalDecor />
        {children}
        <script src="/woo-cart.js" defer />
        <script src="/family-character-bridge.js" defer />
        <script src="/admin-github-write-queue.js" defer />
        <script src="/admin-podcast-conflict-retry.js" defer />
        <script src="/admin-content-conflict-retry.js" defer />
        <script src="/admin-content-map.js" defer />
        <script src="/admin-home-universes.js" defer />
        <script src="/admin-delete-helper.js" defer />
        <script src="/admin-sale-mode.js" defer />
        <script src="/admin-woo-sync-safe.js" defer />
        <script src="/admin-product-quality.js" defer />
        <script src="/admin-aurelie-access.js" defer />
        <script src="/admin-gifts-access.js" defer />
      </body>
    </html>
  );
}
