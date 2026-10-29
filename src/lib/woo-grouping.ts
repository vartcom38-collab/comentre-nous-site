export type ShopProduct = { id:number; name:string; slug:string; sku:string; type:string; price:string; permalink:string; product_url?:string; images:{src:string}[]; downloadable?:boolean; status:string };
export type ShopGroup = { key:string; primary:ShopProduct; ebook?:ShopProduct; amazon?:ShopProduct };
export function combineFormats(items:ShopProduct[]):ShopGroup[]{
 const grouped=new Map<string,ShopGroup>();
 for(const item of items){
  const matched=(item.sku||'').toLowerCase().match(/^([a-z0-9_-]+)-(ebook|amazon)$/);
  const key=matched?matched[1]:'product-'+item.id;
  if(!grouped.has(key))grouped.set(key,{key,primary:item});
  const group=grouped.get(key)!;
  if(item.type==='external'||matched?.[2]==='amazon')group.amazon=item;
  else if(item.downloadable||matched?.[2]==='ebook'){group.ebook=item;group.primary=item;}
 }
 return [...grouped.values()];
}
