const Conversation = require("../models/Conversation");
const Message      = require("../models/Message");
const User         = require("../models/User");

// ─── GET /api/chat/conversations ─────────────────────────────────────────────
exports.getMyConversations = async (req, res) => {
  try {
    const convs = await Conversation.find({ participants: req.user.id })
      .populate("participants", "name avatar email")
      .populate("projectId", "title description")
      .sort({ lastMessageAt: -1 });
    res.json(convs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── POST /api/chat/conversations ─────────────────────────────────────────────
// Create or retrieve existing conversation for a project + pair of users
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { projectId, otherUserId } = req.body;
    if (!projectId || !otherUserId)
      return res.status(400).json({ message: "projectId and otherUserId required" });

    // Find existing
    let conv = await Conversation.findOne({
      projectId,
      participants: { $all: [req.user.id, otherUserId] },
    });

    if (!conv) {
      const project = await require("../models/Project").findById(projectId).select("title description");
      conv = await Conversation.create({
        participants: [req.user.id, otherUserId],
        projectId,
        projectTitle: project?.title || project?.description?.slice(0, 50) || "",
        unreadCounts: { [otherUserId]: 0, [req.user.id]: 0 },
      });
    }

    const populated = await Conversation.findById(conv._id)
      .populate("participants", "name avatar email")
      .populate("projectId", "title description");

    res.json(populated);
  } catch (err) {
    console.error("getOrCreateConversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── GET /api/chat/conversations/:convId/messages ────────────────────────────
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Verify user is a participant
    const conv = await Conversation.findById(req.params.convId);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });
    if (!conv.participants.some(p => p.toString() === req.user.id.toString()))
      return res.status(403).json({ message: "Not authorised" });

    const messages = await Message.find({ conversationId: req.params.convId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      { conversationId: req.params.convId, senderId: { $ne: req.user.id }, read: false },
      { read: true, readAt: new Date() }
    );

    // Reset unread count for this user
    conv.unreadCounts.set(req.user.id.toString(), 0);
    await conv.save();

    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ─── POST /api/chat/conversations/:convId/messages ───────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: "Message cannot be empty" });

    const conv = await Conversation.findById(req.params.convId);
    if (!conv) return res.status(404).json({ message: "Conversation not found" });
    if (!conv.participants.some(p => p.toString() === req.user.id.toString()))
      return res.status(403).json({ message: "Not authorised" });

    const sender = await User.findById(req.user.id).select("name");

    const message = await Message.create({
      conversationId: conv._id,
      senderId:       req.user.id,
      senderName:     sender.name,
      content:        content.trim(),
    });

    // Update conversation last message + unread counts
    conv.lastMessage   = content.trim().slice(0, 100);
    conv.lastMessageAt = new Date();
    conv.participants.forEach(pid => {
      if (pid.toString() !== req.user.id.toString()) {
        const cur = conv.unreadCounts.get(pid.toString()) || 0;
        conv.unreadCounts.set(pid.toString(), cur + 1);
      }
    });
    await conv.save();

    // Emit via Socket.IO to conversation room
    const io = req.app.get("io");
    if (io) io.to(`conv_${conv._id}`).emit("new_message", message);

    // Send notification to recipient(s)
    for (const pid of conv.participants) {
      if (pid.toString() !== req.user.id.toString()) {
        if (io) io.to(`user_${pid}`).emit("new_message_notification", {
          conversationId: conv._id,
          senderName:     sender.name,
          preview:        content.trim().slice(0, 60),
        });
      }
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
