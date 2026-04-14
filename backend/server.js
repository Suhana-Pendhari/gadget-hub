import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import { getRazorpayInstance } from './config/razorpay.js';
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

export const instance = getRazorpayInstance();

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
