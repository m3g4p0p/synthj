export class Keyboard extends EventTarget {
  constructor (elementId) {
    super()

    const keyboard = document.getElementById(elementId)
    const buttons = keyboard.querySelectorAll('button')

    buttons.forEach(button => {
      button.addEventListener('touchstart', this.togglePressed(true))
      button.addEventListener('mousedown', this.togglePressed(true))
      button.addEventListener('mouseenter', this.togglePressed(event => event.buttons))

      button.addEventListener('touchend', this.togglePressed(false))
      button.addEventListener('touchcancel', this.togglePressed(false))
      button.addEventListener('mouseup', this.togglePressed(false))
      button.addEventListener('mouseleave', this.togglePressed(false))
    })
  }

  togglePressed (value) {
    return event => {
      const pressed = typeof value === 'boolean' ? value : value(event)
      const key = parseInt(event.target.value, 10)

      event.preventDefault()
      event.target.classList.toggle('-is-pressed', pressed)

      this.dispatchEvent(new CustomEvent('midimessage', {
        detail: pressed ? [0x90, key, 127] : [0x80, key, 0]
      }))
    }
  }
}
