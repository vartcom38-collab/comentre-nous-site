import Link from 'next/link';
import {type ShopGroup} from '@/src/lib/woo-grouping';
import {wooImage,wooPrice} from '@/src/lib/woo-public';
export default function WooCards({groups,title}:{groups:ShopGroup[];title?:string}){
 if(!groups.length)return null;
 return <section className="section" aria-label={title||'Produits WooCommerce'} style={{maxWidth:1300,margin:'2rem auto',padding:'1rem'}}>
 {title&&<h2>{title}</h2>}
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
 {groups.map(group=><article key={group.key} style={{background:'#fff',borderRadius:24,padding:16,boxShadow:'0 10px 36px #0000000d'}}>
 <Link href={'/boutique/woo/'+encodeURIComponent(group.primary.id)} style={{textDecoration:'none',color:'inherit'}}>
 {wooImage(group.primary)?<img src={wooImage(group.primary)} alt={group.primary.name} style={{width:'100%',aspectRatio:'4/3',objectFit:'cover',borderRadius:16}}/>:<div style={{aspectRatio:'4/3',background:'#fff1ea',borderRadius:16}}/>}
 <h3 style={{fontSize:'1.25rem',margin:'14px 0 6px'}}>{group.primary.name}</h3>
 <p>{group.ebook&&group.amazon?'Ebook et version papier':group.amazon?'Version papier':'Version numérique'}</p>
 <strong>{wooPrice(group.ebook||group.primary)}</strong>
 <p style={{textDecoration:'underline',fontWeight:700}}>Découvrir le produit →</p></Link>
 </article>)}</div></section>;
}
