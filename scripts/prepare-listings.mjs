import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { LISTING_PHOTO_SOURCES } from '../data/listings.ts';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','public','images','listings');
const responsiveWidths=[320,480,960,1600,2400];
const entries=LISTING_PHOTO_SOURCES.flatMap(({slug,photos})=>photos.map((url,index)=>({slug,index,url})));
const missing=[];const imageMetadata={};let completed=0;
async function prepare(item){
 const dir=path.join(root,item.slug);await mkdir(dir,{recursive:true});
 const suffix=item.url.match(/_[^./]+(?=\.[^.]+$)/)?.[0]||'_l';
 const candidates=[item.url.replace(suffix,'_o'),item.url.replace(suffix,'_xl'),item.url];
 let bytes=null,selected=null;
 for(const url of [...new Set(candidates)])try{const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'user-agent':'CityPropertiesImageImporter/1.0'}});if(response.ok){const candidate=Buffer.from(await response.arrayBuffer());if(candidate.length>4000){bytes=candidate;selected=url;break}}}catch{}
 const base=path.join(dir,`${item.slug}-${String(item.index+1).padStart(2,'0')}`);
 if(!bytes){missing.push({slug:item.slug,index:item.index+1,source:item.url});console.error(`MISSING ${item.slug} photo ${item.index+1}: ${item.url}`);return}
 await writeFile(`${base}_l${path.extname(new URL(selected).pathname)}`,bytes);
 const source=sharp(bytes);const meta=await source.metadata();
 if(!meta.width||!meta.height)throw new Error(`Could not read image dimensions: ${selected}`);
 const previous=(await readdir(dir)).filter(name=>name.startsWith(path.basename(base)+'-')&&name.endsWith('.webp'));
 await Promise.all(previous.map(name=>rm(path.join(dir,name),{force:true})));
 const widths=[...new Set([...responsiveWidths.filter(width=>width<meta.width),meta.width])].sort((a,b)=>a-b);
 await Promise.all(widths.map(async width=>source.clone().resize({width,withoutEnlargement:true}).webp({quality:82,effort:5}).toFile(`${base}-${width}.webp`)));
 const blur=await source.clone().resize({width:24}).blur(1.5).webp({quality:38}).toBuffer();
 imageMetadata[`${item.slug}/${item.index+1}`]={width:meta.width,height:meta.height,blurDataURL:`data:image/webp;base64,${blur.toString('base64')}`,sourceUrl:selected};
 completed++;console.log(`OK ${item.slug} photo ${item.index+1}: ${meta.width}×${meta.height} from ${selected}`);
}
let cursor=0;
async function worker(){while(cursor<entries.length){const item=entries[cursor++];await prepare(item)}}
await Promise.all(Array.from({length:3},worker));
await writeFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','data','listing-image-metadata.json'),JSON.stringify(imageMetadata,null,2));
await writeFile(path.join(root,'DOWNLOAD_REPORT.json'),JSON.stringify({requested:entries.length,downloaded:completed,missing},null,2));
console.log(JSON.stringify({requested:entries.length,downloaded:completed,missing},null,2));
