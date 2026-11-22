import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin(){const supabase=await createClient();if(!supabase)redirect('/admin/login?error=configuration');const {data:{user}}=await supabase.auth.getUser();if(!user)redirect('/admin/login');const {data,error}=await supabase.rpc('is_city_properties_admin');if(error||!data)redirect('/admin/login?error=unauthorized');return {supabase,user};}
