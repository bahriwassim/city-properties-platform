import Link from 'next/link';
import { ArrowIcon } from '@/components/site/arrow-icon';

export function PropertyFilters({searchParams={},listing}:{searchParams?:Record<string,string|undefined>;listing:'sale'|'rent'|'commercial'}){
 const href=listing==='sale'?'/residential':listing==='rent'?'/lettings':'/commercial';
 return <form className="property-filters" action={href}>
  <label>Location<input name="location" defaultValue={searchParams.location} placeholder="Dublin or area"/></label>
  <label>Property type<select name="type" defaultValue={searchParams.type}><option value="">Any type</option>{[['house','House'],['apartment','Apartment'],['duplex','Duplex'],['penthouse','Penthouse'],['office','Office'],['retail','Retail Unit'],['industrial','Industrial Unit'],['investment','Investment']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
  <label>{listing==='rent'?'Min. rent':'Min. price'}<input name="min_price" type="number" min="0" defaultValue={searchParams.min_price} placeholder="Any"/></label>
  <label>{listing==='rent'?'Max. rent':'Max. price'}<input name="max_price" type="number" min="0" defaultValue={searchParams.max_price} placeholder="Any"/></label>
  {listing==='commercial'?<><label>Min. area<input name="min_area" type="number" min="0" defaultValue={searchParams.min_area} placeholder="Any"/></label><label>Max. area<input name="max_area" type="number" min="0" defaultValue={searchParams.max_area} placeholder="Any"/></label><label>Status<select name="status" defaultValue={searchParams.status}><option value="">Any status</option>{['available','under_offer','sale_agreed','let','sold'].map(x=><option key={x} value={x}>{x.replace('_',' ')}</option>)}</select></label></>:<><label>Bedrooms<select name="bedrooms" defaultValue={searchParams.bedrooms}><option value="">Any</option>{[1,2,3,4,5].map(x=><option key={x} value={x}>{x}+</option>)}</select></label><label>Bathrooms<select name="bathrooms" defaultValue={searchParams.bathrooms}><option value="">Any</option>{[1,2,3,4,5].map(x=><option key={x} value={x}>{x}+</option>)}</select></label>{listing==='sale'&&<label>BER rating<select name="ber" defaultValue={searchParams.ber}><option value="">Any</option>{['A1','A2','A3','B1','B2','B3','C1','C2','C3','D1','D2','E1','E2','F','G'].map(x=><option key={x}>{x}</option>)}</select></label>}</>}
  {listing==='rent'&&<label>Available from<input name="available_from" type="date" defaultValue={searchParams.available_from}/></label>}
  <label>Reference<input name="reference" defaultValue={searchParams.reference} placeholder="Optional"/></label>
 <label>Sort by<select name="sort" defaultValue={searchParams.sort}><option value="newest">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></label>
  <input type="hidden" name="view" value={searchParams.view||'grid'}/>
  <div className="filter-actions"><button className="button" type="submit">Apply filters <ArrowIcon/></button><Link href={href}>Clear all</Link></div>
 </form>
}



