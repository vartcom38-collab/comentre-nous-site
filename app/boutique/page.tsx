import { LayoutShell, PageIntro } from '@/components/Site';
import {wooCatalog} from '@/src/lib/woo-public';
import WooCards from '@/components/WooCards';
export const dynamic='force-dynamic';
export default async function ShopPage(){
 let groups;try{groups=await wooCatalog()}catch(error){console.error('WooCommerce catalog',error);return <LayoutShell><main><PageIntro title="La boutique" text="La boutique est momentanément indisponible. Aucun achat ne sera proposé tant que le catalogue ne répond pas."/></main></LayoutShell>}
 return <LayoutShell><main><PageIntro kicker="Tous les produits" title="La boutique" text="Découvrez nos créations Com’ en famille et Com’ des entrepreneuses."/><WooCards groups={groups}/></main></LayoutShell>;
}