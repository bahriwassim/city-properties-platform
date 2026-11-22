create extension if not exists pgcrypto;

create type public.property_type as enum ('house','apartment','duplex','penthouse','office','retail','industrial','investment','development','other');
create type public.listing_type as enum ('sale','rent','commercial');
create type public.property_status as enum ('draft','available','under_offer','sale_agreed','let','sold','off_market');
create type public.enquiry_status as enum ('new','contacted','closed');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_city_properties_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_city_properties_admin() from public;
grant execute on function public.is_city_properties_admin() to authenticated;
grant execute on function public.is_city_properties_admin() to anon;

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  property_type public.property_type not null default 'other',
  listing_type public.listing_type not null,
  status public.property_status not null default 'draft',
  price numeric(14,2),
  price_label text,
  address text,
  city text,
  county text,
  eircode text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  bedrooms integer check (bedrooms is null or bedrooms >= 0),
  bathrooms integer check (bathrooms is null or bathrooms >= 0),
  floor_area numeric(10,2),
  floor_area_unit text not null default 'sq m',
  property_reference text unique,
  ber_rating text,
  parking text,
  available_from date,
  featured boolean not null default false,
  new_home boolean not null default false,
  demo_data boolean not null default false,
  published boolean not null default false,
  exact_location_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Admin-only location relation is the source of truth for exact address data.
create table public.property_private_locations (
  property_id uuid primary key references public.properties(id) on delete cascade,
  address text,
  eircode text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  exact_location_public boolean not null default false,
  updated_at timestamptz not null default now()
);
create index properties_public_listing_idx on public.properties(listing_type, status, published, created_at desc);
create index properties_search_location_idx on public.properties using gin (to_tsvector('simple', coalesce(city,'') || ' ' || coalesce(county,'') || ' ' || coalesce(address,'')));
create index properties_featured_idx on public.properties(featured) where featured = true;

create table public.property_features (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  feature text not null,
  unique(property_id, feature)
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  storage_path text not null,
  image_url text not null,
  alt text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  unique(property_id, storage_path)
);
create unique index property_images_one_cover on public.property_images(property_id) where is_cover = true;

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254),
  phone text,
  enquiry_type text not null,
  property_id uuid references public.properties(id) on delete set null,
  property_reference text,
  preferred_date date,
  preferred_time text,
  message text not null check (char_length(message) between 3 and 5000),
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);
create index enquiries_created_at_idx on public.enquiries(created_at desc);

create table public.developments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  location text not null,
  developer text,
  description text,
  unit_count integer,
  availability text,
  price_from numeric(14,2),
  completion_date date,
  amenities text[] not null default '{}',
  gallery jsonb not null default '[]',
  published boolean not null default false,
  demo_data boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.properties add column development_id uuid references public.developments(id) on delete set null;

create table public.site_settings (
  id boolean primary key default true check (id),
  telephone text not null default '01 459 5941',
  email text not null default 'info@cityproperties.ie',
  offices jsonb not null default '[{"address":"12 Lower Hatch St, Dublin 2"},{"address":"Citywest Business Centre, Citywest, Co Dublin"},{"address":"Botanic Court, Botanic Road, Glasnevin, Dublin 9"}]',
  social_links jsonb not null default '{}',
  company_description text not null default 'Residential and commercial property services across Dublin.',
  default_seo_title text not null default 'City Properties | Dublin Property, Considered',
  default_seo_description text not null default 'Residential, commercial and lettings property services across Dublin.',
  updated_at timestamptz not null default now()
);
insert into public.site_settings(id) values (true) on conflict do nothing;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger properties_updated_at before update on public.properties for each row execute function public.set_updated_at();
create trigger developments_updated_at before update on public.developments for each row execute function public.set_updated_at();
create trigger settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.properties enable row level security;
alter table public.property_private_locations enable row level security;
alter table public.property_features enable row level security;
alter table public.property_images enable row level security;
alter table public.enquiries enable row level security;
alter table public.developments enable row level security;
alter table public.site_settings enable row level security;

grant select, insert, update, delete on public.properties to authenticated;
grant select, insert, update, delete on public.property_features, public.property_images to authenticated;
grant select on public.property_features, public.property_images to anon;
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select, insert, update, delete on public.developments to authenticated;
grant select on public.developments to anon;
grant select, update on public.site_settings to authenticated;
grant select on public.site_settings to anon;

create policy "Admins can read admin roster" on public.admin_users for select to authenticated using (public.is_city_properties_admin());
create policy "Public reads published properties" on public.properties for select to anon, authenticated using (published and not demo_data and status <> 'draft' and status <> 'off_market');
create policy "Admins manage properties" on public.properties for all to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());
create policy "Admins manage private property locations" on public.property_private_locations for all to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());
create policy "Public reads features for published properties" on public.property_features for select to anon, authenticated using (exists (select 1 from public.properties p where p.id = property_id and p.published and not p.demo_data and p.status not in ('draft','off_market')));
create policy "Admins manage property features" on public.property_features for all to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());
create policy "Public reads images for published properties" on public.property_images for select to anon, authenticated using (exists (select 1 from public.properties p where p.id = property_id and p.published and not p.demo_data and p.status not in ('draft','off_market')));
create policy "Admins manage property images" on public.property_images for all to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());
create policy "Public submits enquiries" on public.enquiries for insert to anon, authenticated with check (status = 'new' and property_id is null or status = 'new' and exists (select 1 from public.properties p where p.id = property_id and p.published and not p.demo_data));
create policy "Admins manage enquiries" on public.enquiries for all to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());
create policy "Public reads published developments" on public.developments for select to anon, authenticated using (published and not demo_data);
create policy "Admins manage developments" on public.developments for all to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());
create policy "Public reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins update settings" on public.site_settings for update to authenticated using (public.is_city_properties_admin()) with check (public.is_city_properties_admin());

-- Anonymous reads are column-limited so private street addresses, Eircodes and
-- coordinates cannot be fetched through the public Supabase API.
revoke select on public.properties from anon;
grant select (id,slug,title,short_description,description,property_type,listing_type,status,price,price_label,city,county,bedrooms,bathrooms,floor_area,floor_area_unit,property_reference,ber_rating,parking,available_from,featured,new_home,demo_data,published,development_id,created_at,updated_at) on public.properties to anon;
grant select on public.properties to authenticated;
revoke all on public.property_private_locations from anon, authenticated;
grant select, insert, update, delete on public.property_private_locations to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('property-images','property-images',false,12582912,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = false, file_size_limit = 12582912, allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];
create policy "Published property media is readable" on storage.objects for select to anon, authenticated using (bucket_id = 'property-images' and (public.is_city_properties_admin() or exists (select 1 from public.property_images i join public.properties p on p.id = i.property_id where i.storage_path = name and p.published and not p.demo_data and p.status not in ('draft','off_market'))));
create policy "Admins upload property image objects" on storage.objects for insert to authenticated with check (bucket_id = 'property-images' and public.is_city_properties_admin());
create policy "Admins update property image objects" on storage.objects for update to authenticated using (bucket_id = 'property-images' and public.is_city_properties_admin()) with check (bucket_id = 'property-images' and public.is_city_properties_admin());
create policy "Admins delete property image objects" on storage.objects for delete to authenticated using (bucket_id = 'property-images' and public.is_city_properties_admin());

create or replace function public.public_property_location(property_uuid uuid)
returns table(address text,eircode text,latitude numeric,longitude numeric,exact_location_public boolean)
language sql stable security definer set search_path = '' as $$
  select l.address,l.eircode,l.latitude,l.longitude,l.exact_location_public
  from public.property_private_locations l
  join public.properties p on p.id = l.property_id
  where p.id = property_uuid and p.published and not p.demo_data
    and p.status not in ('draft','off_market') and l.exact_location_public;
$$;
revoke all on function public.public_property_location(uuid) from public;
grant execute on function public.public_property_location(uuid) to anon, authenticated;
