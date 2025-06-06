export class ZenNotesChild extends JSWindowActorChild {
  constructor() {
    super();
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  async handleEvent(event) {
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
    const doc = this.contentWindow.document;
    const cssAlreadyLoaded = doc.querySelector('link[href*="zenNotes.css"]');

    if (!cssAlreadyLoaded) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'chrome://browser/content/zen-styles/zen-notes.css';
      doc.head.appendChild(link);
    }

     // Inject template once
  if (!doc.getElementById('zen-sticky-template')) {
    const templateHTML = `
      <template id="zen-sticky-template">
        <div id="zen-sticky-note">
          <button class="color-btn">🎨</button>
          <div class="color-panel hidden">
            <div class="color-swatch" style="background:#C8A2C8;" title="Lilas"></div>
            <div class="color-swatch" style="background:#A2C8E8;" title="Azul"></div>
            <div class="color-swatch" style="background:#D1F2C3;" title="Verde"></div>
            <div class="color-swatch" style="background:#FFF9C4;" title="Amarelo"></div>
          </div>
          <button class="minimize-btn">−</button> 
          <button class="close-btn">×</button>
          <textarea class="zen-note-textarea" placeholder="Write your note..."></textarea>
        </div>
      </template>
    `;
    const wrapper = doc.createElement('div');
    wrapper.innerHTML = templateHTML.trim();
    doc.body.appendChild(wrapper.firstElementChild);
  }
  }

openNote() {
  const doc = this.contentWindow.document;

  if (doc.getElementById('zen-sticky-note')) return;

  const template = doc.getElementById('zen-sticky-template');
  if (!template) {
    console.error('Template não encontrado.');
    return;
  }

  const clone = template.content.cloneNode(true);
  const note = clone.querySelector('#zen-sticky-note');
  this.makeDraggable(note);

  // Buttons
  const closeBtn = note.querySelector('.close-btn');
  const minimizeBtn = note.querySelector('.minimize-btn'); // New Minimize Button
  const colorBtn = note.querySelector('.color-btn');
  const colorPanel = note.querySelector('.color-panel');
  const swatches = note.querySelectorAll('.color-swatch');
  const textArea = note.querySelector('.zen-note-textarea');

  // Close button functionality
  closeBtn.addEventListener('click', () => note.remove());

  // Minimize button functionality
  minimizeBtn.addEventListener('click', () => {
    const isMinimized = note.classList.toggle('minimized');

    if (isMinimized) {
      textArea.style.display = 'none'; 
      note.style.width = '150px'; 
      note.style.height = '40px'; 

      // Move color panel between buttons
      colorPanel.style.position = 'absolute';
      colorBtn.style.top = '5px';
      colorBtn.style.left = 'calc(100% - 80px)'; 
    } else {
      textArea.style.display = 'block'; 
      note.style.width = '300px'; 
      note.style.height = '200px'; 

      // Reset color panel position
      colorPanel.style.position = '';
      colorBtn.style.top = '';
      colorBtn.style.left = '';
    }
  });

  // Color selection functionality
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      note.style.backgroundColor = swatch.style.backgroundColor;
      colorPanel.classList.add('hidden');
    });
  });

  colorBtn.addEventListener('click', () => {
    colorPanel.classList.toggle('hidden');
  });

  doc.body.appendChild(note);
}

// Make a DOM element draggable within the window
makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const doc = this.contentWindow.document;

  element.addEventListener('mousedown', (e) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;

    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    // Prevent text selection while dragging
    doc.body.style.userSelect = 'none';
  });

  this.contentWindow.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  this.contentWindow.addEventListener('mouseup', () => {
    isDragging = false;
    doc.body.style.userSelect = '';
  });
}

  onKeyDown(event) {

    if (event.ctrlKey && (event.key === 'w' || event.key === 'W')) {
      event.preventDefault();
      this.openNote();
    }
  }
}