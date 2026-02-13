const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book.js");
const User = require("../models/User.js");

const bookRouter = express.Router();

// Fetch All Books
bookRouter.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create book
bookRouter.post("", async (req, res) => {
  try {
    const { title, author, genre, isAvailable, publishedYear } = req.body;

    const existingBook = await Book.findOne({ title, author });

    if (existingBook) {
      return res.status(400).json({ error: "Book already exists" });
    }

    const book = await Book.create({
      title,
      author,
      genre,
      isAvailable,
      publishedYear,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete book
bookRouter.delete("/:bookId", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    res.status(200).json({ message: "Book deleted successfully", data: book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single book
bookRouter.get("/:bookId", async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update book
bookRouter.put("/:bookId", async (req, res) => {
  try {
    const bookUpdated = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true },
    );

    res.status(200).json(bookUpdated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

bookRouter.post("/:bookId/borrow/:userId", async (req, res) => {
  try {
    const { bookId, userId } = req.params;

    if (
      !mongoose.isValidObjectId(bookId) ||
      !mongoose.isValidObjectId(userId)
    ) {
      return res.status(400).json({ error: "Invalid bookId or userId" });
    }

    // make sure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check how many books the user has already borrowed
    const borrowedCount = await Book.countDocuments({ borrowedBy: userId });
    if (borrowedCount > 2) {
      return res
        .status(409)
        .json({ error: "User has reached max borrow limit (2 books)" });
    }

    // Automatically claim the book if it's available
    const updated = await Book.findOneAndUpdate(
      { id: bookId, isAvailable: true, borrowedBy: null },
      { $set: { isAvailable: false, borrowedBy: userID } },
      { new: true },
    );

    if (!updated) {
      return res
        .status(409)
        .json({ error: "Book is already borrowed or does not exist" });
    }

    await updated.populated("BorrowedBy", "name email");

    res.status(200).json({
      message: `Book borrowed by ${updated.borrowedBy.name}`,
      data: updated,
    });
  } catch (errors) {
    res.status(500).json({ errors: error.message });
  }
});

// return a book
bookRouter.post("/:bookId/return", async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({ error: "Invalid bookId" });
    }



    const updated = await Book.findOneAndUpdate(
      { id: bookId, isAvailable: false },
      { $set: { isAvailable: true, borrowedBy: null } },
      { new: true },
    );

    if (!updated) {
      return res
        .status(409)
        .json({ error: "Book currently is not borrowed or does not exist" });
    }

    res.status(200).json({
      message:"Book returned", data: updated
    });
  } catch (errors) {
    res.status(500).json({ errors: error.message });
  }
});

module.exports = bookRouter;
