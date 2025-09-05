const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  profilePic: {type:String},
  bio: {type:String},
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  quizzesAttempted: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizResult" }],
  ratedAnimes: [{ type: mongoose.Schema.Types.ObjectId, ref: "AnimeRating" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Anime" }],
  achievements: [String],
  genrePieChart: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);
module.exports = User;