const mongoose = require("mongoose");

// Book Schemas

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, ["Book title is required!"]] },
    author: { type: String, required: [true, ["Author title is required!"]] },
    genre: String,
    publishedYear: {
      type: Number,
      required: [true, ["Published year is required!"]],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Who currently borrowed the book
    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB's special ID type
      ref: "User", // Tells Mongoose this field points to documents from "users" collection
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compile schema from model
const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
