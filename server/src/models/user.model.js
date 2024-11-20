import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },

    photo: {
      type: String,
      default: "hi.png",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;
