const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');

router.get('/', async (req, res) => {

    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * itemsPerPage;

    try {
        const sql = `SELECT * FROM users LIMIT ${itemsPerPage} OFFSET ${offset}`;
        const users = await db.query(sql);
        res.status(200).send({
            status : 'success',
            users : users
        });
    } catch (error) {
        res.status(500).end();
    }

});

router.all('/', handleMethodNotAllowed);

module.exports = router;