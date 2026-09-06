import type { ReactNode } from 'react';
import Link from 'next/link';
import { navItems, universes } from '@/src/data/site';
import { products, Product } from '@/src/data/products';

export function Logo() {
  return <Link className="logo" href="/" aria-label="Accueil Com' entre nous"><span>Com’</span><span>entre</span><span>nous</span><i>♥</i></Link>;
}

export function Header() {
  return <header className="site-header"><Logo /><nav>{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div className="header-actions"><Link className="shop-pill" href="/boutique">Boutique</Link><span>⌕</span><span>♡</span><span>🛒</span></div></header>;
}

export function Footer() {
  return <footer className="footer"><div><Logo /><p>Des mots, des outils, des humains.</p></div><div className="footer-links">{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/mentions-legales">Mentions légales</Link><Link href="/contact">Contact</Link><Link href="/faq">FAQ</Link></div><div className="socials"><span>Instagram</span><span>YouTube</span><span>Pinterest</span><span>Spotify</span></div><p className="thanks">Merci d’être ici ! ♥</p></footer>;
}

export function LayoutShell({ children }: { children: ReactNode }) {
  return <><Header />{children}<Footer /></>;
}

export function DoodleScene() {
  return <div className="hero-scene" aria-hidden="true"><span className="sun">☼</span><span className="heart h1">♡</span><span className="heart h2">♥</span><span className="note n1">Écouter<br/>comprendre<br/>relier</span><span className="bubble">parce que<br/>chaque mot<br/>compte</span><div className="illustration-family"><div className="person adult"><b></b></div><div className="person child"><b></b></div><div className="cards"><i></i><i></i><i></i></div></div></div>;
}

export function UniverseCards() {
  return <section className="section compact"><h2>Quel est ton univers ?</h2><div className="universe-grid">{universes.map((item) => <Link href={item.href} className={`universe-card ${item.tone}`} key={item.href}><span className="big-icon">{item.icon}</span><p className="tag">{item.tag}</p><h3>{item.title}</h3><p>{item.text}</p><b>Découvrir →</b></Link>)}</div></section>;
}

export function ValuesStrip() {
  const values = ['Des créations avec amour', 'Une approche bienveillante', 'Des outils pour la vraie vie', 'Une communauté qui inspire'];
  return <section className="values-strip">{values.map((value) => <div key={value}><span>♡</span><p>{value}</p></div>)}</section>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className={`product-card ${product.color}`}><div className="product-image"><span>{product.type === 'Oracle' ? '✦' : product.type === 'Kit' ? '☼' : product.type === 'Carnet' ? '▤' : '♡'}</span>{product.badge && <em>{product.badge}</em>}</div><div><p className="product-meta">{product.universe} · {product.type}</p><h3>{product.title}</h3><p>{product.description}</p><div className="product-bottom"><strong>{product.price}</strong><Link href={`/produits/${product.slug}`}>{product.buyLabel} →</Link></div></div></article>;
}

export function ProductGrid({ items = products }: { items?: Product[] }) {
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>;
}

export function ProductHighlights({ title = 'Nos nouveautés' }: { title?: string }) {
  return <section className="section"><div className="section-title"><h2>{title}</h2><Link href="/boutique">Voir toute la boutique →</Link></div><ProductGrid /></section>;
}

export function Newsletter() {
  return <section className="newsletter"><div className="mail-icon">✉</div><div><h2>Reçois des idées, des ressources et des coulisses !</h2><p>Et en cadeau, une fiche à imprimer pour créer un vrai moment de discussion.</p></div><form><input placeholder="Ton adresse email" /><button>Je m’inscris !</button></form></section>;
}

export function PodcastBand() {
  return <section className="podcast-band"><div className="mic">♬</div><div><p className="tag">Le podcast</p><h2>Com’ entre nous, même quand le café est froid.</h2><p>Des conversations vraies autour de la parentalité, des émotions, de l’entrepreneuriat et de tout ce qui nous traverse.</p></div><Link href="/podcast" className="dark-btn">Écouter →</Link></section>;
}

export function PageIntro({ kicker, title, text }: { kicker?: string; title: string; text: string }) {
  return <section className="page-intro"><p className="tag">{kicker}</p><h1>{title}</h1><p>{text}</p></section>;
}

export function NeedCards() {
  const needs = ['Aider mon enfant à parler', 'Créer un moment en famille', 'Occuper les enfants sans écran', 'Trouver des idées de contenu', 'Débloquer ma communication', 'M’offrir une pause créative'];
  return <section className="needs"><h2>De quoi as-tu besoin aujourd’hui ?</h2><div>{needs.map((need) => <Link href="/par-ou-commencer" key={need}><span>♡</span>{need}</Link>)}</div></section>;
}
