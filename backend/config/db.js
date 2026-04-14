import mongoose from "mongoose";

export const connectMongoDatabase = () => {
    mongoose.connect(process.env.DB_URI).then(() => {})
}
