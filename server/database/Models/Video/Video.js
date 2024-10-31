const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const videoSchema = new mongoose.Schema({
    url: {
        type: String
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    uploadedBy: {
        type: String // user_id
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }

})

videoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;