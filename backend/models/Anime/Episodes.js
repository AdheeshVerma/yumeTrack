const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
    
});

const Episode = mongoose.model('Episode', EpisodeSchema);
module.exports = Episode;
