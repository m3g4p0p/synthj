import { Effect } from './effect.js'

export class LFO extends Effect {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    super('lfo-controls')

    this.gain = this._effect = context.createGain()
    this.oscillator = context.createOscillator()

    this.oscillator.connect(this.gain.gain)

    this.addEventListener(
      'notestarted',
      () => this.oscillator.start(),
      { once: true }
    )
  }
}
