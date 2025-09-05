const mongoose = require('mongoose');

const UserPreferenceSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    answers:{type:Map,of:String,required:true},
    date:{type:Date,default:Date.now},
    preferences:[{type:mongoose.Schema.Types.ObjectId,ref:'Genre'}]
},{timestamps:true});

UserPreferenceSchema.index({ user: 1, date: -1 });

const UserPreference = mongoose.model('UserPreference', UserPreferenceSchema);
module.exports = UserPreference;