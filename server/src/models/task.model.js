import mongoose from "mongoose";
import { schema, model } from "mongoose";

const taskSchema = new schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
    },

    description: {
      type: String,
      require: true,
      trim: true,
    },

    category: {
      type: String,
      require: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    dueDate: {
      type: Date,
      default: Date.now(),
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },

  { timeStamp: true }
);

const task = model("task", taskSchema);

export default task;
