import { Effect } from './effect.js'

export class Pulse extends Effect {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    super('pulse-controls')

    this.gain = this._node = context.createGain()
    this.oscillator = context.createOscillator()
    this.oscillator.frequency.value = 0
    this.oscillator.connect(this.gain.gain)

    this.addEventListener(
      'notestarted',
      () => this.oscillator.start(),
      { once: true }
    )

    // this.controls.addEventListener('change', () => {
    //   this.isEnabled = this.oscillator.frequency.value
    // })
  }
}
