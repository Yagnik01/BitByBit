const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getMilestones,
  submitMilestone,
  getWallet,
  getTransactions,
} = require("../controllers/milestoneController");

// Wallet & transactions
router.get("/wallet",       protect, getWallet);       // GET  /api/milestones/wallet
router.get("/transactions", protect, getTransactions); // GET  /api/milestones/transactions

// Milestones for a project
router.get("/:projectId",                        protect, getMilestones);     // GET  /api/milestones/:projectId
router.post("/:projectId/:milestoneId/submit",   protect, submitMilestone);   // POST /api/milestones/:projectId/:milestoneId/submit

module.exports = router;
