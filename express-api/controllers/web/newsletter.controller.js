const Newsletter = require('../../models/newsletter.model.js');

exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        existingSubscriber.status = 'active';
        await existingSubscriber.save();
        return res.status(200).json({ success: true, message: 'Resubscribed successfully!' });
      }
      return res.status(400).json({ success: false, message: 'You are already subscribed!' });
    }

    // Create new subscriber
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Newsletter Subscription Error:', error);
    res.status(500).json({ success: false, message: 'Server error while subscribing' });
  }
};
