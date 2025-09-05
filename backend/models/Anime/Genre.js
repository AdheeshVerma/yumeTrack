const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({

});
const Genre = mongoose.model('Genre', GenreSchema);
module.exports = Genre;