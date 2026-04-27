import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handleAsyncError from "../middleware/handleAsyncError.js";
import User from "../models/userModel.js";
import crypto from "crypto"
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import uploadToCloudinary from '../utils/cloudinaryUpload.js';

const debugLogFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '../register-debug.log');
fs.writeFileSync(debugLogFile, 'userController loaded\n');


export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    const uploadedAvatar = req.files?.avatar;

    fs.appendFileSync(debugLogFile, `\n--- register request ---\n`);
    fs.appendFileSync(debugLogFile, `body: ${JSON.stringify(req.body)}\n`);
    fs.appendFileSync(debugLogFile, `files: ${JSON.stringify(Object.keys(req.files || {}))}\n`);
    fs.appendFileSync(debugLogFile, `uploadedAvatar: ${uploadedAvatar ? JSON.stringify({
        hasTempFilePath: Boolean(uploadedAvatar.tempFilePath),
        hasData: Boolean(uploadedAvatar.data),
        mimetype: uploadedAvatar?.mimetype,
        name: uploadedAvatar?.name
    }) : 'null'}\n`);
    
    let avatarData = {
        public_id: 'default_avatar',
        url: '/images/profile.webp'
    };

    const hasTempFilePath = Boolean(uploadedAvatar?.tempFilePath && uploadedAvatar.tempFilePath.trim());
    const hasBufferData = Boolean(uploadedAvatar?.data && uploadedAvatar.data.length > 0);
    const hasFileUpload = Boolean(uploadedAvatar && (hasTempFilePath || hasBufferData));
    fs.appendFileSync('backend/register-debug.log', `hasFileUpload: ${hasFileUpload}\n`);

    if (hasFileUpload) {
        const myCloud = await uploadToCloudinary(uploadedAvatar, 'avatars');
        avatarData = {
            public_id: myCloud.public_id,
            url: myCloud.url
        };
    } else if (avatar && typeof avatar === 'string' && avatar.trim().startsWith('data:')) {
        const myCloud = await uploadToCloudinary(avatar, 'avatars');
        avatarData = {
            public_id: myCloud.public_id,
            url: myCloud.url
        };
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: avatarData
    })

    // const token = user.getJWTToken();

    // res.status(201).json({
    //     success: true,
    //     user,
    //     token
    // })

    // Helper function
    sendToken(user, 201, res);
})

// Login
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HandleError("Email or password cannot be empty", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid Email or password", 401));
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
        return next(new HandleError("Invalid Email or password", 401));
    }
    sendToken(user, 200, res);
})

// Logout
export const logout = handleAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: false,
        message: "Successfully Logged out"
    })
})

// Forgot Password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    // const user = await User.findOne({email: req.body.email}); Or

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User does not exist!", 400));
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken();
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        return next(new HandleError("Could not save reset token, please try again later", 500));
    }
    const resetPasswordURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
    const message = `Use the following link to reset your password: ${resetPasswordURL}.
     \n\n This link will expire in 5 minutes. \n\n If you didnt request a password reset, please ignore this message.`;
    try {
        // Send Email
        await sendEmail({
            email: user.email,
            subject: 'Password reset request',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email is sent to ${user.email} successfully!`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new HandleError("Email could not be sent, please try again later", 500));
    }
})

// Reset password
export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new HandleError("Reset Password token is invalid or has expired", 400));
    }
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next(new HandleError("Password does not match", 400));
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})

// Get user details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// Update password => User know the old password but want to update it
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    const checkPasswordMatch = await user.verifyPassword(oldPassword);
    if (!checkPasswordMatch) {
        return next(new HandleError("Old password is incorrect", 400));
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("Password doesnt match", 400));
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
})

// Updating user profile
export const updateProfile = handleAsyncError(async (req, res, next) => {
    const { name, email, avatar } = req.body;
    const updateUserDetails = {
        name,
        email
    }
    if (avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(imageId);
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })
        updateUserDetails.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        user
    })
})

// Admin - Getting user information
export const getUserList = handleAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Admin - Getting single user information
export const getSingleUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new HandleError(`User does not exist with this id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Admin - Changing user role
export const updateUserRole = handleAsyncError(async (req, res, next) => {
    const { role } = req.body;
    const newUserData = {
        role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })
    if (!user) {
        return next(new HandleError("User does not exists", 400));
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Admin - Deleting user profile
export const deleteUser = handleAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return next(new HandleError("User does not exists", 404));
    }
    const imageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);

    res.status(200).json({
        success: true,
        message: "User deleted successfully!"
    })
})

