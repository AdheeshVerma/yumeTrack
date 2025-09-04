//Dependencies
const express = require('express');
require('dotenv').config();

//Routes
const connectDB = require('./config/mongoDB');

//Middlewares Management
const app = express();
app.use(express.json());

//method management


//Connect to MongoDB and start the server
connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
});