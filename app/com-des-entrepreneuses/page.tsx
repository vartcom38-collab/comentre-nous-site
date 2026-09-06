import { LayoutShell, PageIntro, ProductGrid, PodcastBand, Newsletter } from '@/components/Site';
import { products } from '@/src/data/products';

export default function EntrepreneursPage() {
  const items = products.filter((product) => product.universe === "Com' des entrepreneuses");
  return <LayoutShell><main><PageIntro kicker="Idées · intuition · communication" title="Com’ des entrepreneuses" text="Des supports pour clarifier ton message, écouter ton intuition, créer du contenu et communiquer avec plus de justesse — même quand tu as douze idées et un café froid." /><section className="content-card"><h2>Pour celles qui créent, doutent, osent, recommencent.</h2><p>On y retrouvera Com’ des Murmures, des carnets business, des outils de communication, des extensions visibilité et des ressources pour avancer dans son projet sans perdre son âme.</p></section><section className="section"><div className="section-title"><h2>Nos outils pour entrepreneuses</h2></div><ProductGrid items={items} /></section><PodcastBand /><Newsletter /></main></LayoutShell>;
}
