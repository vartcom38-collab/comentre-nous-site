import { LayoutShell, PageIntro, ProductGrid, Newsletter } from '@/components/Site';
import { products } from '@/src/data/products';

export default function PaperPage() {
  const items = products.filter((product) => product.universe === 'Papeterie');
  return <LayoutShell><main><PageIntro kicker="Carnets · kits · imprimables" title="La papeterie du lien" text="Carnets, kits, jeux à imprimer, bujo et pages créatives pour mettre un peu de magie dans le quotidien." /><section className="content-card"><h2>Des pages pour une vie plus douce.</h2><p>Ici, on prépare les kits d’été, carnets à imprimer, pages de bujo, jeux papier et petits objets qui accompagnent les grands moments comme les mini chaos du quotidien.</p></section><section className="section"><div className="section-title"><h2>Nos incontournables papier</h2></div><ProductGrid items={items} /></section><Newsletter /></main></LayoutShell>;
}
