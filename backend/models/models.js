// Import all models here

//User Model
const User = require('./User/User');
const UserPrefrence =require('./User/UserPreference');
const AnimeList = require('./User/AnimeList');

//Anime Model
const Anime = require('./Anime/Anime');
const Forum = require('./Anime/Forum');
const ForumChats = require('./Anime/ForumChats');
const Genre = require('./Anime/Genre');
const Episode = require('./Anime/Episodes');
const Character = require('./Anime/Character');
const Staff = require('./Anime/Staff');
const review = require('./Anime/Reviews');

//Admin Model
const Admin = require('./Admin/Admin');

//Export all models here
module.exports = {
    User,
    UserPrefrence,
    AnimeList,
    Genre,
    Episode,
    Character,
    Staff,
    review,
    Anime,
    Forum,
    ForumChats,
    Admin
};