

const {Pool} = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "kerim", 
    database: "top_inventory",
    password: "1977930",
    port: 5432
});

module.exports = pool;
