import e from 'express';
import express from 'express'
import { generateOTP, googleAuth, resetPassword, signIn, signOut, signUp, verifyOTP } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/signout", signOut);
authRouter.post("/send-otp", generateOTP);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google-auth", googleAuth);

export default authRouter;