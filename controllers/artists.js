
const db = require("../db/queries");


async function getArtists(req, res){
    try {
        const artists = await db.getAllArtists();
        res.render('artists', { artists });
         
    } catch (error) {
        console.error("Error fetching artists:", error);
        res.status(500).send("Server Error");
    }

    
}

async function createArtistGet(req, res) {
    try {
        const artists = await db.getAllArtists();  
        res.render('createArtistForm', { artists });  
    } catch (error) {
        console.error("Error rendering form:", error);
        res.status(500).send("Server Error");
    }
}

async function createArtistPost(req, res){
    const {artist_name, genre} = req.body;
    try {
        const newArtist = await db.insertArtist(artist_name, genre);
        res.redirect('/artists');
    } catch (error) {
        console.error("Error creating artist:", error);
        res.status(500).send("Server Error");
    }
}

async function getArtistDetails(req, res) {
    const artistId = req.params.id;
    console.log("Fetching details for artist ID:", artistId);
    try {
        const artist = await db.getArtistById(artistId);
        console.log("Artist fetched:", artist);

        if (!artist) {
            console.log("Artist not found");
            return res.status(404).send("Artist not found");
        }

        const albums = await db.getAlbumsByArtist(artistId);
        console.log("Albums fetched:", albums);

        res.render("artistDetails", { artist, albums });
    } catch (error) {
        console.error("Error fetching artist details:", error);
        res.status(500).send("Server Error");
    }
}




module.exports = {
    getArtists, 
    createArtistGet, 
    createArtistPost,
    getArtistDetails
};
