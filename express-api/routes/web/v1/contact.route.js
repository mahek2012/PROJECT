const express = require('express');
const router = express.Router();
const contactController = require('../../../controllers/contact.controller');
const userMiddleware = require('../../../middlewares/user.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');

const adminAuth = [userMiddleware.authUser, adminMiddleware.authAdmin];

// Public route to send message (Optional: associate with user if logged in)
router.post('/send', async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const jwt = require("jsonwebtoken");
            const userModel = require("../../../models/user.model");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findOne({ _id: decoded._id });
            if (user) req.user = user;
        } catch (error) {
            // Ignore token errors for contact form
        }
    }
    next();
}, contactController.sendMessage);

// User route to see their own messages and replies
router.get('/my-messages', userMiddleware.authUser, contactController.getUserMessages);

// Admin routes
router.get('/all', adminAuth, contactController.getAdminMessages);
router.put('/reply/:id', adminAuth, contactController.replyToMessage);
router.put('/seen/:id', adminAuth, contactController.markAsSeen);

module.exports = router;
