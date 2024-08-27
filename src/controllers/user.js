import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { comparePassword, hashPassword } from "../services/hash.password.js";
import { hashTransactionPin } from "../services/transaction.pin.js";
import mongoSanitize from "mongo-sanitize";
import { compareTransactionPin } from "../services/transaction.pin.js";
import { body, validationResult } from "express-validator";

// Register User
export const registerUser = [
  // Validation middleware
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const sanitizedName = mongoSanitize(name);
    const sanitizedEmail = mongoSanitize(email);
    const sanitizedPassword = mongoSanitize(password);

    try {
      const userExist = await User.findOne({ email: sanitizedEmail });
      if (userExist)
        return res.status(400).json({ message: "User already exists." });

      const hashedPassword = await hashPassword(sanitizedPassword);

      const user = new User({
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
      });

      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Login User
export const loginUser = [
  // Validation middleware
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),

  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const sanitizedEmail = mongoSanitize(email);
    const sanitizedPassword = mongoSanitize(password);

    try {
      const user = await User.findOne({ email: sanitizedEmail });
      if (!user)
        return res.status(404).json({ message: "Invalid credentials" });

      const isMatch = await comparePassword(sanitizedPassword, user.password);
      if (!isMatch)
        return res.status(404).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res
        .status(200)
        .json({ _id: user._id, name: user.name, email: user.email, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Set Transaction PIN
export const setTransactionPin = [
  // Validation middleware
  body("pin")
    .isLength({ min: 4, max: 6 })
    .withMessage("PIN must be between 4 and 6 digits"),

  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { pin } = req.body;

    const sanitizedPin = mongoSanitize(pin);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    try {
      const hashedPIN = await hashTransactionPin(sanitizedPin);
      user.transactionPIN = hashedPIN;
      await user.save();

      res.status(200).json({ message: "Transaction PIN set successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Update Transaction PIN
export const updateTransactionPin = [
  // Validation middleware
  body("oldPin").notEmpty().withMessage("Old PIN is required"),
  body("newPin")
    .isLength({ min: 4, max: 6 })
    .withMessage("New PIN must be between 4 and 6 digits"),

  // Controller logic
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { oldPin, newPin } = req.body;
    const sanitizedOldPin = mongoSanitize(oldPin);
    const sanitizedNewPin = mongoSanitize(newPin);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await compareTransactionPin(
      sanitizedOldPin,
      user.transactionPIN
    );

    if (!isMatch) return res.status(401).json({ message: "Invalid PIN" });

    try {
      const hashedPIN = await hashTransactionPin(sanitizedNewPin);
      user.transactionPIN = hashedPIN;
      await user.save();
      res.status(200).json({ message: "Transaction PIN updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
