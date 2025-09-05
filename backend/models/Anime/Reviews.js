const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    anime:{type:mongoose.Schema.Types.ObjectId,ref:'Anime',required:true},
    writer:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    rating:{type:Number,min:0,max:10,required:true},
    review:{type:String,required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
},{timestamps:true});

ReviewSchema.index({ anime: 1 });
ReviewSchema.index({ writer: 1 });

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
