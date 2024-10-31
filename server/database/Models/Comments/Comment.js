const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: String,
    },
    content: {
        type: String,
        trim: true,
    },
    replies: [String],
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

module.exports = commentSchema;


