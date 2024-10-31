const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    content: {
        type: String,
        trim: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
})

commentSchema.pre('save', function (next) {
    if (!this.uploadedAt) {
        this.uploadedAt = Date.now();
    }
    next();
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;


