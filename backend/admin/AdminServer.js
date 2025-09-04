const express = require('express');
const AdminApp = express();

//Middlewares Management
AdminApp.use(express.json());

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
