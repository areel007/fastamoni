import bcrypt from "bcrypt";

export const hashTransactionPin = async (pin) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pin, salt);
};

export const compareTransactionPin = async (
  transactionPin,
  hashedTransactionPin
) => {
  return await bcrypt.compare(transactionPin, hashedTransactionPin);
};
