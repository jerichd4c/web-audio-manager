import { MusicDB } from './db/db.js';

const db = new MusicDB();

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await db.init();
        console.log('Database initialized successfully, components can be rendered');
    }
    
    catch (error) {
        console.error('Failed to initialize database:', error);
    }
});