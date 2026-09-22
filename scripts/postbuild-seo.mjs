import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { HOUSES } from '../src/data/houses.js'
import { GUIDE_INDEX_SEO, GUIDE_PAGES, HOME_SEO, INDEXABLE_PATHS, LANDING_PAGES, modelSeo } from '../src/data/siteContent.js'

const dist=path.resolve('dist')
const base=(process.env.VITE_SITE_URL||process.env.SITE_URL||'https://vora-orpin-delta.vercel.app').replace(/\/$/,'')
const template=await fs.readFile(path.join(dist,'index.html'),'utf8')
const esc=(value)=>String(value).replace(/[&<>'"]/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]))
const abs=(url)=>url.startsWith('http')?url:`${base}${url}`
const canonical=(pathname)=>`${base}${pathname==='/'?'':pathname}`
const json=(value)=>JSON.stringify(value).replace(/</g,'\\u003c')

const prerenderBundle=path.resolve('.prerender/prerender-entry.js')
const {renderHome,renderModel,renderLanding,renderGuideIndex,renderGuide,renderLegal,renderNotFound}=await import(pathToFileURL(prerenderBundle).href)

const organization={
  '@type':'Organization',
  '@id':`${base}/#organization`,
  name:'VORA',
  url:base,
  logo:abs('/vora-logo-dark.svg'),
  description:'Marca de viviendas industrializadas de hormigón completamente equipadas y preparadas para vivir.',
}

const website={
  '@type':'WebSite',
  '@id':`${base}/#website`,
  url:base,
  name:'VORA · Concrete Living',
  publisher:{'@id':organization['@id']},
  inLanguage:'es',
}

function breadcrumbs(pathname,currentName){
  const isModel=pathname.startsWith('/modelos/')
  const isGuide=pathname.startsWith('/guias/')
  const items=[
    {'@type':'ListItem',position:1,name:'Inicio',item:base},
    ...(isModel?[{'@type':'ListItem',position:2,name:'Modelos',item:`${base}/#models`}]:[]),
    ...(isGuide?[{'@type':'ListItem',position:2,name:'Guías',item:`${base}/guias`}]:[]),
    {'@type':'ListItem',position:isModel||isGuide?3:2,name:currentName,item:canonical(pathname)},
  ]
  return {'@type':'BreadcrumbList','@id':`${canonical(pathname)}#breadcrumbs`,itemListElement:items}
}

function documentHtml({title,description,pathname='/',image='/media/hero/hero-desktop-poster.jpg',imageAlt='VORA · Concrete Living',content,schema=[],robots='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1',includeCanonical=true}){
  let html=template
    .replace(/<title>.*?<\/title>/s,`<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(description)}" />`)
    .replace('<div id="root"></div>',`<div id="root" data-prerendered="true">${content}</div>`)
  if(pathname!=='/')html=html.replace(/\s*<link rel="preload" as="image" href="\/media\/hero\/hero-(?:desktop|mobile)-poster\.jpg" media="[^"]+" \/>/g,'')
  const url=canonical(pathname)
  const graph=Array.isArray(schema)?schema:[schema]
  const extra=`
${includeCanonical?`<link rel="canonical" href="${url}" />`:''}
<meta name="robots" content="${robots}" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_ES" />
<meta property="og:site_name" content="VORA · Concrete Living" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${abs(image)}" />
<meta property="og:image:alt" content="${esc(imageAlt)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${abs(image)}" />
${graph.length?`<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':graph})}</script>`:''}
`
  return html.replace('</head>',`${extra}</head>`)
}

async function writeHtml(relativePath,options){
  const output=path.join(dist,relativePath)
  await fs.mkdir(path.dirname(output),{recursive:true})
  await fs.writeFile(output,documentHtml(options))
}

const homeItemList={
  '@type':'ItemList',
  '@id':`${base}/#models`,
  name:'Colección VORA',
  itemListElement:HOUSES.map((house,index)=>({'@type':'ListItem',position:index+1,url:`${base}/modelos/${house.id}`,name:`VORA ${house.name}`})),
}
await writeHtml('index.html',{
  ...HOME_SEO,
  content:renderHome(),
  schema:[organization,website,homeItemList],
})

for(const house of HOUSES){
  const pathname=`/modelos/${house.id}`
  const meta=modelSeo(house)
  const breadcrumb=breadcrumbs(pathname,`VORA ${house.name}`)
  const webpage={
    '@type':'WebPage',
    '@id':`${canonical(pathname)}#webpage`,
    url:canonical(pathname),
    name:meta.title,
    description:meta.description,
    isPartOf:{'@id':website['@id']},
    breadcrumb:{'@id':breadcrumb['@id']},
    primaryImageOfPage:{'@type':'ImageObject',url:abs(house.image)},
    about:{'@type':'Thing',name:`VORA ${house.name}`,description:house.description},
    inLanguage:'es',
  }
  await writeHtml(`modelos/${house.id}.html`,{
    ...meta,
    pathname,
    image:house.image,
    imageAlt:`Exterior VORA ${house.name}`,
    content:renderModel(house),
    schema:[organization,website,breadcrumb,webpage],
  })
}

for(const [slug,page] of Object.entries(LANDING_PAGES)){
  const pathname=`/${slug}`
  const breadcrumb=breadcrumbs(pathname,page.title)
  const webpage={
    '@type':'WebPage',
    '@id':`${canonical(pathname)}#webpage`,
    url:canonical(pathname),
    name:page.seoTitle,
    description:page.seoDescription,
    isPartOf:{'@id':website['@id']},
    breadcrumb:{'@id':breadcrumb['@id']},
    primaryImageOfPage:{'@type':'ImageObject',url:abs(page.image)},
    inLanguage:'es',
  }
  const faq={
    '@type':'FAQPage',
    '@id':`${canonical(pathname)}#faq`,
    mainEntity:page.faqs.map(({question,answer})=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}})),
  }
  await writeHtml(`${slug}.html`,{
    title:page.seoTitle,
    description:page.seoDescription,
    pathname,
    image:page.image,
    imageAlt:page.imageAlt,
    content:renderLanding(slug),
    schema:[organization,website,breadcrumb,webpage,faq],
  })
}

const guideIndexPath='/guias'
const guideIndexBreadcrumb=breadcrumbs(guideIndexPath,'Guías')
const guideItemList={
  '@type':'ItemList',
  '@id':`${canonical(guideIndexPath)}#guides`,
  name:'Guías VORA',
  itemListElement:Object.entries(GUIDE_PAGES).map(([slug,guide],index)=>({'@type':'ListItem',position:index+1,url:`${base}/guias/${slug}`,name:guide.title})),
}
await writeHtml('guias.html',{
  ...GUIDE_INDEX_SEO,
  pathname:guideIndexPath,
  content:renderGuideIndex(),
  schema:[organization,website,guideIndexBreadcrumb,guideItemList,{'@type':'WebPage','@id':`${canonical(guideIndexPath)}#webpage`,url:canonical(guideIndexPath),name:GUIDE_INDEX_SEO.title,description:GUIDE_INDEX_SEO.description,isPartOf:{'@id':website['@id']},breadcrumb:{'@id':guideIndexBreadcrumb['@id']},inLanguage:'es'}],
})

for(const [slug,guide] of Object.entries(GUIDE_PAGES)){
  const pathname=`/guias/${slug}`
  const breadcrumb=breadcrumbs(pathname,guide.title)
  const webpage={
    '@type':'WebPage',
    '@id':`${canonical(pathname)}#webpage`,
    url:canonical(pathname),
    name:guide.seoTitle,
    description:guide.seoDescription,
    isPartOf:{'@id':website['@id']},
    breadcrumb:{'@id':breadcrumb['@id']},
    primaryImageOfPage:{'@type':'ImageObject',url:abs(guide.image)},
    inLanguage:'es',
  }
  await writeHtml(`guias/${slug}.html`,{
    title:guide.seoTitle,
    description:guide.seoDescription,
    pathname,
    image:guide.image,
    imageAlt:guide.imageAlt,
    content:renderGuide(slug),
    schema:[organization,website,breadcrumb,webpage],
  })
}

const legalPages={
  'aviso-legal':'Aviso legal',
  privacidad:'Política de privacidad',
  cookies:'Política de cookies',
}
for(const [slug,title] of Object.entries(legalPages)){
  const pathname=`/legal/${slug}`
  await writeHtml(`legal/${slug}.html`,{
    title:`${title} | VORA`,
    description:`${title} de VORA Concrete Living.`,
    pathname,
    content:renderLegal(slug),
    schema:[{'@type':'WebPage',url:canonical(pathname),name:title,inLanguage:'es'}],
    robots:'noindex,follow',
  })
}

await writeHtml('404.html',{
  title:'Página no encontrada | VORA',
  description:'La página solicitada no existe. Consulta la colección de modelos VORA.',
  pathname:'/404',
  content:renderNotFound(),
  schema:[],
  robots:'noindex,nofollow',
  includeCanonical:false,
})

const sitemapUrls=INDEXABLE_PATHS.map((pathname)=>`<url><loc>${canonical(pathname)}</loc></url>`).join('')
await fs.writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls}</urlset>\n`)
await fs.writeFile(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`)
await fs.writeFile(path.join(dist,'llms.txt'),`# VORA · Concrete Living\n\nVORA presenta una colección de viviendas industrializadas de hormigón, completamente equipadas y preparadas para vivir.\n\n## Información principal\n- La colección se compone de siete modelos cerrados.\n- Cada modelo tiene una ficha con capacidad, características y distribución.\n- La adaptación estudia el encaje técnico, urbanístico y estructural del modelo en la parcela.\n- La propuesta ready to live integra los elementos indicados en el sitio web.\n\n## Páginas canónicas\n${INDEXABLE_PATHS.map((pathname)=>`- ${canonical(pathname)}`).join('\n')}\n\nLos planos son conceptuales y están sujetos a la adaptación técnica, urbanística y estructural correspondiente.\n`)
if(process.env.INDEXNOW_KEY)await fs.writeFile(path.join(dist,`${process.env.INDEXNOW_KEY}.txt`),process.env.INDEXNOW_KEY)

await fs.rm(path.dirname(prerenderBundle),{recursive:true,force:true})
console.log(`SEO postbuild complete: ${INDEXABLE_PATHS.length} indexable URLs, 3 noindex legal pages and one 404 at ${base}`)
