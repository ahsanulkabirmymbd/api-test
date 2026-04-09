const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');

router.post('/', async (req, res) => {
    let email = req.body.email?.trim();
    let phone = req.body.phone?.trim();
    const password = req.body.password?.trim();

    if (!email && !phone) {
        return res.status(403).end();
    }

    if (!email) {
        email = '';
    }

    if (!phone) {
        phone = '';
    }

    if (!password) {
        return res.status(403).end();
    }

    try {
        const users = await db.query('SELECT * FROM users WHERE (`email` = ? OR `phone` = ?) AND `password` = MD5(?)', [email, phone, password]);

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