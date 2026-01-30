import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

// Configure Multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

export const uploadImage = (req, res, next) => {
    const uploadSingle = upload.single('image');

    uploadSingle(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return next(); // No file uploaded, proceed
        }

        // Upload to Cloudinary using stream
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'blog-posts' },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.status(500).json({ message: 'Image upload failed' });
                }
                req.body.imageUrl = result.secure_url;
                next();
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};
