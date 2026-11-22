import type { Metadata } from 'next';
import './globals.css';
import './platform.css';
import { SiteChrome } from '@/components/site/chrome';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { Preloader } from '@/components/site/preloader';
import { getSiteSettings } from '@/lib/data';

export async function generateMetadata():Promise<Metadata>{const settings=await getSiteSettings();return {metadataBase:new URL('https://cityproperties.ie'),title:{default:settings.default_seo_title,template:'%s | City Properties'},description:settings.default_seo_description,openGraph:{type:'website',siteName:'City Properties',locale:'en_IE',images:['/images/dublin-georgian.webp']},twitter:{card:'summary_large_image'}}}

export default async function RootLayout({children}:{children:React.ReactNode}){const settings=await getSiteSettings();return <html lang="en-IE"><body><SiteChrome header={<><Preloader/><Header telephone={settings.telephone}/></>} footer={<Footer settings={settings}/>}>{children}</SiteChrome></body></html>}


