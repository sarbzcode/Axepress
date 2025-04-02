const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, username, email, created_at FROM users');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Server Error');
    }
});

router.post('/', async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password){
        return res.status(400).json({error: 'All fields are required!'});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error('Error adding user:', err);
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', async(req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id', 
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('User not found');
        }
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;