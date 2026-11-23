'use client';
import { useState } from 'react';
import { ArrowIcon } from '@/components/site/arrow-icon';
import { ValuationCTA } from '@/components/site/valuation-cta';
import { copy } from '@/data/copy';

export function EmptyAlert({interest='property'}:{interest?:string}){
  const [status,setStatus]=useState<'idle'|'pending'|'success'|'error'>('idle');const [error,setError]=useState('');
  async function submit(form:FormData){setStatus('pending');setError('');try{const response=await fetch('/api/enquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Property alert request',email:form.get('email'),phone:'',enquiry_type:'Property alert',message:`Please contact me about ${interest} listings when available.`})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Could not send your request.');setStatus('success')}catch(e){setError(e instanceof Error?e.message:'Could not send your request.');setStatus('error')}}
  if(status==='success')return <div className="empty-alert-success" role="status">{copy.empty.success} <ValuationCTA location="property-alert-thank-you" type="sell">Request a valuation</ValuationCTA></div>;
  return <><form className="empty-alert" action={submit}><div><strong>{copy.empty.title}</strong><span>{copy.empty.description}</span></div><label>{copy.empty.emailLabel}<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label><button className="text-link" disabled={status==='pending'}>{status==='pending'?copy.empty.pending:copy.empty.submit} <ArrowIcon/></button>{error&&<p role="alert" className="form-error">{error}</p>}</form><div className="empty-inline-valuation"><ValuationCTA location={`empty-${interest}`} type={interest.includes('letting')?'let':'sell'}>Request a valuation</ValuationCTA></div></>;
}
