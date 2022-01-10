import { Keyboard } from './keyboard.js'
import { Synthie } from './synthie.js'

const overlay = document.getElementById('overlay')

overlay.addEventListener('click', () => {
  const keyboard = new Keyboard('keyboard')
  const synthie = new Synthie()

  synthie.connect(keyboard)
  overlay.parentElement.removeChild(overlay)
})
