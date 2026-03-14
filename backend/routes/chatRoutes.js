const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getMyConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

router.get  ("/conversations",                       protect, getMyConversations);
router.post ("/conversations",                       protect, getOrCreateConversation);
router.get  ("/conversations/:convId/messages",      protect, getMessages);
router.post ("/conversations/:convId/messages",      protect, sendMessage);

module.exports = router;
