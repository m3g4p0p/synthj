import { Effect } from './base.js'

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

  connect (destination) {
    if (!this.isStarted) {
      console.log('start')
      this.oscillator.start()
      this.isStarted = true
    }

    return super.connect(destination)
  }

  updateFrequency () {
    console.log(this.parseFloat('frequency'))
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
