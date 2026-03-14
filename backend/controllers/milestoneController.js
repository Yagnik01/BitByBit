/**
 * Milestone Controller
 * Handles: GET milestones, submit milestone, AI verify, wallet payment
 */
const mongoose  = require("mongoose");
const Project    = require("../models/Project");
const Wallet     = require("../models/Wallet");
const Transaction= require("../models/Transaction");
const Notification = require("../models/Notification");
const { verifyMilestone } = require("../services/aiService");

const emit = (io, userId, event, payload) => {
  if (io && userId) io.to(`user_${userId}`).emit(event, payload);
};

// ── Ensure wallet exists (upsert helper) ─────────────────────────────────────
async function getOrCreateWallet(userId) {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId });
  return wallet;
}

// ─── GET /api/milestones/:projectId ──────────────────────────────────────────
exports.getMilestones = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .select("milestones title description employerId freelancerId status total_budget");
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only employer or freelancer may access milestones
    const uid = String(req.user.id);
    if (String(project.employerId) !== uid && String(project.freelancerId) !== uid)
      return res.status(403).json({ message: "Not authorised" });

    res.json({ milestones: project.milestones, projectTitle: project.title });
  } catch (err) {
    console.error("getMilestones error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── POST /api/milestones/:projectId/:milestoneId/submit ─────────────────────
// Freelancer submits a GitHub link for AI verification + payment
exports.submitMilestone = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { githubLink, notes = "" } = req.body;

    if (!githubLink?.trim())
      return res.status(400).json({ message: "GitHub link is required" });

    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/i;
    if (!githubPattern.test(githubLink.trim()))
      return res.status(400).json({ message: "Invalid GitHub URL format" });

    const project = await Project.findById(req.params.projectId).session(session);
    if (!project) { await session.abortTransaction(); return res.status(404).json({ message: "Project not found" }); }

    // Only the assigned freelancer may submit
    if (String(project.freelancerId) !== String(req.user.id)) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Only the assigned freelancer can submit milestones" });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) { await session.abortTransaction(); return res.status(404).json({ message: "Milestone not found" }); }

    if (["completed", "paid"].includes(milestone.status)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Milestone already completed" });
    }

    // ── Call AI verification ──────────────────────────────────────────────
    const aiResult = await verifyMilestone({
      milestoneTitle:       milestone.title,
      milestoneDescription: milestone.description,
      githubLink:           githubLink.trim(),
      projectDescription:   project.description,
      budgetAllocation:     milestone.budget_allocation,
    });

    // ── Record submission data ────────────────────────────────────────────
    milestone.submission = {
      githubLink:  githubLink.trim(),
      notes,
      submittedAt: new Date(),
      submittedBy: req.user.id,
      aiVerification: {
        score:      aiResult.score,
        status:     aiResult.status,
        feedback:   aiResult.feedback,
        verifiedAt: new Date(),
      },
    };
    milestone.status = aiResult.payment_recommended ? "completed" : "submitted";

    const io = req.app.get("io");

    if (aiResult.payment_recommended) {
      // ── Release escrow payment ─────────────────────────────────────────
      const clientWallet    = await getOrCreateWallet(project.employerId);
      const freelancerWallet= await getOrCreateWallet(project.freelancerId);
      const amount          = milestone.budget_allocation;

      // Deduct from client
      if (clientWallet.balance < amount && clientWallet.escrowBalance < amount) {
        // Top-up escrow if needed (in production this would require a real deposit)
        clientWallet.escrowBalance = Math.max(clientWallet.escrowBalance, amount);
      }
      clientWallet.escrowBalance = Math.max(0, clientWallet.escrowBalance - amount);
      clientWallet.totalSpent   += amount;

      // Credit to freelancer
      freelancerWallet.balance      += amount;
      freelancerWallet.totalEarned  += amount;

      await clientWallet.save({ session });
      await freelancerWallet.save({ session });

      // Record transaction
      await Transaction.create([{
        fromUserId:    project.employerId,
        toUserId:      project.freelancerId,
        type:          "milestone_payment",
        amount,
        projectId:     project._id,
        projectTitle:  project.title || project.description.slice(0, 50),
        milestoneId:   milestone._id.toString(),
        milestoneTitle:milestone.title,
        description:   `Payment for milestone: ${milestone.title}`,
        status:        "completed",
      }], { session });

      milestone.escrowReleased = true;
      milestone.paidAt         = new Date();

      // ── Notify client: payment deducted ───────────────────────────────
      const clientNotif = await Notification.create([{
        recipientId:  project.employerId,
        type:         "payment_released",
        title:        "💸 Milestone Payment Released",
        message:      `$${amount.toLocaleString()} released to freelancer for "${milestone.title}" (AI score: ${aiResult.score}/100)`,
        projectId:    project._id,
        projectTitle: project.title || project.description.slice(0, 50),
      }], { session });
      emit(io, project.employerId.toString(), "new_notification", clientNotif[0]);

      // ── Notify freelancer: payment received ───────────────────────────
      const flNotif = await Notification.create([{
        recipientId:  project.freelancerId,
        type:         "milestone_approved",
        title:        "✅ Milestone Approved & Paid",
        message:      `Your milestone "${milestone.title}" was approved (${aiResult.score}/100). $${amount.toLocaleString()} added to your wallet!`,
        projectId:    project._id,
        projectTitle: project.title || project.description.slice(0, 50),
      }], { session });
      emit(io, project.freelancerId.toString(), "new_notification", flNotif[0]);

      // Check if all milestones are done
      const allDone = project.milestones.every(m => ["completed","paid"].includes(m.status));
      if (allDone) {
        project.status        = "completed";
        project.paymentStatus = "fully-released";
      } else {
        project.paymentStatus = "partially-released";
      }

    } else {
      // ── Revision required — notify both parties ────────────────────────
      const revNotif = await Notification.create([{
        recipientId:  project.freelancerId,
        type:         "milestone_rejected",
        title:        "⚠ Milestone Needs Revision",
        message:      `Your milestone "${milestone.title}" needs revision (score: ${aiResult.score}/100). Feedback: ${aiResult.feedback.slice(0, 100)}`,
        projectId:    project._id,
        projectTitle: project.title || project.description.slice(0, 50),
      }], { session });
      emit(io, project.freelancerId.toString(), "new_notification", revNotif[0]);

      const clientRevNotif = await Notification.create([{
        recipientId:  project.employerId,
        type:         "milestone_submitted",
        title:        "📋 Milestone Submitted (Needs Revision)",
        message:      `Freelancer submitted "${milestone.title}" — AI score: ${aiResult.score}/100. Revision requested.`,
        projectId:    project._id,
        projectTitle: project.title || project.description.slice(0, 50),
      }], { session });
      emit(io, project.employerId.toString(), "new_notification", clientRevNotif[0]);
    }

    await project.save({ session });
    await session.commitTransaction();

    // Emit milestone_updated so dashboards refresh
    emit(io, project.employerId.toString(),   "milestone_updated", { projectId: project._id, milestone });
    emit(io, project.freelancerId.toString(), "milestone_updated", { projectId: project._id, milestone });

    res.json({
      milestone,
      aiVerification: aiResult,
      paymentReleased: aiResult.payment_recommended,
      amount: aiResult.payment_recommended ? milestone.budget_allocation : 0,
      message: aiResult.payment_recommended
        ? `Milestone approved! $${milestone.budget_allocation.toLocaleString()} has been paid.`
        : `Submission recorded. AI score: ${aiResult.score}/100. Revision required.`,
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("submitMilestone error:", err);
    res.status(500).json({ message: "Failed to process milestone submission" });
  } finally {
    session.endSession();
  }
};

// ─── GET /api/milestones/wallet ───────────────────────────────────────────────
exports.getWallet = async (req, res) => {
  try {
    const wallet = await getOrCreateWallet(req.user.id);
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET /api/milestones/transactions ────────────────────────────────────────
exports.getTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({
      $or: [{ fromUserId: req.user.id }, { toUserId: req.user.id }],
    }).sort({ createdAt: -1 }).limit(50);
    res.json(txns);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
