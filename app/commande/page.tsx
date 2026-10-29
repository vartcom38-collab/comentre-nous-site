'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {LayoutShell} from '@/components/Site';
export default function CheckoutPage(){
 const [id,setId]=useState(0),[email,setEmail]=useState(''),[first,setFirst]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{const parsed=Number(new URLSearchParams(window.location.search).get('id'));if(Number.isSafeInteger(parsed)&&parsed>0)setId(parsed);},[]);
 async function checkout(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(!id||busy)return;setBusy(true);setError('');
  try{const response=await fetch('/comentre-checkout.php?action=start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:id,email,first_name:first})});
   const json=await response.json();if(!response.ok||!json.ok||!/^https:\/\/checkout\.stripe\.com\//.test(String(json.url||'')))throw Error(json.error||'Le paiement est momentanément indisponible.');
   window.location.assign(json.url);
  }catch(e){setError(e instanceof Error?e.message:'Le paiement est momentanément indisponible.');setBusy(false);}
 }
 return <LayoutShell><main style={{maxWidth:720,margin:'4rem auto',padding:'0 20px 5rem'}}>
 <p style={{letterSpacing:2,fontWeight:800,fontSize:12}}>COM’ ENTRE NOUS</p><h1>Finaliser mon achat</h1>
 <p>Ton paiement sécurisé s’effectuera sur Stripe. Tu restes dans l’univers Com’ entre nous et ne passeras pas par la boutique Com’ des Murmures.</p>
 {!id?<p>Produit non sélectionné. <Link href="/boutique/">Retour à la boutique</Link></p>:
 <form onSubmit={checkout} style={{display:'grid',gap:16,maxWidth:520}}>
 <label style={{display:'grid',gap:6}}>Prénom<input autoComplete="given-name" value={first} onChange={e=>setFirst(e.target.value)} maxLength={80} style={{padding:14,border:'1px solid #ddd',borderRadius:12}}/></label>
 <label style={{display:'grid',gap:6}}>Adresse e-mail pour recevoir ton accès<input autoComplete="email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:14,border:'1px solid #ddd',borderRadius:12}}/></label>
 <button disabled={busy} style={{border:0,cursor:'pointer',padding:16,borderRadius:25,background:'#11182a',color:'white'}}>{busy?'Préparation du paiement…':'Payer avec Stripe'}</button>
 {error&&<p role="alert" style={{color:'#a32620'}}>{error}</p>}
 </form>}
 <p><Link href="/boutique/">← Retour à la boutique</Link></p>
 </main></LayoutShell>;
}
