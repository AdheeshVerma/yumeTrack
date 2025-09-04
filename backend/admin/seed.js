const mongoose = require('mongoose');
const {Admin}=require('../models/models');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedAdminData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL).then(() => {console.log('Connected to MongoDB')});
        const existingAdmin = await Admin.findOne({ username: 'Adheesh Verma' });
        if (existingAdmin) {
            console.log('Admin data already exists');
            mongoose.disconnect();
            return;
        }
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, parseInt(process.env.SALT_ROUNDS));
        const admin = new Admin({
            username: 'Adheesh Verma',
            password: hashedPassword,
        });
        await admin.save();
        console.log('Admin data seeded successfully');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin data:', error);
    }
};

seedAdminData();