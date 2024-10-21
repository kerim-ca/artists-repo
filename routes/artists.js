
const express = require("express");


const db = require("../db/queries");

const router = express.Router();

const artistController = require("../controllers/artists");

router.get('/artists', artistController.getArtists);

router.get('/artists/create', artistController.createArtistGet);

router.post('/artists/create', artistController.createArtistPost);

router.get('/artists/:id', artistController.getArtistDetails);




module.exports = router;
