const User = require('../models/User');
const jwt = require("jsonwebtoken");

const isUserSigned = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: "No token provided"
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded.userId) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            return res.status(401).json({
                message: 'User not found with the token'
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            message: "Authentication failed",
            error: error.message
        });
    }
}

module.exports = { isUserSigned };
