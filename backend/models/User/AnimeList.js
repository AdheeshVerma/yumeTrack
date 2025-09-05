const mongoose = require('mongoose');

const AnimeListSchema = new mongoose.Schema({
    anime:{type:mongoose.Schema.Types.ObjectId,ref:"Anime"},
    status: {type: String, enum: ["plan to watch", "on hold", "watching", "completed", "dropped"],required: true},
    startedAt: { type: Date },
    finishedAt: { type: Date }
},{timestamps:true});

const AnimeList = mongoose.model('AnimeList', AnimeListSchema);
module.exports = AnimeList;
