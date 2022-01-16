import { Controls } from '../controls.js'

export class Effect extends Controls {
  /**
   * @param {AudioContext} context
   * @param {string} elementId
   */
  constructor (context, elementId) {
    super(elementId && document.getElementById(elementId))

    /**
     * @type {AudioNode}
     */
    this._node = null
    this.currentTime = () => context.currentTime
  }

  get isEnabled () {
    return this.node !== null && super.isEnabled
  }

  get node () {
    return this._node
  }

  get input () {
    return this.node
  }

  get output () {
    return this.node
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
   * @param {Effect|AudioNode} other
   */
  chain (other) {
    this.disconnect()

    if (!this.isEnabled) {
      return other
    }

    this.connect(other)
    return this.node
  }
}
