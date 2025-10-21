import express from 'express';
import pool from '../db.js'; // PostgreSQL connection pool
import { ensureAuthenticated } from './auth.js'; // Middleware to check authentication

const router = express.Router();

// Route: GET /all
// Fetch all events, with optional filtering by category ID
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
        // Add WHERE clause if category filter is provided        
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

// Route: POST /
// Create a new event
router.post('/', async (req, res) => {
    const { title, description, place, date, time, category_id} = req.body;
    
    // Validate input
    if (!title || !description || !place || !date || !time || !category_id) {
        return res.status(400).json({ error: 'All values are required.' });
    }

    try {
        // Insert the event into the database
        const eventResult = await pool.query(
            `INSERT INTO events (title, description, place, date, time, category_id) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [title, description, place, date, time, category_id]
        );

        const createdEvent = eventResult.rows[0];

        // Fetch the category name for the event
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

// Route: PUT /:id
// Update an existing event (authentication required)
router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { title, description, place, date, time, category_id } = req.body;

    // Validate input
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

// Route: DELETE /:id
// Delete an event by ID
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

// Route: GET /:id
// Fetch a single event by ID
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

// Route: GET /
// Fetch the 5 most recent events
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

// Route: GET /categories/:categoryId
// Fetch all events under a specific category
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
        res.json(event); // Return filtered events
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching events" });
    }
});

export default router; // Export router for use in main app
