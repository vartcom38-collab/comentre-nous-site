'use client';

import { usePathname } from 'next/navigation';
import seasonal from '../content/seasonal.json';
import { familyCardAurelie } from './familyCardAurelie';

export default function SeasonalDecor(){
  const pathname=usePathname();
  if(pathname?.startsWith('/admin')) return null;
  if(!seasonal.enabled || seasonal.theme==='none') return null;
  const intensity=seasonal.intensity||'light';
  return <div className={`seasonal-layer seasonal-${seasonal.theme} seasonal-${intensity}`} aria-hidden="true">
    <img className="seasonal-piece seasonal-piece-a" src={familyCardAurelie} alt="" />
    <img className="seasonal-piece seasonal-piece-b" src={familyCardAurelie} alt="" />
    {intensity==='festive'&&<img className="seasonal-piece seasonal-piece-c" src={familyCardAurelie} alt="" />}
  </div>
}
