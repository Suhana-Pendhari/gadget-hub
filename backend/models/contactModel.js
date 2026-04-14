import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
    },
    phone: {
        type: String
    },
    message: {
        type: String,
        required: [true, "Please provide a message"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Contact", contactSchema);
