import express from 'express';
import bcrypt from 'bcryptjs'; // For hashing passwords securely
import pool from '../db.js'; // PostgreSQL database connection pool
import 'dotenv/config'; // Load environment variables from .env file

const router = express.Router();

const validInvitationCode = process.env.VALID_INVITATION_CODE; // Secret invitation code for admin signup

// Middleware to ensure the user is logged in before accessing protected routes
export function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login'); // If not authenticated, redirect to login
}

// Route: POST /signup
// Purpose: Register a new admin user (invitation code required)
router.post('/signup', async (req, res) => {
    const { name, username, email, password, invitationCode } = req.body;
  // Simple regex to validate email format
    const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
    if (!isValidEmail) {
        return res.status(400).send('Invalid email format');
    }
  // Check if the invitation code matches the expected one
    if (invitationCode !== validInvitationCode) {
        return res.status(403).send('Invalid invitation code. Signup restricted.');
      }
    try {
      // Check if the username already exists
      const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userCheck.rows.length > 0) {
        return res.status(400).send('Username already taken.');
      }
      // Hash the password before storing in DB
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert new user into the database
      await pool.query(
        'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)',
        [name, username, email, hashedPassword]
      );
      res.status(201).send('User registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating user!');
    }
  });

// Route: POST /login
// Purpose: Log in an existing user
router.post('/login', async (req, res)=> {
    const {username, password} = req.body;
    try {
       // Find user by username
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if(result.rows.length === 0) {
            return res.status(400).send('User not found!');
        }
        const user = result.rows[0];
        // Compare input password with hashed password from DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).send('Incorrect password!');
        }
        // Save user info in session to track logged-in state
        req.session.user = {
          id: user.id,
          username: user.username,
        };
        res.status(200).json({message: 'Login successful!', user: {id: user.id, username: user.username}});
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Server Error');
    }
});

// Route: POST /logout
// Purpose: Destroy session and log the user out
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out!');
    }
    res.status(200).send('Logout successful!');
  });
});

// Route: GET /admindashboard
// Purpose: Protected route - Only accessible when logged in
router.get('/admindashboard', ensureAuthenticated, (req,res) => {
  res.status(200).json({message: 'Welcome to the admin dashboard'});
});

// Route: GET /status
// Purpose: Check current login status of the user
router.get('/status', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({loggedIn: true, user: req.session.user});
  } else {
    return res.status(200).json({loggedIn: false});
  }
});

export default router; // Export router for use in the main app
