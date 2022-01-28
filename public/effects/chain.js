export class EffectsChain {
  /**
   * @param {import('./effect').Effect[]} effects
   */
  constructor (effects) {
    this.effects = effects
    this._enabled = 2 ** effects.length
  }

  get mask () {
    return this.effects.reduce((mask, effect, index) => {
      return !effect.isEnabled ? mask : mask + 2 ** index
    }, 0)
  }

  chain (destination) {
    return this.effects.reduceRight((node, effect) => {
      effect.disconnect()

      if (!effect.isEnabled) {
        return node
      }

      effect.connect(node)
      return effect.node
    }, destination)
  }

  connect (sources, destination) {
    const enabled = this.mask

    if (enabled === this._enabled) {
      return this
    }

    const chain = this.chain(destination)
    this._enabled = enabled

    sources.forEach(source => {
      source.disconnect()
      source.connect(chain)
    })

    return this
  }

  dispatchEvent (event) {
    return this.effects
      .filter((_, index) => 2 ** index & this._enabled)
      .map(effect => effect.dispatchEvent(event))
      .every(Boolean)
  }
}
