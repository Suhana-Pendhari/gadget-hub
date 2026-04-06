import { v2 as cloudinary } from 'cloudinary';

const toUploadData = (image) => {
    if (typeof image !== 'string') return image;

    if (image.startsWith('data:') || image.includes('base64,')) {
        return image;
    }

    return `data:image/jpeg;base64,${image}`;
};

const uploadToCloudinary = async (image, folder, retries = 3) => {
    let lastError;
    const uploadData = toUploadData(image);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const result = await cloudinary.uploader.upload(uploadData, {
                folder,
                resource_type: 'auto',
                timestamp,
                timeout: 60000
            });

            return {
                public_id: result.public_id,
                url: result.secure_url
            };
        } catch (error) {
            lastError = error;
            console.log(`Upload attempt ${attempt} failed:`, error.message);

            if (attempt === retries) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
    }

    throw lastError;
};

export default uploadToCloudinary;

