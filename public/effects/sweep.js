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

  start () {
    const currentTime = this.currentTime()

    this.gain.gain.cancelScheduledValues(currentTime)
    this.gain.gain.linearRampToValueAtTime(1, currentTime + this.parseFloat('attack'))
  }

  stop () {
    this.gain.gain.linearRampToValueAtTime(0, this.currentTime() + this.parseFloat('release'))
  }

  handleEvent (event) {
    switch (event.type) {
      case 'notestarted':
        return this.start()
      case 'notestopped':
        event.preventDefault()
        this.stop()
    }
  }
}
