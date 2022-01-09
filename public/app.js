import { Keyboard } from './keyboard.js'
import { Synthie } from './synthie.js'

window.addEventListener('click', () => {
  const keyboard = new Keyboard('keyboard')
  const synthie = new Synthie()

  synthie.connect(keyboard)
}, { once: true })
