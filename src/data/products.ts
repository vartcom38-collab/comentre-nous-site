export type Product = {
  slug: string;
  title: string;
  universe: "Com' en famille" | "Com' des entrepreneuses" | 'Papeterie';
  type: 'Cartes' | 'Oracle' | 'Carnet' | 'Kit' | 'Podcast' | 'Cadeau';
  price: string;
  badge?: string;
  age?: string;
  description: string;
  buyLabel: string;
  buyUrl: string;
  color: 'coral' | 'mint' | 'lilac' | 'yellow' | 'blue';
};

export const products: Product[] = [
  {
    slug: 'les-petits-liens',
    title: 'Les Petits Liens',
    universe: "Com' en famille",
    type: 'Cartes',
    price: '29,00 €',
    badge: 'Nouveau',
    age: '6–10 ans',
    description: "Le jeu des émotions du quotidien pour ouvrir la parole sans pression.",
    buyLabel: 'Voir',
    buyUrl: '#',
    color: 'yellow'
  },
  {
    slug: 'oracle-com-des-murmures',
    title: "L’Oracle Com’ des Murmures",
    universe: "Com' des entrepreneuses",
    type: 'Oracle',
    price: '39,00 €',
    badge: 'Coup de cœur',
    description: 'Un oracle pour clarifier ton message, retrouver du sens et communiquer avec justesse.',
    buyLabel: 'Voir',
    buyUrl: '#',
    color: 'lilac'
  },
  {
    slug: 'mon-carnet-de-clarte',
    title: 'Mon carnet de clarté',
    universe: "Com' des entrepreneuses",
    type: 'Carnet',
    price: '12,90 €',
    description: 'Un carnet pour remettre tes idées au clair quand tout part en post-it mental.',
    buyLabel: 'Voir',
    buyUrl: '#',
    color: 'mint'
  },
  {
    slug: 'mon-kit-ete',
    title: "Mon kit d’été",
    universe: 'Papeterie',
    type: 'Kit',
    price: '12,90 €',
    badge: 'À imprimer',
    description: 'Des activités, idées et petits rituels à glisser dans la valise.',
    buyLabel: 'Voir',
    buyUrl: '#',
    color: 'coral'
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
