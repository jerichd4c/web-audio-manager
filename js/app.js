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
        
        let currentQueue = [];
        let currentIndex = -1;

        // Aux function to reaload the list
        const loadSongsFromDB = async () => {
            currentQueue = await db.getAllSongs();
            songListEl.updateList(currentQueue);
        };

        // 1. Load songs stored in the database and update the song list
        await loadSongsFromDB();

        // 2. Listen when a song is added
        document.addEventListener('request-add-song', async (event) => {
            const files = event.detail.files;

            // Save every uploaded file to the database
            for (const file of files) {
                await db.addSong(file);
            }

            await loadSongsFromDB();
        });

        // 3. Listen to the request and connects to the audio player
        document.addEventListener('request-play', (event) => {
            const songToPlay= event.detail.song;
            // Find the index of the song to play in the current queue
            currentIndex = currentQueue.findIndex(s => s.id === songToPlay.id);
            mainPlayerEl.loadAndPlay(songToPlay);
        });

        // 4. Next Button
        mainPlayerEl.addEventListener('request-next', () => {
            if (currentQueue.length === 0) return; 
            // Move to the next song, goes to 0 if at the end
            currentIndex = (currentIndex + 1) % currentQueue.length;
            mainPlayerEl.loadAndPlay(currentQueue[currentIndex]);
        });

        // 5. Previous Button
        mainPlayerEl.addEventListener('request-prev', () => {
            if (currentQueue.length === 0) return; 
            // Move to the previous song, goes to the last if at the start
            currentIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
            mainPlayerEl.loadAndPlay(currentQueue[currentIndex]);
        });

    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});