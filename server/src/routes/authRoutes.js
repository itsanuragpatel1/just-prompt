import { Router } from "express";
import { googleCallBack, googleLogin, login, logout, sendOtp, signup, verifyOtp } from "../controllers/authController.js";

const authRoutes=Router();


// authRoutes.post('/signup',signup);
authRoutes.post('/send-otp',sendOtp);
authRoutes.post('/verify-otp',verifyOtp);
authRoutes.post('/login',login);
authRoutes.get('/logout',logout);
authRoutes.get('/google',googleLogin);
authRoutes.get('/google/callback',googleCallBack);

export {authRoutes}