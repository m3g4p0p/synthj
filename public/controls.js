export class Controls extends EventTarget {
  /**
   * @param {HTMLFormElement} controls
   * @param {object} init
   */
  constructor (controls, init) {
    super()

    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        controls.elements[key].value = value
      })
    }

    controls.addEventListener('change', event => {
      if (event.target.name !== 'enabled') {
        return
      }

      this.dispatchEvent(new CustomEvent(
        event.target.checked ? 'controlsenabled' : 'controlsdisabled'
      ))
    })

    this.controls = controls
  }

  get isEnabled () {
    const input = this.controls.elements.enabled
    return !input || input.checked
  }

  parseFloat (name) {
    return parseFloat(this.controls.elements[name].value)
  }
}
