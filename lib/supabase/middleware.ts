import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: {
    getAll: () => request.cookies.getAll(),
    setAll(cookiesToSet) { cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); },
  } });
  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const publicAdminRoutes=['/admin/login','/admin/forgot-password','/admin/reset-password'];
  if (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname) && !user) {
    const login = request.nextUrl.clone(); login.pathname = '/admin/login'; login.searchParams.set('next', pathname); return NextResponse.redirect(login);
  }
  if (pathname.startsWith('/admin') && !publicAdminRoutes.includes(pathname) && user) {
    const { data: isAdmin } = await supabase.rpc('is_city_properties_admin');
    if (!isAdmin) { const login = request.nextUrl.clone(); login.pathname = '/admin/login'; login.searchParams.set('error','unauthorized'); return NextResponse.redirect(login); }
  }
  if (pathname === '/admin/login' && user) {
    const dashboard = request.nextUrl.clone(); dashboard.pathname = '/admin/dashboard'; dashboard.search = ''; return NextResponse.redirect(dashboard);
  }
  return response;
}
