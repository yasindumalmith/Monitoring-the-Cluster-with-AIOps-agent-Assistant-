const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        // Note: The 'users' table doesn't exist in our schema.sql yet!
        // This will throw an error until you create it.
        res.status(500).json({ error: 'Failed to fetch users or table missing' });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    const { role } = req.body;
    try {
        // Simple example assuming table has role
        // CREATE TABLE users (id SERIAL PRIMARY KEY, role TEXT);
        const { rows } = await db.query(
            'INSERT INTO users (role) VALUES ($1) RETURNING *',
            [role]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

module.exports = router;
