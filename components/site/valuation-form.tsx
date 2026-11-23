'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ValuationCTA } from '@/components/site/valuation-cta';
import type { Office } from '@/data/site-content';

type Values = { name: string; email: string; telephone: string; address: string; lookingTo: 'Sell' | 'Let'; message: string; consent: boolean; website: string };
const blank: Values = { name: '', email: '', telephone: '', address: '', lookingTo: 'Sell', message: '', consent: false, website: '' };
function validate(values: Values): Partial<Record<keyof Values, string>> {
  const errors: Partial<Record<keyof Values, string>> = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.telephone.replace(/\D/g, '').length < 7) errors.telephone = 'Enter a valid telephone number.';
  if (values.address.trim().length < 3) errors.address = 'Enter the property address.';
  if (!values.consent) errors.consent = 'Please confirm that you have read the privacy policy.';
  return errors;
}

export function ValuationForm({ initial = {}, offices }: { initial?: Partial<Values>; offices: Office[] }) {
  const [values, setValues] = useState<Values>(() => ({ ...blank, ...initial }));
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [submitted, setSubmitted] = useState(false); const [status, setStatus] = useState<'form' | 'sending' | 'success' | 'error'>('form');
  const [serverError, setServerError] = useState(''); const errors = validate(values);
  function update<K extends keyof Values>(key: K, value: Values[K]) { setValues((old) => ({ ...old, [key]: value })); setServerError(''); }
  function fieldError(key: keyof Values) { return (touched[key] || submitted) ? errors[key] : undefined; }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true); setTouched({ name: true, email: true, telephone: true, address: true, consent: true });
    if (Object.keys(errors).length) { const first = Object.keys(errors)[0]; document.getElementById(first === 'consent' ? 'valuation-consent' : `valuation-${first}`)?.focus(); return; }
    setStatus('sending'); setServerError('');
    try {
      const response = await fetch('/api/valuation', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(values) });
      if (!response.ok) throw new Error((await response.json()).error || 'We could not send your request.');
      setStatus('success');
    } catch (error) { setServerError(error instanceof Error ? error.message : 'We could not send your request.'); setStatus('error'); }
  }
  if (status === 'success') return <div className="valuation-result" role="status" aria-live="polite"><span className="eyebrow">Request received</span><h2>Thank you</h2><p>Your valuation request has been received. One of our team will be in touch.</p><a className="valuation-success-phone" href="tel:+35314595941">Call 01 459 5941</a><div className="valuation-success-offices">{offices.map((office) => <p key={office.name}><strong>{office.name}</strong><br/>{office.address}</p>)}</div><Link className="button button-dark" href="/">Back to homepage <span>↗</span></Link></div>;
  if (status === 'error') return <div className="valuation-result valuation-result--error" role="alert"><span className="eyebrow">Unable to send</span><h2>Your request hasn’t gone through.</h2><p>{serverError || 'Please try again or contact our team.'}</p><div className="valuation-result-actions"><button className="button button-dark" onClick={() => setStatus('form')}>Try again</button><Link href="/contact">Contact our team</Link></div></div>;
  return <form className="valuation-request-form" onSubmit={submit} noValidate>
    {submitted && Object.keys(errors).length > 0 && <p className="valuation-error-summary" role="alert" aria-live="assertive">Please complete the required fields.</p>}
    <fieldset className="valuation-field valuation-field--full valuation-toggle"><legend>I&apos;m looking to</legend><div role="group" aria-label="I’m looking to"><button type="button" aria-pressed={values.lookingTo === 'Sell'} onClick={() => update('lookingTo', 'Sell')}>Sell</button><button type="button" aria-pressed={values.lookingTo === 'Let'} onClick={() => update('lookingTo', 'Let')}>Let</button></div></fieldset>
    <div className="valuation-field valuation-field--full"><label htmlFor="valuation-address">Property address <b>*</b></label><input id="valuation-address" name="address" autoComplete="street-address" value={values.address} aria-invalid={Boolean(fieldError('address'))} aria-describedby={fieldError('address') ? 'valuation-address-error' : undefined} onChange={(e) => update('address', e.target.value)} onBlur={() => setTouched((old) => ({ ...old, address: true }))} />{fieldError('address') && <small id="valuation-address-error" className="valuation-inline-error" aria-live="polite">{fieldError('address')}</small>}</div>
    <div className="valuation-field"><label htmlFor="valuation-name">Full name <b>*</b></label><input id="valuation-name" name="name" autoComplete="name" value={values.name} aria-invalid={Boolean(fieldError('name'))} aria-describedby={fieldError('name') ? 'valuation-name-error' : undefined} onChange={(e) => update('name', e.target.value)} onBlur={() => setTouched((old) => ({ ...old, name: true }))} />{fieldError('name') && <small id="valuation-name-error" className="valuation-inline-error" aria-live="polite">{fieldError('name')}</small>}</div>
    <div className="valuation-field"><label htmlFor="valuation-telephone">Phone <b>*</b></label><input id="valuation-telephone" name="telephone" type="tel" autoComplete="tel" value={values.telephone} aria-invalid={Boolean(fieldError('telephone'))} aria-describedby={fieldError('telephone') ? 'valuation-telephone-error' : undefined} onChange={(e) => update('telephone', e.target.value)} onBlur={() => setTouched((old) => ({ ...old, telephone: true }))} />{fieldError('telephone') && <small id="valuation-telephone-error" className="valuation-inline-error" aria-live="polite">{fieldError('telephone')}</small>}</div>
    <div className="valuation-field valuation-field--full"><label htmlFor="valuation-email">Email <b>*</b></label><input id="valuation-email" name="email" type="email" autoComplete="email" value={values.email} aria-invalid={Boolean(fieldError('email'))} aria-describedby={fieldError('email') ? 'valuation-email-error' : undefined} onChange={(e) => update('email', e.target.value)} onBlur={() => setTouched((old) => ({ ...old, email: true }))} />{fieldError('email') && <small id="valuation-email-error" className="valuation-inline-error" aria-live="polite">{fieldError('email')}</small>}</div>
    <div className="valuation-field valuation-field--full"><label htmlFor="valuation-message">Message <span>(optional)</span></label><textarea id="valuation-message" name="message" rows={2} value={values.message} onChange={(e) => update('message', e.target.value)} /></div>
    <div className="valuation-honeypot" aria-hidden="true"><label htmlFor="valuation-website">Website</label><input id="valuation-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update('website', e.target.value)} /></div>
    <div className="valuation-consent valuation-field--full"><label><input id="valuation-consent" type="checkbox" checked={values.consent} aria-invalid={Boolean(fieldError('consent'))} aria-describedby={fieldError('consent') ? 'valuation-consent-error' : undefined} onChange={(e) => update('consent', e.target.checked)} onBlur={() => setTouched((old) => ({ ...old, consent: true }))} /><span>I have read and understood the <Link href="/privacy-policy">privacy policy</Link> <b>*</b></span></label>{fieldError('consent') && <small id="valuation-consent-error" className="valuation-inline-error" aria-live="polite">{fieldError('consent')}</small>}</div>
    <button className="valuation-submit valuation-field--full" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Request my valuation'} <span>↗</span></button>
    <p className="valuation-privacy-note valuation-field--full">Your details are used only to arrange the valuation and are not shared or sold.</p>
  </form>;
}
