import test from 'node:test'
import assert from 'node:assert/strict'
import { createGestureDetector, normalizeWheelDelta } from '../src/lib/scrollGesture.js'

// Replays [delta, time] pairs and counts how many gestures fire.
function replay(events, detector = createGestureDetector()) {
  return events.reduce((count, [delta, time]) => count + (detector.push(delta, time).trigger ? 1 : 0), 0)
}

// A Mac trackpad swipe: the finger accelerates, then inertia decays for a long tail at ~60 Hz.
function trackpadSwipe({ start = 0, direction = 1, peak = 48, inertiaMs = 1800, jitter = 0 } = {}) {
  const events = []
  let time = start
  for (const value of [2, 6, 14, 28, 40, peak]) { events.push([direction * value, time]); time += 16 }
  let value = peak, step = 0
  while (time - start < inertiaMs && value >= .5) {
    value *= .955
    const noise = jitter ? 1 + Math.sin(step++ * 1.7) * jitter : 1
    events.push([direction * Math.max(.5, value * noise), time])
    time += 16
  }
  return events
}

test('a short trackpad swipe advances exactly one phase', () => {
  assert.equal(replay([[3, 0], [7, 16], [9, 32], [4, 48]]), 1)
})

test('a long trackpad swipe with a long, noisy inertia tail advances exactly one phase', () => {
  assert.equal(replay(trackpadSwipe({ inertiaMs: 2600, jitter: .15 })), 1)
})

test('a very fast trackpad swipe advances exactly one phase', () => {
  assert.equal(replay(trackpadSwipe({ peak: 260, inertiaMs: 3000 })), 1)
})

test('a fresh swipe while the previous inertia is still coasting is a second gesture', () => {
  const first = trackpadSwipe({ inertiaMs: 2400 })
  const cut = first.filter(([, time]) => time < 900)
  const second = trackpadSwipe({ start: 900, inertiaMs: 1200 })
  assert.equal(replay([...cut, ...second]), 2)
})

test('two separate swipes count twice, a reversal counts in each direction', () => {
  assert.equal(replay([...trackpadSwipe(), ...trackpadSwipe({ start: 2400 })]), 2)
  const detector = createGestureDetector()
  const down = trackpadSwipe({ inertiaMs: 300 })
  const up = trackpadSwipe({ start: 320, direction: -1, inertiaMs: 300 })
  const directions = [...down, ...up].map(([delta, time]) => detector.push(delta, time)).filter(result => result.trigger).map(result => result.direction)
  assert.deepEqual(directions, [1, -1])
})

test('a long continuous mouse-wheel spin is one gesture, a pause starts another', () => {
  const spin = (start, notches, every = 40) => Array.from({ length: notches }, (_, index) => [100, start + index * every])
  assert.equal(replay(spin(0, 14)), 1)
  assert.equal(replay(spin(0, 6, 150)), 1)
  assert.equal(replay([...spin(0, 5), ...spin(700, 5)]), 2)
})

test('resting fingers and tiny deltas never fire', () => {
  assert.equal(replay([[1, 0], [1, 16], [2, 32], [1, 48]]), 0)
})

test('a spent gesture never fires again, even when it keeps travelling', () => {
  const detector = createGestureDetector()
  const swipe = trackpadSwipe({ inertiaMs: 1600 })
  detector.push(...swipe[0])
  detector.spend()
  assert.equal(replay(swipe.slice(1), detector), 0)
})

test('line and page delta modes are converted to pixels', () => {
  assert.equal(normalizeWheelDelta({ deltaY: 3, deltaMode: 1 }), 48)
  assert.equal(normalizeWheelDelta({ deltaY: 1, deltaMode: 2 }, 900), 900)
  assert.equal(normalizeWheelDelta({ deltaY: -53, deltaMode: 0 }), -53)
})
