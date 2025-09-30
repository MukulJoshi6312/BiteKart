import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOtpMail = async(to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Reset Your Password',
    html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
  });
};


export const sendDeliveryOtpMail = async(user, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Delivery OTP',
    html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`
  });
};
