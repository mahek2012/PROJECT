import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Return kaise kare? (How to return an item?)",
      answer: "You can initiate a return within 14 days of delivery. Simply go to your 'Order History', select the order, and click 'Return Item'. We will arrange a pickup from your address."
    },
    {
      question: "Payment methods kya hai? (What are the payment methods?)",
      answer: "We accept all major Credit/Debit cards, PayPal, UPI, and Net Banking. Cash on Delivery (COD) is also available for selected pin codes."
    },
    {
      question: "Delivery kitne din me aayegi? (How many days for delivery?)",
      answer: "Standard delivery takes 3-7 business days depending on your location. We also offer express 1-2 day delivery for metropolitan areas at an additional cost."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, orders can be canceled before they are shipped. Once the status changes to 'Shipped', cancellation is no longer possible, but you can return it after delivery."
    },
    {
      question: "How do I use a coupon code?",
      answer: "During checkout, you will see an 'Apply Coupon' field. Enter your valid coupon code there and click apply to see the discounted total."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 font-medium">Find answers to common questions about our products and services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-300 ${openIndex === index ? 'border-orange-500 shadow-md' : 'border-gray-200'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
              >
                <span className="font-bold text-gray-900">{faq.question}</span>
                <ChevronDown 
                  className={`text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-orange-500' : ''}`} 
                  size={20} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 font-medium leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
