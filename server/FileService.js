import { v2 as cloudinary } from 'cloudinary';
import { configDotenv } from 'dotenv';


configDotenv();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    secure: true,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFile = async (file) => {
    const fileData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const uploadResult = await cloudinary.uploader.upload(fileData, {
        public_id: file.originalname,
    });
    return uploadResult;
};

