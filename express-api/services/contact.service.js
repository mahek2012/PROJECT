const contactModel = require('../models/contact.model');

module.exports.createMessage = async (data) => {
    return await contactModel.create(data);
};

module.exports.getAllMessages = async () => {
    return await contactModel.find().sort({ createdAt: -1 }).populate('userId', 'fullName email');
};

module.exports.getUserMessages = async (userId) => {
    return await contactModel.find({ userId }).sort({ createdAt: -1 });
};

module.exports.updateMessageStatus = async (id, status, adminReply = '') => {
    const update = { status };
    if (adminReply) {
        update.adminReply = adminReply;
        update.repliedAt = new Date();
        update.status = 'replied';
    }
    return await contactModel.findByIdAndUpdate(id, update, { new: true });
};

module.exports.deleteMessage = async (id) => {
    return await contactModel.findByIdAndDelete(id);
};
