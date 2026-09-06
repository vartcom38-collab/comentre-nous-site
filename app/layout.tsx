import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Com' entre nous — Des outils pour créer du lien",
  description: "Des cartes, carnets, kits et ressources pour mieux se parler, s’écouter et créer du lien.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
