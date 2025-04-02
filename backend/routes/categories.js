const express = require('express');
const router = express.Router();
const pool = require('../db');
const {body, param, validationResult} = require('express-validator');

// Categories CRUD
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

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

// UPDATE category
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

// DELETE category
router.delete('/:id', async (req, res) => {
    try {
        // First delete associated values (if you want cascade delete)
        await pool.query('DELETE FROM values WHERE category_id = $1', [req.params.id]);
        
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

// Values CRUD
// GET all values for category (already exists, but enhanced)
router.get('/:categoryId/values',
    param('categoryId').isInt(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // Verify category exists
        const category = await pool.query(
          'SELECT id FROM categories WHERE id = $1',
          [req.params.categoryId]
        );
        if (category.rows.length === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }
  
        const values = await pool.query(
          'SELECT * FROM values WHERE category_id = $1 ORDER BY name ASC',
          [req.params.categoryId]
        );
        res.status(200).json(values.rows);
      } catch (err) {
        console.error('Error fetching values:', err);
        res.status(500).json({ error: 'Server Error' });
      }
  });
  
  // POST create value (already exists, but enhanced)
  router.post('/:categoryId/values',
    param('categoryId').isInt(),
    body('name').trim().isLength({ min: 2 }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const { categoryId } = req.params;
        const { name } = req.body;
        
        // Verify category exists
        const category = await pool.query(
          'SELECT id FROM categories WHERE id = $1',
          [categoryId]
        );
        if (category.rows.length === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }
  
        // Check for existing value
        const existing = await pool.query(
          'SELECT id FROM values WHERE name = $1 AND category_id = $2',
          [name, categoryId]
        );
        if (existing.rows.length > 0) {
          return res.status(409).json({ error: 'Value already exists in this category' });
        }
  
        const result = await pool.query(
          'INSERT INTO values (name, category_id) VALUES ($1, $2) RETURNING *',
          [name, categoryId]
        );
        res.status(201).json(result.rows[0]);
      } catch (err) {
        console.error('Error creating value:', err);
        res.status(500).json({ error: 'Server Error' });
      }
  });

// GET single value
router.get('/:categoryId/values/:id', 
    param('categoryId').isInt(),
    param('id').isInt(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const result = await pool.query(
          'SELECT * FROM values WHERE id = $1 AND category_id = $2',
          [req.params.id, req.params.categoryId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Value not found in this category' });
        }
        res.json(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
  });
  
  // UPDATE value
  router.put('/:categoryId/values/:id',
    param('categoryId').isInt(),
    param('id').isInt(),
    body('name').trim().isLength({ min: 2 }),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // Verify category exists
        const category = await pool.query(
          'SELECT id FROM categories WHERE id = $1',
          [req.params.categoryId]
        );
        if (category.rows.length === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }
  
        // Check for name conflict
        const existing = await pool.query(
          'SELECT id FROM values WHERE name = $1 AND category_id = $2 AND id != $3',
          [req.body.name, req.params.categoryId, req.params.id]
        );
        if (existing.rows.length > 0) {
          return res.status(409).json({ error: 'Value name already exists in this category' });
        }
  
        const result = await pool.query(
          'UPDATE values SET name = $1 WHERE id = $2 AND category_id = $3 RETURNING *',
          [req.body.name, req.params.id, req.params.categoryId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Value not found in this category' });
        }
        res.json(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
  });
  
  // DELETE value
  router.delete('/:categoryId/values/:id',
    param('categoryId').isInt(),
    param('id').isInt(),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // Verify category exists
        const category = await pool.query(
          'SELECT id FROM categories WHERE id = $1',
          [req.params.categoryId]
        );
        if (category.rows.length === 0) {
          return res.status(404).json({ error: 'Category not found' });
        }
  
        const result = await pool.query(
          'DELETE FROM values WHERE id = $1 AND category_id = $2 RETURNING *',
          [req.params.id, req.params.categoryId]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Value not found in this category' });
        }
        res.json({ message: 'Value deleted successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      }
  });

module.exports = router;