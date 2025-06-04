{
class ZenNotesManager extends ZenDOMOperatedFeature {
  

  #notes = new Map();
  #currentNoteID = null;

  noteTemplate;

  init() {
    
    window.addEventListener('TabClose', this.onTabClose.bind(this));
    window.addEventListener('TabSelect', this.onLocationChange.bind(this));

    ChromeUtils.defineLazyGetter(this, 'noteTemplate', () => document.getElementById('zen-note-template'));
    
  }

  onOverlayClick(event) {
    if (event.target === this.overlay && event.originalTarget !== this.contentWrapper) {
      this.closeNote({ onNoteClose: true });
    }
  }

  getTabPosition(tab) {
    return Math.max(gBrowser.pinnedTabCount, tab._tPos);
  }

  async createBrowserElement(currentTab, existingTab = null) {
    // Create a new <zen-note> element
    let noteElement = document.createElement('zen-note');
    const noteContent = await noteElement.createNoteElement();  // Generates the actual content (panel)
    
    const newUUID = gZenUIManager.generateUuidv4();
    currentTab._selected = true;

    // Attach note panel to tab content
    currentTab.querySelector('.tab-content').appendChild(noteContent);
    currentTab.setAttribute('note-id', newUUID);

    this.#notes.set(newUUID, {
      note: noteContent,
      parentTab: currentTab,
    });

    this.#currentNoteID = newUUID;
  }


  async openNote() {
    const wrapper = document.getElementById('zen-main-app-wrapper');

    let noteElement = document.querySelector('zen-note');
    if (!noteElement) {
      await customElements.whenDefined('zen-note');
      noteElement = document.createElement('zen-note');
      document.body.appendChild(noteElement);
      const noteContent = await noteElement.createNoteElement();
      wrapper.appendChild(noteContent);
    }
  }

  onTabClose(event) {
    const currentNote = this.#notes.get(this.#currentNoteID);
    if (event.target === currentNote?.parentTab) {
      this.closeNote(this.#currentNoteID);
    }
  }

  onLocationChange() {
    if (!this.#currentNoteID) return;
    this.openNote();
  }
}



class ZenNoteElement extends MozXULElement {
  static get markup() {
      return `
        <panel id="zen-note" hidden="true">
            <vbox>
              <image id="zen-note-close" class="toolbarbutton-1"/>
              <textarea placeholder="Write your note..."></textarea>
              <button id="note-color-button"></button>
              <div id="note-color-panel">
                <button class="note-color-swatch" style="background-color: #C8A2C8;"></button>
                <button class="note-color-swatch" style="background-color: #A2C8E8;"></button>
                <button class="note-color-swatch" style="background-color: #D1F2C3;"></button>
                <button class="note-color-swatch" style="background-color: #FFF9C4;"></button>
              </div>
            </vbox>
          </panel>
      `;
    }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Optional: Auto-create note on connection
  }

  async createNoteElement() {
    const fragment = window.MozXULElement.parseXULToFragment(noteHTML);
    const newNote = fragment.querySelector('#zen-note');
    newNote.querySelector('#zen-note-close').addEventListener("click", this.#cleanNote(newNote));
    newNote.querySelector('#note-color-button').addEventListener('click', () => newNote.querySelector('#note-color-panel').classList.toggle('hidden'));

    const swatches = newNote.querySelectorAll('.note-color-swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color || swatch.style.backgroundColor;
            newNote.style.backgroundColor = color;
            newNote.querySelector('#note-color-panel').classList.add('hidden');
        });
    });
    Object.assign(newNote.style, {
      left: `${200}px`,
      top: `${200}px`,
      transform: 'translate(-50%, -50%)',
    });
    

    return newNote;
  }


  #cleanNote(element) {
    if (element && element.remove) {
      element.remove();
    }
  }

}

customElements.define('zen-note', ZenNoteElement);

window.gZenNotesManager = new ZenNotesManager();

// function registerWindowActors() {
//     if (Services.prefs.getBoolPref('zen.notes.enabled', true)) {
//       gZenActorsManager.addJSWindowActor('ZenNotes', {
//         parent: {
//           esModuleURI: 'chrome://browser/content/zen-components/actors/ZenNotesParent.sys.mjs',
//         },
//         child: {
//           esModuleURI: 'chrome://browser/content/zen-components/actors/ZenNotesChild.sys.mjs',
//           events: {
//             DOMContentLoaded: {},
//             keydown: {
//               capture: true,
//             },
//           },
//         },
//         allFrames: true,
//         matches: ['*://*/*'],
//       });
//     }
//   }

//   registerWindowActors();

}
