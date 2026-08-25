import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
const root = new URL('../dist/', import.meta.url).pathname.replace(/^\/(.:)/, '$1');
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map((entry)=>entry.isDirectory()?files(join(dir,entry.name)):[join(dir,entry.name)]))).flat();}
const htmlFiles=(await files(root)).filter((file)=>file.endsWith('.html'));
const errors=[];
const titles=new Map();
for(const file of htmlFiles){
  const html=await readFile(file,'utf8'); const name=relative(root,file);
  const title=html.match(/<title>([^<]{8,})<\/title>/)?.[1];
  if(!title) errors.push(`${name}: title mancante`); else if(titles.has(title)) errors.push(`${name}: title duplicato con ${titles.get(title)}`); else titles.set(title,name);
  if(!/<meta name="description" content="[^"]{40,}"/.test(html)) errors.push(`${name}: description mancante`);
  if(!/<link rel="canonical" href="[^"]+"/.test(html)) errors.push(`${name}: canonical mancante`);
  if(!/<meta property="og:image" content="[^"]+\/og\.png"/.test(html)) errors.push(`${name}: immagine Open Graph mancante`);
  if((html.match(/<h1[ >]/g)??[]).length!==1) errors.push(`${name}: deve contenere esattamente un H1`);
  if(html.includes('w4u.example')) errors.push(`${name}: dominio segnaposto presente`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);} console.log(`SEO check superato: ${htmlFiles.length} pagine HTML.`);
