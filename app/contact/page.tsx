import { LayoutShell, PageIntro, Newsletter } from '@/components/Site';

export default function ContactPage() {
  return <LayoutShell><main><PageIntro kicker="Nous écrire" title="Contact" text="Une question, une idée, une envie de collaboration ou juste un petit mot ? Tu peux nous écrire ici." /><section className="content-card"><h2>Bonjour ♥</h2><p>Email : bonjour@comentrenous.fr</p><p>Instagram, podcast, partenariats et demandes pros seront ajoutés ici quand les liens définitifs seront prêts.</p></section><Newsletter /></main></LayoutShell>;
}
