const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    ProductionStudio: { type: String },
    rating: { type: Number, min: 0, max: 10 },
    
});
const Anime = mongoose.model('Anime', AnimeSchema);
module.exports = Anime;