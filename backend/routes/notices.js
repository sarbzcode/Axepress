const express = require('express');
const router = express.Router();
const pool = require('../db');
const ensureAuthenticated = require('./auth');

// GET all notices with filtering by category
router.get('/all', async (req, res) => {
    try {
        const {categoryId} = req.query;
        
        let query = `
            SELECT n.*, c.name AS category_name
            FROM notices n
            JOIN categories c ON n.category_id = c.id
        `;
        
        const params = [];
        let whereAdded = false;
        
        if (categoryId) {
            query += ' WHERE n.category_id = $1';
            params.push(categoryId);
            whereAdded = true;
        }
        
        query += ' ORDER BY created_at DESC';
        
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching notices:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', ensureAuthenticated, async (req, res) => {
    const { title, description, category_id} = req.body;
    
    // Check if categoryId and valueId are provided
    if (!title || !description || !category_id) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Create the notice by using categoryId and valueId directly
        const noticeResult = await pool.query(
            `INSERT INTO notices (title, description, category_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [title, description, category_id]
        );

        // Return the created notice, including category and value names
        const createdNotice = noticeResult.rows[0];

        // Fetch category and value names for the notice
        const categoryResult = await pool.query(
            'SELECT name FROM categories WHERE id = $1', 
            [category_id]
        );

        createdNotice.categoryName = categoryResult.rows[0]?.name;

        res.status(201).json(createdNotice);
    } catch (error) {
        console.error('Error adding notice:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, category_id } = req.body;

    // Validate request data
    if (!title || !description || !category_id) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Update event
        const result = await pool.query(
            `UPDATE notices
             SET title = $1, description = $2, category_id = $3
             WHERE id = $4 RETURNING *`,
            [title, description, category_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notice not found.' });
        }

        res.status(200).json({ message: 'Notice updated successfully!', notice: result.rows[0] });
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM notices WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notice not found!' });
        }
        res.json({ message: 'Notice deleted successfully!' });
    } catch (err) {
        console.error('Error deleting notice:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT n.id, n.title, n.description,
                    c.name AS category_name
             FROM notices n
             JOIN categories c ON n.category_id = c.id
             WHERE n.id = $1`,
            [id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Notice not found' });
        }
    } catch (error) {
        console.error('Error fetching notice details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async(req, res) => {
    try {
        const result = await pool.query(`
            SELECT n.*, c.name AS category_name
            FROM notices n
            JOIN categories c ON n.category_id = c.id
            ORDER BY created_at DESC
            LIMIT 5
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching recent notices:', err);
        res.status(500).send('Server Error');
    }
});

router.get('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    
    try {
        const result = await pool.query(
            'SELECT * FROM notices WHERE category_id = $1', [categoryId]
        );
        const notices = result.rows;

        if (notices.length === 0) {
            return res.json([]);
        }
        res.json(notices); // Send back the filtered notices
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching notices" });
    }
});

module.exports = router;