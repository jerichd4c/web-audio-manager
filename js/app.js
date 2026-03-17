import { MusicDB } from './db/db.js';
import { MainPlayer } from './components/MainPlayer.js';
import { SongList } from './components/SongList.js';    

const db = new MusicDB();

customElements.define('main-player', MainPlayer);
customElements.define('song-list', SongList);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await db.init();
        console.log('Database initialized successfully, components can be rendered');

        const songListEl = document.querySelector('song-list');
        const mainPlayerEl = document.querySelector('main-player');

        // 1. Load songs stored in the database and update the song list
        const initialSongs = await db.getAllSongs();
        songListEl.updateList(initialSongs);

        // 2. Listen when a song is added
        document.addEventListener('request-add-song', async (event) => {
            const files = event.detail.files;

            // Save every uploaded file to the database
            for (const file of files) {
                await db.addSong(file);
            }

            const allSongs = await db.getAllSongs();
            songListEl.updateList(allSongs);
        });

        // 3. Listen to the request and connects to the audio player
        document.addEventListener('request-play', (event) => {
            const songToPlay= event.detail.song;
            mainPlayerEl.loadAndPlay(songToPlay);
        });
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});