import mongoose from "mongoose";

let isConnected = false;

export const connectMongoDatabase = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.DB_URI) {
        throw new Error("DB_URI is missing in environment variables");
    }

    const conn = await mongoose.connect(process.env.DB_URI);
    isConnected = Boolean(conn?.connections?.[0]?.readyState);
};
