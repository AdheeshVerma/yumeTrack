const Review = require('../models/Anime/Reviews.js');
const {User , AnimeList , UserPreference, ForumChats,Forum,Anime} = require('../models/models.js');
const {generateToken} = require('../utils/TokenGen.js');
const bcrypt = require('bcrypt');
const { sendWelcomeMail } = require("../utils/Mailer.js");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS) || 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });
    await sendWelcomeMail(newUser.email, newUser.username);
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne(req.user.email);
    res.status(200).json({
      message:"User Found",
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const {
      username, email, password
    } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { username, email, password }, { new: true }).select("-password");
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.showUserAnimeList = async (req, res) => {
  try {
    const animeList = await AnimeList.find({ user: req.user.id });
    res.status(200).json(animeList);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addToAnimeList = async (req, res) => {
  try {
    const { animeId, status } = req.body;
    const newEntry = await AnimeList.create({ user: req.user.id, anime: animeId, status });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateAnimeList = async (req, res) => {
  try {
    const { status } = req.body;
    const {animeId} = req.params;
    const updatedEntry = await AnimeList.findOneAndUpdate(
      { user: req.user.id, anime: animeId },
      { status },
      { new: true }
    );
    res.status(200).json(updatedEntry);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.removeFromAnimeList = async (req, res) => {
  try {
    const { animeId } = req.body;
    await AnimeList.findOneAndDelete({ user: req.user.id, anime: animeId });
    res.status(200).json({ message: "Entry removed from anime list" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.userPrefrence = async (req, res) => {
  try {
    const { 
      answers,
      prefrences
    } = req.body;
    const userId=req.user.id;

    const genreDocs = await Genre.find({ name: { $in: prefrences } });
    if (genreDocs.length !== prefrences.length) {
        return res.status(400).json({ message: 'One or more genres are invalid.' });
    }
    const genreIds = genreDocs.map(genre => genre._id);

    const newResult = {
      user: userId,
      answers,
      preferences: genreIds
    }
    const Pref = await UserPreference.create(newResult);
    res.status(200).json(Pref);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserPrefrence = async (req, res) => {
  try {
    const preference = await UserPreference.findOne({ user: req.user.id }).populate('prefrences', 'name');
    if (!preference) {
      return res.status(404).json({ message: "User preference not found" });
    }
    res.status(200).json(preference);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.registerReport = async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user.id;
    const { item_type, item_id } = req.params;

    const allowedItemTypes = ['Forum', 'Review', 'ForumChats'];
    if (!allowedItemTypes.includes(item_type)) {
      return res.status(400).json({ message: 'Invalid item type provided' });
    }

    let itemPresent;
    if (item_type === 'Forum') {
      itemPresent = await Forum.findById(item_id);
    } else if (item_type === 'Review') {
      itemPresent = await Review.findById(item_id);
    } else {
      itemPresent = await ForumChats.findById(item_id);
    }
    if (!itemPresent) {
      return res.status(404).json({ message: "Item not found" });
    }

    const alreadyReported = await Report.findOne({ user: userId, item_id, item_type });
    if (alreadyReported) {
      return res.status(400).json({ message: "You have already reported this item" });
    }

    const newReport = await Report.create({ user: userId, item_type , item_id , reason });
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};