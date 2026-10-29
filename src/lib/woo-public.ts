import {combineFormats, type ShopProduct, type ShopGroup} from './woo-grouping';
export type PublicWooProduct=ShopProduct & {categories?:{id:number;name:string;slug:string}[];description?:string;short_description?:string;button_text?:string;add_to_cart?:{url?:string};prices?:{price:string;currency_minor_unit:number;currency_code:string};};
const source='https://comentrenous.marionbolomey.fr';
export async function wooCatalog():Promise<(ShopGroup & {category:string})[]>{
 const all:PublicWooProduct[]=[];
 for(let page=1;page<=10;page++){
  const response=await fetch(source+'/woo-bridge.php?action=products',{cache:'no-store',headers:{Accept:'application/json'}});
  if(!response.ok)throw new Error('Catalogue WooCommerce indisponible ('+response.status+')');
  const payload=await response.json() as {ok:boolean;products:PublicWooProduct[]};
  if(!payload.ok)throw new Error('Passerelle WooCommerce indisponible');
  const batch=payload.products;
  if(!Array.isArray(batch))throw new Error('Réponse WooCommerce invalide');
  all.push(...batch.filter(p=>p.status!=='draft'));
  break;
 }
 return combineFormats(all).map(group=>{
  const categories=(group.primary as PublicWooProduct).categories||[];
  const normalized=categories.map(c=>(c.slug+' '+c.name).toLowerCase());
  const category=normalized.some(c=>c.includes('famille'))?'famille':normalized.some(c=>c.includes('entrepreneuse'))?'entrepreneuses':normalized.some(c=>c.includes('papeterie'))?'papeterie':'autre';
  return {...group,category};
 }).filter(group=>group.category==='famille'||group.category==='entrepreneuses');
}
export const wooImage=(p:ShopProduct)=>p.images?.[0]?.src||'';
export function wooPrice(p:ShopProduct){const extra=p as PublicWooProduct;const value=extra.prices?Number(extra.prices.price)/Math.pow(10,extra.prices.currency_minor_unit):Number(p.price);return Number.isFinite(value)?new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(value):'';}
