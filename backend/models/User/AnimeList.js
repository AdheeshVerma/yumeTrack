const mongoose = require('mongoose');

const AnimeListSchema = new mongoose.Schema({
    
});

const AnimeList = mongoose.model('AnimeList', AnimeListSchema);
module.exports = AnimeList;
