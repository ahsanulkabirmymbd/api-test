const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.status(403).end();
});

module.exports = router;