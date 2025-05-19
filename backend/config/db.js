const { Pool } = require('pg');

// Vérifier que DB_PASSWORD est défini
if (!process.env.DB_PASSWORD) {
  throw new Error('DB_PASSWORD is not defined in .env');
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;