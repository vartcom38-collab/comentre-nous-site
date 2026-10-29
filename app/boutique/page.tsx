import {LayoutShell,PageIntro} from '@/components/Site';
import WooCards from '@/components/WooCards';
export default function ShopPage(){
 return <LayoutShell><main><PageIntro kicker="Tous les produits" title="La boutique" text="Découvrez nos créations Com’ en famille et Com’ des entrepreneuses."/><WooCards/></main></LayoutShell>;
}
