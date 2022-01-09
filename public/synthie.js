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
    const { currentTime } = this
    const frequency = toFrequency(key)
    console.log(frequency)

    this.gain.gain.cancelScheduledValues(currentTime)
    this.gain.gain.linearRampToValueAtTime(1, currentTime + 0.200)
    this.oscillator.frequency.setValueAtTime(frequency, currentTime)
  }

  stop (key) {
    this.gain.gain.linearRampToValueAtTime(0, this.currentTime + 0.2)
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
