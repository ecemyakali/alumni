/**
 * ========================================================
 * Database Layer: PostgreSQL Connection Pool
 * File: src/config/db.js
 * ========================================================
 * 
 * Centralized database connection pool powered by node-postgres (`pg.Pool`).
 * Reads connection settings from environment variables (or .env),
 * supports full SSL configuration, connection pooling, and idle termination.
 */

const { Pool } = require('pg');

// Parse database configuration from environment
const connectionString = process.env.DATABASE_URL;

const poolConfig = connectionString
  ? { connectionString }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.DB_NAME || process.env.POSTGRES_DB || 'alumni_db',
    };

// Pool settings
poolConfig.max = Number(process.env.DB_POOL_MAX) || 20;
poolConfig.idleTimeoutMillis = Number(process.env.DB_POOL_IDLE_TIMEOUT_MS) || 30000;
poolConfig.connectionTimeoutMillis = Number(process.env.DB_POOL_CONNECTION_TIMEOUT_MS) || 5000;
// Allow Node process to exit gracefully if only idle clients remain
poolConfig.allowExitOnIdle = true;

// SSL configuration
if (process.env.DB_SSL === 'true' || process.env.DB_SSL === 'require') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[DB Pool Error]: Unexpected error on idle PostgreSQL client', err);
});

module.exports = {
  pool,

  /**
   * Executes a parameterized SQL query on the pool
   * @param {string} text - SQL query string with placeholders ($1, $2, ...)
   * @param {Array} [params] - Query parameters
   * @returns {Promise<import('pg').QueryResult>}
   */
  query(text, params) {
    return pool.query(text, params);
  },

  /**
   * Acquires a dedicated client from the pool (for transactions)
   * @returns {Promise<import('pg').PoolClient>}
   */
  getClient() {
    return pool.connect();
  },

  /**
   * Tests connection to the database
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      const res = await pool.query('SELECT NOW() AS current_time');
      return !!res.rows[0];
    } catch {
      return false;
    }
  },

  /**
   * Closes the connection pool
   * @returns {Promise<void>}
   */
  close() {
    return pool.end();
  }
};
