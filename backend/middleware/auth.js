const jwt = require('jsonwebtoken');

// Middleware to protect routes and check if the user is authorized
const protect = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract token from header
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.company = decoded.company;  // Store company info in request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = protect;
