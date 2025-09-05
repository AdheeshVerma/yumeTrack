const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item_type: { type: String, required: true, enum: ['Forum', 'Review', 'ForumChats', 'User', 'Anime'] },
    item_id: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'item_type' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

ReportSchema.index({ user: 1 });
ReportSchema.index({ item_type: 1, item_id: 1 });

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;