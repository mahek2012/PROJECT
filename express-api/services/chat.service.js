const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const faqModel = require("../models/faq.model");
const chatModel = require("../models/chat.model");

module.exports.getReply = async (message, userId = null, sessionId = null) => {
  const text = message.toLowerCase();
  let reply = { text: "", type: "text", metadata: {} };

  // 1. Check for Order Status
  if (text.includes("order") && (text.includes("status") || text.includes("track") || text.includes("where"))) {
    // Try to find an order ID in the message (looking for 24 char hex or similar)
    const orderIdMatch = text.match(/[0-9a-fA-F]{24}/);
    if (orderIdMatch) {
      const order = await orderModel.findById(orderIdMatch[0]);
      if (order) {
        reply.text = `Found it! Your order #${order._id.toString().slice(-6)} status is: ${order.status.toUpperCase()}. Total amount was $${order.totalAmount}.`;
        reply.type = "order_status";
        reply.metadata = { status: order.status };
      } else {
        reply.text = "I couldn't find an order with that ID. Please double check.";
      }
    } else if (userId) {
      // If no ID but user logged in, get latest order
      const latestOrder = await orderModel.findOne({ user: userId }).sort({ createdAt: -1 });
      if (latestOrder) {
        reply.text = `Your latest order #${latestOrder._id.toString().slice(-6)} is currently ${latestOrder.status.toUpperCase()}.`;
        reply.type = "order_status";
      } else {
        reply.text = "You haven't placed any orders yet!";
      }
    } else {
      reply.text = "Please provide your Order ID so I can track it for you.";
    }
    return reply;
  }

  // 2. Check for Product Search (e.g., "dress under 1000")
  const priceMatch = text.match(/under\s*(\d+)|below\s*(\d+)|(\d+)\s*se\s*kam/i);
  const categories = await productModel.distinct("category");
  const categoryMatch = categories.find(cat => text.includes(cat.toLowerCase()));

  if (categoryMatch || priceMatch) {
    let query = {};
    if (categoryMatch) query.category = categoryMatch;
    if (priceMatch) {
      const priceLimit = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
      query.price = { $lte: priceLimit };
    }

    const products = await productModel.find(query).limit(4);
    if (products.length > 0) {
      reply.text = `Sure! Here are some ${categoryMatch || "products"} ${priceMatch ? "under $" + (priceMatch[1]||priceMatch[2]||priceMatch[3]) : ""} I found for you:`;
      reply.type = "product";
      reply.metadata = { products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        image: p.images?.[0]
      })) };
    } else {
      reply.text = "Sorry, I couldn't find any products matching those criteria right now.";
    }
    return reply;
  }

  // 3. Check FAQs
  const faqs = await faqModel.find({ isActive: true });
  const matchedFaq = faqs.find(f => text.includes(f.question.toLowerCase()) || f.question.toLowerCase().includes(text));
  if (matchedFaq) {
    reply.text = matchedFaq.answer;
    return reply;
  }

  // 4. Default Greeting / Help
  if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
    reply.text = "Hello! I'm your ShopVerse AI Assistant. I can help you find products, track orders, or answer questions. Try asking 'Under 500 shoes' or 'My order status'.";
    return reply;
  }

  // Final Fallback
  reply.text = "I'm not sure I understand. I can help you search for products (e.g. 'Dresses under 100') or track your order. What would you like to do?";
  return reply;
};
