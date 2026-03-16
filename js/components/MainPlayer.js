export class MainPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentAudio = new Audio(); // Native HTML5 audio element for playback
    }

    connectedCallback() {
        this.render();
        this.init();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <styles>
        </styles>
        <div class="player-container">

            <img id="cover" src="./resources/default-cover.png" alt="Song Cover" width="150" height="150">
            <h2 id="title">Select a Song</h2>
            <h3 id="artist">Artist</h3>
            <h4 id="genre">Genre</h4>

            <div class="controls">
                <button id="play-pause">Play/Pause</button>
            </div>
        </div>
        `;
    }

    init() {
        this.playPauseButton = this.shadowRoot.getElementById('play-pause');

        this.playPauseButton.addEventListener('click', () => this.togglePlay());

        document.addEventListener('songSelected', (event) => this.loadSong(event.detail.song));
    }

    loadAndPlay(songData) {
        // Converts the song data to URL
        const audioURL = URL.createObjectURL(songData.file);
        this.currentAudio.src = audioURL;
        this.currentAudio.play();

        this.shadowRoot.getElementById('title').textContent = songData.title;
    }

    togglePlay() {
        if (this.currentAudio.paused) {
            this.currentAudio.play();
        } else {
            this.currentAudio.pause();
        }
    }

    // End of life cycle
    disconnectedCallback() {
        this.currentAudio.pause();
        this.currentAudio.src = "";
    }
}