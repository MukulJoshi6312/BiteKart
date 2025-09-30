import exprees from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/token.js";
import { sendOtpMail } from "../utils/mail.js";


export const signUp = async(req, res) => {
    try{
        const { fullName, email, password, mobile, role } = req.body;

        // Validate request body
        if (!fullName || !email || !password || !mobile || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Validate password
        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Validate mobile number
        if(mobile.length !== 10){
            return res.status(400).json({ message: "Mobile number must be  10 digits long" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ fullName, email, password: hashedPassword, mobile, role });
        // Generate token
        const token = await generateToken(user._id);
        res.cookie("token", token, { secure:false,sameSite:"strict",maxAge: 7 * 24 * 60 * 60 * 1000,httpOnly:true });
        // Save user to database
        await user.save();

        return res.status(201).json({ message: "User registered successfully", user,token });
    }catch(error){
        console.error("Error signing up:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const signIn = async(req, res) => {
    try{
        const { email, password } = req.body;

        // Validate request body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = await generateToken(user._id);
        res.cookie("token", token, { secure:false,sameSite:"strict",maxAge: 7 * 24 * 60 * 60 * 1000,httpOnly:true });

        return res.status(200).json({ message: "User signed in successfully", user, token });
    }catch(error){
        console.error("Error signing in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}   

export const signOut = async(req, res) => {
    try{
        res.clearCookie("token");
        return res.status(200).json({ message: "User signed out successfully" });
    }catch(error){
        console.error("Error signing out:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// generate OTP
 
export const generateOTP = async(req, res) => {
    try{
        const {email} = req.body;
        console.log(email)
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        user.isOtpVerified = false;
        await user.save();
        await sendOtpMail(email, otp);
        return res.status(200).json({ message: "OTP sent successfully" });
    }catch(error){
        console.error("Error generating OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}; 

export const verifyOTP = async(req, res) => {
    try{
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP is valid
        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP has expired
        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Mark OTP as verified
        user.isOtpVerified = true;
        user.resetOtp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    }catch(error){
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const resetPassword = async(req, res) => { 
    try{
        const { email, newPassword } = req.body;

        // Validate request body
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(404).json({ message: "Otp verification required" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully" });
    }catch(error){
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });  
    }
}


export const googleAuth = async(req, res) => {
    try{

        const{fullName,email,mobile,role} = req.body;
        let user =  await User.findOne({ email });
        if (!user) {
            user = await User.create({ fullName, email, mobile, role});
        }

        // Generate token
        const token = await generateToken(user._id);
        res.cookie("token", token, { secure:false,sameSite:"strict",maxAge: 7 * 24 * 60 * 60 * 1000,httpOnly:true });

        return res.status(200).json(user);
    }catch(error){
        console.error("Error with Google authentication:", error);
        return res.status(500).json({ message: "Google Auth error" });
    }   
}