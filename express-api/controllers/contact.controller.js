const contactService = require('../services/contact.service');

module.exports.sendMessage = async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email and message are required" });
        }

        const newMessage = await contactService.createMessage({
            name,
            email,
            message,
            subject,
            userId
        });

        res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.getAdminMessages = async (req, res) => {
    try {
        const messages = await contactService.getAllMessages();
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const messages = await contactService.getUserMessages(userId);
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.replyToMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminReply, status } = req.body;

        const updatedMessage = await contactService.updateMessageStatus(id, status || 'replied', adminReply);
        
        if (!updatedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ success: true, message: "Reply sent successfully", data: updatedMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.markAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMessage = await contactService.updateMessageStatus(id, 'seen');
        
        if (!updatedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json({ success: true, message: "Message marked as seen", data: updatedMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
