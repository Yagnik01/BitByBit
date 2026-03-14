const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },

  balance: { type: Number, default: 0, min: 0 },

  // Lifetime totals (for stats display)
  totalEarned:  { type: Number, default: 0 },
  totalSpent:   { type: Number, default: 0 },

  // Escrow: funds locked awaiting milestone completion
  escrowBalance: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
