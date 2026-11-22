import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/admin';
import { DevelopmentEditor } from '@/components/admin/development-editor';
export default async function NewDevelopmentPage({searchParams}:{searchParams:Promise<{error?:string}>}){await requireAdmin();const {error}=await searchParams;return <><div className="admin-page-head"><div><span className="eyebrow">New homes</span><h1>Add development</h1><p>Create a new residential development page.</p></div><Link className="admin-back" href="/admin/developments">← All developments</Link></div>{error&&<div className="admin-alert">Could not save the development. Check that its name and slug are unique.</div>}<DevelopmentEditor/></>}
