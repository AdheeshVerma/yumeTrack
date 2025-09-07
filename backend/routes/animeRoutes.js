const express = require('express');
const router = express.Router();
const { allAnime,getAnimeById,getAnimeByGenre,getAnimeEpisodes,getRecommendations,getSpecificEpisode,mostViewedAnime,topRatedAnime,trendingAnime } = require('../controller/AnimeCont.js');

router.get('/', allAnime);
router.get('/:id', getAnimeById);
router.get('/recommendations', getRecommendations);
router.get('/genre', getAnimeByGenre);
router.get('/trending', trendingAnime);
router.get('/top-rated', topRatedAnime);
router.get('/most-viewed', mostViewedAnime);
router.get('/:animeId/episodes', getAnimeEpisodes);
router.get('/:animeId/episodes/:epNo', getSpecificEpisode);

module.exports = router;