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
      if (event.target.name.includes('.')) {
        return this.updateValue(event)
      }

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

  set isEnabled (value) {
    const input = this.controls?.elements?.enabled

    if (input) {
      input.checked = !!value
    }
  }

  /**
   * @param {Event} event
   * @param {Bio} force
   */
  dispatchEvent (event, force = false) {
    if (this.isEnabled || force) {
      super.dispatchEvent(event)
    }
  }

  parseFloat (name) {
    return parseFloat(this.controls.elements[name].value)
  }

  updateValue (event) {
    const { name, value } = event.target
    const chain = name.split('.')
    const prop = chain.pop()
    const target = chain.reduce((target, prop) => target[prop], this)

    if (target[prop] instanceof AudioParam) {
      target[prop].value = parseFloat(value)
    } else {
      target[prop] = value
    }
  }
}
