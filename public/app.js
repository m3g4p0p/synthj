import { Keyboard } from './keyboard.js'
import { Synthie } from './synthie.js'

const overlay = document.getElementById('overlay')
const keyboard = new Keyboard('keyboard')
const synthie = new Synthie()

overlay.addEventListener('click', () => {
  overlay.parentElement.removeChild(overlay)
  synthie.connect(keyboard)
})
