import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { comparePassword, hashPassword } from "../services/hash.password.js";
import { hashTransactionPin } from "../services/transaction.pin.js";
import mongoSanitize from "mongo-sanitize";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const sanitizedName = mongoSanitize(name);
  const sanitizedEmail = mongoSanitize(email);
  const sanitizedPassword = mongoSanitize(password);

  try {
    const userExist = await User.findOne({ sanitizedEmail });
    if (userExist)
      return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await hashPassword(sanitizedPassword);

    const user = new User({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const sanitizedEmail = mongoSanitize(email);
  const sanitizedPassword = mongoSanitize(password);

  try {
    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });
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
};

export const setTransactionPin = async (req, res) => {
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
};
