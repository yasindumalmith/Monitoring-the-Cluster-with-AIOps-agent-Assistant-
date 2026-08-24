const { Pool } = require('pg');
require('dotenv').config();

// Create a dedicated connection pool for the Kubernetes Postgres Pod (port-forwarded to 5432)
const podPool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POD_DATABASE_URL || 'postgresql://aiops_user:aiops_password@postgres:5432/aiops_db',
});

module.exports = {
    query: (text, params) => podPool.query(text, params),
};
