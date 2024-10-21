const db = require("../db/queries");

async function createSongPost(req, res) {
    console.log("Form Data:", req.body);  // Log form data for debugging

    const { album_id, song_name, duration } = req.body;

    if (!album_id || !song_name || !duration) {
        console.log("Missing form data");
        return res.status(400).send("Missing form data");
    }

    try {
        const newSong = await db.insertSong(song_name, album_id, duration);
        res.redirect(`/albums/${album_id}`);
    } catch (err) {
        console.error("Error adding song:", err);
        res.status(500).send("Server Error");
    }
}


module.exports = {
    createSongPost,
};