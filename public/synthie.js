import { LFO } from './effects.js'
import { Oscillator } from './oscillator.js'

window.AudioContext = window.AudioContext || window.webkitAudioContex

export class Synthie {
  constructor () {
    this.context = new AudioContext()

    this.oscillators = [
      new Oscillator(this.context, { gain: 0.5 }),
      new Oscillator(this.context, { gain: 0.5 })
    ]

    this.effects = [
      new LFO(this.context)
    ]
  }

  get currentTime () {
    return this.context.currentTime
  }

  /**
   * @param {EventTarget} device
   */
  connect (device) {
    const { destination } = [
      ...this.effects,
      this.context
    ].reduceRight((destination, current) => {
      return current.chain(destination)
    })

    device.addEventListener('midimessage', this)
    console.log(destination)

    this.oscillators.forEach(oscillator => {
      oscillator.connect(destination)
    })
  }

  /**
   * @param {EventTarget} device
   */
  diconnect (device) {
    device.removeEventListener('midimessage', this)
  }

  play (key) {
    this.oscillators.forEach(oscillator => oscillator.play(key))
  }

  stop (key) {
    this.oscillators.forEach(oscillator => oscillator.stop(key))
  }

  /**
   * @param {Event} event
   */
  handleEvent (event) {
    const [command, key, velocity] = event.data || event.detail

    switch (command) {
      case 0x80:
        this.stop(key)
        break
      case 0x90:
        this.play(key)
    }
  }
}
