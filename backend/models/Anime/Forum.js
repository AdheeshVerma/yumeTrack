const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    anime:{type:mongoose.Schema.Types.ObjectId,required:true},
    created_by:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},
    
},{timestamps:true});
const Forum = mongoose.model('Forum', ForumSchema);
module.exports = Forum;
