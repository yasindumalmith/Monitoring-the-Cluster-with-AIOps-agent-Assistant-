const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// POST /chat
// Proxies the request to the Python AI Agent after attaching user context
router.post('/', verifyToken, async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Construct the payload expected by the Python FastAPI agent
        const payload = {
            user_id: req.user.userId,
            role: req.user.role,
            messages: messages
        };

        // Forward to Python AI Agent running on port 8000
        const response = await fetch('http://localhost:8000/v1/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI Agent Error:', errorText);
            return res.status(response.status).json({ error: 'Error from AI Agent' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI Agent' });
    }
});

module.exports = router;
