import express from 'express';
import { submitContactForm, getAllContactMessages, deleteContactMessage } from '../controller/contactController.js';
import { verifyUserAuth, roleBasedAccess } from '../middleware/userAuth.js';

const router = express.Router();

// Submit contact form (public)
router.post('/submit', submitContactForm);

// Get all contact messages (admin only)
router.get('/all', verifyUserAuth, roleBasedAccess('admin'), getAllContactMessages);

// Delete contact message (admin only)
router.delete('/:id', verifyUserAuth, roleBasedAccess('admin'), deleteContactMessage);

export default router;
