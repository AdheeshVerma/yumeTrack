const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
    
});
const UserPreference = mongoose.model('UserPreference', UserPreferenceSchema);
module.exports = UserPreference;