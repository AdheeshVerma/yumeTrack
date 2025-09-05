const mongoose = require('mongoose');

const AnimeListSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    anime:{type:mongoose.Schema.Types.ObjectId,ref:'Anime',required:true},
    status:{type:String,enum:['Watching','Completed','On-Hold','Dropped','Plan to Watch'],required:true}
});

AnimeListSchema.index({ user: 1, anime: 1 }, { unique: true });
AnimeListSchema.index({ anime: 1 });
AnimeListSchema.index({ user: 1 });

const AnimeList = mongoose.model('AnimeList', AnimeListSchema);
module.exports = AnimeList;
