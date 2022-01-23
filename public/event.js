export class NoteEvent extends CustomEvent {
  static fromMidiMessage (event, init) {
    const [command, key] = event.data

    return new this(command === 0x90, {
      ...init,
      detail: key
    })
  }

  constructor (started, init) {
    super(started ? 'notestarted' : 'notestopped', init)
  }
}
