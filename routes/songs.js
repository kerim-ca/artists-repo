const express = require('express');
const router = express.Router();
const songController = require('../controllers/songs');

// Route to render the song creation form (GET request)
router.get('/songs/create', (req, res) => {
    res.render('songDetails');  // Render the song creation form
});

// Route to create a new song (POST request)
router.post('/songs/create', songController.createSongPost);

module.exports = router;
