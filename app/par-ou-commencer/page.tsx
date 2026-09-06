import Link from 'next/link';
import { LayoutShell, PageIntro } from '@/components/Site';

const paths = [
  { title: 'Je suis parent·e', href: '/com-en-famille', text: "J’ai envie d’aider mon enfant à parler, comprendre ses émotions, créer du lien." },
  { title: 'Je suis entrepreneuse', href: '/com-des-entrepreneuses', text: 'J’ai besoin de clarifier mes idées, mon message ou ma communication.' },
  { title: 'Je cherche des imprimables', href: '/papeterie-du-lien', text: 'Je veux des carnets, kits, jeux papier ou petites pages créatives.' },
  { title: 'Je veux découvrir votre univers', href: '/podcast', text: 'Je veux écouter, comprendre le ton, les coulisses et votre façon de voir les choses.' }
];

export default function StartPage() {
  return <LayoutShell><main><PageIntro kicker="Respire, on t’aide" title="Par où commencer ?" text="Tu arrives ici et tu ne sais pas par quelle porte entrer ? Choisis ce qui te ressemble aujourd’hui." /><section className="content-card"><div className="steps">{paths.map((path) => <Link href={path.href} key={path.href}><h3>{path.title}</h3><p>{path.text}</p><strong>Entrer →</strong></Link>)}</div></section></main></LayoutShell>;
}
