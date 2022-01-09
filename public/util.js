export function toFrequency (key, octave = 1) {
  return Math.pow(2, (key - 69) / 12) * 440 * Math.pow(2, octave)
}
