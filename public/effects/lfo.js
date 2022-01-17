import { Effect } from './effect.js'

export class LFO extends Effect {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    super(context, 'lfo-controls')

    this.isStarted = false
    this.gain = this._effect = context.createGain()
    this.oscillator = context.createOscillator()

    this.oscillator.connect(this.gain.gain)
    this.controls.addEventListener('change', this)
  }

  start () {
    if (this.isStarted) {
      return
    }

    this.oscillator.start()
    this.isStarted = true
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
