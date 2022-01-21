export class EffectChain {
  /**
   * @param {import('./effect').Effect[]} effects
   */
  constructor (effects) {
    this.effects = effects
  }

  connect (destination) {
    const event = new CustomEvent('notestarted')

    return this.effects.reduceRight((node, effect) => {
      if (!effect.isEnabled) {
        return node
      }

      effect.connect(node)
      effect.dispatchEvent(event)

      return effect.effect
    }, destination)
  }
}
