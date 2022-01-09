import { toFrequency } from './util.js'

/**
 * @type {HTMLTemplateElement}
 */
const template = document.getElementById('oscillator-controls')
const oscillators = document.getElementById('oscillators')

function createControls () {
  const fragment = template.content.cloneNode(true)
  const controls = fragment.firstElementChild

  oscillators.appendChild(fragment)
  return controls
}

export class Oscillator {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    const { currentTime } = context

    this.gain = context.createGain()
    this.oscillator = context.createOscillator()
    this.controls = createControls()
    this.currentTime = () => context.currentTime

    this.gain.connect(context.destination)
    this.gain.gain.setValueAtTime(0, currentTime)

    this.oscillator.connect(this.gain)
    this.oscillator.start(currentTime)

    oscillators.appendChild(this.controls)
  }

  parseFloat (name) {
    return parseFloat(this.controls.elements[name].value)
  }

  play (key) {
    const currentTime = this.currentTime()
    const frequency = toFrequency(key)

    this.gain.gain.cancelScheduledValues(currentTime)
    this.gain.gain.linearRampToValueAtTime(1, currentTime + this.parseFloat('release'))
    this.oscillator.type = this.controls.elements.waveform.value
    this.oscillator.frequency.setValueAtTime(frequency, currentTime)
  }

  stop (key) {
    this.gain.gain.linearRampToValueAtTime(0, this.currentTime() + this.parseFloat('release'))
  }
}
