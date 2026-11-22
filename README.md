# City Properties platform

Next.js App Router, TypeScript and Supabase implementation for City Properties, Dublin.

## Local setup

1. Use Node.js 20.9 or newer.
2. Install packages with npm install.
3. Create a Supabase project and run both SQL files in supabase/migrations, in filename order, in the Supabase SQL Editor. For a preview environment, also run supabase/seed_demo.sql.
4. Copy .env.example to .env.local and set the project URL and publishable key.
5. Turn off public user sign-ups in Supabase Auth. Create administrator accounts manually in Supabase Auth, then add each Auth user UUID to public.admin_users using the SQL Editor.
6. Add https://YOUR_DOMAIN/auth/confirm and http://localhost:3000/auth/confirm to Supabase Auth's redirect URL allowlist for password recovery. Configure Supabase Auth email delivery for recovery messages.
7. Run npm run dev. The app is available at http://localhost:3000.

The migration creates the private property-images Storage bucket and applies row-level security. Property images are available to the public only while their associated listing is published. Exact addresses and coordinates are held separately and returned publicly only when an administrator enables the exact-location option.

## Demo fixtures

supabase/seed_demo.sql contains fictional preview fixtures: six residential properties, four rentals, three commercial listings and two new-home developments. Every title and property record is marked DEMO / SAMPLE and has demo_data = true. They are published only so the preview catalogue can be explored; the public site displays the demo label on each listing. Run this seed only in a non-production project, and never treat these records as actual City Properties inventory.

## Data flow

- Public catalogues and detail pages read published records from Supabase.
- Contact and viewing forms validate and insert enquiries into public.enquiries. Valuation requests are sent to info@cityproperties.ie through Resend.
- Administrator sessions are verified through Supabase Auth and the public.admin_users allowlist. Table and Storage writes are separately protected by RLS.
- Admin listing forms write properties and features. The image manager compresses photos in-browser to WebP, stores them in Supabase Storage, and manages cover/order metadata.
- No service-role credential is used in the browser. The publishable key is the only Supabase key required by the app.

Set NEXT_PUBLIC_SITE_URL in production to the canonical site origin. Email notifications are not configured; enquiries are stored in Supabase and visible in /admin/inquiries.

## Routes

- Public: /, /residential, /commercial, /lettings, /new-homes, /contact
- Property details: /residential/[slug], /commercial/[slug], /lettings/[slug]
- Development details: /new-homes/[slug]
- Admin: /admin/login, /admin/dashboard, /admin/properties, /admin/developments, /admin/inquiries, /admin/settings


## Content updates

The reusable page-header images and focal points live in `data/page-headers.ts`. Change a page entry's `image`, `imageAlt` or `focalPoint` to swap its header photo. Keep header exports at least 2000 pixels wide and below 250 KB; the component applies responsive sizing and prioritizes the page's LCP image.

Published editorial content is managed in `data/site-content.ts`. A section appears only when it is marked `published: true`, has at least one complete item, and all item values pass the placeholder check. Testimonials additionally require `approved: true`; team portraits must be client-provided files in `/public/images/team/`.

Example approved testimonial:

```ts
 testimonials: { published: true, items: [
   { quote: 'The team kept us informed throughout the sale.', clientName: 'Client name approved for publication', area: 'Dublin 2', date: '2026-01', approved: true },
 ] },
```

Example press item:

```ts
 press: { published: true, items: [
   { title: 'Verified article headline', source: 'Publication name', url: 'https://publication.example/article', date: '2026-01-15' },
 ] },
```

Example team member (add an approved portrait to `/public/images/team/` first):

```ts
 team: { published: true, items: [
   { name: 'Approved staff name', role: 'Property consultant', photo: '/images/team/approved-staff-name.webp', bio: 'Approved staff biography.' },
 ] },
```

Keep the matching `siteContent` section shape, and only set `published: true` after the content and any consent/approval have been confirmed. Invalid or unfinished content is hidden; development builds log a warning. Stock or generated faces are not permitted for team or testimonial portraits.

### Valuation email delivery

The valuation form sends through Resend to `info@cityproperties.ie`. Configure `RESEND_API_KEY` and a verified sender in `RESEND_FROM_EMAIL` in the deployment environment. If these are absent, the form displays a retry/call message rather than claiming delivery. The email includes the `/valuation` URL and ISO submission timestamp.
