const express = require('express');
const router = express.Router();
const podDB = require('../database/podDB');

let clients = [];

// Get all historical incidents
router.get('/', async (req, res) => {
    try {
        const result = await podDB.query('SELECT * FROM incidents ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching incidents:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get count of currently open incidents
router.get('/open/count', async (req, res) => {
    try {
        const result = await podDB.query("SELECT COUNT(*) FROM incidents WHERE status = 'open'");
        const count = parseInt(result.rows[0].count, 10);
        res.json({ count });
    } catch (err) {
        console.error('Error fetching open incident count:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Resolve an incident (Mark as fixed)
router.patch('/:id/resolve', async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution_summary } = req.body;
        
        const result = await podDB.query(
            "UPDATE incidents SET status = 'fixed', resolution_summary = $1, resolved_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
            [resolution_summary, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Incident not found' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error resolving incident:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// SSE endpoint for React frontend
router.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send an initial heartbeat/connection payload to establish connection
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    clients.push(newClient);
    console.log(`[SSE] Client ${clientId} connected. Total clients: ${clients.length}`);

    req.on('close', () => {
        console.log(`[SSE] Client ${clientId} disconnected`);
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Internal Webhook from Python main.py
router.post('/notify', (req, res) => {
    const incidentData = req.body;
    console.log(`[SSE] Broadcasting new incident: ${incidentData.resource_name}`);

    clients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(incidentData)}\n\n`);
    });

    res.status(200).json({ success: true, clientsNotified: clients.length });
});

module.exports = router;
