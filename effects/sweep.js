import { Effect } from './effect.js'

export class Sweep extends Effect {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    super('sweep-controls')

    this.gain = this._effect = context.createGain()
    this.gain.gain.setValueAtTime(0, context.currentTime)
    this.addEventListener('notestarted', this)
    this.addEventListener('notestopped', this)
  }

  rampTo (value, name) {
    const { currentTime } = this
    const endTime = currentTime + this.parseFloat(name)

    this.gain.gain.cancelAndHoldAtTime(currentTime)
    this.gain.gain.linearRampToValueAtTime(value, endTime)
  }

  handleEvent (event) {
    switch (event.type) {
      case 'notestarted':
        return this.rampTo(1, 'attack')
      case 'notestopped':
        event.preventDefault()
        this.rampTo(0, 'release')
    }
  }
}
