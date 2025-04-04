const express = require('express');
const router = express.Router();
const pool = require('../db');
const ensureAuthenticated = require('./auth');

// GET all events with filtering by category
router.get('/all', async (req, res) => {
    try {
        const {categoryId} = req.query;
        
        let query = `
            SELECT e.*, c.name AS category_name
            FROM events e
            JOIN categories c ON e.category_id = c.id
        `;
        
        const params = [];
        let whereAdded = false;
        
        if (categoryId) {
            query += ' WHERE e.category_id = $1';
            params.push(categoryId);
            whereAdded = true;
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
    const { title, description, place, date, time, category_id} = req.body;
    
    // Check if categoryId and valueId are provided
    if (!title || !description || !place || !date || !time || !category_id) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Create the event by using categoryId and valueId directly
        const eventResult = await pool.query(
            `INSERT INTO events (title, description, place, date, time, category_id) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description, place, date, time, category_id]
        );

        // Return the created event, including category and value names
        const createdEvent = eventResult.rows[0];

        // Fetch category and value names for the event
        const categoryResult = await pool.query(
            'SELECT name FROM categories WHERE id = $1', 
            [category_id]
        );

        createdEvent.categoryName = categoryResult.rows[0]?.name;

        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, place, date, time, category_id } = req.body;

    // Validate request data
    if (!title || !description || !place || !date || !time || !category_id) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Update event
        const result = await pool.query(
            `UPDATE events
             SET title = $1, description = $2, place = $3, date = $4, time = $5, category_id = $6
             WHERE id = $7 RETURNING *`,
            [title, description, place, date, time, category_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json({ message: 'Event updated successfully!', event: result.rows[0] });
    } catch (err) {
        console.error('Error updating event:', err);
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
            `SELECT e.id, e.title, e.description, e.place, e.date, e.time,
                    c.name AS category_name
             FROM events e
             JOIN categories c ON e.category_id = c.id
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

router.get('/', async(req, res) => {
    try {
        const result = await pool.query(`
            SELECT e.*, c.name AS category_name
            FROM events e
            JOIN categories c ON e.category_id = c.id
            ORDER BY date DESC
            LIMIT 5
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching recent events:', err);
        res.status(500).send('Server Error');
    }
});

router.get('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    
    try {
        const result = await pool.query(
            'SELECT * FROM events WHERE category_id = $1', [categoryId]
        );
        const event = result.rows;

        if (event.length === 0) {
            return res.json([]);
        }
        res.json(event); // Send back the filtered events
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching events" });
    }
});

module.exports = router;