import type { MetadataRoute } from 'next';
import { getProperties,getDevelopments } from '@/lib/data';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base='https://cityproperties.ie';const staticRoutes=['','/residential','/commercial','/lettings','/new-homes','/contact','/privacy-policy','/cookie-policy','/terms'].map(path=>({url:base+path,lastModified:new Date()}));const [properties,developments]=await Promise.all([getProperties({limit:1000,includeImages:false}),getDevelopments()]);const propertyRoutes=properties.data.map(p=>({url:base+(p.listing_type==='commercial'?'/commercial':p.listing_type==='rent'?'/lettings':'/residential')+'/'+p.slug,lastModified:new Date(p.updated_at)}));const developmentRoutes=developments.data.map(d=>({url:base+'/new-homes/'+d.slug,lastModified:new Date(d.updated_at)}));return [...staticRoutes,...propertyRoutes,...developmentRoutes]}


