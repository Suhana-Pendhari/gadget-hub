import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDatabase } from './config/db.js';
if(process.env.NODE_ENV!=='PRODUCTION'){
    dotenv.config({ path: 'backend/config/config.env' });
}
import Razorpay from 'razorpay';
dotenv.config({ path: "backend/config/config.env" });
import { v2 as cloudinary } from 'cloudinary';

connectMongoDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: false
})

// Handle uncaught exception errors
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to uncaught exception errors`);
    process.exit(1);
})

const port = process.env.PORT || 3000;

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const server = app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
})


process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down, due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    })
})
