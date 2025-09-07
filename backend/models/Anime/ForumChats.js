const mongoose = require('mongoose');

const ForumChatsSchema = new mongoose.Schema({
    forum:{type:mongoose.Schema.Types.ObjectId,ref:'Forum',required:true},
    message:{type:String,required:true},
    attachments:{type:[String],default:[]},
    parentMessage:{type:mongoose.Schema.Types.ObjectId,ref:'ForumChats',default:null},
    edited_at:{type:Date,default:null},
    sent_by:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    status:{type:String,enum:['sent','delivered','read','failed'],default:'sent'}
},{timestamps:true});

ForumChatsSchema.index({ forum: 1 , createdAt: -1 });
ForumChatsSchema.index({ sent_by: 1 });
ForumChatsSchema.index({ parentMessage: 1 });

const ForumChats = mongoose.model('ForumChats', ForumChatsSchema);
module.exports = ForumChats;
