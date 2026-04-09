const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');

router.get('/:name', async (req, res) => {
    const name = req.params.name?.trim();

    if (!name) {
        return res.status(403).end();
    }

    try {
        const users = await db.query('SELECT * FROM users WHERE name LIKE ?', [`%${name}%`]);

        if (users.length === 0) {
            return res.status(404).end();
        }

        return res.status(200).send({
            status: 'success',
            data: users
        });

    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.all('/', handleMethodNotAllowed);

module.exports = router;