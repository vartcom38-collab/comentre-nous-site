'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function HomeFoundersBridge(){
  const pathname=usePathname();

  useEffect(()=>{
    if(pathname!=='/') return;
    if(document.getElementById('home-founders-block')) return;
    const podcast=document.querySelector<HTMLElement>('.podcast');
    if(!podcast?.parentElement) return;

    const section=document.createElement('section');
    section.id='home-founders-block';
    section.className='home-founders-block';
    section.innerHTML=`
      <div class="home-founders-note">
        <span class="home-founders-doodle">♡</span>
        <p class="home-founders-kicker">Derrière Com’ entre nous</p>
        <h2>Nous, c’est Marion & Aurélie.</h2>
        <p class="home-founders-text">Deux femmes, deux quotidiens bien remplis, beaucoup d’idées et une envie commune : créer des outils qui servent vraiment dans la vraie vie.</p>
        <a class="home-founders-link" href="/a-propos">Faire connaissance avec nous →</a>
      </div>
      <div class="home-founders-side">
        <img class="home-founders-photo" alt="Marion et Aurélie, fondatrices de Com’ entre nous" />
        <span class="home-founders-star" aria-hidden="true">✦</span>
      </div>
    `;
    podcast.parentElement.insertBefore(section,podcast);

    const photo=section.querySelector<HTMLImageElement>('.home-founders-photo');
    if(photo){
      fetch('/uploads/marion-aurelie-home-data.txt',{cache:'no-store'})
        .then(response=>{
          if(!response.ok) throw new Error(`Photo data ${response.status}`);
          return response.text();
        })
        .then(data=>{photo.src=`data:image/jpeg;base64,${data.trim()}`;})
        .catch(()=>{photo.style.display='none';});
    }

    if(!document.getElementById('home-founders-style')){
      const style=document.createElement('style');
      style.id='home-founders-style';
      style.textContent=`
        .home-page .home-founders-block{width:min(1380px,calc(100% - 2rem));margin:clamp(2.8rem,6vw,6rem) auto;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:clamp(1.2rem,4vw,4rem);align-items:stretch;padding:clamp(1.5rem,3.4vw,3.6rem);border-radius:2.7rem;background:linear-gradient(135deg,#fff7ef 0%,#ffe5e2 48%,#e3f6f1 100%);box-shadow:0 24px 70px rgba(48,30,18,.08);position:relative;overflow:hidden}
        .home-page .home-founders-block:before{content:'';position:absolute;width:12rem;height:12rem;border-radius:50%;right:-4rem;bottom:-4rem;background:rgba(255,215,104,.38)}
        .home-page .home-founders-note{position:relative;z-index:2;align-self:center;max-width:780px}
        .home-page .home-founders-doodle{display:inline-block;font:700 2.4rem/1 var(--hand);transform:rotate(-10deg);margin-bottom:.4rem}
        .home-page .home-founders-kicker{margin:0 0 .7rem;font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.12em}
        .home-page .home-founders-note h2{margin:0;font:700 clamp(3rem,5vw,5.5rem)/.9 var(--hand);letter-spacing:-.04em}
        .home-page .home-founders-text{max-width:680px;margin:1.2rem 0 1.6rem;color:#343846;font-size:clamp(.96rem,1.1vw,1.08rem);line-height:1.75}
        .home-page .home-founders-link{display:inline-flex;align-items:center;min-height:3rem;padding:.82rem 1.18rem;border:2px solid var(--ink);border-radius:999px;background:rgba(255,255,255,.72);font-weight:800;transition:transform .18s ease,background .18s ease}
        .home-page .home-founders-link:hover{transform:translateY(-2px);background:#fff}
        .home-page .home-founders-side{position:relative;min-height:330px;border-radius:2rem;overflow:hidden;background:#fff;box-shadow:0 18px 45px rgba(48,30,18,.12);transform:rotate(.45deg)}
        .home-page .home-founders-photo{display:block;width:100%;height:100%;min-height:330px;object-fit:cover;object-position:center;transition:transform .35s ease}
        .home-page .home-founders-block:hover .home-founders-photo{transform:scale(1.018)}
        .home-page .home-founders-star{position:absolute;right:1.1rem;top:.9rem;display:grid;place-items:center;width:2.7rem;height:2.7rem;border-radius:999px;background:rgba(255,255,255,.88);font-size:1.55rem;box-shadow:0 8px 24px rgba(48,30,18,.12);transform:rotate(10deg)}
        @media(max-width:820px){.home-page .home-founders-block{grid-template-columns:1fr}.home-page .home-founders-side{min-height:0;aspect-ratio:4/3}.home-page .home-founders-photo{min-height:0;aspect-ratio:4/3}.home-page .home-founders-note h2{font-size:3.5rem}}
      `;
      document.head.appendChild(style);
    }
  },[pathname]);

  return null;
}
