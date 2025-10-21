// db.js
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Create a single shared pool with keepalive + SSL
const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false },
  keepAlive: true,
  connectionTimeoutMillis: 0,   // never timeout while connecting
  idle_in_transaction_session_timeout: 0
});

// Log unexpected errors
pool.on('error', (err) => {
  console.error('⚠️ Unexpected PostgreSQL client error:', err);
});

export default pool;
