import { ShieldCheck, Truck, Zap, Headphones, Target, Eye, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600" 
            alt="About Us" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 inline-block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">About SHOP<span className="text-orange-500">VERSE</span></h1>
            <p className="text-xl text-gray-300 font-medium max-w-2xl mx-auto">
              We are more than just an e-commerce platform. We are your trusted partner in finding the best quality products for your lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Company Intro */}
      <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-2xl">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img 
                src="/about_office.png" 
                alt="Our Office" 
                className="rounded-[2.5rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Founded in 2024, ShopVerse started with a simple idea: to make premium electronics, fashion, and lifestyle products accessible to everyone without compromising on quality or customer service.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                What began as a small startup in a garage has quickly grown into a nationwide brand trusted by thousands. We handpick every item we sell, ensuring that when you shop with us, you are getting nothing but the absolute best.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-[100px] -z-0 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-lg shadow-orange-500/30">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 relative z-10">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                To empower consumers by providing a seamless, secure, and highly curated online shopping experience. We aim to connect the best global brands with people who value quality and reliability.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-lg shadow-blue-500/30">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 relative z-10">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed relative z-10">
                To become the most customer-centric e-commerce destination in the world, where people can discover anything they might want to buy online at the best possible prices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-2 inline-block">The ShopVerse Difference</span>
            <h2 className="text-4xl font-black text-gray-900">Why Choose Us?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck />, title: '100% Secure', desc: 'Enterprise-grade encryption keeps your data and payments completely safe.', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: <Truck />, title: 'Fast Delivery', desc: 'Lightning-fast shipping with real-time tracking straight to your door.', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: <Zap />, title: 'Daily Deals', desc: 'Exclusive discounts and flash sales on premium products every single day.', color: 'text-yellow-500', bg: 'bg-yellow-50' },
              { icon: <Headphones />, title: '24/7 Support', desc: 'Our dedicated customer service team is always here to help you out.', color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 p-8 rounded-[2rem] text-center hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100"
              >
                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-500 font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team Section (Optional/Added Value) */}
      <section className="py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-gray-500" size={24} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Meet The Team</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">The passionate people working behind the scenes to deliver the best shopping experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
              { name: 'Michael Chen', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
              { name: 'Emily Rodriguez', role: 'Customer Success Manager', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' }
            ].map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/40 group"
              >
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-orange-500 font-bold uppercase tracking-widest text-xs">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
