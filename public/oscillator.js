import { Controls } from './controls.js'
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

export class Oscillator extends Controls {
  /**
   * @param {AudioContext} context
   */
  constructor (context, init = {}) {
    super(createControls(), init)

    this.isStarted = false
    this.gain = context.createGain()
    this.oscillator = context.createOscillator()
    this.currentTime = () => context.currentTime

    this.gain.gain.setValueAtTime(0, context.currentTime)
    this.oscillator.connect(this.gain)
  }

  connect (destination) {
    this.gain.connect(destination)

    if (this.isStarted) {
      return
    }

    this.isStarted = true
    this.oscillator.start()
  }

  disconnect () {
    this.gain.disconnect()
  }

  play (key) {
    const currentTime = this.currentTime()
    const frequency = toFrequency(key + this.parseFloat('octave') * 12)

    this.gain.gain.cancelScheduledValues(currentTime)
    this.gain.gain.setValueAtTime(this.parseFloat('gain'), currentTime)
    this.oscillator.type = this.controls.elements.waveform.value
    this.oscillator.frequency.setValueAtTime(frequency, currentTime)
  }

  stop () {
    this.gain.gain.setTargetAtTime(0, this.currentTime(), 0.015)
  }
}
