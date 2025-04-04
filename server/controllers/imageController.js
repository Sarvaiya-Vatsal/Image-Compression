const Image = require('../models/Image');
const sharp = require('sharp');
const logger = require('../config/logger');
const path = require('path');
const fs = require('fs');


exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const originalPath = req.file.path;
        const compressedPath = path.join(
            'uploads',
            'compressed',
            `${Date.now()}-compressed-${req.file.originalname}`
        );

        
        if (!fs.existsSync(path.join('uploads', 'compressed'))) {
            fs.mkdirSync(path.join('uploads', 'compressed'), { recursive: true });
        }

        
        await sharp(originalPath)
            .jpeg({ quality: 60 })
            .toFile(compressedPath);

        const originalStats = fs.statSync(originalPath);
        const compressedStats = fs.statSync(compressedPath);

        const image = new Image({
            originalName: req.file.originalname,
            originalSize: originalStats.size,
            compressedSize: compressedStats.size,
            originalPath: originalPath,
            compressedPath: compressedPath,
            compressionRatio: ((originalStats.size - compressedStats.size) / originalStats.size) * 100
        });

        await image.save();
        logger.info(`Image compressed: ${req.file.originalname}`);

        res.status(201).json({
            message: 'Image uploaded and compressed successfully',
            image: {
                id: image._id,
                originalName: image.originalName,
                originalSize: image.originalSize,
                compressedSize: image.compressedSize,
                compressionRatio: image.compressionRatio
            }
        });
    } catch (error) {
        logger.error(`Error uploading image: ${error.message}`);
        
        
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                logger.error(`Error cleaning up file: ${unlinkError.message}`);
            }
        }

        if (error.message.includes('sharp')) {
            res.status(400).json({ message: 'Error processing image. Please try a different image.' });
        } else if (error.message.includes('MongoDB')) {
            res.status(500).json({ message: 'Database error. Please try again.' });
        } else {
            res.status(500).json({ message: 'Error processing image. Please try again.' });
        }
    }
};


exports.getImages = async (req, res) => {
    try {
        const images = await Image.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        logger.error(`Error fetching images: ${error.message}`);
        res.status(500).json({ message: 'Error fetching images' });
    }
};


exports.downloadImage = async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if (!fs.existsSync(image.compressedPath)) {
            return res.status(404).json({ message: 'Compressed image file not found' });
        }

        res.download(image.compressedPath, `compressed-${image.originalName}`);
        logger.info(`Image downloaded: ${image.originalName}`);
    } catch (error) {
        logger.error(`Error downloading image: ${error.message}`);
        res.status(500).json({ message: 'Error downloading image' });
    }
};


exports.getAnalytics = async (req, res) => {
    try {
        const totalImages = await Image.countDocuments();
        const totalOriginalSize = await Image.aggregate([
            { $group: { _id: null, total: { $sum: '$originalSize' } } }
        ]);
        const totalCompressedSize = await Image.aggregate([
            { $group: { _id: null, total: { $sum: '$compressedSize' } } }
        ]);

        res.json({
            totalImages,
            totalOriginalSize: totalOriginalSize[0]?.total || 0,
            totalCompressedSize: totalCompressedSize[0]?.total || 0,
            totalSpaceSaved: (totalOriginalSize[0]?.total || 0) - (totalCompressedSize[0]?.total || 0)
        });
    } catch (error) {
        logger.error(`Error fetching analytics: ${error.message}`);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
}; 