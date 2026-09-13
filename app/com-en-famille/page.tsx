import { LayoutShell, PageIntro, ProductGrid, ValuesStrip, Newsletter } from '@/components/Site';
import { products } from '@/src/data/products';
import siteContent from '@/content/site-sections.json';

export default function FamilyPage() {
  const items = products.filter((product) => product.universe === "Com' en famille" || product.universe === 'Papeterie');
  const page = siteContent.pages.famille;
  return <LayoutShell><main><PageIntro kicker={page.kicker} title={page.title} text={page.intro} /><section className="content-card"><h2>{page.blockTitle}</h2><p>{page.blockText}</p></section><section className="section"><div className="section-title"><h2>{page.productsTitle}</h2></div><ProductGrid items={items} /></section><ValuesStrip /><Newsletter /></main></LayoutShell>;
}
