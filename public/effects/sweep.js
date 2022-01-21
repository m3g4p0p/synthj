import { Effect } from './effect.js'

export class Sweep extends Effect {
  /**
   * @param {AudioContext} context
   */
  constructor (context) {
    super(context, 'sweep-controls')

    this.gain = this._effect = context.createGain()
    this.gain.gain.setValueAtTime(0, context.currentTime)
    this.addEventListener('notestarted', this)
    this.addEventListener('notestopped', this)
  }

  rampTo (from, to, name) {
    const currentTime = this.currentTime()
    const endTime = currentTime + this.parseFloat(name)

    this.gain.gain.cancelScheduledValues(currentTime)
    this.gain.gain.setValueAtTime(from, currentTime)
    this.gain.gain.linearRampToValueAtTime(to, endTime)
  }

  handleEvent (event) {
    if (!this.isEnabled) {
      return
    }

    switch (event.type) {
      case 'notestarted':
        return this.rampTo(0, 1, 'attack')
      case 'notestopped':
        event.preventDefault()
        this.rampTo(this.gain.gain.value, 0, 'release')
    }
  }
}
