import app from '../app.js';
import { connectMongoDatabase } from '../config/db.js';

export default async function handler(req, res) {
    try {
        await connectMongoDatabase();
        return app(req, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Server initialization failed'
        });
    }
}
