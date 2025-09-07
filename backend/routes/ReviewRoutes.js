const express = require('express');
const router = express.Router();
const { writeReview, getAnimeReviews, deleteReview,getUserReviews, editReview,rateReview, likeReview, unlikeReview } = require('../controller/reviewCont.js');
const  protect  = require('../middleware/UserAuthen.js');

router.post('/review/:animeId', protect, writeReview);
router.get('/review/:animeId', getAnimeReviews);
router.get('/review/user', protect, getUserReviews);
router.put('/review/:reviewId', protect, editReview);
router.delete('/review/:reviewId', protect, deleteReview);
router.put('/review/:reviewId/rate', protect, rateReview);
router.put('/review/:reviewId/like', protect, likeReview);
router.put('/review/:reviewId/unlike', protect, unlikeReview);

module.exports = router;