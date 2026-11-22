import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request:NextRequest){const url=new URL(request.url);const tokenHash=url.searchParams.get('token_hash');const type=url.searchParams.get('type');const destination='/admin/reset-password';if(!tokenHash||type!=='recovery')return NextResponse.redirect(new URL('/admin/forgot-password?error=expired',url.origin));const supabase=await createClient();if(!supabase)return NextResponse.redirect(new URL('/admin/forgot-password?error=configuration',url.origin));const {error}=await supabase.auth.verifyOtp({token_hash:tokenHash,type:'recovery'});if(error)return NextResponse.redirect(new URL('/admin/forgot-password?error=expired',url.origin));return NextResponse.redirect(new URL(destination,url.origin))}



