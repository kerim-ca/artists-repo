

const pool = require('./pool');

async function createTables() {

    const dropTables = `
        DROP TABLE IF EXISTS album_artists;
        DROP TABLE IF EXISTS songs;
        DROP TABLE IF EXISTS albums;
        DROP TABLE IF EXISTS artists;
    `;
    
    const createArtistsTable = `
        CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            artist_name VARCHAR(255),
            genre VARCHAR(255)
        );
    `;

    const createAlbumsTable = `
    CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        album_name VARCHAR(255),
        album_year INT NOT NULL
    );
`;

    const createAlbumArtistsTable = `
        CREATE TABLE IF NOT EXISTS album_artists (
            album_id INT NOT NULL,
            artist_id INT NOT NULL,
            PRIMARY KEY (album_id, artist_id),
            FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
            FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
        );
    `;

    const createSongsTable = `
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            song_name VARCHAR(255),
            duration TIME,
            album_id INT NOT NULL,
            FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
        );
    `;

    try {
        await pool.query(dropTables);
        await pool.query(createArtistsTable);
        await pool.query(createAlbumsTable);
        await pool.query(createAlbumArtistsTable);
        await pool.query(createSongsTable);
        console.log("Tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}

async function insertInitialData() {
    const insertArtists = `
        INSERT INTO artists (artist_name, genre)
        VALUES 
        ('Bill Evans', 'Jazz'),
        ('Jim Hall', 'Jazz')
        RETURNING id;
    `;

    const insertAlbum = `
    INSERT INTO albums (album_name, album_year)
    VALUES ('Undercurrent', 1962)
    RETURNING id;
`;

    const insertAlbumArtists = `
        INSERT INTO album_artists (album_id, artist_id)
        VALUES 
        ($1, 1),
        ($1, 2);
    `;

    const insertSongs = `
        INSERT INTO songs (song_name, duration, album_id)
        VALUES
        ('My Funny Valentine', '00:05:19', $1),
        ('I Hear a Rhapsody', '00:04:35', $1),
        ('Dream Gypsy', '00:04:30', $1),
        ('Romain', '00:05:18', $1),
        ('Skating in Central Park', '00:05:17', $1),
        ('Darn That Dream', '00:05:05', $1);
    `;

    try {
        // Insert artists and get the album's ID
        const artistsResult = await pool.query(insertArtists);
        console.log("Artists inserted:", artistsResult.rows);

        // Insert the album and retrieve its ID
        const albumResult = await pool.query(insertAlbum);
        const albumId = albumResult.rows[0].id;
        console.log("Album inserted with ID:", albumId);

        // Insert artist-to-album relationships
        await pool.query(`
            INSERT INTO album_artists (album_id, artist_id)
            VALUES 
            ($1, 1),
            ($1, 2);
        `, [albumId]);
        console.log("Album-artist relationships inserted.");

        // Insert songs
        await pool.query(insertSongs, [albumId]);
        console.log("Songs inserted.");
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}

async function populateDatabase() {
    try {
        // Create the tables
        await createTables();

        // Insert initial data
        await insertInitialData();

        // Close the pool connection
        await pool.end();
        console.log("Database population complete.");
    } catch (error) {
        console.error("Error populating database:", error);
    }
}

// Run the population script
populateDatabase();
