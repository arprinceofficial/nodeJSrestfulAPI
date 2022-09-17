const { createPool } = require('mysql'); // if u do not import everything then just use createPool.. it will import specifice things

const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit: 10
});

// reusing the connection pool in other files
module.exports = pool;