const mongoose = require('mongoose');
const { schema } = require('./Anime');

const ReviewSchema = new mongoose.Schema({
    anime:{type:mongoose.Schema.Types.ObjectId,ref:'Anime',required:true},
    review:{type:String,required:true}
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
