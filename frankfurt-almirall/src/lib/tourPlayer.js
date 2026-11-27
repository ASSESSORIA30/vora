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
 *  – Sub-frame cross-fade between the two neighbouring frames for smooth motion
 *    at slow scroll speeds. Never clears to black: if a frame is missing the
 *    nearest decoded one is shown.
 *  – Responsive framing: fills the screen (cover) around a moving focus point,
 *    but never crops more than `minVisible`; beyond that the gap is filled by a
 *    blurred extension of the same frame with feathered edges.
 */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function createTourPlayer(canvas, opts) {
  const {
    count,
    src, // (i) => url
    width: frameW,
    height: frameH,
    focusAt, // (frame) => [x, y]
    minVisible = 0.72,
    bandAnchor = 0.42, // vertical position of the band when the video is narrower than the screen
    keyStep = 12,
    ahead = 30,
    behind = 12,
    keep = 48,
    concurrency = 6,
    maxDpr = 2,
    onLayout,
    onFirstFrame,
  } = opts;

  const ctx = canvas.getContext('2d', { alpha: false });
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = 48;
  blurCanvas.height = Math.round((48 * frameH) / frameW);
  const blurCtx = blurCanvas.getContext('2d');
  const fg = document.createElement('canvas');
  const fgCtx = fg.getContext('2d');

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
      if (!destroyed && ok && Math.abs(i - current) <= 2) render(true);
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
    const cw = Math.round(canvas.clientWidth * dpr);
    const ch = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    const cover = Math.max(cw / frameW, ch / frameH);
    const contain = Math.min(cw / frameW, ch / frameH);
    const scale = Math.min(cover, contain / minVisible);
    const dw = frameW * scale;
    const dh = frameH * scale;
    layout = { cw, ch, dpr, dw, dh, band: dw < cw - 1 || dh < ch - 1 };
    if (fg.width !== Math.ceil(dw) || fg.height !== Math.ceil(dh)) {
      fg.width = Math.ceil(Math.min(dw, cw));
      fg.height = Math.ceil(Math.min(dh, ch));
    }
  }

  function placement(frame) {
    const { cw, ch, dw, dh } = layout;
    const [fx, fy] = focusAt(frame);
    // overflowing axis: keep focus centred but never reveal an edge
    const x = dw > cw ? clamp(cw / 2 - fx * dw, cw - dw, 0) : (cw - dw) / 2;
    const y = dh > ch ? clamp(ch / 2 - fy * dh, ch - dh, 0) : clamp(ch * bandAnchor - dh / 2, 0, ch - dh);
    return { x, y };
  }

  function drawImage(target, img, x, y, w, h, alpha) {
    target.globalAlpha = alpha;
    target.drawImage(img, x, y, w, h);
  }

  let lastFloat = -1;
  function render(force = false, frameFloat = lastFloat) {
    if (!layout || frameFloat < 0) return;
    const f0 = Math.floor(frameFloat);
    const t = frameFloat - f0;
    const a = nearestReady(f0);
    if (a < 0) return;
    const bIdx = Math.min(count - 1, f0 + 1);
    const b = a === f0 && t > 0.02 && frames.get(bIdx)?.ready ? bIdx : -1;
    const key = `${a}|${b}|${b >= 0 ? t.toFixed(3) : 0}`;
    if (!force && key === drawn) return;
    drawn = key;

    const { cw, ch, dw, dh, band } = layout;
    const { x, y } = placement(frameFloat);
    const imgA = frames.get(a).img;
    const imgB = b >= 0 ? frames.get(b).img : null;

    ctx.globalAlpha = 1;
    if (band) {
      // blurred, darkened extension of the same frame behind the band
      blurCtx.globalAlpha = 1;
      blurCtx.drawImage(imgA, 0, 0, blurCanvas.width, blurCanvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const s = Math.max(cw / blurCanvas.width, ch / blurCanvas.height) * 1.15;
      const bw = blurCanvas.width * s;
      const bh = blurCanvas.height * s;
      ctx.drawImage(blurCanvas, (cw - bw) / 2, (ch - bh) / 2, bw, bh);
      ctx.fillStyle = 'rgba(20, 15, 11, 0.55)';
      ctx.fillRect(0, 0, cw, ch);

      // feathered foreground
      const vx = Math.max(0, x);
      const vy = Math.max(0, y);
      fgCtx.globalCompositeOperation = 'source-over';
      fgCtx.globalAlpha = 1;
      fgCtx.clearRect(0, 0, fg.width, fg.height);
      drawImage(fgCtx, imgA, x - vx, y - vy, dw, dh, 1);
      if (imgB) drawImage(fgCtx, imgB, x - vx, y - vy, dw, dh, t);
      fgCtx.globalAlpha = 1;
      fgCtx.globalCompositeOperation = 'destination-in';
      const vertical = dh < ch - 1;
      const len = vertical ? fg.height : fg.width;
      const feather = Math.round(len * 0.1);
      const g = vertical ? fgCtx.createLinearGradient(0, 0, 0, len) : fgCtx.createLinearGradient(0, 0, len, 0);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(feather / len, 'rgba(0,0,0,1)');
      g.addColorStop(1 - feather / len, 'rgba(0,0,0,1)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      fgCtx.fillStyle = g;
      fgCtx.fillRect(0, 0, fg.width, fg.height);
      fgCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(fg, vx, vy);
    } else {
      drawImage(ctx, imgA, x, y, dw, dh, 1);
      if (imgB) drawImage(ctx, imgB, x, y, dw, dh, t);
      ctx.globalAlpha = 1;
    }

    if (!firstDrawn) {
      firstDrawn = true;
      onFirstFrame?.();
    }
  }

  function resize() {
    computeLayout();
    const { dpr, dw, dh, cw, ch } = layout;
    const { y } = placement(Math.max(0, lastFloat));
    onLayout?.({
      band: layout.band,
      top: Math.max(0, y) / dpr,
      bottom: Math.min(ch, y + dh) / dpr,
      width: Math.min(cw, dw) / dpr,
    });
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
  window.addEventListener('resize', resize);
  resize();

  return {
    setFrame,
    resize,
    stats: () => ({ loaded: [...frames.values()].filter((f) => f.ready).length, inflight, queued: queue.size }),
    destroy() {
      destroyed = true;
      window.removeEventListener('resize', resize);
      frames.forEach((f) => {
        f.img.src = '';
      });
      frames.clear();
      queue.clear();
    },
  };
}
