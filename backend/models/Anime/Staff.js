const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    
});

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
