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
  }

openNote() {
  const doc = this.contentWindow.document;

  // Prevent duplicate notes
  if (doc.getElementById('zen-sticky-note')) return;
  const note = doc.createElement('div');
  note.id = 'zen-sticky-note';
  this.makeDraggable(note);

  // Close button
  const closeBtn = doc.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => note.remove());

  // Textarea
  const textarea = doc.createElement('textarea');
  textarea.className = 'zen-note-textarea';
  textarea.placeholder = 'Write your note...';

  
  // Color picker button
  const colorBtn = doc.createElement('button');
  colorBtn.className = 'color-btn';
  colorBtn.textContent = '🎨';

  // Color panel (hidden by default)
  const colorPanel = doc.createElement('div');
  colorPanel.className = 'color-panel hidden';

  const colors = {
    lilas: '#C8A2C8',
    azul: '#A2C8E8',
    verde: '#D1F2C3',
    amarelo: '#FFF9C4',
  };

  // Create color swatches inside the panel
  Object.entries(colors).forEach(([name, color]) => {
    const swatch = doc.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    swatch.title = name.charAt(0).toUpperCase() + name.slice(1);
    swatch.addEventListener('click', () => {
      note.style.backgroundColor = color;
      colorPanel.classList.add('hidden');
    });
    colorPanel.appendChild(swatch);
  });

  colorBtn.addEventListener('click', () => {
    colorPanel.classList.toggle('hidden');
  });

  note.appendChild(colorBtn);
  note.appendChild(colorPanel);
  note.appendChild(closeBtn);
  note.appendChild(textarea);
  doc.body.appendChild(note);
}

// Make a DOM element draggable within the window
makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener('mousedown', (e) => {
    // Only drag with left mouse button
    if (e.button !== 0) return;

    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  });

  this.contentWindow.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  this.contentWindow.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
}

  onKeyDown(event) {

    if (event.ctrlKey && (event.key === 'w' || event.key === 'W')) {
      event.preventDefault();
      this.openNote();
    }
  }
}
