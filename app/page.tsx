import Link from 'next/link';

const mockupSrc = 'data:image/webp;base64,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';

const hotspots = [
  { href: '/com-en-famille', label: 'Com en famille', style: { left: '18%', top: '2%', width: '14%', height: '4%' } },
  { href: '/com-des-entrepreneuses', label: 'Com des entrepreneuses', style: { left: '32%', top: '2%', width: '19%', height: '4%' } },
  { href: '/papeterie-du-lien', label: 'Papeterie du lien', style: { left: '52%', top: '2%', width: '15%', height: '4%' } },
  { href: '/podcast', label: 'Le podcast', style: { left: '68%', top: '2%', width: '10%', height: '4%' } },
  { href: '/petits-cadeaux', label: 'Les petits cadeaux', style: { left: '78%', top: '2%', width: '13%', height: '4%' } },
  { href: '/a-propos', label: 'À propos', style: { left: '90%', top: '2%', width: '8%', height: '4%' } },
  { href: '/par-ou-commencer', label: 'Découvrir nos univers', style: { left: '6%', top: '24%', width: '21%', height: '4%' } },
  { href: '/boutique', label: 'Voir les nouveautés', style: { left: '30%', top: '24%', width: '20%', height: '4%' } },
  { href: '/com-en-famille', label: 'Carte Com en famille', style: { left: '3%', top: '32%', width: '31%', height: '17%' } },
  { href: '/com-des-entrepreneuses', label: 'Carte Com des entrepreneuses', style: { left: '35%', top: '32%', width: '31%', height: '17%' } },
  { href: '/papeterie-du-lien', label: 'Carte Papeterie du lien', style: { left: '68%', top: '32%', width: '29%', height: '17%' } },
  { href: '/boutique', label: 'Toute la boutique', style: { left: '82%', top: '67%', width: '15%', height: '5%' } },
  { href: '/podcast', label: 'Podcast', style: { left: '3%', top: '72%', width: '94%', height: '13%' } }
];

export default function HomePage() {
  return (
    <main className="mockup-home-image" aria-label="Page d’accueil Com’entre nous">
      <div className="mockup-frame">
        <img src={mockupSrc} alt="Maquette validée de la page d’accueil Com’entre nous" />
        {hotspots.map((hotspot) => (
          <Link key={`${hotspot.href}-${hotspot.label}`} href={hotspot.href} aria-label={hotspot.label} className="mockup-hotspot" style={hotspot.style} />
        ))}
      </div>
      <style>{`
        html, body { margin: 0; background: #fffaf1; }
        .mockup-home-image {
          min-height: 100vh;
          background: #fffaf1;
          display: flex;
          justify-content: center;
          overflow-x: auto;
        }
        .mockup-frame {
          position: relative;
          width: min(100vw, 1440px);
          line-height: 0;
          background: #fffaf1;
        }
        .mockup-frame img {
          display: block;
          width: 100%;
          height: auto;
        }
        .mockup-hotspot {
          position: absolute;
          z-index: 5;
          display: block;
          border-radius: 22px;
          opacity: 0;
        }
        .mockup-hotspot:hover,
        .mockup-hotspot:focus-visible {
          opacity: .14;
          background: #ff5f5b;
          outline: 3px solid #111;
          outline-offset: 2px;
        }
        @media (max-width: 760px) {
          .mockup-frame { width: 1024px; min-width: 1024px; }
        }
      `}</style>
    </main>
  );
}
