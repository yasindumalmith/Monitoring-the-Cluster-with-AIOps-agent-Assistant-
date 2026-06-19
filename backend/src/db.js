const { Pool } = require('pg');
require('dotenv').config();

// Connects to postgres via DATABASE_URL
// e.g. postgresql://aiops_user:aiops_password@localhost:5432/aiops_db
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
