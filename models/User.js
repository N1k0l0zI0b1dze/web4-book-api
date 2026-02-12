const mongoose = require("mongoose");

// User Schemas

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Username is required!"] },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true, // no two users with same email
      lowercase: true, // store in lowercase
      trim: true,
    },
    isStudent: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compile schema from model
const User = mongoose.model("User", userSchema);

module.exports = User;
