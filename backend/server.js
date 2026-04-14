import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import Razorpay from 'razorpay';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: false
})

// Handle uncaught exception errors
process.on('uncaughtException', (err) => {
    process.exit(1);
})

const port = process.env.PORT || 3000;

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

let server;

const startServer = async () => {
    try {
        await connectMongoDatabase();
        server = app.listen(port, () => {});
    } catch (error) {
        console.error(`Startup failed: ${error.message}`);
        process.exit(1);
    }
};

startServer();


process.on('unhandledRejection', (err) => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
})
