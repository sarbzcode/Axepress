// Importing the Pool class from the pg module
const {Pool} = require('pg');

// Loading environment variables from the .env file
require('dotenv').config();

// Creating a new pool of database connections
// The connection string is retrieved from the PG_URI variable in the .env file
const pool = new Pool({
    connectionString: process.env.PG_URI, // This is the PostgreSQL connection string (contains user, password, and database info)
});

// Exporting the pool instance for use in other files
module.exports = pool;