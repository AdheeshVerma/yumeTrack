const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    name:{type:String,required:true},
    role:{type:String,required:true},
    anime:{type:mongoose.Schema.Types.ObjectId,ref:'Anime',required:true},
    image:{type:String,default:null}
},{timestamps:true});

StaffSchema.index({ anime: 1 });
StaffSchema.index({ name: 1 });

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
