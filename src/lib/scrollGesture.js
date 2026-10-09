// Groups the stream of `wheel` events produced by one physical gesture so a
// caller can act exactly once per gesture.
//
// Browsers do not expose where a trackpad gesture (or its inertia) begins and
// ends, so this is a heuristic. A new gesture is recognised when:
//   - no event arrived for longer than an adaptive gap (scaled from the cadence
//     of the current stream: ~16 ms for trackpads, 30–100 ms for wheel notches),
//   - the direction reverses, or
//   - during a decaying inertia tail the deltas jump up again, which is what a
//     fresh swipe on a still-coasting trackpad looks like.
// Each gesture can fire `trigger` once, after it travels `threshold` pixels.

const LINE_HEIGHT = 16

export function normalizeWheelDelta(event, pageHeight = 800) {
  const factor = event.deltaMode === 1 ? LINE_HEIGHT : event.deltaMode === 2 ? pageHeight : 1
  return event.deltaY * factor
}

const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

export function createGestureDetector({ threshold = 10, minGap = 120, maxGap = 320, firstGap = 260 } = {}) {
  let gesture = null

  const gapLimit = () => gesture.intervals.length
    ? Math.min(maxGap, Math.max(minGap, median(gesture.intervals) * 4))
    : firstGap

  const startsNewGesture = (abs, direction, time) => {
    if (!gesture) return true
    if (time - gesture.last > gapLimit()) return true
    if (direction !== gesture.direction && abs > 2) return true
    if (gesture.decaying && gesture.recent.length >= 3) {
      const baseline = mean(gesture.recent.slice(-3))
      if (abs >= baseline * 1.8 && abs - baseline >= 6) return true
    }
    return false
  }

  return {
    push(delta, time) {
      const abs = Math.abs(delta)
      if (!abs) return { isNew: false, trigger: false, direction: gesture?.direction ?? 0 }
      const direction = Math.sign(delta)
      const isNew = startsNewGesture(abs, direction, time)
      if (isNew) gesture = { direction, last: time, travelled: 0, peak: 0, decaying: false, recent: [], intervals: [], spent: false }
      else {
        gesture.intervals.push(time - gesture.last)
        if (gesture.intervals.length > 8) gesture.intervals.shift()
      }
      gesture.last = time
      if (direction === gesture.direction) gesture.travelled += abs
      gesture.recent.push(abs)
      if (gesture.recent.length > 6) gesture.recent.shift()
      if (abs > gesture.peak) gesture.peak = abs
      else if (abs < gesture.peak * .6) gesture.decaying = true
      let trigger = false
      if (!gesture.spent && gesture.travelled >= threshold) {
        trigger = true
        gesture.spent = true
      }
      return { isNew, trigger, direction: gesture.direction }
    },
    // Marks the gesture in progress as used, so its remaining events (inertia)
    // can never fire again.
    spend() { if (gesture) gesture.spent = true },
    reset() { gesture = null },
  }
}
