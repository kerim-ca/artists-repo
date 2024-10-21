
const pool = require("./pool");

async function getAllArtists(){
    try {
        const { rows } = await pool.query("SELECT * FROM artists");
        return rows;
    } catch (error) {
        console.error("Error fetching artists:", error);
        throw error;
    }
    
}


async function insertArtist(artistName, genre){
    try {
        const result = await pool.query("INSERT INTO artists (artist_name, genre) VALUES ($1, $2) RETURNING *", [artistName, genre]); 
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting artist:", error);
        throw error;
    }
   
}

async function insertAlbum(albumName, albumYear, artistIds) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const albumResult = await client.query(
            "INSERT INTO albums (album_name, album_year) VALUES ($1, $2) RETURNING *",
            [albumName, albumYear]
        );
        const newAlbum = albumResult.rows[0];
        console.log("New album inserted:", newAlbum);

        for (let artistId of artistIds) {
            const result = await client.query(
                "INSERT INTO album_artists (album_id, artist_id) VALUES ($1, $2) RETURNING *",
                [newAlbum.id, artistId]
            );
            console.log(`Album-artist relationship inserted: `, result.rows[0]);
        }

        await client.query('COMMIT');
        return newAlbum;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error inserting album:", error);
        throw error;
    } finally {
        client.release();
    }
}

async function insertSong(songName, albumId, duration){

    try {
        const result = await pool.query("INSERT INTO songs (song_name,  album_id, duration) VALUES ($1, $2, $3) RETURNING *", [songName,  albumId, duration]); 
        return result.rows[0];
    } catch (error) {
        console.error("Error inserting song:", error);
        throw error;
    }

    
}


async function getArtistById(id) {
    const { rows } = await pool.query("SELECT * FROM artists WHERE id = $1", [id]);
    return rows[0];
}


async function getAlbumsByArtist(artistId) {
    console.log("Fetching albums for artist ID:", artistId);
    try {
        const query = `
            SELECT DISTINCT albums.*
            FROM albums
            JOIN album_artists ON albums.id = album_artists.album_id
            WHERE album_artists.artist_id = $1
        `;
        console.log("Executing query:", query);
        console.log("With artist ID:", artistId);
        
        const { rows } = await pool.query(query, [artistId]);
        
        console.log("Albums found:", rows);
        return rows;
    } catch (error) {
        console.error("Error fetching albums for artist:", error);
        throw error;
    }
}

async function getAlbumById(id) {
    const { rows } = await pool.query("SELECT * FROM albums WHERE id = $1", [id]);
    return rows[0];
}


async function getSongsByAlbum(albumId) {
    const { rows } = await pool.query("SELECT * FROM songs WHERE album_id = $1", [albumId]);
    return rows;
}

async function insertSong(song_name, album_id, duration) {
    try {
        const result = await pool.query(
            "INSERT INTO songs (song_name, album_id, duration) VALUES ($1, $2, $3) RETURNING *",
            [song_name, album_id, duration]
        );
        return result.rows[0];  // Return the inserted song
    } catch (err) {
        console.error('Error inserting song:', err);
        throw err;
    }
}






module.exports = {
    getAllArtists, 
    insertArtist, 
    insertAlbum, 
    insertSong, 
    getArtistById, 
    getAlbumsByArtist, 
    getArtistById, 
    getAlbumById, 
    getSongsByAlbum, 
}