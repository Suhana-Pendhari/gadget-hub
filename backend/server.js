import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({ path: 'backend/config/config.env', quiet: true });
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: false
})

process.on('uncaughtException', (err) => {
    console.error(`Uncaught exception: ${err.message}`);
    process.exit(1);
})

const port = process.env.PORT || 3000;

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
    console.error(`Unhandled rejection: ${err.message}`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
})
