const handleMethodNotAllowed = (req, res) => {
    res.status(403).end();
};

module.exports = {
    handleMethodNotAllowed
};