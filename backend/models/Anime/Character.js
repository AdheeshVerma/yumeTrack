const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name:{type:String,required:true},
    role:{type:String,required:true},
    anime:{type:mongoose.Schema.Types.ObjectId,ref:'Anime',required:true},
    image:{type:String,default:null}
},{timestamps:true});

CharacterSchema.index({ anime: 1 });

const Character = mongoose.model('Character', CharacterSchema);
module.exports = Character;
