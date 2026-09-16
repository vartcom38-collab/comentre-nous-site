'use client';

import { usePathname } from 'next/navigation';
import seasonal from '../content/seasonal.json';
import layouts from '../content/seasonal-layouts.json';

type Intensity='light'|'normal'|'festive';
type Placement={
  slot:string;
  asset:string;
  size:'xs'|'s'|'m'|'l'|'xl';
  x:string;
  y:string;
  rotate?:number;
  hideMobile?:boolean;
  minIntensity?:Intensity;
};

const intensityRank:Record<Intensity,number>={light:1,normal:2,festive:3};

function normalizePath(pathname:string){
  if(!pathname||pathname==='/')return '/';
  return pathname.replace(/\/$/,'');
}

export default function SeasonalDecor(){
  const pathname=normalizePath(usePathname()||'/');
  if(pathname.startsWith('/admin')) return null;
  if(!seasonal.enabled || seasonal.theme==='none') return null;

  const intensity=((seasonal.intensity||'light') as Intensity);
  const themeConfig=(layouts as any)[seasonal.theme];
  if(!themeConfig) return null;
  const placements=(themeConfig.pages?.[pathname]||[]) as Placement[];
  if(!placements.length) return null;

  const visible=placements.filter(item=>intensityRank[intensity]>=intensityRank[item.minIntensity||'light']);
  const base=themeConfig.assetsBase||`/seasonal/${seasonal.theme}`;

  return (
    <div className={`seasonal-layer seasonal-${seasonal.theme} seasonal-${intensity}`} data-seasonal-theme={seasonal.theme} aria-hidden="true">
      {visible.map((item)=>(
        <img
          key={`${pathname}-${item.slot}`}
          className={`seasonal-piece seasonal-size-${item.size}${item.hideMobile?' seasonal-hide-mobile':''}`}
          data-seasonal-slot={item.slot}
          src={`${base}/${item.asset}`}
          alt=""
          style={{left:item.x,top:item.y,transform:`translate(-50%,-50%) rotate(${item.rotate||0}deg)`}}
          onError={(event)=>{event.currentTarget.style.display='none'}}
        />
      ))}
    </div>
  );
}
