const { review ,Anime} = require('../models/models.js');

exports.writeReview = async (req, res) => {
  try {
    const { animeId } = req.params;
    const { content } = req.body;
    const writer = req.user.id;

    const animeExists = await Anime.findById(animeId);
    if (!animeExists) {
      return res.status(404).json({ message: "Anime not found" });
    }

    const newReview = await review.create({ anime: animeId, review: content, writer });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAnimeReviews = async (req, res) => {
  try {
    const { animeId } = req.params;
    const reviews = await review.find({ anime: animeId }).populate('writer', 'username').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const reviewToDelete = await review.findById(reviewId);
    if (!reviewToDelete) {
      return res.status(404).json({ message: "Review not found" });
    }

    await reviewToDelete.remove();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.likeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const reviewToLike = await review.findById(reviewId);
    if (!reviewToLike) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (reviewToLike.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this review" });
    }

    reviewToLike.likes.push(userId);
    await reviewToLike.save();

    res.status(200).json({ message: "Review liked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.unlikeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const reviewToUnlike = await review.findById(reviewId);
    if (!reviewToUnlike) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!reviewToUnlike.likes.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this review" });
    }

    reviewToUnlike.likes.pull(userId);
    await reviewToUnlike.save();

    res.status(200).json({ message: "Review unliked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await review.find({ writer: req.user.id }).populate('anime', 'name').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content } = req.body;

    const reviewToEdit = await review.findById(reviewId);
    if (!reviewToEdit) {
      return res.status(404).json({ message: "Review not found" });
    }

    reviewToEdit.review = content;
    await reviewToEdit.save();

    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.rateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating } = req.body;

    const reviewToRate = await review.findById(reviewId);
    if (!reviewToRate) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ message: "Rating must be between 0 and 10" });
    }

    const existingRating = reviewToRate.ratings.find(r => r.user.toString() === req.user.id);
    if (existingRating) {
      existingRating.value = rating;
    } else {
      reviewToRate.ratings.push({ user: req.user.id, value: rating });
    }
    reviewToRate.averageRating = reviewToRate.ratings.reduce((acc, r) => acc + r.value, 0) / reviewToRate.ratings.length;
    await reviewToRate.save();

    res.status(200).json({ message: "Review rated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
