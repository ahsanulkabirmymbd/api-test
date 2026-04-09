const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');

router.get('/:email', async (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(403).end();
    }

    try {
        const users = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user) {
            return res.status(200).send({
                status : 'success',
                user : user
            });
        }

        return res.status(404).send({
            status : 'error',
            message : 'User not found'
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