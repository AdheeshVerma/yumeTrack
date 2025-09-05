const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
    anime:{type:mongoose.Schema.Types.ObjectId, ref : 'Anime',required:true},
    epNo:{type:Number,required:true},
    name:{type:String,required:true},
    description:{type:String,required:true},
    rating:{type:Number,min:0,max:10,default:null},
    thumbnail:{type:String,default:null},
    status:{type:String,enum:['UPCOMING','RELEASED'],default:'UPCOMING'},
    releaseDate:{type:Date,default:null},
    isFiller:{type:Boolean,default:false},
    duration:{type:Number,default:null},
    Sources:[{type:String,default:null}]
},{timestamps:true});

EpisodeSchema.index({anime:1,epNo:1},{unique:true});

const Episode = mongoose.model('Episode', EpisodeSchema);
module.exports = Episode;
