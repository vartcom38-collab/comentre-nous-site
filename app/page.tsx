import Link from 'next/link';

const links = [
  { href: '/', label: 'Accueil', className: 'logo-link' },
  { href: '/com-en-famille', label: 'Com’ en famille', className: 'nav-family' },
  { href: '/com-des-entrepreneuses', label: 'Com’ des entrepreneuses', className: 'nav-business' },
  { href: '/papeterie-du-lien', label: 'Papeterie du lien', className: 'nav-paper' },
  { href: '/podcast', label: 'Le podcast', className: 'nav-podcast' },
  { href: '/les-petits-cadeaux', label: 'Les petits cadeaux', className: 'nav-gifts' },
  { href: '/a-propos', label: 'À propos', className: 'nav-about' },
  { href: '/boutique', label: 'Recherche', className: 'icon-search' },
  { href: '/a-propos', label: 'Compte', className: 'icon-account' },
  { href: '/boutique', label: 'Panier', className: 'icon-cart' },
  { href: '/boutique', label: 'Des petites idées qui font du bien', className: 'top-note-link' },
  { href: '/par-ou-commencer', label: 'Découvrir nos univers', className: 'cta-univers' },
  { href: '/boutique', label: 'Voir les nouveautés', className: 'cta-news' },
  { href: '/par-ou-commencer', label: 'Valeurs Com’ entre nous', className: 'values-link' },
  { href: '/com-en-famille', label: 'Image famille', className: 'photo-link' },
  { href: '/par-ou-commencer', label: 'Écouter comprendre ressentir partager avancer', className: 'tabs-link' },
  { href: '/com-en-famille', label: 'Ici on parle vrai', className: 'truth-link' },
] as const;

export default function HomePage() {
  return (
    <main className="image-home">
      <style>{styles}</style>

      <nav className="sr-only" aria-label="Navigation principale">
        <Link href="/com-en-famille">Com’ en famille</Link>
        <Link href="/com-des-entrepreneuses">Com’ des entrepreneuses</Link>
        <Link href="/papeterie-du-lien">Papeterie du lien</Link>
        <Link href="/podcast">Le podcast</Link>
        <Link href="/les-petits-cadeaux">Les petits cadeaux</Link>
        <Link href="/a-propos">À propos</Link>
        <Link href="/boutique">Boutique</Link>
      </nav>

      <section className="hero-board" aria-label="Accueil Com’ entre nous">
        <img
          src="/hero-accueil-comentre-nous.webp"
          alt="Com’ entre nous — Des mots, des cartes et des carnets pour créer du lien"
          draggable="false"
        />
        {links.map((link) => (
          <Link key={`${link.href}-${link.className}`} href={link.href} aria-label={link.label} className={`hotspot ${link.className}`} />
        ))}
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}html,body{margin:0;background:#fffaf2;color:#101827}.image-home{min-height:100vh;background:#fffaf2;overflow-x:hidden}.hero-board{position:relative;width:min(1672px,100vw);margin:0 auto;background:#fffaf2}.hero-board img{display:block;width:100%;height:auto;user-select:none}.hotspot{position:absolute;z-index:5;display:block;border-radius:999px;text-indent:-9999px;overflow:hidden}.hotspot:focus-visible{outline:3px solid rgba(255,87,92,.75);outline-offset:4px;background:rgba(255,255,255,.12)}@media (hover:hover){.hotspot:hover{outline:2px dashed rgba(255,87,92,.32);outline-offset:4px}}
.logo-link{left:2.4%;top:1.7%;width:11.8%;height:13.5%}.nav-family{left:15.1%;top:3.9%;width:10.2%;height:5.8%}.nav-business{left:25.4%;top:3.9%;width:14.2%;height:5.8%}.nav-paper{left:39.7%;top:3.9%;width:11.4%;height:5.8%}.nav-podcast{left:51.3%;top:3.9%;width:8.2%;height:5.8%}.nav-gifts{left:59.4%;top:3.9%;width:11.4%;height:5.8%}.nav-about{left:70.6%;top:3.9%;width:7.6%;height:5.8%}.icon-search{left:79.0%;top:2.8%;width:3.8%;height:7.4%}.icon-account{left:83.0%;top:2.8%;width:3.7%;height:7.4%}.icon-cart{left:86.5%;top:2.2%;width:4.3%;height:8.5%}.top-note-link{left:90.0%;top:0.4%;width:9.0%;height:12.4%;border-radius:34px}.cta-univers{left:8.5%;top:68.0%;width:20.4%;height:7.4%}.cta-news{left:29.0%;top:68.0%;width:18.4%;height:7.4%}.values-link{left:3.6%;top:78.4%;width:44.0%;height:9.8%}.photo-link{left:48.6%;top:11.0%;width:38.8%;height:82.4%;border-radius:26px}.tabs-link{left:84.9%;top:14.0%;width:12.2%;height:50.0%;border-radius:18px}.truth-link{left:89.5%;top:67.0%;width:9.4%;height:19.0%;border-radius:34px}.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:760px){.hero-board{width:100vw}.nav-family,.nav-business,.nav-paper,.nav-podcast,.nav-gifts,.nav-about,.top-note-link{display:none}.icon-search,.icon-account,.icon-cart{top:2.5%;height:8.2%}.cta-univers{left:8%;top:68%;width:24%;height:8%}.cta-news{left:33%;top:68%;width:22%;height:8%}.photo-link{left:47%;top:11%;width:49%;height:82%}}
`;