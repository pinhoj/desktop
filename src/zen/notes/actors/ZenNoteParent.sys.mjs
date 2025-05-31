export class ZenNoteParent extends JSWindowActorParent {
  constructor() {
    console.log('[ZenNoteParent] INICIOUUUU');
    super();
  }

  async receiveMessage(message) {
    switch (message.name) {
      case 'ZenNote:OpenNote': {
        this.openNote(this.browsingContext.topChromeWindow, message.data);
        break;
      }
      case 'ZenNote:CloseNote': {
        const params = {
          onTabClose: true,
          ...message.data,
        };
        this.browsingContext.topChromeWindow.gZenNotesManager.closeNote(params);
        break;
      }
      default:
        console.warn(`[note]: Unknown message: ${message.name}`);
    }
  }

  openNote(window, data) {
    window.gZenNotesManager.openNote(data);
  }
}
