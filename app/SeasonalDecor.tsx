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
type Crop={x:number;y:number;w:number;h:number};

const intensityRank:Record<Intensity,number>={light:1,normal:2,festive:3};
const HALLOWEEN_SPRITE='/seasonal/halloween/sprite.png';
const SPRITE_W=1536;
const SPRITE_H=1024;

// Crops from the validated Halloween master sheet.
const halloweenCrops:Record<string,Crop>={
  'character-01.webp':{x:15,y:11,w:285,h:323},
  'character-02.webp':{x:299,y:24,w:237,h:304},
  'character-duo-01.webp':{x:536,y:31,w:448,h:321},
  'character-mug-01.webp':{x:361,y:839,w:134,h:161},
  'guardian-01.webp':{x:1264,y:52,w:239,h:304},
  'guardian-02.webp':{x:1264,y:52,w:239,h:304},
  'guardian-mug-01.webp':{x:1264,y:52,w:239,h:304},
  'bat-01.webp':{x:825,y:368,w:259,h:119},
  'cat-01.webp':{x:542,y:360,w:161,h:221},
  'cat-books-01.webp':{x:1081,y:368,w:230,h:187},
  'books-01.webp':{x:1081,y:368,w:230,h:187},
  'moon-01.webp':{x:1094,y:566,w:122,h:137},
  'star-cluster-01.webp':{x:1258,y:568,w:71,h:71},
  'pumpkin-cluster-01.webp':{x:351,y:557,w:173,h:173},
  'leaf-cluster-01.webp':{x:30,y:620,w:93,h:128},
  'corner-leaves-stars-01.webp':{x:250,y:713,w:109,h:131},
  'lantern-01.webp':{x:30,y:815,w:99,h:177},
  'mug-01.webp':{x:361,y:839,w:134,h:161},
  'candles-01.webp':{x:131,y:838,w:216,h:171},
  'mushrooms-01.webp':{x:1272,y:660,w:159,h:175},
  'scene-books-mug-01.webp':{x:1081,y:368,w:230,h:187},
  'acorn-01.webp':{x:1038,y:710,w:116,h:125}
};

function normalizePath(pathname:string){
  if(!pathname||pathname==='/')return '/';
  return pathname.replace(/\/$/,'');
}

function HalloweenPiece({item,pathname}:{item:Placement;pathname:string}){
  const crop=halloweenCrops[item.asset];
  if(!crop)return null;
  return <svg
    key={`${pathname}-${item.slot}`}
    className={`seasonal-piece seasonal-size-${item.size}${item.hideMobile?' seasonal-hide-mobile':''}`}
    data-seasonal-slot={item.slot}
    viewBox={`0 0 ${crop.w} ${crop.h}`}
    preserveAspectRatio="xMidYMid meet"
    style={{left:item.x,top:item.y,transform:`translate(-50%,-50%) rotate(${item.rotate||0}deg)`}}
  >
    <image href={HALLOWEEN_SPRITE} x={-crop.x} y={-crop.y} width={SPRITE_W} height={SPRITE_H}/>
  </svg>;
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

  return (
    <div className={`seasonal-layer seasonal-${seasonal.theme} seasonal-${intensity}`} data-seasonal-theme={seasonal.theme} aria-hidden="true">
      {seasonal.theme==='halloween' ? visible.map(item=><HalloweenPiece key={`${pathname}-${item.slot}`} item={item} pathname={pathname}/>) : null}
    </div>
  );
}
