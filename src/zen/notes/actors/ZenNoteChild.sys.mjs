export class ZenNoteChild extends JSWindowActorChild {
  constructor() {
    super();
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  async handleEvent(event) {
    console.trace('Chamou o handleEvent de ZenNoteChild:');
    switch (event.type) {
      case 'DOMContentLoaded':
        await this.initiateNotes();
        break;
      case 'keydown':
        this.onKeyDown(event);
        break;
      default:
    }
  }

  async receiveMessage(message) {
    switch (message.name) {
    }
  }

  async initiateNotes() {
    this.contentWindow.addEventListener('keydown', this.onKeyDown);
  }

  // Create a note (textarea) element and append it to the body
  openNote() {

    const win = this.contentWindow;
    const width = 400;
    const height = 300;
    
    this.sendAsyncMessage('ZenNote:OpenNote', {
      url: 'about:zen-note',
      x: (win.innerWidth - width) / 2,
      y: (win.innerHeight - height) / 2,
      width,
      height,
    });
  }


  onKeyDown(event) {

    if (event.ctrlKey && (event.key === 'w' || event.key === 'W')) {
      event.preventDefault(); // evitar que feche a aba
      this.openNote();
    }
    if (event.defaultPrevented || event.key !== 'Escape') {
      return;
    }
    this.sendAsyncMessage('ZenNote:CloseNote', {
      hasFocused: this.contentWindow.document.activeElement !== this.contentWindow.document.body,
    });
  }
}
