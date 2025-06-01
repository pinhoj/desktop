{
class ZenNotesManager extends ZenDOMOperatedFeature {
  
  _animating = false;
  _lazyPref = {};

  #notes = new Map();
  #currentNoteID = null;

  #confirmationTimeout = null;

  init() {
    /*
    window.addEventListener('TabClose', this.onTabClose.bind(this));
    window.addEventListener('TabSelect', this.onLocationChange.bind(this));

    XPCOMUtils.defineLazyPreferenceGetter(
      this._lazyPref,
      'SHOULD_OPEN_EXTERNAL_TABS_IN_NOTES',
      'zen.notes.open-external-links',
      false
    );

    ChromeUtils.defineLazyGetter(this, 'sidebarButtons', () => document.getElementById('zen-notes-sidebar-container'));
    document.getElementById('tabbrowser-tabpanels').addEventListener('click', this.onOverlayClick.bind(this));
    Services.obs.addObserver(this, 'quit-application-requested');

    //this.#addSidebarButtonListeners();*/
  }
/*
  #addSidebarButtonListeners() {
    this.sidebarButtons.addEventListener('command', (event) => {
      const button = event.target.closest('toolbarbutton');
      if (!button) return;

      switch (button.id) {
        case 'zen-notes-sidebar-close':
          this.closeNote({ onNoteClose: true });
          break;
      }
    });
  }*/

  get #currentBrowser() {
    return this.#notes.get(this.#currentNoteID)?.browser;
  }

  get #currentTab() {
    return this.#notes.get(this.#currentNoteID)?.tab;
  }

  get #currentParentTab() {
    return this.#notes.get(this.#currentNoteID)?.parentTab;
  }
/*
  onOverlayClick(event) {
    if (event.target === this.overlay && event.originalTarget !== this.contentWrapper) {
      this.closeNote({ onNoteClose: true });
    }
  }

  observe(subject, topic) {
    if (topic === 'quit-application-requested') {
      this.onUnload();
    }
  }

  onUnload() {
    for (let [id, note] of this.#notes) {
      gBrowser.removeTab(note.tab, { animate: false });
    }
  }

  getTabPosition(tab) {
    return Math.max(gBrowser.pinnedTabCount, tab._tPos);
  }

  createBrowserElement(url, currentTab, existingTab = null) {
    const newTabOptions = {
      userContextId: currentTab.getAttribute('usercontextid') || '',
      skipBackgroundNotify: true,
      insertTab: true,
      skipLoad: false,
      index: this.getTabPosition(currentTab) + 1,
    };
    currentTab._selected = true;
    const newUUID = gZenUIManager.generateUuidv4();
    const newTab = existingTab ?? gBrowser.addTrustedTab(Services.io.newURI(url).spec, newTabOptions);
    if (currentTab.hasAttribute('zenDefaultUserContextId')) {
      newTab.setAttribute('zenDefaultUserContextId', true);
    }
    currentTab.querySelector('.tab-content').appendChild(newTab);
    newTab.setAttribute('zen-notes-tab', true);
    newTab.setAttribute('note-id', newUUID);
    currentTab.setAttribute('note-id', newUUID);
    this.#notes.set(newUUID, {
      tab: newTab,
      parentTab: currentTab,
      browser: newTab.linkedBrowser,
    });
    this.#currentNoteID = newUUID;
    gBrowser.selectedTab = newTab;
    return this.#currentBrowser;
  }

  fillOverlay(browser) {
    this.overlay = browser.closest('.browserSidebarContainer');
    this.browserWrapper = browser.closest('.browserContainer');
    this.contentWrapper = browser.closest('.browserStack');
  }

  showSidebarButtons(animate = false) {
    if (this.sidebarButtons.hasAttribute('hidden') && animate) {
      gZenUIManager.motion.animate(
        this.sidebarButtons.querySelectorAll('toolbarbutton'),
        { x: [50, 0], opacity: [0, 1] },
        { delay: gZenUIManager.motion.stagger(0.1) }
      );
    }
    this.sidebarButtons.removeAttribute('hidden');
  }

  hideSidebarButtons() {
    this.sidebarButtons.setAttribute('hidden', true);
  }
*/
  openNote(data, existingTab = null, ownerTab = null) {
    if (this.#currentBrowser) {
      return;
    }
    if (gBrowser.selectedTab === this.#currentParentTab) {
      gBrowser.selectedTab = this.#currentTab;
      return;
    }
    /*
    this.animatingOpen = true;
    this._animating = true;

    const initialX = data.x;
    const initialY = data.y;
    const initialWidth = data.width;
    const initialHeight = data.height;

    this.browserWrapper?.removeAttribute('animate');
    this.browserWrapper?.removeAttribute('animate-end');
    this.browserWrapper?.removeAttribute('animate-full');
    this.browserWrapper?.removeAttribute('has-finished-animation');
    this.overlay?.removeAttribute('post-fade-out');
*/
    const currentTab = ownerTab ?? gBrowser.selectedTab;

    const browserElement = this.createBrowserElement(data.url, currentTab, existingTab);

    this.fillOverlay(browserElement);
/*
    this.overlay.classList.add('zen-notes-overlay');

    this.browserWrapper.removeAttribute('animate-end');
    window.requestAnimationFrame(() => {
      this.quickOpenNote({ dontOpenButtons: true });
      this.showSidebarButtons(true);

      gZenUIManager.motion.animate(
        this.#currentParentTab.linkedBrowser.closest('.browserSidebarContainer'),
        {
          scale: [1, 0.98],
          backdropFilter: ['blur(0px)', 'blur(5px)'],
          opacity: [1, 0.5],
        },
        {
          duration: 0.4,
          type: 'spring',
          bounce: 0.2,
        }
      );
      this.#currentBrowser.setAttribute('animate-note-open', true);
      this.overlay.removeAttribute('fade-out');
      this.browserWrapper.setAttribute('animate', true);
      const top = initialY + initialHeight / 2;
      const left = initialX + initialWidth / 2;
      this.browserWrapper.style.top = `${top}px`;
      this.browserWrapper.style.left = `${left}px`;
      this.browserWrapper.style.width = `${initialWidth}px`;
      this.browserWrapper.style.height = `${initialHeight}px`;
      this.browserWrapper.style.opacity = 0.8;
      this.#notes.get(this.#currentNoteID).originalPosition = {
        top: this.browserWrapper.style.top,
        left: this.browserWrapper.style.left,
        width: this.browserWrapper.style.width,
        height: this.browserWrapper.style.height,
      };
      this.browserWrapper.style.transform = 'translate(-50%, -50%)';
      this.overlay.style.overflow = 'visible';
      gZenUIManager.motion
        .animate(
          this.browserWrapper,
          {
            top: '50%',
            left: '50%',
            width: '85%',
            height: '100%',
            opacity: 1,
          },
          {
            duration: 0.3,
            type: 'spring',
            bounce: 0.2,
          }
        )
        .then(() => {
          this.#currentBrowser.removeAttribute('animate-note-open');
          this.overlay.style.removeProperty('overflow');
          this.browserWrapper.removeAttribute('animate');
          this.browserWrapper.setAttribute('animate-end', true);
          this.browserWrapper.setAttribute('has-finished-animation', true);
          this._animating = false;
          this.animatingOpen = false;
        });
    });*/
  }
/*
  _clearContainerStyles(container) {
    const inset = container.style.inset;
    container.removeAttribute('style');
    container.style.inset = inset;
  }

  closeNote({
    noAnimation = false,
    onNoteClose = false,
    setNewID = null,
    isDifferent = false,
    hasFocused = false,
    skipPermitUnload = false,
  } = {}) {
    if (this._animating || !this.#currentBrowser || this.animatingOpen || this._duringOpening) {
      return;
    }

    if (onNoteClose && hasFocused && !this.#confirmationTimeout) {
      const cancelButton = document.getElementById('zen-notes-sidebar-close');
      cancelButton.setAttribute('waitconfirmation', true);
      this.#confirmationTimeout = setTimeout(() => {
        cancelButton.removeAttribute('waitconfirmation');
        this.#confirmationTimeout = null;
      }, 3000);
      return;
    }

    this.browserWrapper.removeAttribute('has-finished-animation');
    if (noAnimation) {
      this._clearContainerStyles(this.#currentParentTab.linkedBrowser.closest('.browserSidebarContainer'));
      this.quickCloseNote({ closeCurrentTab: false });
      return;
    }

    this.closingNote = true;
    this._animating = true;

    gBrowser.zenInsertTabAtIndex(this.#currentTab, {
      index: this.getTabPosition(this.#currentParentTab),
    });

    let quickCloseZen = false;

    this.#currentTab.style.display = 'none';
    this.browserWrapper.style.inset = this.#notes.get(this.#currentNoteID)?.originalPosition || '';

    this.hideSidebarButtons();

    const parentBrowserContainer = this.#currentParentTab.linkedBrowser.closest('.browserSidebarContainer');
    gZenUIManager.motion
      .animate(
        parentBrowserContainer,
        {
          scale: [0.98, 1],
          backdropFilter: ['blur(5px)', 'blur(0px)'],
          opacity: [0.5, 1],
        },
        {
          duration: 0.3,
          type: 'spring',
          bounce: 0.2,
        }
      )
      .then(() => {
        this.#currentParentTab._visuallySelected = true;
      });

    gZenUIManager.motion
      .animate(
        this.browserWrapper,
        {
          width: ['85%', '0%'],
          height: ['100%', '0%'],
          opacity: [1, 0],
          left: [null, this.#notes.get(this.#currentNoteID).originalPosition?.left || '50%'],
          top: [null, this.#notes.get(this.#currentNoteID).originalPosition?.top || '50%'],
        },
        {
          duration: 0.3,
          type: 'spring',
          bounce: 0.2,
        }
      )
      .then(() => {
        if (quickCloseZen) {
          this.quickCloseNote({ closeCurrentTab: false, closeParentTab: false });
          return;
        }
        this.#currentTab.removeAttribute('note-id');
        this.#currentParentTab.removeAttribute('note-id');
        this.#notes.delete(this.#currentNoteID);
        this._animating = false;
        this.closingNote = false;
      });
  }

  onTabClose(event) {
    if (event.target === this.#currentParentTab) {
      this.closeNote({ onTabClose: true });
    }
  }

  quickCloseNote({
    closeCurrentTab = true,
    closeParentTab = true,
    justAnimateParent = false,
    clearID = true,
  } = {}) {
    const parentHasBrowser = !!this.#currentParentTab.linkedBrowser;
    this.hideSidebarButtons();

    if (parentHasBrowser) {
      this.#currentParentTab.linkedBrowser.closest('.browserSidebarContainer').classList.remove('zen-notes-background');
    }

    if (!justAnimateParent && this.overlay) {
      if (parentHasBrowser) {
        if (closeParentTab) {
          this.#currentParentTab.linkedBrowser.closest('.browserSidebarContainer').classList.remove('deck-selected');
        }
        this.#currentParentTab.linkedBrowser.zenModeActive = false;
      }
      this.#currentBrowser.zenModeActive = false;
      if (closeParentTab && parentHasBrowser) {
        this.#currentParentTab.linkedBrowser.docShellIsActive = false;
      }
      if (closeCurrentTab) {
        this.#currentBrowser.docShellIsActive = false;
        this.overlay.classList.remove('deck-selected');
        this.#currentTab._selected = false;
      }
      if (!this.#currentParentTab._visuallySelected && closeParentTab) {
        this.#currentParentTab._visuallySelected = false;
      }
      this.#currentBrowser.removeAttribute('zen-notes-selected');
      this.overlay.classList.remove('zen-notes-overlay');
    }

    if (clearID) {
      this.#currentNoteID = null;
    }
  }

  onLocationChange() {
    if (this._animating) {
      return;
    }
    if (!this.#currentNoteID) {
      return;
    }
    this.quickOpenNote();
  }

  clearConfirmationTimeout() {
    if (this.#confirmationTimeout) {
      clearTimeout(this.#confirmationTimeout);
      this.#confirmationTimeout = null;
    }
    document.getElementById('zen-notes-sidebar-close')?.removeAttribute('waitconfirmation');
  }

  onNoteClose(event) {
    if (event.target === this.#currentParentTab) {
      this.closeNote({ onNoteClose: true });
    }
  }*/
}

window.gZenNotesManager = new ZenNotesManager();

function registerWindowActors() {
    if (Services.prefs.getBoolPref('zen.notes.enabled', true)) {
      gZenActorsManager.addJSWindowActor('ZenNotes', {
        parent: {
          esModuleURI: 'chrome://browser/content/zen-components/actors/ZenNotesParent.sys.mjs',
        },
        child: {
          esModuleURI: 'chrome://browser/content/zen-components/actors/ZenNotesChild.sys.mjs',
          events: {
            DOMContentLoaded: {},
            keydown: {
              capture: true,
            },
          },
        },
        allFrames: true,
        matches: ['*://*/*'],
      });
    }
  }

  registerWindowActors();

}
