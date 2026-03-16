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

        document.addEventListener('request-add-song', async (event) => {
            const files = event.detail.files;

            // Save every uploaded file to the database
            for (const file of files) {
                await db.addSong(file);
            }

            console.log(`${files.length} songs added to indexdedDB.`);
        });

    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
});