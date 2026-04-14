import Contact from '../models/contactModel.js';
import HandleError from '../utils/handleError.js';
import handleAsyncError from '../middleware/handleAsyncError.js';

// Submit Contact Form
export const submitContactForm = handleAsyncError(async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email, and message"
            });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            contact
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error submitting contact form"
        });
    }
});

// Get All Contact Messages (Admin)
export const getAllContactMessages = handleAsyncError(async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            contacts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error fetching messages"
        });
    }
});

// Delete Contact Message (Admin)
export const deleteContactMessage = handleAsyncError(async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return next(new HandleError("Message not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Error deleting message"
        });
    }
});
