import express from 'express';
import pool from '../db.js';
import {body, param, validationResult} from 'express-validator';

const router = express.Router();

// ======================
// CATEGORIES CRUD ROUTES
// ======================

// GET all categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST create a new category
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        // Check for existing category
        const existing = await pool.query(
            'SELECT id FROM categories WHERE name = $1', 
            [name]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Category already exists' });
        }
        // Insert new category
        const result = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET single category
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// UPDATE category by ID
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const result = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
            [name, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE category by ID
router.delete('/:id', async (req, res) => {
    try {        
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
