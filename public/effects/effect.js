import { Controls } from '../controls.js'

export class Effect extends Controls {
  /**
   * @param {string} elementId
   */
  constructor (elementId) {
    super(elementId && document.getElementById(elementId))

    /**
     * @type {AudioNode}
     */
    this._effect = null

    this.controls.addEventListener('change', event => {
      if (event.target.name.includes('.')) {
        return this.updateValue(event)
      }
    })
  }

  get isEnabled () {
    return this.effect !== null && super.isEnabled
  }

  get effect () {
    return this._effect
  }

  get currentTime () {
    return this._effect?.context.currentTime
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
