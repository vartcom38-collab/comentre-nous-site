import { LayoutShell, PageIntro, ProductGrid, ValuesStrip, Newsletter } from '@/components/Site';
import { products } from '@/src/data/products';

export default function FamilyPage() {
  const items = products.filter((product) => product.universe === "Com' en famille" || product.universe === 'Papeterie');
  return <LayoutShell><main><PageIntro kicker="Famille · émotions · quotidien" title="Com’ en famille" text="Des outils pour se parler, s’écouter, accueillir les émotions et créer de vrais moments ensemble — sans mode d’emploi parfait." /><section className="content-card"><h2>Parce que les mots changent les journées.</h2><p>Cartes de communication, jeux émotionnels, kits famille, petites ressources à imprimer : ici, on crée des supports pour les moments où les mots restent coincés, débordent, ou ont juste besoin d’un petit coup de pouce.</p></section><section className="section"><div className="section-title"><h2>Nos produits famille</h2></div><ProductGrid items={items} /></section><ValuesStrip /><Newsletter /></main></LayoutShell>;
}
