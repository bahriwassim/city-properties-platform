import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/admin';
import { PropertyEditor } from '@/components/admin/property-editor';
export default async function NewPropertyPage({searchParams}:{searchParams:Promise<{error?:string}>}){const {supabase}=await requireAdmin();const {data:developments}=await supabase.from('developments').select('id,name,location').eq('demo_data',false).order('name');const {error}=await searchParams;return <><div className="admin-page-head"><div><span className="eyebrow">Property management</span><h1>Add a property</h1><p>Add details, features and photography to a listing.</p></div><Link className="admin-back" href="/admin/properties">← All properties</Link></div>{error&&<div className="admin-alert">Unable to save the property. Check required fields and ensure the slug and reference are unique.</div>}<PropertyEditor developments={developments||[]}/></>}



