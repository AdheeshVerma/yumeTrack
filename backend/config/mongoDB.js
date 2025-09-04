const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL).then(() => { console.log('MongoDB connected'); });
    }
    catch(err){
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectDB;
