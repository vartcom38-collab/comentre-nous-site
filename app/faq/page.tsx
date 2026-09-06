import { LayoutShell, PageIntro } from '@/components/Site';

const questions = [
  ['Comment acheter un produit ?', 'Les boutons pourront mener vers Amazon, Stripe, PayPal, Gumroad ou une autre solution selon le produit.'],
  ['Est-ce que les carnets sont imprimables ?', 'Oui, la papeterie du lien pourra accueillir des PDF, kits et pages à télécharger.'],
  ['Où retrouver le podcast ?', 'La page Podcast rassemble les épisodes, les thèmes et les liens d’écoute.']
];

export default function FaqPage() {
  return <LayoutShell><main><PageIntro kicker="Questions" title="FAQ" text="Les réponses pratiques autour des produits, des téléchargements et de l’univers Com’ entre nous." /><section className="content-card">{questions.map(([q, a]) => <div key={q}><h2>{q}</h2><p>{a}</p></div>)}</section></main></LayoutShell>;
}
