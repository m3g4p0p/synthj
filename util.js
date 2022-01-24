export function toFrequency (key, octave = 1) {
  return Math.pow(2, (key - 69) / 12) * 440 * Math.pow(2, octave)
}

export function addEventListeners (events, target, handler = target) {
  events.forEach(event => target.addEventListener(event, handler))
}

export function removeEventListeners (events, target, handler = target) {
  events.forEach(event => target.removeEventListener(event, handler))
}
