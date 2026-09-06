import { LayoutShell, DoodleScene, UniverseCards, ValuesStrip, ProductHighlights, PodcastBand, Newsletter, NeedCards } from '@/components/Site';

export default function HomePage() {
  return (
    <LayoutShell>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="tag">Bienvenue dans notre joyeux bazar du quotidien</p>
            <h1>Des mots, des cartes et des carnets pour <mark>créer du lien.</mark></h1>
            <p>Des outils doux, illustrés et concrets pour exprimer ce que tu ressens, trouver les mots et faire circuler les idées. En famille, dans ton quotidien ou dans ton projet.</p>
            <div className="actions"><a href="/com-en-famille">Je viens pour ma famille →</a><a className="secondary" href="/com-des-entrepreneuses">Je suis entrepreneuse →</a></div>
          </div>
          <DoodleScene />
        </section>
        <UniverseCards />
        <ValuesStrip />
        <NeedCards />
        <ProductHighlights title="Nos coups de cœur du moment" />
        <PodcastBand />
        <Newsletter />
      </main>
    </LayoutShell>
  );
}
