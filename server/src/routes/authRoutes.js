import { Router } from "express";
import { googleCallBack, googleLogin, login, logout, sendOtp, setGoogleCookie, signup, updateAvatar, updatePassword, updateProfile, verifyOtp } from "../controllers/authController.js";
import { auth } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const authRoutes=Router();


// authRoutes.post('/signup',signup);
authRoutes.post('/send-otp',sendOtp);
authRoutes.post('/verify-otp',verifyOtp);
authRoutes.post('/login',login);
authRoutes.get('/logout',logout);
authRoutes.get('/google',googleLogin);
authRoutes.get('/google/callback',googleCallBack);
authRoutes.post('/set-google-cookie', setGoogleCookie);
authRoutes.post('/update-password',auth,updatePassword);
authRoutes.post('/update-profile',auth,updateProfile);
authRoutes.post('/update-avatar',auth,upload.single('image'),updateAvatar);

export {authRoutes}