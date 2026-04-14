import mongoose from "mongoose";

export const connectMongoDatabase = async () => {
    if (!process.env.DB_URI) {
        throw new Error("DB_URI is missing in environment variables");
    }

    await mongoose.connect(process.env.DB_URI);
};
