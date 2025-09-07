const express = require('express');
const router = express.Router();
const { createForum, getUserForums, updateForum,deleteForum,getAllForums,addForumChat,editForumChat,deleteForumChat,getForumChats } = require('../controller/ForumCont.js');
const  protect  = require('../middleware/UserAuthen.js');

router.post('/forum/create', protect, createForum);
router.get('/forum', getAllForums);
router.get('/forum/user', protect, getUserForums);
router.put('/forum/:forumId', protect, updateForum);
router.delete('/forum/:forumId', protect, deleteForum);
router.post('/forum/:forumId/chat', protect, addForumChat);
router.get('/forum/:forumId/chats', protect, getForumChats);
router.put('/forum/chat/:chatId', protect, editForumChat);
router.delete('/forum/chat/:chatId', protect, deleteForumChat);

module.exports = router;
