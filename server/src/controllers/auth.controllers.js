import User from "../models/user.model.js";
import { sendVerificationEmail } from "../helpers/nodemailer.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateVerifyToken } from "../helpers/token.js";
import jwt from "jsonwebtoken";
import Otp from "../models/otp.model.js";
import { generateOtp } from "../helpers/otp.js";

const createUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    //   Check if password = comnfirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "passwords do not match" });
    }
    // Check if user email exists

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "user email exist already" });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Proceed to save user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const { fullName, email, password, photo, isEmailVerified } = newUser;
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }

    if (newUser) {
      // Send verication Email
      await sendVerificationEmail(newUser);

      //Generate and Send Verification Token as response to client
      const userPayload = {
        _id: newUser._id,
        email: newUser.email,
      };
      const verificationToken = generateVerifyToken(userPayload);
      res.status(201).json({ message: "user created", verificationToken });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// This controller takes the otp from client confirms it and updates the isEmailVerified prop of user
const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  // Extract token from req header
  let token = null;
  const authHeader = req.headers["authorization"];
  console.log(req.headers);
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "auth token is required" });
  }
  // Verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_VERIFY_SECRET);
    console.log(payload);

    const userOtp = await Otp.findOne({
      user: payload._id,
      otpType: "email-verify",
    });

    if (!userOtp) {
      return res.status(400).json({ message: "otp is invalid" });
    }
    if (userOtp.expiresIn < new Date(Date.now())) {
      return res.status(400).json({ message: "otp has expired" });
    }
    if (userOtp.otp === otp) {
      await User.findByIdAndUpdate(payload._id, { isEmailVerified: true });
      res.status(200).json({ message: "user email verified" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (!user.isEmailVerified) {
      //Send verification email again
      await sendVerificationEmail(user);

      // Generate and send verification token as response to client
      const userPayload = {
        _id: user._id,
      };
      const verificationToken = generateVerifyToken(userPayload);
      return res
        .status(200)
        .json({ message: "Verification email sent", verificationToken });
    }

    // Generate and send access token
    const userPayload = {
      _id: user._id,
    };
    const accessToken = generateAccessToken(userPayload);
    return res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// logout user
const logoutUser = async (req, res) => {
  res.status(200).json({ message: "User logged out" });
};

// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    // 404 Not Found
    return res.status(404).json({ message: "User not found" });
  }

  // see if reset token exists
  let token = await token.findOne({ userId: user._id });

  // if token exists --> delete the token
  if (token) {
    await token.deleteOne();
  }

  // Generate a 6-digit otp
  const otp = generateOtp();

  // Hash the OTP
  const hashedOtp = hashToken(otp);

  // Save the hashed OTP with expiration
  await new token({
    userId: user._id,
    passwordResetToken: hashedOtp,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
  }).save();

  // Send OTP to user via email
  const subject = "Password Reset OTP - TaskHive";
  const send_to = user.email;
  const send_from = process.env.EMAIL;
  const reply_to = "noreply@noreply.com";
  const template = "forgotPasswordOtp";
  const name = user.name;

  try {
    await sendEmail(subject, send_to, send_from, reply_to, template, name, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("Error sending email: ", error);
    return res.status(500).json({ message: "OTP could not be sent" });
  }
};

// Helper function to hash the OTP
const hashToken = (token) => {
  const salt = crypto.randomBytes(16).toString("hex");
  return crypto.pbkdf2Sync(token, salt, 1000, 64, `sha512`).toString(`hex`);
};

// reset password
const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // hash the reset token
  const hashedToken = hashToken(resetPasswordToken);

  // check if token exists and has not expired
  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,
    // check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // find user with the user id in the token
  const user = await User.findById(userToken.userId);

  // update user password
  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
};

// change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find user by id
  const user = await User.findById(req.user._id);

  // compare current password with the hashed password in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password!" });
  }

  // reset password
  if (isMatch) {
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } else {
    return res.status(400).json({ message: "Password could not be changed!" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  // attempt to find and delete the user
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Cannot Delete User" });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Cannot get users" });
  }
};

export {
  createUser,
  verifyEmail,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  deleteUser,
  getAllUsers,
};
