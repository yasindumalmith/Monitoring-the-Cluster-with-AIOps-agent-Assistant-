const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// GET /users/me
router.get('/me', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query(
            'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
