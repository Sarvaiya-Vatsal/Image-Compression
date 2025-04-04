const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    originalSize: {
        type: Number,
        required: true
    },
    compressedSize: {
        type: Number,
        required: true
    },
    originalPath: {
        type: String,
        required: true
    },
    compressedPath: {
        type: String,
        required: true
    },
    compressionRatio: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Image', imageSchema); 