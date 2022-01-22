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

    this.addEventListener('change', event => {
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

  updateValue (event) {
    const { name, value } = event.target
    const chain = event.target.name.split('.')
    const prop = chain.pop()
    const target = chain.reduce((target, prop) => target[prop], this)

    if (target[prop] instanceof AudioParam) {
      target[prop].setValueAtTime(this.parseFloat(name, this.currentTime()))
    } else {
      target[prop] = value
    }
  }
}
