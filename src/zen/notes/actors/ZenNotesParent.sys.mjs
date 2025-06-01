export class ZenNotesParent extends JSWindowActorParent {
  /*
  constructor() {
    console.log('[ZenNotesParent] INICIOUUUU');
    super();
  }

  async receiveMessage(message) {
    switch (message.name) {
      case 'ZenNotes:OpenNote': {
        this.openNote(this.browsingContext.topChromeWindow, message.data);
        break;
      }
      case 'ZenNotes:CloseNote': {
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
  }*/
}
