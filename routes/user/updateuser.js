const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');















router.put('/', async (req, res) => {
    const { id, name, email, phone, password } = req.body;

    if (!id) {
        return res.status(400).json({ status: 'error', message: 'User id is required' });
    }

    try {
        // Constructing the SQL query with the MD5 function
        // Note: Use parameterized queries to prevent SQL injection
        const sql = `
            UPDATE users 
            SET name = ?, email = ?, phone = ?, password = MD5(?) 
            WHERE id = ?
        `;
        
        const values = [name, email, phone, password, id];

        // Example using a hypothetical 'db' connection object
        await db.execute(sql, values);

        return res.status(200).json({
            status: 'success',
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});
























router.all('/', handleMethodNotAllowed);

module.exports = router;