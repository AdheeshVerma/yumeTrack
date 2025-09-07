const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    ProductionStudio: { type: String },
    status: { type: String, enum: ['Ongoing', 'Completed', 'Plan to Watch'], default: 'Ongoing' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    Format: { type: String, enum: ['TV', 'Movie', 'OVA', 'ONA', 'TV Short'], default: 'TV' },
    totalEpisodes: { type: Number, default: 0 },
    latestEpisode: { type: Number, default: 0 },
    avgRating: { type: Number, min: 0, max: 10, default: null },
    ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, rating: { type: Number, min: 0, max: 10 } }],
    popularity: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    coverImage: { type: String, default: null },
    bannerImage: { type: String, default: null },
    synonyms: [{ type: String }]
},{timestamps:true});

AnimeSchema.index({ name: 1, startDate: 1 }, { unique: true });
AnimeSchema.index({ status: 1 });
AnimeSchema.index({ startDate: -1 });

const Anime = mongoose.model('Anime', AnimeSchema);
module.exports = Anime;