const {Admin} = require('../models/models'); 
const jwt = require('jsonwebtoken');

const AdminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userdata = jwt.verify(token, process.env.JWT_SECRET);
        if (!userdata) {
            return res.status(401).json({ message: 'Unauthorized -2' });
        }
        const { username } = userdata;
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized -3' });
        }
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Admin authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized -4' });
    }
}

module.exports = AdminAuth;