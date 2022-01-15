import { Controls } from './controls.js'

class Effect extends Controls {
  /**
   * @param {AudioContext} context
   * @param {string} elementId
   */
  constructor (context, elementId) {
    super(document.getElementById(elementId))

    /**
     * @type {AudioNode}
     */
    this.destination = null
    this.currentTime = () => context.currentTime
  }

  get isEnabled () {
    return this.destination !== null && super.isEnabled
  }

  /**
   * @param {Effect|AudioNode|AudioParam} destination
   */
  connect (destination) {
    if (this.isEnabled) {
      this.destination.connect(destination)
    } else {
      this.destination.disconnect()
    }

    return destination
  }

  /**
   * @param {Effect|AudioDestinationNode} other
   */
  chain (other) {
    this.connect(other.destination)
    return this
  }
}

export class LFO extends Effect {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    super(context, 'lfo-controls')

    this.isStarted = false
    this.destination = context.createGain()
    this.oscillator = context.createOscillator()

    this.oscillator.connect(this.destination.gain)
    this.controls.addEventListener('change', this)
  }

  connect (destination) {
    if (!this.isStarted) {
      this.oscillator.start()
      this.isStarted = true
    }

    return super.connect(destination)
  }

  updateFrequency () {
    this.oscillator.frequency.setValueAtTime(
      this.parseFloat('frequency'),
      this.currentTime()
    )
  }

  handleEvent (event) {
    switch (event.target.name) {
      case 'frequency':
        return this.updateFrequency()
      case 'waveform':
        this.oscillator.type = event.target.value
    }
  }
}
