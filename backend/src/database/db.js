const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.USER_DATABASE_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@user-postgres:5432/userdb',
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
