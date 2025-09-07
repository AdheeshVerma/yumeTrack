//Dependencies
const express = require('express');
require('dotenv').config();

//Routes
const connectDB = require('./config/mongoDB');
const startAdminServer = require('./admin/AdminServer');
const UserRoutes = require('./routes/UserRoutes');
const ForumRoutes = require('./routes/ForumRoutes');
const ReviewRoutes = require('./routes/ReviewRoutes');
const AnimeRoutes = require('./routes/animeRoutes');

//Middlewares Management
const app = express();
app.use(express.json());

//method management
app.use('/api/user',UserRoutes);
app.use('/api/forum',ForumRoutes);
app.use('/api',ReviewRoutes);
app.use('/api/anime',AnimeRoutes);

//Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
    // Start Admin Server
    startAdminServer(process.env.ADMIN_PORT || 4000);
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});