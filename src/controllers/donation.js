import { Donation } from "../models/donation.js";
import { User } from "../models/user.js";
import { transporter } from "../services/email.transporter.js";
import { compareTransactionPin } from "../services/transaction.pin.js";

export const makeDonation = async (req, res) => {
  const { beneficiaryId, amount, transactionPIN } = req.body;

  try {
    const donor = req.user;

    const beneficiary = await User.findById(beneficiaryId);

    const user = await User.findById(donor.id);

    // Check if beneficiary exists
    if (!beneficiary)
      return res.status(404).json({ message: "Beneficiary not found" });

    // check if donor transaction pin is correct
    const isMatch = await compareTransactionPin(
      transactionPIN,
      user.transactionPIN
    );

    if (!isMatch)
      return res.status(400).json({ message: "Invalid transaction PIN" });

    // Check if donor has enough balance
    if (user.walletBalance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Create donation
    const donation = await Donation.create({
      donor: donor.id,
      beneficiary: beneficiary._id,
      amount,
    });

    // Update wallet balances
    user.walletBalance -= amount;
    user.donationsMade += 1;
    await user.save();

    beneficiary.walletBalance += amount;
    await beneficiary.save();

    // Send thank you message if two or more donations made
    if (user.donationsMade >= 2) {
      await transporter(process.env.EMAIL, process.env.PASSWORD).sendMail({
        from: "noreply@example.com",
        to: user.email,
        subject: "Thank you!",
        text: "Thank you for your generous donations!",
      });
    }

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
