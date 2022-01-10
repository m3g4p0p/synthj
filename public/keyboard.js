const BLACK_KEYS = [1, 3, 6, 8, 10]

function createKeys (from, to) {
  const fragment = document.createDocumentFragment()

  for (let i = from; i <= to; i++) {
    const key = document.createElement('div')
    const button = document.createElement('button')

    button.name = 'key'
    button.value = i
    key.className = 'key ' + (BLACK_KEYS.includes(i % 12) ? '-is-black' : '-is-white')
    key.appendChild(button)
    fragment.appendChild(key)
  }

  return fragment
}

export class Keyboard extends EventTarget {
  constructor (elementId) {
    super()

    /**
     * @type {HTMLButtonElement|null}
     */
    this.pressed = null

    const keyboard = document.getElementById(elementId)
    const keys = createKeys(60, 71)

    keyboard.appendChild(keys)
    keyboard.addEventListener('mousedown', this)
    keyboard.addEventListener('mouseup', this)
    keyboard.addEventListener('mousemove', this)
    keyboard.addEventListener('touchstart', this)
    keyboard.addEventListener('touchend', this)
    keyboard.addEventListener('touchmove', this)
  }

  /**
   * @param {HTMLButtonElement} target
   * @param {boolean} isPressed
   */
  dispatchMIDIEvent (target, isPressed) {
    const key = parseInt(target.value, 10)

    if (this.pressed) {
      this.pressed.classList.remove('-is-pressed')
    }

    this.pressed = isPressed ? target : null
    target.classList.toggle('-is-pressed', isPressed)

    this.dispatchEvent(new CustomEvent('midimessage', {
      detail: isPressed ? [0x90, key, 127] : [0x80, key, 0]
    }))
  }

  /**
   * @param {MouseEvent} event
   */
  handleMouseMove (event) {
    if (event.target !== this.pressed) {
      this.dispatchMIDIEvent(event.target, event.buttons)
    }
  }

  /**
   * @param {TouchEvent} event
   */
  handleTouchMove (event) {
    const [{ pageX, pageY }] = event.changedTouches
    const target = document.elementFromPoint(pageX, pageY)

    switch (true) {
      case target === this.pressed:
        return
      case target && target.name === 'key':
        return this.dispatchMIDIEvent(target, true)
      case this.pressed !== null:
        return this.dispatchMIDIEvent(this.pressed, false)
    }
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   */
  handleEvent (event) {
    if (!event.target.value) {
      return
    }

    event.preventDefault()

    switch (event.type) {
      case 'mouseup':
      case 'touchend':
        return this.dispatchMIDIEvent(event.target, false)
      case 'mousedown':
      case 'touchstart':
        return this.dispatchMIDIEvent(event.target, true)
      case 'mousemove':
        return this.handleMouseMove(event)
      case 'touchmove':
        return this.handleTouchMove(event)
    }
  }
}
