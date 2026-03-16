export class SongList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.init();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <styles>
        </styles>
        <div class="header">
            <h2>My Songs</h2>
            <button class="add-song" id="add-song">Add Song</button>
            <input type="file" id="file-input" accept="audio/mp3, audio/m4a" multiple hidden>
        </div>
        <div id="list container"></div>
        `;
    }

    init() {
        const addBtn = this.shadowRoot.getElementById('add-song');
        const fileInput = this.shadowRoot.getElementById('file-input');

        addBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (event) => this.handleFileSelect(event));
    }

    handleFile(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        //Composed: true allows the event to bypass the shadow DOM and be listened to by other components
        const addSongEvent = new CustomEvent('request-add-song', {
            detail: { files },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(addSongEvent);

        event.target.value = ''; // Reset the file input for future uploads
    }
    disconnectedCallback() {
        // Clean up any event listeners if necessary
    }
}