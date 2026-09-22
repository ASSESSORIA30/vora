import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { INDEXABLE_PATHS } from './src/data/siteContent.js'

const HTML_PATHS=new Set([...INDEXABLE_PATHS,'/legal/aviso-legal','/legal/privacidad','/legal/cookies'])

function seoPreviewRoutes(){
  return {
    name:'vora-seo-preview-routes',
    configurePreviewServer(server){
      server.middlewares.use((request,response,next)=>{
        if(request.method!=='GET'||!String(request.headers.accept||'').includes('text/html'))return next()
        const requested=new URL(request.url,'http://preview.local').pathname
        if(requested!=='/'&&requested.endsWith('/')){
          response.statusCode=308
          response.setHeader('Location',requested.replace(/\/+$/,''))
          return response.end()
        }
        if(requested.endsWith('.html')){
          response.statusCode=308
          response.setHeader('Location',requested.replace(/\.html$/,''))
          return response.end()
        }
        const clean=requested||'/'
        const relative=clean==='/'?'index.html':`${clean.slice(1)}.html`
        const file=path.resolve('dist',HTML_PATHS.has(clean)?relative:'404.html')
        if(!fs.existsSync(file))return next()
        response.statusCode=HTML_PATHS.has(clean)?200:404
        response.setHeader('Content-Type','text/html; charset=utf-8')
        response.end(fs.readFileSync(file))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(),seoPreviewRoutes()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
