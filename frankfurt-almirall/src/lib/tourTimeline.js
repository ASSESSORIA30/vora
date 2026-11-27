/**
 * Pure timeline maths for the scroll-driven tour (no DOM).
 *
 * Scroll progress (0–1) → "virtual frame". Real frames run 0…count-1; past the
 * last frame the virtual frame keeps growing through the final hold so the
 * closing text can appear while the image stays on the last frame.
 *
 * Scroll distance is not linear in frames: around each stop the scroll weight is
 * boosted (a Gaussian), so the camera slows down near every product without ever
 * stopping or locking the scroll.
 */

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export function buildTimeline(config, manifest) {
  const { fps, count, start } = manifest;
  const last = count - 1;
  const toFrame = (seconds) => Math.min(last, Math.max(0, Math.round((seconds - start) * fps)));

  const stops = config.stops.map((s) => ({ ...s, frame: toFrame(s.time) }));
  const holdFrames = Math.round(config.finale.hold * fps);
  const virtualEnd = last + holdFrames;
  const sigma = 0.6 * fps;

  // Cumulative scroll weight for every virtual frame.
  const cum = new Float64Array(virtualEnd + 1);
  for (let f = 1; f <= virtualEnd; f += 1) {
    let w = 1;
    if (f <= last) {
      for (const s of stops) w += s.dwell * Math.exp(-(((f - s.frame) / sigma) ** 2));
    }
    cum[f] = cum[f - 1] + w;
  }
  const total = cum[virtualEnd];

  /** progress 0–1 → virtual frame (float) */
  function frameAt(progress) {
    const w = Math.min(1, Math.max(0, progress)) * total;
    let lo = 0;
    let hi = virtualEnd;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= w) lo = mid;
      else hi = mid;
    }
    const span = cum[hi] - cum[lo] || 1;
    return lo + (w - cum[lo]) / span;
  }

  /** virtual frame → progress 0–1 (for the progress indicator and jumps) */
  const progressAt = (frame) => {
    const f = Math.min(virtualEnd, Math.max(0, frame));
    const i = Math.floor(f);
    const next = Math.min(virtualEnd, i + 1);
    return (cum[i] + (cum[next] - cum[i]) * (f - i)) / total;
  };

  const before = config.textWindow.before * fps;
  const after = config.textWindow.after * fps;

  /** 0–1 visibility of a stop's text at virtual frame v */
  const stopOpacity = (stop, v) => {
    const rise = smooth((v - (stop.frame - before)) / (before * 0.65));
    const fall = 1 - smooth((v - (stop.frame + after * 0.35)) / (after * 0.65));
    return Math.min(rise, fall);
  };

  const introEnd = config.intro.until * fps;
  const introOpacity = (v) => 1 - smooth((v - introEnd * 0.25) / (introEnd * 0.75));

  const finaleFrom = (config.finale.from - start) * fps;
  const finaleOpacity = (v) => smooth((v - finaleFrom) / (0.5 * fps));

  // Focus keyframes: where the important subject sits in the video (0–1).
  const focusKeys = [
    { frame: 0, focus: config.intro.focus },
    ...stops.map((s) => ({ frame: s.frame, focus: s.focus })),
    { frame: last, focus: config.finale.focus },
  ].sort((a, b) => a.frame - b.frame);

  function focusAt(frame) {
    if (frame <= focusKeys[0].frame) return focusKeys[0].focus;
    for (let i = 1; i < focusKeys.length; i += 1) {
      const a = focusKeys[i - 1];
      const b = focusKeys[i];
      if (frame <= b.frame) {
        const t = smooth((frame - a.frame) / (b.frame - a.frame || 1));
        return [a.focus[0] + (b.focus[0] - a.focus[0]) * t, a.focus[1] + (b.focus[1] - a.focus[1]) * t];
      }
    }
    return focusKeys[focusKeys.length - 1].focus;
  }

  return {
    count,
    last,
    virtualEnd,
    stops,
    frameAt,
    progressAt,
    stopOpacity,
    introOpacity,
    finaleOpacity,
    focusAt,
    finaleFrame: Math.min(virtualEnd, finaleFrom + 0.6 * fps),
  };
}
