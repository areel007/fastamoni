import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 200 },
    transactionPIN: { type: String },
    donationsMade: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
