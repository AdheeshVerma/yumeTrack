const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
});
const Anime = mongoose.model('Anime', AnimeSchema);
module.exports = Anime;