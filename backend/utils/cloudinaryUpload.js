import { v2 as cloudinary } from 'cloudinary';

const toUploadData = (image) => {
    if (typeof image !== 'string') return image;

    if (image.startsWith('data:') || image.includes('base64,')) {
        return image;
    }

    return `data:image/jpeg;base64,${image}`;
};

const isExpressUploadFile = (file) => {
    return (
        file &&
        typeof file === 'object' &&
        Object.prototype.hasOwnProperty.call(file, 'mimetype') &&
        (Object.prototype.hasOwnProperty.call(file, 'data') || Object.prototype.hasOwnProperty.call(file, 'tempFilePath'))
    );
};

const uploadBufferFile = (file, folder) => {
    const resourceType = file.mimetype?.startsWith('video/') ? 'video' : 'image';

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
                timeout: 120000
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );

        stream.end(file.data);
    });
};

const uploadToCloudinary = async (image, folder, retries = 3) => {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            let result;

            if (isExpressUploadFile(image)) {
                if (image.tempFilePath) {
                    const resourceType = image.mimetype?.startsWith('video/') ? 'video' : 'image';
                    result = await cloudinary.uploader.upload(image.tempFilePath, {
                        folder,
                        resource_type: resourceType,
                        timestamp,
                        timeout: 120000
                    });
                } else {
                    result = await uploadBufferFile(image, folder);
                }
            } else {
                const uploadData = toUploadData(image);
                result = await cloudinary.uploader.upload(uploadData, {
                    folder,
                    resource_type: 'auto',
                    timestamp,
                    timeout: 60000
                });
            }

            return {
                public_id: result.public_id,
                url: result.secure_url
            };
        } catch (error) {
            lastError = error;

            if (attempt === retries) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
    }

    throw lastError;
};

export default uploadToCloudinary;

