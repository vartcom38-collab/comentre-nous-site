'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import siteSections from '../content/site-sections.json';

export default function HomeUniverseBridge(){
  const pathname=usePathname();
  useEffect(()=>{
    if(pathname!=='/')return;
    const section=document.querySelector<HTMLElement>('.univers');
    if(!section)return;
    const eyebrow=section.querySelector<HTMLElement>('.universe-title p');
    const title=section.querySelector<HTMLElement>('.universe-title h2');
    if(eyebrow)eyebrow.textContent=siteSections.universeSection.eyebrow;
    if(title)title.textContent=siteSections.universeSection.title;
    const cards=Array.from(section.querySelectorAll<HTMLAnchorElement>('.universe-card'));
    siteSections.universes.forEach((item,index)=>{
      const card=cards[index];if(!card)return;
      card.href=item.href;
      const kicker=card.querySelector<HTMLElement>('.card-kicker');
      const heading=card.querySelector<HTMLElement>('h3');
      const text=card.querySelector<HTMLElement>('.card-text');
      const button=card.querySelector<HTMLElement>('.card-button');
      const icon=card.querySelector<HTMLElement>('.floating-heart');
      if(kicker)kicker.textContent=item.tag;
      if(heading)heading.textContent=item.title;
      if(text)text.textContent=item.text;
      if(button)button.innerHTML=`${item.buttonLabel||'Découvrir'} <b>→</b>`;
      if(icon)icon.textContent=item.icon||'♡';
    });
  },[pathname]);
  return null;
}
