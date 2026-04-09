const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(403).end();
    }

    try {
        const users = await db.query('SELECT * FROM users WHERE id = ?', [id]);
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