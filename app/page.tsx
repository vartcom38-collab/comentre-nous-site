import Link from 'next/link';

const dreamImage = 'https://lh3.googleusercontent.com/d/1PSvjzzZnTI_jsdCgN9uzCVRFvNRTjJqF=w2048';

const links = [
  { href: '/', label: 'Accueil', className: 'logo-link' },
  { href: '/com-en-famille', label: 'Com’ en famille', className: 'nav-family' },
  { href: '/com-des-entrepreneuses', label: 'Com’ des entrepreneuses', className: 'nav-business' },
  { href: '/papeterie-du-lien', label: 'La papeterie', className: 'nav-paper' },
  { href: '/podcast', label: 'Le podcast', className: 'nav-podcast' },
  { href: '/les-petits-cadeaux', label: 'Les petits cadeaux', className: 'nav-gifts' },
  { href: '/a-propos', label: 'À propos', className: 'nav-about' },
  { href: '/boutique', label: 'Recherche', className: 'icon-search' },
  { href: '/a-propos', label: 'Compte', className: 'icon-account' },
  { href: '/boutique', label: 'Panier', className: 'icon-cart' },
  { href: '/com-en-famille', label: 'Com’ en famille', className: 'card-family' },
  { href: '/com-des-entrepreneuses', label: 'Com’ des entrepreneuses', className: 'card-business' },
  { href: '/papeterie-du-lien', label: 'La papeterie', className: 'card-paper' },
  { href: '/podcast', label: 'Le podcast', className: 'card-podcast' },
  { href: '/les-petits-cadeaux', label: 'Les petits cadeaux', className: 'card-gifts' },
  { href: '/a-propos', label: 'À propos', className: 'card-about' },
  { href: '/par-ou-commencer', label: 'Découvrir notre univers', className: 'cta-discover' },
  { href: '/boutique', label: 'Voir les nouveautés', className: 'cta-news' },
  { href: '/com-en-famille', label: 'Des outils concrets', className: 'value-1' },
  { href: '/par-ou-commencer', label: 'Une approche bienveillante', className: 'value-2' },
  { href: '/les-petits-cadeaux', label: 'Une communauté engagée', className: 'value-3' },
] as const;

export default function HomePage() {
  return (
    <main className="dream-page">
      <style>{styles}</style>
      <section className="visual-board" aria-label="Accueil Com’ entre nous">
        <img src={dreamImage} alt="Com’ entre nous — page d’accueil" draggable="false" />
        {links.map((link) => <Link key={`${link.href}-${link.className}`} href={link.href} aria-label={link.label} className={`hotspot ${link.className}`} />)}
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}html,body{margin:0;background:#fffaf2;color:#101827}.dream-page{min-height:100vh;background:#fffaf2;overflow-x:hidden}.visual-board{position:relative;width:min(1024px,100vw);margin:0 auto;background:#fffaf2}.visual-board img{display:block;width:100%;height:auto;user-select:none}.hotspot{position:absolute;z-index:10;display:block;border-radius:999px;text-indent:-9999px;overflow:hidden}.hotspot:focus-visible{outline:3px solid rgba(255,87,92,.72);outline-offset:3px;background:rgba(255,255,255,.16)}@media(hover:hover){.hotspot:hover{outline:2px dashed rgba(255,87,92,.28);outline-offset:3px}}
.logo-link{left:2.7%;top:.8%;width:12.4%;height:9.7%;border-radius:22px}.nav-family{left:18.0%;top:1.7%;width:11.0%;height:3.5%}.nav-business{left:30.0%;top:1.7%;width:15.0%;height:3.5%}.nav-paper{left:45.7%;top:1.7%;width:11.2%;height:3.5%}.nav-podcast{left:57.0%;top:1.7%;width:8.5%;height:3.5%}.nav-gifts{left:65.8%;top:1.7%;width:12.6%;height:3.5%}.nav-about{left:78.8%;top:1.7%;width:8.4%;height:3.5%}.icon-search{left:87.8%;top:1.1%;width:3.8%;height:4.2%}.icon-account{left:92.2%;top:1.1%;width:3.1%;height:4.2%}.icon-cart{left:96.0%;top:.9%;width:3.6%;height:4.4%}.card-family{left:1.2%;top:31.0%;width:15.5%;height:16.3%;border-radius:16px}.card-business{left:17.8%;top:31.0%;width:15.6%;height:16.3%;border-radius:16px}.card-paper{left:34.7%;top:31.0%;width:15.7%;height:16.3%;border-radius:16px}.card-podcast{left:51.5%;top:31.0%;width:15.1%;height:16.3%;border-radius:16px}.card-gifts{left:67.8%;top:31.0%;width:15.4%;height:16.3%;border-radius:16px}.card-about{left:84.1%;top:31.0%;width:15.0%;height:16.3%;border-radius:16px}.cta-discover{left:8.0%;top:65.0%;width:26.5%;height:4.4%;border-radius:50px}.cta-news{left:73.0%;top:74.7%;width:22.5%;height:4.6%;border-radius:50px}.value-1{left:7.5%;top:82.2%;width:20.0%;height:5.4%;border-radius:18px}.value-2{left:38.5%;top:82.2%;width:23.0%;height:5.4%;border-radius:18px}.value-3{left:72.0%;top:82.2%;width:24.0%;height:5.4%;border-radius:18px}@media(max-width:760px){.visual-board{width:100vw}.nav-family,.nav-business,.nav-paper,.nav-podcast,.nav-gifts,.nav-about{display:none}.icon-search{left:85.5%;width:4.8%}.icon-account{left:91%;width:4.3%}.icon-cart{left:96%;width:4.0%}.logo-link{left:2%;top:.6%;width:14%;height:10%}}
`;