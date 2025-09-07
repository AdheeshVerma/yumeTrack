const {Anime,UserPreference,AnimeList,Genre,Episode} = require('../models/models.js');

const allAnime=async(req,res)=>{
    try{
        const anime=await Anime.find();
        res.status(200).json(anime);
    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ message: "Anime not found" });

    anime.views = (anime.views || 0) + 1;
    await anime.save();

    res.json(anime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const userPref = await UserPreference.findOne({ user: req.user.id }).sort({ createdAt: -1 }); 
    if (!userPref || !userPref.preferences || userPref.preferences.length === 0) {
      return res.status(200).json({ message: "No preferences found", recommendations: [] });
    }
    const watchedAnimeIds = await AnimeList.find({ user: req.user.id }).distinct("anime");
    const recommendations = await Anime.find({
      genres: { $in: userPref.preferences },
      _id: { $nin: watchedAnimeIds }
    })
      .sort({ popularity: -1, avgRating: -1 })
      .limit(10)
      .populate("genres");

    res.status(200).json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getAnimeByGenre = async (req, res) => {
  try {
    const { genre } = req.body;
    const genreExists = await Genre.findOne({ name: genre });
    if (!genreExists) {
      return res.status(404).json({ message: "Genre not found" });
    }
    const anime = await Anime.find({ genres: genreExists._id });
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const trendingAnime = async (req, res) => {
    try {
        const anime = await Anime.find().sort({ popularity: -1 }).limit(10);
        res.status(200).json(anime);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const topRatedAnime = async (req, res) => {
    try {
        const anime = await Anime.find().sort({ avgRating: -1 }).limit(10);
        res.status(200).json(anime);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const mostViewedAnime = async (req, res) => {
    try {
        const anime = await Anime.find().sort({ views: -1 }).limit(10);
        res.status(200).json(anime);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const getAnimeEpisodes = async (req, res) => {
    try {
        const { animeId } = req.params;
        const episodes = await Episode.find({ anime: animeId }).sort({ epNo: 1 });
        res.status(200).json(episodes);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

const getSpecificEpisode = async (req, res) => {
  try {
    const {animeId, epNo} = req.params;
    const anime = await Anime.findById(animeId)
    if (!anime) return res.status(404).json({ message: "Anime not found" });
    const episode = await Episode.findOne({ anime: animeId ,epNo})

    res.status(200).json(episode);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports={allAnime,getAnimeById,getRecommendations,getAnimeByGenre,trendingAnime,topRatedAnime,mostViewedAnime,getAnimeEpisodes,getSpecificEpisode};