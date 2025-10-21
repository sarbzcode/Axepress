import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Route to get all users
router.get('/', async (req, res) => {
    try {
        // Fetch user details (excluding passwords) from the database
        const result = await pool.query('SELECT id, name, username, email, created_at FROM users');
        res.status(200).json(result.rows);  // Send users data as response
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server Error'); // Handle database error
    }
});

// Route to create a new user
router.post('/', async (req, res) => {
    const {username, email, password} = req.body;

    // Validate that all fields are provided
    if (!username || !email || !password){
        return res.status(400).json({error: 'All fields are required!'});
    }
    try {

        // Hash the user's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database with hashed password
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        // Send the created user's data as response
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error('Error adding user:', err);
        res.status(500).send('Server Error'); // Handle database error
    }
});

// Route to delete a user by ID
router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    try {

        // Delete the user from the database by their ID
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id', 
            [id]
        );

        // If no user was deleted, return 404 (User not found)
        if (result.rowCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(204).send(); // Successfully deleted, no content to return
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server Error'); // Handle database error
    }
});

// Route to get the total count of users
router.get('/count', async (req, res) => {
    try {

        // Query the database to get the count of all users
        const result = await pool.query('SELECT COUNT(*) FROM users');
        const userCount = result.rows[0].count;

        // Send the user count in response
        res.json({userCount});
    } catch (err) {
        console.error('Error fetching user count:', err);
        res.status(500).json({error: 'Server error'}); // Handle database error
    }
});

export default router;
