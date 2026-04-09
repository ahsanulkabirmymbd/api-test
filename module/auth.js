const validateApiValidation = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    const apiSecret = req.headers['api-secret'];
    if (apiKey === process.env.API_KEY && apiSecret === process.env.API_SECRET) {
        next();
    } else {
        res.status(403).end();
    }
}

module.exports = validateApiValidation;