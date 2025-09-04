// Import all models here

//User Model
const User = require('./User/User');
const UserPrefrence =require('./User/UserPreference');

//Anime Model
const Anime = require('./Anime/Anime');
const Comments = require('./Anime/Comments');
const Forum = require('./Anime/Forum');
const ForumChats = require('./Anime/ForumChats');

//Admin Model
const Admin = require('./Admin/Admin');

//Export all models here
module.exports = {
    User,
    UserPrefrence,
    Anime,
    Comments,
    Forum,
    ForumChats,
    Admin
};