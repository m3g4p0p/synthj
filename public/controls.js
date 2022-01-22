export class Controls extends EventTarget {
  /**
   * @param {HTMLFormElement} controls
   * @param {object} init
   */
  constructor (controls, init) {
    super()

    this.controls = controls

    if (!controls) {
      return
    }

    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        controls.elements[key].value = value
      })
    }

    controls.addEventListener('change', event => {
      this.dispatchEvent(event, true)

      if (event.target.name !== 'enabled') {
        return
      }

      this.dispatchEvent(new CustomEvent(
        event.target.checked ? 'controlsenabled' : 'controlsdisabled'
      ), true)
    })
  }

  get isEnabled () {
    const input = this.controls?.elements?.enabled
    return !input || input.checked
  }

  dispatchEvent (event, force = false) {
    if (this.isEnabled || force) {
      super.dispatchEvent(event)
    }
  }

  parseFloat (name) {
    return parseFloat(this.controls.elements[name].value)
  }
}
