//Dependencies
const express = require('express');
require('dotenv').config();

//Routes
const connectDB = require('./config/mongoDB');
const startAdminServer = require('./admin/AdminServer');

//Middlewares Management
const app = express();
app.use(express.json());
app.use('/api/admin',require('./routes/AdminRoutes'));
app.use('/api/user',require('./routes/UserRoutes'));
//method management


//Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(process.env.ADMIN_PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
    // Start Admin Server
    startAdminServer(process.env.ADMIN_PORT || 4000);
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});