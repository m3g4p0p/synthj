const keyboard = document.getElementById('keyboard')
const keys = keyboard.querySelectorAll('button')

keys.forEach(key => {
  key.addEventListener('mousedown', () => {
    key.classList.add('-is-pressed')
  })

  key.addEventListener('mouseup', () => {
    key.classList.remove('-is-pressed')
  })
})
