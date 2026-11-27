/**
 * Scroll-scrubbed image sequence on a canvas.
 * – Loads only a window of frames around the current one (prefetch ahead/behind).
 * – Releases frames far from the playhead to keep mobile memory bounded.
 * – Draws only when the requested frame changes; caps devicePixelRatio.
 */
export function createFrameSequence(canvas, { count, path, width, height }, { window: win = 24, maxDpr = 1.5 } = {}) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const cache = new Map();
  let current = -1;
  let lastDrawn = -1;
  let destroyed = false;

  function load(i) {
    if (i < 0 || i >= count || cache.has(i)) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = path(i);
    const entry = { img, ready: false };
    img.onload = () => {
      entry.ready = true;
      if (!destroyed && i === current) draw(i);
    };
    cache.set(i, entry);
  }

  function prune(center) {
    for (const key of cache.keys()) {
      if (Math.abs(key - center) > win * 2) {
        cache.get(key).img.src = '';
        cache.delete(key);
      }
    }
  }

  function nearestReady(i) {
    for (let d = 0; d < win; d += 1) {
      if (cache.get(i - d)?.ready) return i - d;
      if (cache.get(i + d)?.ready) return i + d;
    }
    return -1;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const { clientWidth: w, clientHeight: h } = canvas;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    lastDrawn = -1;
    if (current >= 0) draw(current);
  }

  function draw(i) {
    const idx = nearestReady(i);
    if (idx < 0 || idx === lastDrawn) return;
    const { img } = cache.get(idx);
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / width, ch / height);
    const dw = width * scale;
    const dh = height * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastDrawn = idx;
  }

  function setProgress(p) {
    const i = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));
    if (i === current) return;
    const dir = i > current ? 1 : -1;
    current = i;
    load(i);
    for (let k = 1; k <= win; k += 1) load(i + k * dir);
    for (let k = 1; k <= win / 3; k += 1) load(i - k * dir);
    prune(i);
    draw(i);
  }

  resize();
  window.addEventListener('resize', resize);
  setProgress(0);

  return {
    setProgress,
    destroy() {
      destroyed = true;
      window.removeEventListener('resize', resize);
      cache.forEach((e) => {
        e.img.src = '';
      });
      cache.clear();
    },
  };
}
