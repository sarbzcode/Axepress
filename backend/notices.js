const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notices ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).send('Server Error');
    }
});

router.post('/api/notices', async (req, res) => {
    const {title, description} = req.body;
    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }
    try {
        const result = await pool.query(
            'INSERT INTO notices(title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.error('Error adding notice:', err);
        res.status(500).send('Server Error');
    }
});

router.put('/api/notices/:id', async(req, res) => {
    const {id} = req.params;
    const {title, description} = req.body;
    try {
        const result = await pool.query(
            'UPDATE notices SET title = $1, description = $2 WHERE id = $3 RETURNING *',
            [title, description, id]
        );
        if (result.rows.length === 0){
            return res.status(404).send('Notice not found');
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).send('Server Error');
    }
});

router.delete('/api/notices/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM notices WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0){
            return res.status(404).send('Notice not found');
        }
        res.send('Notice deleted successfully');
    } catch (err) {
        console.error('Error deleting notice:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;