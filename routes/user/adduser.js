const express = require('express');
const router = express.Router();
const db = require('../../module/db');
const { handleMethodNotAllowed } = require('../../module/utility');

router.post('/', async (req, res) => {

    const { name, email = '', phone = '', password } = req.body;    
    const cleanName = name?.trim();
    const cleanEmail = email?.trim();
    const cleanPhone = phone?.trim();
    const cleanPassword = password?.trim();

    if (!cleanName || !cleanPassword) {
        return res.status(400).json({
            status: 'error',
            message: 'Name and password are required'
        });
    }

    if (!cleanEmail && !cleanPhone) {
        return res.status(400).json({
            status: 'error',
            message: 'Either email or phone is required'
        });
    }

    try {

        const checkSql = "SELECT id FROM `users` WHERE (`email` <> '' AND `email` = ?) OR (`phone` <> '' AND `phone` = ?) LIMIT 1";
        const existingUsers = await db.query(checkSql, [cleanEmail, cleanPhone]);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'Email or phone already exists'
            });
        }

        const insertSql = "INSERT INTO `users` (`name`, `email`, `phone`, `password`, `status`) VALUES (?, ?, ?, MD5(?), 'active')";
        const result = await db.query(insertSql, [cleanName, cleanEmail, cleanPhone, cleanPassword]);

        return res.status(201).json({
            status: 'success',
            data: {
                userId: result.insertId,
                message: 'User registered successfully'
            }
        });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }

});

router.all('/', handleMethodNotAllowed);

module.exports = router;