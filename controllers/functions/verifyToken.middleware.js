const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) { return res.status(500).send({ message: 'Failed to authenticate token' }) }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
