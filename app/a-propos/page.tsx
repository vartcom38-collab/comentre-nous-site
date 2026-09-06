import { LayoutShell, PageIntro, Newsletter } from '@/components/Site';

export default function AboutPage() {
  return <LayoutShell><main><PageIntro kicker="Notre histoire" title="À propos" text="Deux amies, une même envie : créer des outils qui font du bien, sans posture parfaite ni grands discours." /><section className="content-card"><h2>Marion & Aurélie</h2><p>Nous, c’est Marion et Aurélie. Deux amies, deux parcours, une même sensibilité : les mots, les liens, les humains. À travers Com’entre Nous, nous créons des supports pour mieux se comprendre, s’exprimer et avancer, en famille, en solo ou en entrepreneuse.</p></section><section className="content-card"><h2>Notre boussole</h2><p>Des outils beaux, simples, concrets. Des phrases qui ouvrent une porte. Des supports qui peuvent être utilisés dans la vraie vie, pas seulement quand tout est rangé, calme et parfait.</p></section><Newsletter /></main></LayoutShell>;
}
