/**
 * Socket.IO handler
 * Events: notifications, chat, project applications, approval push
 */
const Notification = require("../models/Notification");
const Message      = require("../models/Message");
const Conversation = require("../models/Conversation");

const socketHandlers = (io) => {
  const onlineUsers = new Map(); // userId → socketId

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ── 1. User joins their personal notification room ───────────────────
    socket.on("join_user_room", (userId) => {
      if (!userId) return;
      socket.join(`user_${userId}`);
      onlineUsers.set(String(userId), socket.id);
      console.log(`User ${userId} joined room`);

      // Send unread count immediately on connect
      Notification.countDocuments({ recipientId: userId, read: false })
        .then(count => socket.emit("unread_count", { count }))
        .catch(() => {});
    });

    // ── 2. Chat: join / leave conversation room ──────────────────────────
    socket.on("join_conversation", (convId) => {
      socket.join(`conv_${convId}`);
    });
    socket.on("leave_conversation", (convId) => {
      socket.leave(`conv_${convId}`);
    });

    // ── 3. Real-time chat message (supplement to REST) ───────────────────
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, senderId, senderName, content } = data;
        if (!content?.trim() || !conversationId || !senderId) return;

        const conv = await Conversation.findById(conversationId);
        if (!conv) return;

        const message = await Message.create({ conversationId, senderId, senderName, content: content.trim() });

        conv.lastMessage   = content.trim().slice(0, 100);
        conv.lastMessageAt = new Date();
        conv.participants.forEach(pid => {
          if (pid.toString() !== String(senderId)) {
            conv.unreadCounts.set(pid.toString(), (conv.unreadCounts.get(pid.toString()) || 0) + 1);
          }
        });
        await conv.save();

        io.to(`conv_${conversationId}`).emit("new_message", message);
        conv.participants.forEach(pid => {
          if (pid.toString() !== String(senderId))
            io.to(`user_${pid}`).emit("new_message_notification", { conversationId, senderName, preview: content.trim().slice(0, 60) });
        });
      } catch (err) {
        console.error("send_message socket error:", err);
      }
    });

    // ── 4. Typing indicators ─────────────────────────────────────────────
    socket.on("typing_start", ({ conversationId, userId, userName }) => {
      socket.to(`conv_${conversationId}`).emit("user_typing", { userId, userName });
    });
    socket.on("typing_stop", ({ conversationId, userId }) => {
      socket.to(`conv_${conversationId}`).emit("user_stopped_typing", { userId });
    });

    // ── 5. Mark notification read ────────────────────────────────────────
    socket.on("mark_notification_read", async ({ notificationId, userId }) => {
      try {
        await Notification.findOneAndUpdate({ _id: notificationId, recipientId: userId }, { read: true });
        const count = await Notification.countDocuments({ recipientId: userId, read: false });
        socket.emit("unread_count", { count });
      } catch {}
    });

    // ── 6. Test helpers ──────────────────────────────────────────────────
    socket.on("test_message", (data) => {
      socket.emit("test_response", { message: "Received!", original: data, timestamp: new Date() });
    });

    // ── 7. Disconnect ────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.forEach((sid, uid) => { if (sid === socket.id) onlineUsers.delete(uid); });
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = socketHandlers;
