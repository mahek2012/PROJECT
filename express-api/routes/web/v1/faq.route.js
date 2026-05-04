const express = require('express');
const router = express.Router();
const faqModel = require('../../../models/faq.model');
const userMiddleware = require('../../../middlewares/user.middleware');
const adminMiddleware = require('../../../middlewares/admin.middleware');

// Public: Get all active FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await faqModel.find({ isActive: true });
        res.status(200).json(faqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Manage FAQs
router.post('/add', userMiddleware.authUser, adminMiddleware.authAdmin, async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const faq = await faqModel.create({ question, answer, category });
        res.status(201).json({ message: 'FAQ added', faq });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', userMiddleware.authUser, adminMiddleware.authAdmin, async (req, res) => {
    try {
        await faqModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'FAQ deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
