const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    anime:{type:mongoose.Schema.Types.ObjectId,ref:'Anime',default:null},
    created_by:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'}
},{timestamps:true});

ForumSchema.index({ created_by: 1 });
ForumSchema.index({ anime: 1 });

const Forum = mongoose.model('Forum', ForumSchema);
module.exports = Forum;
