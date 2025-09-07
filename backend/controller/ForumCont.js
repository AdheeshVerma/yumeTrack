const {Forum,ForumChats,Anime} = require('../models/models.js');

exports.createForum = async (req, res) => {
  try {
    const { title, description , anime } = req.body;
    const created_by = req.user.id;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    if (anime) {
      const animeExists = await Anime.findOne({ name: anime });
      if (!animeExists) {
        return res.status(400).json({ message: "Provided anime does not exist" });
      }
      const newForum = await Forum.create({ created_by, title, description , anime:animeExists._id });
      res.status(201).json(newForum);
    }
    const newForum = await Forum.create({ created_by, title, description });
    res.status(201).json(newForum);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
}

exports.getUserForums = async (req, res) => {
  try {
    const forums = await Forum.find({ created_by: req.user.id });
    res.status(200).json(forums);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateForum = async (req, res) => {
  try {
    const { forumId } = req.params;
    const { title, description, anime } = req.body;

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    forum.title = title || forum.title;
    forum.description = description || forum.description;
    if (anime) {
      const animeExists = await Anime.findOne({ name: anime });
      if (!animeExists) {
        return res.status(400).json({ message: "Provided anime does not exist" });
      }
      forum.anime = animeExists._id;
    }

    const updatedForum = await forum.save();
    res.status(200).json(updatedForum);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteForum = async (req, res) => {
    try {
        const { forumId } = req.params;
        const forum = await Forum.findById(forumId);
        if (!forum) {
            return res.status(404).json({ message: "Forum not found" });
        }
        await Forum.findByIdAndDelete(forumId);
        res.status(200).json({ message: "Forum deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.getAllForums = async (req, res) => {
    try {
        const forums = await Forum.find().populate("created_by", "username").populate("anime", "name");
        res.status(200).json(forums);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.addForumChat = async (req, res) => {
  try {
    const { forumId } = req.params;
    const { message, attachments, parentMessage } = req.body;
    const sent_by = req.user.id;

    if (!forumId || !message) {
      return res.status(400).json({ message: "Forum ID and message are required" });
    }

    const forumExists = await Forum.findById(forumId);
    if (!forumExists) {
      return res.status(404).json({ message: "Forum not found" });
    }

    const newChat = new ForumChats({
      forum: forumId,
      message,
      attachments: attachments || [],
      parentMessage: parentMessage || null,
      sent_by
    });

    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.editForumChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, attachments } = req.body;
    const sent_by = req.user.id;

    if (!chatId || !message) {
      return res.status(400).json({ message: "Chat ID and message are required" });
    }

    const edited_at = new Date();

    const updatedChat = await ForumChats.findByIdAndUpdate(
      chatId,
      { message, attachments: attachments || [], sent_by, edited_at },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const populatedChat = await updatedChat.populate("sent_by", "username");

    res.status(200).json(populatedChat);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteForumChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await ForumChats.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    await ForumChats.findByIdAndDelete(chatId);
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getForumChats = async (req, res) => {
  try {
    const { forumId } = req.params;
    if (!forumId) {
      return res.status(400).json({ message: "Forum ID is required" });
    }
    const chats = await ForumChats.find({ forum: forumId }).populate("sent_by", "username").sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
