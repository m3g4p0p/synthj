import { Oscillator } from './oscillator.js'

window.AudioContext = window.AudioContext || window.webkitAudioContex

export class Synthie {
  constructor () {
    const context = new AudioContext()

    this.oscillators = [
      new Oscillator(context, { gain: 0.5 }),
      new Oscillator(context, { gain: 0.5 })
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
    this.oscillators.forEach(oscillator => oscillator.start())
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
