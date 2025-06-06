{
class ZenNotesManager extends ZenDOMOperatedFeature {

  init() {
  }

}

function registerWindowActors() {
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

  registerWindowActors();

}