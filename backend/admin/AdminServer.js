const express = require('express');
const AdminApp = express();

//Middlewares Management
AdminApp.use(express.json());
AdminApp.use(express.urlencoded({ extended: true }));

//Routes
const AdminRoutes = require('../routes/AdminRoutes');
AdminApp.use('/api/admin', AdminRoutes);

const startAdminServer = (port) => {
    try {
        AdminApp.listen(port, () => {
            console.log(`Admin server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start admin server:', error);
    }
};

module.exports = startAdminServer;
