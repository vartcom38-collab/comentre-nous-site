import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import MobileMenu from './MobileMenu';
import './globals.css';
import './font-fix.css';
import './universe-polish.css';
import './site-responsive.css';
import './mobile-menu.css';

export const metadata: Metadata = {
  title: "Com' entre nous — Des outils pour créer du lien",
  description: "Des cartes, carnets, kits et ressources pour mieux se parler, s’écouter et créer du lien."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <MobileMenu />
        {children}
      </body>
    </html>
  );
}
