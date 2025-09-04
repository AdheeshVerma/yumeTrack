const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    
});
const Comments = mongoose.model('Comments', CommentsSchema);
module.exports = Comments;
