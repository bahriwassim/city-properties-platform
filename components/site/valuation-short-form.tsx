'use client';

import { FormEvent } from 'react';
import { ArrowIcon } from '@/components/site/arrow-icon';

export function ValuationShortForm() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const values = new FormData(event.currentTarget); const query = new URLSearchParams();
    for (const key of ['name', 'email', 'phone', 'type']) { const value = values.get(key); if (typeof value === 'string' && value.trim()) query.set(key, value.trim()); }
    window.location.assign(`/valuation?${query.toString()}`);
  }
  return <form className="valuation-short-form" onSubmit={submit}>
    <label>Name<input name="name" autoComplete="name" required/></label><label>Email<input name="email" type="email" autoComplete="email" required/></label>
    <label>Phone<input name="phone" type="tel" autoComplete="tel" required/></label><label>I&apos;m looking to<select name="type" defaultValue="sell"><option value="sell">Sell</option><option value="let">Let</option></select></label>
    <button type="submit" data-cta="homepage-valuation-short-form">Request my valuation <ArrowIcon/></button>
  </form>;
}
