const { Pool } = require ('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => console.log('PostgreSQL connecté !'))
    .catch((err) => console.error('Erreur de connexion PostgreSQL : ',err));

module.exports = pool;    