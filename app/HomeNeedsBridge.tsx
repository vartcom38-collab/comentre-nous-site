'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import siteSections from '../content/site-sections.json';

const icons=['♡','✦','☀','✎','↗','☁'];

export default function HomeNeedsBridge(){
  const pathname=usePathname();

  useEffect(()=>{
    if(pathname!=='/')return;
    if(document.getElementById('home-needs-section'))return;
    const univers=document.querySelector<HTMLElement>('.univers');
    const products=document.querySelector<HTMLElement>('.products');
    if(!univers||!products)return;

    const section=document.createElement('section');
    section.id='home-needs-section';
    section.className='home-needs';
    section.setAttribute('aria-labelledby','home-needs-title');

    const intro=document.createElement('div');
    intro.className='home-needs-intro';
    intro.innerHTML=`<p>${siteSections.needs.eyebrow}</p><h2 id="home-needs-title">${siteSections.needs.title}</h2><span>Choisis juste la phrase qui te ressemble le plus aujourd’hui.</span>`;

    const grid=document.createElement('div');
    grid.className='home-needs-grid';
    siteSections.needs.items.forEach((item,index)=>{
      const a=document.createElement('a');
      a.href=item.href||'/par-ou-commencer';
      a.className=`home-need-card need-${index+1}`;
      a.innerHTML=`<span class="home-need-icon">${icons[index%icons.length]}</span><strong>${item.label}</strong><span class="home-need-arrow">→</span>`;
      grid.appendChild(a);
    });

    const footer=document.createElement('div');
    footer.className='home-needs-footer';
    footer.innerHTML='<span>Tu hésites encore ?</span><a href="/par-ou-commencer">On t’aide à choisir →</a>';

    section.append(intro,grid,footer);
    products.parentNode?.insertBefore(section,products);

    if(!document.getElementById('home-needs-style')){
      const style=document.createElement('style');
      style.id='home-needs-style';
      style.textContent=`
        .home-page .home-needs{width:min(1420px,calc(100% - 2rem));margin:clamp(2rem,5vw,5.5rem) auto;padding:clamp(1.4rem,3.6vw,3.2rem);border-radius:clamp(1.8rem,3vw,3rem);background:linear-gradient(135deg,#fff4ef 0%,#fffdf8 42%,#effaf7 100%);box-shadow:0 24px 70px rgba(48,30,18,.08);position:relative;overflow:hidden}
        .home-page .home-needs:before,.home-page .home-needs:after{content:'';position:absolute;border-radius:999px;pointer-events:none;opacity:.45}.home-page .home-needs:before{width:180px;height:180px;background:#ffd768;right:-70px;top:-65px}.home-page .home-needs:after{width:135px;height:135px;background:#ead4ff;left:-55px;bottom:-55px}
        .home-page .home-needs-intro{position:relative;z-index:1;text-align:center;max-width:900px;margin:0 auto 1.8rem}.home-page .home-needs-intro>p{margin:0 0 .55rem;text-transform:uppercase;letter-spacing:.12em;font-size:.72rem;font-weight:900;color:#ff565f}.home-page .home-needs-intro h2{margin:0;font:700 clamp(2.7rem,5vw,4.8rem)/.96 var(--hand);letter-spacing:-.03em}.home-page .home-needs-intro>span{display:block;margin-top:.8rem;color:#5c5760;font-size:.95rem}
        .home-page .home-needs-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.home-page .home-need-card{min-height:118px;border-radius:1.45rem;padding:1rem 1.05rem;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.8rem;background:rgba(255,255,255,.86);border:1px solid rgba(13,20,36,.06);box-shadow:0 10px 28px rgba(48,30,18,.06);transition:transform .18s ease,box-shadow .18s ease}.home-page .home-need-card:hover{transform:translateY(-4px) rotate(-.25deg);box-shadow:0 18px 36px rgba(48,30,18,.1)}.home-page .home-need-card:nth-child(2n){transform:rotate(.35deg)}.home-page .home-need-card:nth-child(2n):hover{transform:translateY(-4px) rotate(.15deg)}
        .home-page .home-need-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:999px;background:#ffe5e2;font:700 1.6rem/1 var(--hand)}.home-page .home-need-card:nth-child(2) .home-need-icon,.home-page .home-need-card:nth-child(5) .home-need-icon{background:#d7f5ef}.home-page .home-need-card:nth-child(3) .home-need-icon,.home-page .home-need-card:nth-child(6) .home-need-icon{background:#ead4ff}.home-page .home-need-card strong{font-size:clamp(.88rem,1.1vw,1.03rem);line-height:1.35}.home-page .home-need-arrow{font:700 1.45rem/1 var(--hand)}
        .home-page .home-needs-footer{position:relative;z-index:1;display:flex;justify-content:center;align-items:center;gap:.7rem;margin-top:1.2rem;font-size:.84rem}.home-page .home-needs-footer a{font-weight:900;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}
        @media(max-width:900px){.home-page .home-needs-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.home-page .home-needs{width:min(100% - 1rem,1420px);padding:1.2rem}.home-page .home-needs-grid{grid-template-columns:1fr}.home-page .home-needs-footer{flex-direction:column;text-align:center}.home-page .home-need-card{min-height:96px}}
      `;
      document.head.appendChild(style);
    }
  },[pathname]);

  return null;
}
