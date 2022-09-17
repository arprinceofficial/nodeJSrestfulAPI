const { createPool } = require('mysql'); // if u do not import everything then just use createPool.. it will import specifice things

const pool = createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
});

// export default pool to use in other files exp. service.js
module.exports = pool;