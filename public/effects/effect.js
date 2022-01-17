import { Controls } from '../controls.js'

export class Effect extends Controls {
  /**
   * @param {AudioContext} context
   * @param {string} elementId
   */
  constructor (context, elementId) {
    super(elementId && document.getElementById(elementId))

    /**
     * @type {Audioeffect}
     */
    this._effect = null
    this.currentTime = () => context.currentTime
  }

  get isEnabled () {
    return this.effect !== null && super.isEnabled
  }

  get effect () {
    return this._effect
  }

  /**
   * @param {Audioeffect|AudioParam} destination
   */
  connect (destination) {
    return this.isEnabled && this.effect.connect(destination)
  }

  disconnect () {
    this.effect.disconnect()
  }

  /**
   * @param {Effect|Audioeffect} other
   */
  chain (other, event) {
    this.disconnect()

    if (!this.isEnabled) {
      return other
    }

    this.connect(other)
    this.dispatchEvent(event)

    return this.effect
  }
}
