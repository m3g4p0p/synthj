import { Keyboard } from './keyboard.js'
import { Synthie } from './synthie.js'

const overlay = document.getElementById('overlay')
const keyboard = new Keyboard('keyboard')

overlay.addEventListener('click', () => {
  const synthie = new Synthie()
  overlay.parentElement.removeChild(overlay)
  synthie.connect(keyboard)
})
