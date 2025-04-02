const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all noticess with filtering by category
router.get('/', async (req, res) => {
    try {
        const { categoryId, valueId} = req.query;
        
        let query = `
            SELECT e.*, c.name AS category_name, v.name AS value_name
            FROM events e
            JOIN categories c ON e.category_id = c.id
            JOIN values v ON e.value_id = v.id
        `;
        
        const params = [];
        let whereAdded = false;
        
        if (categoryId) {
            query += ' WHERE e.category_id = $1';
            params.push(categoryId);
            whereAdded = true;
        }

        if (valueId) {
            query += whereAdded ? ' AND' : ' WHERE';
            query += ` n.value_id = $${params.length + 1}`;
            params.push(valueId);
        }
        
        query += ' ORDER BY date DESC';
        
        const result = await pool.query(query, params);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, place, date, time, category_id, value_id } = req.body;
    
    // Check if categoryId and valueId are provided
    if (!title || !description || !place || !date || !time || !category_id || !value_id) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Create the notice by using categoryId and valueId directly
        const eventResult = await pool.query(
            `INSERT INTO events (title, description, place, date, time, category_id, value_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, place, date, time, category_id, value_id]
        );

        // Return the created notice, including category and value names
        const createdEvent = eventResult.rows[0];

        // Fetch category and value names for the notice
        const categoryResult = await pool.query(
            'SELECT name FROM categories WHERE id = $1', 
            [category_id]
        );

        const valueResult = await pool.query(
            'SELECT name FROM values WHERE id = $1', 
            [value_id]
        );

        createdEvent.categoryName = categoryResult.rows[0]?.name;
        createdEvent.valueName = valueResult.rows[0]?.name;

        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('Error adding notice:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, categoryName, valueName } = req.body;
    
    if (!title || !description || !categoryName || !valueName) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Get or create category (same as POST)
        let categoryResult = await pool.query(
            'SELECT id FROM categories WHERE name = $1', 
            [categoryName]
        );

        let categoryId;
        if (categoryResult.rows.length > 0) {
            categoryId = categoryResult.rows[0].id;
        } else {
            categoryResult = await pool.query(
                'INSERT INTO categories (name) VALUES ($1) RETURNING id',
                [categoryName]
            );
            categoryId = categoryResult.rows[0].id;
        }

        // Get or create value (same as POST)
        let valueResult = await pool.query(
            'SELECT id FROM values WHERE name = $1 AND category_id = $2', 
            [valueName, categoryId]
        );

        let valueId;
        if (valueResult.rows.length > 0) {
            valueId = valueResult.rows[0].id;
        } else {
            valueResult = await pool.query(
                'INSERT INTO values (name, category_id) VALUES ($1, $2) RETURNING id',
                [valueName, categoryId]
            );
            valueId = valueResult.rows[0].id;
        }
        
        // Update event
        const result = await pool.query(
            `UPDATE notices 
             SET title = $1, description = $2, category_id = $3, value_id = $4 
             WHERE id = $5 RETURNING *`,
            [title, description, categoryId, valueId, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notice not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating notice:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM events WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found!' });
        }
        res.json({ message: 'Event deleted successfully!' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT e.id, e.title, e.description,
                    c.name AS category_name, v.name AS value_name
             FROM events e
             JOIN categories c ON e.category_id = c.id
             JOIN values v ON e.value_id = v.id
             WHERE e.id = $1`,
            [id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Event not found' });
        }
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;