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
    this._node = null

    this.controls.addEventListener('change', event => {
      if (event.target.name.includes('.')) {
        return this.updateValue(event)
      }
    })
  }

  get isEnabled () {
    return this.node !== null && super.isEnabled
  }

  get node () {
    return this._node
  }

  get currentTime () {
    return this._node?.context.currentTime
  }

  /**
   * @param {AudioNode|AudioParam} destination
   */
  connect (destination) {
    return this.isEnabled && this.node.connect(destination)
  }

  disconnect () {
    this.node.disconnect()
  }

  /**
   * @param {AudioNode} other
   * @param {Event} event
   * @returns {AudioNode}
   */
  chain (other, event) {
    this.disconnect()

    if (!this.isEnabled) {
      return other
    }

    this.connect(other)
    this.dispatchEvent(event)

    return this.node
  }
}
