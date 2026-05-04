const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const chatController = require("../../../controllers/chat.controller");

// router --> service --> controller --> call into router
// Optional Auth: If logged in, associate chat, else allow as guest
router.post("/chat", async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const jwt = require("jsonwebtoken");
            const userModel = require("../../../models/user.model");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findOne({ _id: decoded._id });
            if (user) req.user = user;
        } catch (error) {
            // Ignore token errors
        }
    }
    next();
}, chatController.botReply);

module.exports = router;
