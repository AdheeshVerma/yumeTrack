const Anime = require('../models/Anime/Anime.js')

exports.addAnime = async (req, res) => {
    try {
        const {
            name,
            description,
            genres,
            ProductionStudio,
            status,
            startDate,
            endDate,
            Format,
            totalEpisodes,
            latestEpisode,
            avgRating,
            coverImage,
            bannerImage,
            synonyms
        } = req.body;

        const existingAnime = await Anime.findOne({ name: name.trim() });
        if (existingAnime) {
            return res.status(409).json({ message: 'Anime with this name already exists.' });
        }

        const anime = new Anime({
            name,
            description,
            genres,
            ProductionStudio,
            status,
            startDate,
            endDate,
            Format,
            totalEpisodes,
            latestEpisode,
            avgRating,
            coverImage,
            bannerImage,
            synonyms
        });

        await anime.save();
        res.status(201).json({ message: 'Anime added successfully', anime });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add anime', error: error.message });
    }
};