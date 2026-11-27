#!/usr/bin/env node
/**
 * Converteix el vídeo del recorregut en seqüències de fotogrames optimitzades
 * i escriu src/content/tour.manifest.json.
 *
 *   npm run video                      # fa servir tour.source.file
 *   npm run video -- path/al/video.mp4 # un altre fitxer
 *
 * Llegeix el tram útil, el format i les mides de src/content/tour.config.js.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tour } from '../src/content/tour.config.js';

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
const variants = {};

for (const v of tour.output.variants) {
  const dir = join(outDir, v.name);
  mkdirSync(dir, { recursive: true });
  const height = Math.round((probe.height * v.width) / probe.width / 2) * 2;
  const codec =
    tour.output.format === 'avif'
      ? ['-c:v', 'libaom-av1', '-still-picture', '1', '-crf', String(Math.round(63 - v.quality * 0.5)), '-cpu-used', '6']
      : ['-c:v', 'libwebp', '-quality', String(v.quality), '-compression_level', '6', '-preset', 'photo'];
  const t0 = Date.now();
  execFileSync(
    'ffmpeg',
    [
      '-loglevel', 'error', '-y', '-i', input,
      '-vf', `select='between(n\\,${first}\\,${last})',scale=${v.width}:${height}:flags=lanczos`,
      '-fps_mode', 'passthrough', '-an',
      ...codec,
      '-start_number', '0',
      join(dir, `f_%04d.${tour.output.format}`),
    ],
    { stdio: 'inherit' },
  );
  const files = readdirSync(dir);
  const bytes = files.reduce((s, f) => s + statSync(join(dir, f)).size, 0);
  console.log(`${v.name}: ${files.length} frames, ${v.width}×${height}, ${(bytes / 1e6).toFixed(1)} MB (${Math.round(bytes / files.length / 1024)} kB/frame) in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  if (files.length !== count) throw new Error(`Expected ${count} frames, got ${files.length}`);
  variants[v.name] = {
    width: v.width,
    height,
    path: `/${tour.output.dir.replace(/^public\//, '')}/${v.name}/f_{i}.${tour.output.format}`,
    bytes,
  };
}

// Open Graph image from the first frame
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', input, '-vf', `select='eq(n\\,${first})',scale=1200:-2,crop=1200:630`, '-frames:v', '1', '-q:v', '3', resolve(root, 'public/media/og.jpg')]);

const manifest = {
  source: tour.source.file,
  fps,
  start: tour.source.start,
  count,
  aspect: probe.width / probe.height,
  variants,
  generatedAt: new Date().toISOString(),
};
writeFileSync(resolve(root, 'src/content/tour.manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log('→ src/content/tour.manifest.json');
