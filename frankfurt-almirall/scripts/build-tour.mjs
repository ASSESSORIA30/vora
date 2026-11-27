#!/usr/bin/env node
/**
 * Converteix el vídeo del recorregut en seqüències de fotogrames optimitzades
 * i escriu src/content/tour.manifest.json.
 *
 *   npm run video                      # fa servir tour.source.file
 *   npm run video -- path/al/video.mp4 # un altre fitxer
 *
 * Tot es llegeix de src/content/tour.config.js (tram útil, sèries, format, qualitat, realç).
 *
 * Procés per sèrie:
 *   1. FFmpeg extreu el tram útil a PNG sense pèrdua, amb escalat Lanczos (si cal)
 *      i un realç suau de luminància (unsharp) opcional.
 *   2. Cada PNG es codifica com a imatge independent (AVIF 4:4:4 o WebP), en paral·lel.
 */
import { execFile, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { cpus, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { tour } from '../src/content/tour.config.js';

const run = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(root, process.argv[2] ?? tour.source.file);

const probe = JSON.parse(
  execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames', '-of', 'json', input]).toString(),
).streams[0];
const [num, den] = probe.r_frame_rate.split('/').map(Number);
const fps = num / den;
const first = Math.round(tour.source.start * fps);
const last = Math.min(Math.round(tour.source.end * fps), Number(probe.nb_frames) - 1);
const count = last - first + 1;
console.log(`${input}\n${probe.width}×${probe.height} @ ${fps} fps · frames ${first}–${last} (${count})`);

const outDir = resolve(root, tour.output.dir);
rmSync(outDir, { recursive: true, force: true });
const jobs = Math.max(1, cpus().length);
const variants = {};

function encoderArgs(v, src, dst) {
  if (v.format === 'avif') {
    // one independent AV1 key frame per file, full-resolution chroma
    return ['-loglevel', 'error', '-y', '-i', src, '-pix_fmt', 'yuv444p', '-c:v', 'libaom-av1', '-still-picture', '1', '-crf', String(v.crf ?? 14), '-cpu-used', '6', '-threads', '1', dst];
  }
  return ['-loglevel', 'error', '-y', '-i', src, '-c:v', 'libwebp', '-quality', String(v.quality ?? 86), '-compression_level', '6', '-preset', 'photo', dst];
}

async function pool(items, worker) {
  let i = 0;
  await Promise.all(
    Array.from({ length: jobs }, async () => {
      while (i < items.length) {
        const item = items[i];
        i += 1;
        await worker(item);
      }
    }),
  );
}

for (const v of tour.output.variants) {
  const t0 = Date.now();
  const dir = join(outDir, v.name);
  mkdirSync(dir, { recursive: true });
  const width = Math.min(v.width, probe.width);
  const height = Math.round((probe.height * width) / probe.width / 2) * 2;
  const filters = [`select='between(n\\,${first}\\,${last})'`];
  if (width !== probe.width) filters.push(`scale=${width}:${height}:flags=lanczos`);
  if (v.sharpen > 0) filters.push(`unsharp=5:5:${v.sharpen}:5:5:0`);

  const tmp = mkdtempSync(join(tmpdir(), `tour-${v.name}-`));
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-vf', filters.join(','), '-fps_mode', 'passthrough', '-an', '-pix_fmt', 'rgb24', '-start_number', '0', join(tmp, 'f_%04d.png')], {
    stdio: 'inherit',
  });
  const pngs = readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();
  if (pngs.length !== count) throw new Error(`Expected ${count} frames, got ${pngs.length}`);

  let done = 0;
  await pool(pngs, async (png) => {
    const dst = join(dir, png.replace('.png', `.${v.format}`));
    await run('ffmpeg', encoderArgs(v, join(tmp, png), dst));
    done += 1;
    if (done % 50 === 0) process.stdout.write(`  ${v.name}: ${done}/${count}\n`);
  });
  rmSync(tmp, { recursive: true, force: true });

  const files = readdirSync(dir);
  const bytes = files.reduce((s, f) => s + statSync(join(dir, f)).size, 0);
  console.log(
    `${v.name}: ${files.length} × ${width}×${height} ${v.format}, ${(bytes / 1e6).toFixed(1)} MB (${Math.round(bytes / files.length / 1024)} kB/frame) in ${Math.round((Date.now() - t0) / 1000)} s`,
  );
  variants[v.name] = {
    width,
    height,
    format: v.format,
    path: `/${tour.output.dir.replace(/^public\//, '')}/${v.name}/f_{i}.${v.format}`,
    bytes,
  };
}

// Open Graph image from the first frame of the tour
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-vf', `select='eq(n\\,${first})',scale=1200:-2,crop=1200:630`, '-frames:v', '1', '-q:v', '3', resolve(root, 'public/media/og.jpg')]);

const manifest = {
  source: tour.source.file,
  fps,
  start: tour.source.start,
  firstSourceFrame: first,
  count,
  aspect: probe.width / probe.height,
  sourceWidth: probe.width,
  sourceHeight: probe.height,
  variants,
  generatedAt: new Date().toISOString(),
};
writeFileSync(resolve(root, 'src/content/tour.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('→ src/content/tour.manifest.json');
