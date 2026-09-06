import { LayoutShell, PageIntro, ProductGrid } from '@/components/Site';
import { productFilters } from '@/src/data/site';

export default function ShopPage() {
  return <LayoutShell><main><PageIntro kicker="Tous les produits" title="La boutique" text="Cartes, oracles, carnets, kits à imprimer, papeterie et futures extensions : tout est rassemblé ici." /><div className="filter-row">{productFilters.map((filter) => <span key={filter}>{filter}</span>)}</div><section className="section"><ProductGrid /></section></main></LayoutShell>;
}
