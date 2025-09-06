    const {Anime, Genre, Episode, Character, report} = require('../models/models');
    const {generateToken} = require('../utils/TokenGen.js');
    const {Admin} = require("../models/models.js")
    const bcrypt = require("bcrypt")

    exports.adminLogin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const admin = await Admin.findOne({ username });

            if (!admin) return res.status(400).json({ message: "Invalid credentials" });

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(admin);

            res.json({
            message: "Login successful",
            user: {
                id: admin._id,
                username: admin.username,
            },
            token,
            });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
    };

exports.addGenre = async (req, res) => {
    try {
        const { name } = req.body;

        const existingGenre = await Genre.findOne({ name: name.trim() });
        if (existingGenre) {
            return res.status(409).json({ message: 'Genre already exists.' });
        }

        const genre = new Genre({ name });
        await genre.save();
        res.status(201).json({ message: 'Genre added successfully', genre });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add genre', error: error.message });
    }
};

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

        const genreDocs = await Genre.find({ name: { $in: genres } });
        if (genreDocs.length !== genres.length) {
            return res.status(400).json({ message: 'One or more genres are invalid.' });
        }
        const genreIds = genreDocs.map(genre => genre._id);

        const anime = new Anime({
            name: name.trim(),
            description: description.trim(),
            genres: genreIds,
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

exports.addEpisodes = async (req, res) => {
    try {
        const {
            anime,
            epNo,
            name,
            description,
            rating,
            thumbnail,
            status,
            releaseDate,
            isFiller,
            duration,
            Sources
        } = req.body;

        const animeId = await Anime.findOne({ name: anime.trim() });
        if (!animeId) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const episode = {
            anime: animeId._id,
            name: name.trim(),
            epNo,
            description: description.trim(),
            rating,
            thumbnail,
            status,
            releaseDate,
            isFiller,
            duration,
            Sources
        };

        const newEpisode = await Episode.create(episode);
        res.status(201).json({ message: 'Episode added successfully', episode: newEpisode });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add episode', error: error.message });
    }
}

exports.addCharacters = async (req, res) => {
    try {
        const {
            anime,
            name,
            role,
            image
        } = req.body;

        if (!anime || !name || !role) {
            return res.status(400).json({ message: 'Anime, name, and role are required fields.' });
        }
        const animeId = await Anime.findOne({ name: anime.trim() });
        if (!animeId) {
            return res.status(404).json({ message: 'Anime not found' });
        }

        const character = {
            anime: animeId._id,
            name: name.trim(),
            role: role.trim(),
            image: image.trim()
        };

        const newCharacter = await Character.create(character);
        res.status(201).json({ message: 'Character added successfully', character: newCharacter });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add character', error: error.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await report.find();
        res.status(200).json({ reports });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
    }
};

async function resolveIssue(issue) {
    if (issue.item_type === 'Forum') {
        await ForumChat.deleteMany({ forum: issue.item_id });
        await Forum.findByIdAndDelete(issue.item_id);
    } else if (issue.item_type === 'Review') {
        await Review.findByIdAndDelete(issue.item_id);
    } else if (issue.item_type === 'ForumChats') {
        await ForumChat.findByIdAndDelete(issue.item_id);
    }
}

exports.resolveReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const issue = await report.findById(reportId);
        if (!issue) {
            return res.status(404).json({ message: 'Report not found' });
        }
        if (issue.status === 'Pending') {
            resolveIssue(issue);
            issue.status = 'Resolved';
            await issue.save();
            res.status(200).json({ message: 'Report resolved successfully', issue });
        } else {
            res.status(400).json({ message: 'Report is not in a resolvable state', issue });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to resolve report', error: error.message });
    }
};

exports.rejectReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const issue = await report.findById(reportId);
        if (!issue) {
            return res.status(404).json({ message: 'Report not found' });
        }
        if (issue.status !== 'Pending') {
            return res.status(400).json({ message: 'Report is not in a pending state', issue });
        }
        issue.status = 'Rejected';
        await issue.save();
        res.status(200).json({ message: 'Report rejected successfully', issue });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject report', error: error.message });
    }
};