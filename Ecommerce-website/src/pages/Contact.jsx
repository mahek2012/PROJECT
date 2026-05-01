import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=1600" 
            alt="Contact Us" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12">
              <MessageSquare className="text-white" size={28} />
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Let's Talk</h1>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              Have questions about a product, order, or just want to say hi? Our team is always here to help you out.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-20 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex gap-6 items-start"
            >
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                <Phone className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-500 mb-1 font-medium">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+12345678900" className="text-orange-500 font-bold text-lg hover:underline">+1 (234) 567-8900</a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex gap-6 items-start"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                <Mail className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-500 mb-1 font-medium">We'll respond within 24 hours.</p>
                <a href="mailto:support@shopverse.com" className="text-blue-500 font-bold text-lg hover:underline">support@shopverse.com</a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex gap-6 items-start"
            >
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="text-green-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-500 mb-1 font-medium">Drop by our headquarters.</p>
                <p className="text-gray-900 font-bold">123 Commerce Avenue,<br />Tech District, NY 10001</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-8">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Message</label>
                  <textarea 
                    required
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you today?"
                    className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                    status === 'success' ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-orange-500 text-white'
                  }`}
                >
                  {status === 'loading' ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
                  ) : status === 'success' ? (
                    <>Message Sent Successfully!</>
                  ) : (
                    <>Send Message <Send size={18} /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
