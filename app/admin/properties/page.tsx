import Link from 'next/link';
import Image from 'next/image';
import { requireAdmin } from '@/lib/supabase/admin';
import { changePropertyStatusAction, duplicatePropertyAction } from '@/app/actions';
import { demoImage } from '@/lib/data';
import { ConfirmButton } from '@/components/admin/confirm-button';

type SearchParams = Promise<{ q?: string; listing?: string; status?: string }>;

export default async function AdminPropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  let query = supabase.from('properties')
    .select('*,property_images(image_url,is_cover,storage_path)')
    .order('updated_at', { ascending: false });

  if (params.q) {
    const term = params.q.replace(/[(),]/g, ' ');
    query = query.or(`title.ilike.%${term}%,property_reference.ilike.%${term}%,city.ilike.%${term}%,address.ilike.%${term}%`);
  }
  if (params.listing) query = query.eq('listing_type', params.listing);
  if (params.status) query = query.eq('status', params.status);

  const { data, error } = await query;
  const rows = await Promise.all((data || []).map(async (property: any) => ({
    ...property,
    property_images: await Promise.all((property.property_images || []).map(async (image: any) => {
      const { data: signed } = await supabase.storage.from('property-images').createSignedUrl(image.storage_path, 3600);
      return { ...image, image_url: signed?.signedUrl || '' };
    })),
  })));

  return <>
    <div className="admin-page-head">
      <div><span className="eyebrow">Property management</span><h1>Properties</h1><p>Manage listings, descriptions, availability and media.</p></div>
      <Link className="button" href="/admin/properties/new">Add property <span>+</span></Link>
    </div>
    <form className="admin-filters">
      <input name="q" defaultValue={params.q} placeholder="Search title, reference or location" />
      <select name="listing" defaultValue={params.listing || ''}><option value="">All categories</option><option value="sale">Sale</option><option value="rent">Rent</option><option value="commercial">Commercial</option></select>
      <select name="status" defaultValue={params.status || ''}><option value="">All statuses</option>{['draft', 'available', 'under_offer', 'sale_agreed', 'let', 'sold', 'off_market'].map(status => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select>
      <button className="button button-small">Filter</button>
    </form>
    {error ? <div className="admin-alert">Unable to load properties: {error.message}</div> : rows.length ? <div className="admin-table-wrap"><table className="admin-table properties-table">
      <thead><tr><th>Property</th><th>Reference</th><th>Category</th><th>Price</th><th>Status</th><th>Featured</th><th>Updated</th><th>Actions</th></tr></thead>
      <tbody>{rows.map((property: any) => {
        const cover = property.property_images?.find((image: any) => image.is_cover)?.image_url || property.property_images?.[0]?.image_url || demoImage;
        return <tr key={property.id}>
          <td><div className="admin-property-cell"><Image src={cover} alt="" width={72} height={58} /><span><b>{property.title}</b><small>{[property.city, property.county].filter(Boolean).join(', ')}</small></span></div></td>
          <td>{property.property_reference || '—'}</td><td>{property.listing_type}<small>{property.property_type}</small></td><td>{property.price_label || '—'}</td>
          <td><span className={'status-pill ' + property.status}>{property.status.replace('_', ' ')}</span>{property.demo_data && <small>DEMO</small>}</td>
          <td>{property.featured ? 'Yes' : 'No'}</td><td>{new Date(property.updated_at).toLocaleDateString('en-IE')}</td>
          <td><div className="row-actions"><Link href={'/admin/properties/' + property.id}>Edit</Link>
            <form action={duplicatePropertyAction}><input type="hidden" name="id" value={property.id} /><button>Duplicate</button></form>
            <form action={changePropertyStatusAction}><input type="hidden" name="id" value={property.id} /><input type="hidden" name="published" value="false" /><input type="hidden" name="status" value="off_market" /><ConfirmButton question="Archive this listing? It will be hidden from the public website.">Archive</ConfirmButton></form>
          </div></td>
        </tr>;
      })}</tbody>
    </table></div> : <div className="admin-empty">{params.q || params.listing || params.status ? 'No properties match these filters.' : 'No properties yet. Add a property to get started.'}</div>}
  </>;
}
