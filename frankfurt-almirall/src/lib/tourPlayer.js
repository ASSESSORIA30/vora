/**
 * Canvas player for the scroll-scrubbed frame sequence.
 *
 * Loading
 *  – Frame 0 first, then a sparse set of key frames (every `keyStep`) so any scroll
 *    position has a near frame, then a sliding window around the playhead,
 *    biased in the direction of travel. Max `concurrency` requests in flight.
 *  – Frames outside the window (except key frames) are released, so memory
 *    stays bounded on phones.
 * Drawing
 *  – Always draws one whole frame (no blending between frames: a blend of two
 *    frames reads as a soft double image). High-quality resampling. Never clears
 *    to black: if a frame is missing the nearest decoded one is shown.
 *  – Fills its canvas (cover) around a moving focus point. The page decides the
 *    canvas shape (the opening of the picture frame), so the crop stays bounded.
 *  – Resizes itself when the canvas element changes size (ResizeObserver).
 */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function createTourPlayer(canvas, opts) {
  const {
    count,
    src, // (i) => url
    width: frameW,
    height: frameH,
    focusAt, // (frame) => [x, y]
    keyStep = 16,
    ahead = 36,
    behind = 12,
    keep = 40,
    concurrency = 6,
    maxDpr = 2,
    onFirstFrame,
  } = opts;

  const ctx = canvas.getContext('2d', { alpha: false });
  const frames = new Map(); // i -> { img, ready, loading }
  const queue = new Set();
  let inflight = 0;
  let current = 0;
  let direction = 1;
  let drawn = -1;
  let destroyed = false;
  let firstDrawn = false;
  let layout = null;

  const isKey = (i) => i % keyStep === 0 || i === count - 1;

  function request(i) {
    if (i < 0 || i >= count) return;
    const f = frames.get(i);
    if (f && (f.ready || f.loading)) return;
    queue.add(i);
  }

  function pump() {
    if (destroyed) return;
    while (inflight < concurrency && queue.size) {
      // nearest to the playhead first, ahead of it before behind it
      let best = -1;
      let bestScore = Infinity;
      for (const i of queue) {
        const d = (i - current) * direction;
        const score = d >= 0 ? d : -d * 2.5 + 2;
        const s = isKey(i) && Math.abs(i - current) > ahead ? score * 0.35 : score;
        if (s < bestScore) {
          bestScore = s;
          best = i;
        }
      }
      queue.delete(best);
      load(best);
    }
  }

  function load(i) {
    const img = new Image();
    img.decoding = 'async';
    const entry = { img, ready: false, loading: true };
    frames.set(i, entry);
    inflight += 1;
    img.src = src(i);
    const done = (ok) => {
      inflight -= 1;
      entry.loading = false;
      entry.ready = ok;
      if (!ok) frames.delete(i);
      if (!destroyed && ok && Math.abs(i - current) <= 3) render(true);
      pump();
    };
    (img.decode ? img.decode() : Promise.resolve())
      .then(() => done(true))
      .catch(() => (img.complete && img.naturalWidth ? done(true) : done(false)));
  }

  function prune() {
    for (const [i, f] of frames) {
      if (isKey(i) || f.loading) continue;
      if (Math.abs(i - current) > keep) {
        f.img.src = '';
        frames.delete(i);
      }
    }
    for (const i of queue) if (!isKey(i) && Math.abs(i - current) > keep) queue.delete(i);
  }

  function schedule() {
    request(current);
    for (let k = 1; k <= ahead; k += 1) request(current + k * direction);
    for (let k = 1; k <= behind; k += 1) request(current - k * direction);
    prune();
    pump();
  }

  function nearestReady(i) {
    for (let d = 0; d < count; d += 1) {
      if (frames.get(i - d)?.ready) return i - d;
      if (frames.get(i + d)?.ready) return i + d;
      if (i - d < 0 && i + d >= count) break;
    }
    return -1;
  }

  function computeLayout() {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const cw = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const ch = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const scale = Math.max(cw / frameW, ch / frameH);
    layout = { cw, ch, dpr, dw: frameW * scale, dh: frameH * scale };
  }

  function placement(frame) {
    const { cw, ch, dw, dh } = layout;
    const [fx, fy] = focusAt(frame);
    // overflowing axis: keep focus centred but never reveal an edge
    const x = dw > cw ? clamp(cw / 2 - fx * dw, cw - dw, 0) : (cw - dw) / 2;
    const y = dh > ch ? clamp(ch / 2 - fy * dh, ch - dh, 0) : (ch - dh) / 2;
    return { x, y };
  }

  let lastFloat = -1;
  function render(force = false, frameFloat = lastFloat) {
    if (!layout || frameFloat < 0) return;
    const want = Math.round(frameFloat);
    const a = nearestReady(want);
    if (a < 0) return;
    const { x, y } = placement(frameFloat);
    const key = `${a}|${x.toFixed(1)}|${y.toFixed(1)}`;
    if (!force && key === drawn) return;
    drawn = key;

    const { dw, dh } = layout;
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(frames.get(a).img, x, y, dw, dh);

    if (!firstDrawn) {
      firstDrawn = true;
      onFirstFrame?.();
    }
  }

  function resize() {
    computeLayout();
    render(true);
  }

  function setFrame(frameFloat) {
    const f = clamp(frameFloat, 0, count - 1);
    const i = Math.round(f);
    if (i !== current) {
      direction = i > current ? 1 : -1;
      current = i;
      schedule();
    }
    lastFloat = f;
    render(false, f);
  }

  // Boot: first frame, then key frames in order of distance from the start.
  computeLayout();
  request(0);
  pump();
  for (let i = keyStep; i < count; i += keyStep) request(i);
  request(count - 1);
  schedule();
  lastFloat = 0;
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  return {
    setFrame,
    resize,
    stats: () => ({ loaded: [...frames.values()].filter((f) => f.ready).length, inflight, queued: queue.size }),
    destroy() {
      destroyed = true;
      ro.disconnect();
      frames.forEach((f) => {
        f.img.src = '';
      });
      frames.clear();
      queue.clear();
    },
  };
}
