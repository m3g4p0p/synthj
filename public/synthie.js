import { toFrequency } from './util.js'

window.AudioContext = window.AudioContext || window.webkitAudioContex

export class Synthie {
  constructor () {
    this.context = new AudioContext()
    this.gain = this.context.createGain()
    this.oscillator = this.context.createOscillator()

    this.gain.connect(this.context.destination)
    this.gain.gain.setValueAtTime(0, this.currentTime)

    this.oscillator.connect(this.gain)
    this.oscillator.start(this.currentTime)
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
    const frequency = toFrequency(key)
    console.log(frequency)

    this.gain.gain.setValueAtTime(1, this.currentTime)
    this.oscillator.frequency.setValueAtTime(frequency, this.currentTime)
  }

  stop (key) {
    this.gain.gain.setValueAtTime(0, this.currentTime)
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
