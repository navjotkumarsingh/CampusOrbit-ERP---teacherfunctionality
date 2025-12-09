const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/contact", messageController.sendContactForm);
router.post("/send", authMiddleware, messageController.sendMessage);
router.get("/received", authMiddleware, messageController.getReceivedMessages);
router.get("/sent", authMiddleware, messageController.getSentMessages);
router.put(
  "/:messageId/read",
  authMiddleware,
  messageController.markMessageAsRead
);
router.delete("/:messageId", authMiddleware, messageController.deleteMessage);

router.post("/notice/create", authMiddleware, messageController.createNotice);
router.get("/notice", authMiddleware, messageController.getAllNotices);
router.put("/notice/:noticeId", authMiddleware, messageController.updateNotice);
router.delete(
  "/notice/:noticeId",
  authMiddleware,
  messageController.deleteNotice
);

module.exports = router;
