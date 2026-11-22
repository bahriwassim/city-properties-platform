-- Demo listings are deliberately public only when marked as samples and published.
-- This makes the seeded catalogue usable on preview deployments without implying
-- that the properties are genuine City Properties stock.
drop policy if exists "Public reads published properties" on public.properties;
create policy "Public reads published properties" on public.properties
  for select to anon, authenticated
  using (published and status not in ('draft', 'off_market'));

drop policy if exists "Public reads features for published properties" on public.property_features;
create policy "Public reads features for published properties" on public.property_features
  for select to anon, authenticated
  using (exists (
    select 1 from public.properties p
    where p.id = property_id and p.published and p.status not in ('draft', 'off_market')
  ));

drop policy if exists "Public reads images for published properties" on public.property_images;
create policy "Public reads images for published properties" on public.property_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.properties p
    where p.id = property_id and p.published and p.status not in ('draft', 'off_market')
  ));

drop policy if exists "Public reads published developments" on public.developments;
create policy "Public reads published developments" on public.developments
  for select to anon, authenticated using (published);

-- Deliberately do not expose exact residential locations for sample records.
create or replace function public.public_property_location(property_uuid uuid)
returns table(address text,eircode text,latitude numeric,longitude numeric,exact_location_public boolean)
language sql stable security definer set search_path = '' as $$
  select l.address,l.eircode,l.latitude,l.longitude,l.exact_location_public
  from public.property_private_locations l
  join public.properties p on p.id = l.property_id
  where p.id = property_uuid and p.published and not p.demo_data
    and p.status not in ('draft','off_market') and l.exact_location_public;
$$;
