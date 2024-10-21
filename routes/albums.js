const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albums');

// Route to get album details and songs for the album
router.get('/albums/:id', albumController.getAlbumDetails);

// Route to create a new album (POST request)
router.post('/albums/create', albumController.createAlbumPost);

module.exports = router;
