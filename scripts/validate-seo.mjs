import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { HOUSES } from '../src/data/houses.js'
import { INDEXABLE_PATHS } from '../src/data/siteContent.js'

const dist=path.resolve('dist')
const base=(process.env.VITE_SITE_URL||process.env.SITE_URL||'https://vora-orpin-delta.vercel.app').replace(/\/$/,'')
const fileFor=(pathname)=>path.join(dist,pathname==='/'?'index.html':`${pathname.slice(1)}.html`)
const tagContent=(html,pattern,label)=>{
  const match=html.match(pattern)
  assert.ok(match,`Missing ${label}`)
  return match[1]
}

const titles=new Set(),descriptions=new Set()
const allowedPaths=new Set([...INDEXABLE_PATHS,'/legal/aviso-legal','/legal/privacidad','/legal/cookies'])

for(const pathname of INDEXABLE_PATHS){
  const html=await fs.readFile(fileFor(pathname),'utf8')
  const title=tagContent(html,/<title>(.*?)<\/title>/s,`title in ${pathname}`)
  const description=tagContent(html,/<meta name="description" content="([^"]+)" \/>/,`description in ${pathname}`)
  assert.ok(!titles.has(title),`Duplicate title: ${title}`)
  assert.ok(!descriptions.has(description),`Duplicate description: ${description}`)
  titles.add(title);descriptions.add(description)
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`${pathname} must contain one H1`)
  assert.equal(tagContent(html,/<link rel="canonical" href="([^"]+)" \/>/,`canonical in ${pathname}`),`${base}${pathname==='/'?'':pathname}`)
  for(const name of ['og:title','og:description','og:url','og:image','twitter:card','twitter:title','twitter:description','twitter:image'])assert.ok(html.includes(`${name}\" content=`),`${pathname} missing ${name}`)
  const structured=JSON.parse(tagContent(html,/<script type="application\/ld\+json">(.*?)<\/script>/s,`JSON-LD in ${pathname}`))
  assert.equal(structured['@context'],'https://schema.org')
  assert.ok(Array.isArray(structured['@graph']))
  for(const href of [...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((match)=>match[1])){
    if(!href.startsWith('/')||href.startsWith('//'))continue
    const target=new URL(href,base).pathname.replace(/\/+$/,'')||'/'
    assert.ok(allowedPaths.has(target),`Broken internal link ${href} in ${pathname}`)
  }
  if(pathname!=='/')assert.ok(!html.includes('hero-desktop-poster.jpg" media='),`${pathname} should not preload home hero media`)
}

for(const house of HOUSES){
  const pathname=`/modelos/${house.id}`
  const html=await fs.readFile(fileFor(pathname),'utf8')
  const structured=JSON.parse(tagContent(html,/<script type="application\/ld\+json">(.*?)<\/script>/s,`model JSON-LD in ${pathname}`))
  const types=structured['@graph'].map((entry)=>entry['@type'])
  assert.ok(types.includes('BreadcrumbList'),`${pathname} missing BreadcrumbList`)
  assert.ok(types.includes('WebPage'),`${pathname} missing WebPage`)
  assert.ok(!types.includes('SingleFamilyResidence'),`${pathname} contains unjustified residence schema`)
  if(house.validationStatus==='pending'){
    assert.ok(!/>[^<]*m²[^<]*</.test(html),`${pathname} publishes pending square metres`)
    assert.ok(!/>[^<]*m aprox\.[^<]*</.test(html),`${pathname} publishes pending plan dimensions`)
  }
}

const sitemap=await fs.readFile(path.join(dist,'sitemap.xml'),'utf8')
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match)=>match[1])
assert.deepEqual(sitemapUrls,INDEXABLE_PATHS.map((pathname)=>`${base}${pathname==='/'?'':pathname}`))
assert.ok(!sitemap.includes('/legal/'))
assert.ok(!sitemap.includes('.html'))

const robots=await fs.readFile(path.join(dist,'robots.txt'),'utf8')
assert.equal(robots,`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`)

const notFound=await fs.readFile(path.join(dist,'404.html'),'utf8')
assert.ok(notFound.includes('name="robots" content="noindex,nofollow"'))
assert.ok(!notFound.includes('rel="canonical"'))
assert.equal((notFound.match(/<h1(?:\s|>)/g)||[]).length,1)

console.log(`SEO validation passed: ${INDEXABLE_PATHS.length} canonical URLs, ${HOUSES.length} model pages, unique metadata and valid internal links.`)
