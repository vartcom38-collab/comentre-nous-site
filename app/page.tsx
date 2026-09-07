import Link from 'next/link';

const dreamImage = 'https://drive.google.com/uc?export=view&id=1KIuLAfhc2d5bnpPMtUZQ6DWXeomxfR7f';

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
  { href: '/par-ou-commencer', label: 'Découvrir nos univers', className: 'cta-univers' },
  { href: '/boutique', label: 'Voir les nouveautés', className: 'cta-news' },
  { href: '/com-en-famille', label: 'Com’ en famille', className: 'card-family' },
  { href: '/com-des-entrepreneuses', label: 'Com’ des entrepreneuses', className: 'card-business' },
  { href: '/papeterie-du-lien', label: 'Papeterie du lien', className: 'card-paper' },
  { href: '/products/les-petits-liens', label: 'Les Petits Liens', className: 'product-1' },
  { href: '/products/mon-carnet-de-clarte', label: 'Mon carnet de clarté', className: 'product-2' },
  { href: '/products/mon-kit-dete', label: 'Mon kit d’été', className: 'product-3' },
  { href: '/products/cartes-emotions', label: 'Cartes émotions', className: 'product-4' },
  { href: '/boutique', label: 'Voir toute la boutique', className: 'shop-note' },
  { href: '/podcast', label: 'Écouter le dernier épisode', className: 'podcast-main' },
  { href: '/podcast', label: 'Voir tous les épisodes', className: 'podcast-all' },
  { href: '/les-petits-cadeaux', label: 'Newsletter et petits cadeaux', className: 'newsletter-zone' },
  { href: '/mentions-legales', label: 'Mentions légales', className: 'legal' },
  { href: '/contact', label: 'Contact', className: 'contact' },
  { href: '/faq', label: 'FAQ', className: 'faq' },
] as const;

export default function HomePage() {
  return (
    <main className="dream-page">
      <style>{styles}</style>
      <section className="visual-board" aria-label="Accueil Com’ entre nous">
        <img src={dreamImage} alt="Com’ entre nous — Des mots, des cartes et des carnets pour créer du lien" draggable="false" />
        {links.map((link) => <Link key={`${link.href}-${link.className}`} href={link.href} aria-label={link.label} className={`hotspot ${link.className}`} />)}
      </section>
    </main>
  );
}

const styles = `
*{box-sizing:border-box}html,body{margin:0;background:#fffaf2;color:#101827}.dream-page{min-height:100vh;background:#fffaf2;padding:0 0 42px;overflow-x:hidden}.visual-board{position:relative;width:min(977px,100vw);margin:0 auto;background:#fffaf2}.visual-board img{display:block;width:100%;height:auto;user-select:none}.hotspot{position:absolute;z-index:5;display:block;border-radius:999px;text-indent:-9999px;overflow:hidden}.hotspot:focus-visible{outline:3px solid rgba(255,87,92,.7);outline-offset:3px;background:rgba(255,255,255,.12)}@media(hover:hover){.hotspot:hover{outline:2px dashed rgba(255,87,92,.28);outline-offset:3px}}
.logo-link{left:3.0%;top:1.0%;width:12.5%;height:7.7%}.nav-family{left:17.0%;top:2.3%;width:11.5%;height:3.2%}.nav-business{left:30.0%;top:2.3%;width:15.0%;height:3.2%}.nav-paper{left:45.5%;top:2.3%;width:11.5%;height:3.2%}.nav-podcast{left:57.0%;top:2.3%;width:8.2%;height:3.2%}.nav-gifts{left:66.0%;top:2.3%;width:12.0%;height:3.2%}.nav-about{left:78.0%;top:2.3%;width:8.5%;height:3.2%}.icon-search{left:79.4%;top:1.4%;width:4.2%;height:4.7%}.icon-account{left:84.0%;top:1.4%;width:4.1%;height:4.7%}.icon-cart{left:88.3%;top:1.0%;width:4.2%;height:5.1%}.cta-univers{left:10.4%;top:22.2%;width:18.5%;height:3.8%}.cta-news{left:30.0%;top:22.2%;width:16.2%;height:3.8%}.card-family{left:3.1%;top:30.3%;width:30.0%;height:17.2%;border-radius:32px}.card-business{left:34.5%;top:30.3%;width:30.0%;height:17.2%;border-radius:32px}.card-paper{left:65.7%;top:30.3%;width:30.8%;height:17.2%;border-radius:32px}.product-1{left:2.6%;top:56.5%;width:18.4%;height:15.0%;border-radius:18px}.product-2{left:21.9%;top:56.5%;width:18.5%;height:15.0%;border-radius:18px}.product-3{left:41.6%;top:56.5%;width:18.5%;height:15.0%;border-radius:18px}.product-4{left:61.4%;top:56.5%;width:18.5%;height:15.0%;border-radius:18px}.shop-note{left:79.7%;top:54.0%;width:18.0%;height:18.0%;border-radius:32px}.podcast-main{left:13.5%;top:79.4%;width:22.0%;height:3.8%}.podcast-all{left:78.0%;top:78.8%;width:18.0%;height:4.0%}.newsletter-zone{left:3.0%;top:86.6%;width:94.5%;height:6.0%;border-radius:32px}.legal{left:43.0%;top:95.0%;width:7.0%;height:2.0%}.contact{left:51.0%;top:95.0%;width:5.8%;height:2.0%}.faq{left:57.8%;top:95.0%;width:4.0%;height:2.0%}@media(max-width:760px){.dream-page{padding-bottom:18px}.visual-board{width:100vw}.nav-family,.nav-business,.nav-paper,.nav-podcast,.nav-gifts,.nav-about{display:none}.icon-search{left:79%;top:1.3%;width:5%;height:5%}.icon-account{left:84%;top:1.3%;width:5%;height:5%}.icon-cart{left:89%;top:1%;width:5%;height:5.5%}}
`;