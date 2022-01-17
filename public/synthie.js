import { Oscillator } from './oscillator.js'
import { LFO } from './effects/lfo.js'
import { Sweep } from './effects/sweep.js'

window.AudioContext = window.AudioContext || window.webkitAudioContex

export class Synthie {
  constructor () {
    this.context = new AudioContext()

    this.oscillators = [
      new Oscillator(this.context, { gain: 0.5 }),
      new Oscillator(this.context, { gain: 0.5 })
    ]

    this.effects = [
      new LFO(this.context),
      new Sweep(this.context)
    ]
  }

  get currentTime () {
    return this.context.currentTime
  }

  /**
   * @param {EventTarget} device
   */
  connect (device) {
    device.addEventListener('midimessage', this)
  }

  /**
   * @param {EventTarget} device
   */
  diconnect (device) {
    device.removeEventListener('midimessage', this)
  }

  play (key) {
    const event = new CustomEvent('notestarted')

    const destination = this.effects.reduceRight((node, effect) => {
      return effect.chain(node, event)
    }, this.context.destination)

    this.oscillators.forEach(oscillator => {
      oscillator.connect(destination)
      oscillator.play(key)
    })
  }

  stop (key) {
    const event = new CustomEvent('notestopped', {
      cancelable: true
    })

    this.effects.forEach(effect => {
      effect.dispatchEvent(event)
    })

    if (event.defaultPrevented) {
      return
    }

    this.oscillators.forEach(oscillator => {
      oscillator.stop(key)
    })
  }

  /**
   * @param {Event} event
   */
  handleEvent (event) {
    const [command, key] = event.data || event.detail

    switch (command) {
      case 0x80:
        this.stop(key)
        break
      case 0x90:
        this.play(key)
    }
  }
}
