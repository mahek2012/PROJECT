const chatService = require("../services/chat.service");
const chatModel = require("../models/chat.model");

module.exports.botReply = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Get smart reply from service
    const reply = await chatService.getReply(message, userId, sessionId);

    // Save history (optional but good for Admin Panel)
    let chat = await chatModel.findOne({ sessionId });
    if (!chat) {
      chat = await chatModel.create({ userId, sessionId, messages: [] });
    }

    chat.messages.push({
      sender: "user",
      text: message,
      type: "text"
    });

    chat.messages.push({
      sender: "bot",
      text: reply.text,
      type: reply.type,
      metadata: reply.metadata
    });

    await chat.save();

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin: Get all chat history
module.exports.getChatHistory = async (req, res) => {
  try {
    const chats = await chatModel.find().populate('userId', 'fullname email').sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, chats });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
