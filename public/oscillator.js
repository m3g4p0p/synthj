import { toFrequency } from './util.js'

/**
 * @type {HTMLTemplateElement}
 */
const template = document.getElementById('oscillator-controls')
const oscillators = document.getElementById('oscillators')

function createControls (init) {
  const fragment = template.content.cloneNode(true)
  const controls = fragment.firstElementChild

  Object.entries(init).forEach(([key, value]) => {
    controls.elements[key].value = value
  })

  oscillators.appendChild(fragment)
  return controls
}

export class Oscillator {
  /**
   * @param {AudioContext} context
   */
  constructor (context, init = {}) {
    this.isStarted = false
    this.gain = context.createGain()
    this.oscillator = context.createOscillator()
    this.controls = createControls(init)
    this.currentTime = () => context.currentTime

    this.gain.gain.setValueAtTime(0, context.currentTime)
    this.gain.connect(context.destination)
    this.oscillator.connect(this.gain)

    oscillators.appendChild(this.controls)
  }

  parseFloat (name) {
    return parseFloat(this.controls.elements[name].value)
  }

  start () {
    if (this.isStarted) {
      return
    }

    this.isStarted = true
    this.oscillator.start()
  }

  play (key) {
    const currentTime = this.currentTime()
    const frequency = toFrequency(key + this.parseFloat('octave') * 12)

    this.gain.gain.cancelScheduledValues(currentTime)

    this.gain.gain.linearRampToValueAtTime(
      this.parseFloat('gain'),
      currentTime + this.parseFloat('release')
    )

    this.oscillator.type = this.controls.elements.waveform.value
    this.oscillator.frequency.setValueAtTime(frequency, currentTime)
  }

  stop (key) {
    this.gain.gain.linearRampToValueAtTime(0, this.currentTime() + this.parseFloat('release'))
  }
}
