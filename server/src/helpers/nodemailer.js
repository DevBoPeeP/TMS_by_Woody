import nodemailer from "nodemailer";
import { generateOtp } from "./otp.js";

const sendVerificationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  console.log(process.env.EMAIL);
  console.log(process.env.PASSWORD);

  // Call Generate Otp Function
  const returnedOtp = await generateOtp(user._id, "email-verify");

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: "One-time verification code",
    text: `Welcome to TMS. To complete your registation, Please use the following One-Time Password: ${returnedOtp}`,
  };

  try {
    const emailInfo = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error sending mail", error);
    throw error;
  }
};

export { sendVerificationEmail };
