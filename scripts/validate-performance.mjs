import fs from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const assetsDir = path.resolve('dist/assets')
if (!fs.existsSync(assetsDir)) throw new Error('dist/assets is missing. Run npm run build first.')

const assets = fs.readdirSync(assetsDir).map((name) => {
  const buffer = fs.readFileSync(path.join(assetsDir, name))
  return { name, bytes: buffer.length, gzip: gzipSync(buffer).length }
})
const totals = (extension) => assets.filter(({ name }) => name.endsWith(extension)).reduce((sum, asset) => sum + asset.gzip, 0)
const jsGzip = totals('.js')
const cssGzip = totals('.css')
const limits = { jsGzip: 200_000, cssGzip: 12_000, video: 5_000_000 }
const videos = ['public/media/hero/hero-mobile.mp4', 'public/media/hero/hero-desktop.mp4'].map((file) => ({ file, bytes: fs.statSync(file).size }))
const failures = []
if (jsGzip > limits.jsGzip) failures.push(`JavaScript gzip ${jsGzip} exceeds ${limits.jsGzip}`)
if (cssGzip > limits.cssGzip) failures.push(`CSS gzip ${cssGzip} exceeds ${limits.cssGzip}`)
videos.forEach(({ file, bytes }) => { if (bytes > limits.video) failures.push(`${file} ${bytes} exceeds ${limits.video}`) })

console.log(`Performance budget: JS ${jsGzip} B gzip, CSS ${cssGzip} B gzip.`)
videos.forEach(({ file, bytes }) => console.log(`${file}: ${bytes} B`))
if (failures.length) {
  failures.forEach((failure) => console.error(failure))
  process.exitCode = 1
} else {
  console.log('Performance budgets passed.')
}
