import { Types, Schema, model } from "mongoose";

const otpSchema = new Schema({
  user: { type: Types.ObjectId, ref: "user", required: true },
  otp: { type: String, required: true },
  expiresIn: { type: Date, required: true },
  otpType: { type: String, enum: ["email-verify", "password-reset"] },
});

const Otp = model("otp", otpSchema);

export default Otp;
