const express = require("express");
// const mongoose = require("mongoose");
const Book = require("../models/User.js");

const userRouter = express.Router();

userRouter.post("/", async (req, res) => {
  try {
    const { name, email, isStudent } = req.body;

    // check if email exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exist" });
    }

    const user = await User.create({ name, email, isStudent });
    res.status(500).json({ error: error.message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

bookRouter.get("/", async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = userRouter;
