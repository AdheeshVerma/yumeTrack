const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
    anime:{type:mongoose.Schema.Types.ObjectId, ref : 'Anime',required:true},
    epNo:{type:Number,required:true},
    name:{type:String,required:true},
    description:{type:String,required:true},
    rating:{type:Number,min:0,max:10,required:true},
    thumbnail:{type:String,required:true}
});

const Episode = mongoose.model('Episode', EpisodeSchema);
module.exports = Episode;
