
const db = require("../db/queries");



async function getAlbumDetails(req, res) {
    const albumId = req.params.id;
    try {
        const album = await db.getAlbumById(albumId);  // This should return the album with the correct ID
        const songs = await db.getSongsByAlbum(albumId);  // Get all songs for the album
        res.render("albumDetails", { album, songs });  // Pass the album and songs to the template
    } catch (error) {
        console.error("Error fetching album details:", error);
        res.status(500).send("Server Error");
    }
}


async function createAlbumPost(req, res) {
    const { artist_id, album_name, album_year } = req.body;
    const artistIds = Array.isArray(artist_id) ? artist_id : [artist_id];
    
    try {
        const newAlbum = await db.insertAlbum(album_name, album_year, artistIds);
        console.log("New album created:", newAlbum);
        res.redirect(`/artists/${artistIds[0]}`);
    } catch (err) {
        console.error('Error creating album:', err);
        res.status(500).send('Server Error');
    }
}



module.exports = {
    getAlbumDetails, 
    createAlbumPost
};