const mongoose = require('mongoose');
const commentSchema = require('../Comments/Comment');
const User = require('../User/User');

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
        type: String
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
    },
    thumbnail: {
        type: String
    }

})

videoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;