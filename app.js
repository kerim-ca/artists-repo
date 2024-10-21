const express = require("express");

const path = require("path");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const artistRoutes = require('./routes/artists');

const albumRoutes = require('./routes/albums');

const songRoutes = require('./routes/songs');

app.use(artistRoutes);  
app.use(albumRoutes);    
app.use(songRoutes); 


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));



app.get("/", (req, res) => {
    res.render("index");  
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
