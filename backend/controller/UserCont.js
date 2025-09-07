const {User , AnimeList , UserPreference, ForumChats,Forum,Genre,review,report, Anime} = require('../models/models.js');
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

    if (!user) return res.status(400).json({ message: "User not found" });

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
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS) || 10);
    const user = await User.findByIdAndUpdate(req.user.id, { username, email, password: hashedPassword }, { new: true }).select("-password");
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.deleteMe = async (req, res) => {
  try {
    await ForumChats.updateMany({ sent_by: req.user.id }, { sent_by: null });
    await Forum.updateMany({ created_by: req.user.id }, { created_by: null });
    await AnimeList.deleteMany({ user: req.user.id });
    await UserPreference.deleteMany({ user: req.user.id });
    await review.updateMany({ writer: req.user.id }, { writer: null });
    await report.updateMany({ user: req.user.id }, { user: null });
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "You are already following this user" });
    }
    if (userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    await currentUser.save();
    await userToFollow.save();
    res.status(200).json({ message: "User followed successfully" });
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
    const {animeId} = req.params;
    const { status } = req.body;
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: "Anime not found" });
    }
    const existingEntry = await AnimeList.findOne({ user: req.user.id, anime: animeId });
    if (existingEntry) {
      return res.status(400).json({ message: "Anime already in list" });
    }
    if(status==="Watching"){
      anime.popularity = anime.popularity + 1;
      await anime.save();
    }
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
    const anime = await Anime.findById(animeId);
    if (status==="Watching"){
      anime.popularity = anime.popularity + 1;
      await anime.save();
    }
    else{
      if(anime.popularity>0){
        anime.popularity = anime.popularity - 1;
        await anime.save();
      }
    }

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
    const { animeId } = req.params;
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
    const preference = await UserPreference.findOne({ user: req.user.id }).populate('preferences', 'name');
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
      itemPresent = await review.findById(item_id);
    } else {
      itemPresent = await ForumChats.findById(item_id);
    }
    if (!itemPresent) {
      return res.status(404).json({ message: "Item not found" });
    }

    const alreadyReported = await report.findOne({ user: userId, item_id, item_type });
    if (alreadyReported) {
      return res.status(400).json({ message: "You have already reported this item" });
    }

    const newReport = await report.create({ user: userId, item_type , item_id , reason });
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const reports = await report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteUserReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const reportToDelete = await report.findByIdAndDelete({ _id: reportId, user: req.user.id });
    if (!reportToDelete) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
