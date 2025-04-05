// Importing necessary dependencies
const express = require('express'); // Web framework for handling routes and requests
const session = require('express-session'); // Middleware for handling sessions
const cors = require('cors'); // Middleware for enabling Cross-Origin Resource Sharing
const pool = require('./db'); // PostgreSQL connection pool
const noticesRoutes = require('./routes/notices'); // Routes related to notices
const usersRoutes = require('./routes/users'); // Routes related to users
const eventRoutes = require('./routes/events'); // Routes related to events
const categoriesRoutes = require('./routes/categories'); // Routes related to categories
const authRoutes = require('./routes/auth'); // Routes related to authentication
require('dotenv').config(); // Loads environment variables from a .env file

// Initializing the express app
const app = express();

// CORS configuration to allow requests from specific origin and support credentials
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL that is allowed to make requests
    credentials: true, // Allows cookies to be sent with the requests
}));

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Setting up session management with custom configuration
app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key to sign the session ID cookie
    resave: false, // Prevents session from being saved to the store if it wasn’t modified
    saveUninitialized: true, // Forces a session to be saved even if it wasn’t modified
    cookie: {maxAge: 60000 * 60}, // Cookie expiration time set to 1 hour (60 minutes * 60 seconds)
}));

// Connecting to PostgreSQL database and logging the result
pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL! Message:', err.message); // Logs if connection fails
    } else {
        console.log('Successfully connected to PostgreSQL!'); // Logs if connection is successful
    }
});

// Setting up routes for different resources
app.use('/api/notices', noticesRoutes); // Route for handling notices
app.use('/api/users', usersRoutes); // Route for handling users
app.use('/api/events', eventRoutes); // Route for handling events
app.use('/api/categories', categoriesRoutes); // Route for handling categories
app.use('/api/auth', authRoutes); // Route for handling authentication

// A simple GET route to check if the backend is running
app.get('/', (req, res) => {
    res.send('Backend is running!'); // Sends a message confirming the backend is active
});

// Server listening on the specified port
const PORT = process.env.PORT || 5000; // Default port is 5000 or the port defined in the environment variable
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Logs server URL once it starts
});