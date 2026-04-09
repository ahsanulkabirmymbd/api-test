const express = require('express');
const router = express.Router();
const db = require('../../module/db');

router.get('/', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users');
        res.status(200).send({
            status : 'success',
            users : users
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).send({
            status: 'error',
            message: 'Invalid user id'
        });
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

router.post('/:action', async (req, res) => {

    const action = req.params.action;
    const allowedActions = ['auth', 'register', 'update', 'delete'];

    if (!allowedActions.includes(action)) {
        return res.status(400).send({
            status: 'error',
            message: 'Invalid action'
        });
    }
    
    if (action === 'auth') {

        if (!req.body) {
            return res.status(400).send({
                status: 'error',
                message: 'Request body is required'
            });
        }

        const { email, phone, password } = req.body;
        
        if (!password) {
            return res.status(400).send({
                status: 'error',
                message: 'Password is required'
            });
        }

        if (!email && !phone) {
            return res.status(400).send({
                status: 'error',
                message: 'Either email or phone is required'
            });
        }

        try {
            const users = await db.query('SELECT `id`, `email`, `phone` FROM `users` WHERE (`email` = ? OR `phone` = ?) AND `password` = MD5(?)', [email, phone, password]);
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

    } else if (action === 'register') {

        if (!req.body) {
            return res.status(400).send({
                status: 'error',
                message: 'Request body is required'
            });
        }

        const { name, email, phone, password } = req.body;
        if (!name || !email || !phone || !password) {
            return res.status(400).send({
                status: 'error',
                message: 'Name, email, phone and password are required'
            });
        }

        try {
            const existingUsers = await db.query(
                'SELECT `email`, `phone` FROM `users` WHERE `email` = ? OR `phone` = ?', 
                [email, phone]
            );
            const rows = existingUsers || [];
            const errors = {};
            for (const user of rows) {
                if (user.email === email) {
                    errors.email = 'This email is already registered';
                }
                if (user.phone === phone) {
                    errors.phone = 'This phone number is already registered';
                }
            }

            if (Object.keys(errors).length > 0) {
                return res.status(409).send({
                    status: 'error',
                    message: 'Validation failed',
                    errors: errors
                });
            }

            const result = await db.query(
                'INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `status`) VALUES (NULL, ?, ?, ?, MD5(?), ?)', 
                [name, email, phone, password, 'active']
            );
            
            const userId = result.insertId;

            return res.status(201).send({
                status: 'success',
                userId: userId
            });

        } catch (error) {
            return res.status(500).send({
                status: 'error',
                message: 'Something went wrong'
            });
        }

    }

});

module.exports = router;
