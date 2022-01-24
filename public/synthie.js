import { Oscillator } from './oscillator.js'
import { LFO } from './effects/lfo.js'
import { Sweep } from './effects/sweep.js'
import { NoteEvent } from './event.js'
import { EffectsChain } from './effects/chain.js'

window.AudioContext = window.AudioContext || window.webkitAudioContex

export class Synthie {
  constructor () {
    this.context = new AudioContext()
    this.key = null

    this.oscillators = [
      new Oscillator(this.context, { gain: 0.5 }),
      new Oscillator(this.context, { gain: 0.5 })
    ]

    this.effects = new EffectsChain([
      new LFO(this.context),
      new Sweep(this.context)
    ])
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
    this.effects.connect(
      this.oscillators,
      this.context.destination
    ).dispatchEvent(new NoteEvent(true))

    this.oscillators.forEach(oscillator => {
      oscillator.play(key)
    })
  }

  stop () {
    const event = new NoteEvent(false, {
      cancelable: true
    })

    this.effects.dispatchEvent(event)

    if (event.defaultPrevented) {
      return
    }

    this.oscillators.forEach(oscillator => {
      oscillator.stop()
    })
  }

  /**
   * @param {Event} event
   */
  handleEvent (event) {
    const [command, key] = event.data || event.detail

    switch (command) {
      case 0x80:
        if (this.key) {
          this.key = null
          this.stop()
        }

        break
      case 0x90:
        if (key !== this.key) {
          this.key = key
          this.play(key)
        }
    }
  }
}
