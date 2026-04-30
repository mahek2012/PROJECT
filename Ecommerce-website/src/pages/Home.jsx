import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Star,
  Clock,
  Zap,
  Mail,
  MessageCircle,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const categories = [
    { name: 'Electronics', icon: '💻', color: 'bg-white' },
    { name: 'Fashion', icon: '👕', color: 'bg-white' },
    { name: 'Mobile & Accessories', icon: '📱', color: 'bg-white' },
    { name: 'Groceries', icon: '🛒', color: 'bg-white' },
    { name: 'Gaming', icon: '🎮', color: 'bg-white' },
    { name: 'Books', icon: '📚', color: 'bg-white' },
    { name: 'Home & Decor', icon: '🏠', color: 'bg-white' },
    { name: 'Beauty', icon: '💄', color: 'bg-white' },
    { name: 'Accessories', icon: '⌚', color: 'bg-white' },
    { name: 'Sports', icon: '🏀', color: 'bg-white' },
  ];

  const [activeTab, setActiveTab] = useState('All');

  const products = [
    { id: 1, name: 'Premium Wireless Headphones', price: 299, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Smart Fitness Watch', price: 199, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Classic Leather Bag', price: 159, img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Minimalist Ceramic Vase', price: 45, img: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="bg-[#f8f9fa]">
      {/* 1. Hero Banner */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4 inline-block border-l-4 border-orange-500 pl-4">
              New Season Arrival
            </span>
            <h1 className="text-7xl font-black mb-6 leading-tight">
              Elevate Your <br />
              <span className="text-orange-500">Lifestyle</span> With Style
            </h1>
            <p className="text-lg text-gray-300 mb-10 font-medium">
              Discover our curated collection of premium products designed to enhance your everyday life. Quality meets elegance.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg shadow-orange-500/20">
                Shop Now
              </Link>
              <Link to="/products" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg font-bold transition-all border border-white/20">
                View Collections
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Features */}
      <section className="py-10 -mt-10 relative z-20">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Truck className="text-orange-500" />, title: 'Free Shipping', desc: 'On orders over $500', color: 'bg-orange-50' },
              { icon: <ShieldCheck className="text-orange-500" />, title: 'Secure Payment', desc: '100% secure payment', color: 'bg-orange-50' },
              { icon: <Zap className="text-orange-500" />, title: 'Flash Deals', desc: 'Daily new offers', color: 'bg-orange-50' },
              { icon: <Headphones className="text-orange-500" />, title: '24/7 Support', desc: 'Dedicated support', color: 'bg-orange-50' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-500 font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 font-medium mt-1">Explore our diverse range of premium collections.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all cursor-pointer group shadow-sm">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">1.2k+ Products</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trending / Best Sellers */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">Trending Now</span>
              <h2 className="text-4xl font-black text-gray-900">Best Sellers</h2>
            </div>
            <Link to="/products" className="bg-white border border-gray-200 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 101, name: 'Ultra-Quiet Noise Cancelling Headphones', price: 349, rating: 5, img: 'https://images.unsplash.com/photo-1546435770-a3e426ff4737?auto=format&fit=crop&q=80&w=400' },
              { id: 102, name: 'Smart OLED Television 55"', price: 899, rating: 4, img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400' },
              { id: 103, name: 'Ergonomic Wireless Mouse', price: 79, rating: 5, img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400' },
              { id: 104, name: 'Portable Bluetooth Speaker', price: 129, rating: 4, img: 'https://images.unsplash.com/photo-1608156639585-34052e81c99f?auto=format&fit=crop&q=80&w=400' },
            ].map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-3xl border border-gray-100 group hover:shadow-2xl transition-all duration-500 shadow-sm">
                <div className="aspect-square rounded-2xl overflow-hidden mb-5 relative bg-gray-50">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black text-gray-900">{p.rating}.0</span>
                  </div>
                  <button className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-6 py-2 rounded-xl font-bold text-sm translate-y-4 group-hover:translate-y-0 transition-transform">Add to Cart</span>
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-orange-500">${p.price}</span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
              <p className="text-gray-500 font-medium mt-1">Our handpicked selection for you</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {['All', 'Electronics', 'Fashion', 'Home'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === tab ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <ShoppingBag size={20} className="text-gray-900" />
                  </button>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-black">${product.price}.00</span>

                  <span className="text-gray-400 text-sm line-through font-medium">${product.price + 100}.00</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="inline-block border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold px-10 py-3 rounded-lg transition-all">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Offer Banner */}
      <section className="py-20">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-400 rounded-[2rem] overflow-hidden flex flex-col md:flex-row items-center min-h-[400px] shadow-2xl shadow-orange-200">
            <div className="p-12 md:p-16 flex-1 text-white">
              <h2 className="text-5xl font-black mb-4">Limited Time Offer!</h2>
              <p className="text-xl font-bold opacity-90 mb-8">Get up to <span className="text-white text-3xl">50% OFF</span> on selected electronics <br />and accessories. Offer valid till Sunday.</p>
              <button className="bg-white text-orange-500 px-10 py-4 rounded-xl font-black shadow-xl hover:scale-105 transition-all">
                Grab The Deal
              </button>
            </div>
            <div className="flex-1 p-10 flex justify-center items-center">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600"
                alt="Headphones"
                className="w-[350px] rotate-12 hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Reviews */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-black uppercase tracking-widest text-xs mb-2 inline-block">Real Feedback</span>
            <h2 className="text-4xl font-black text-gray-900">What Our Customers Say</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Johnson', text: "The quality of the products is absolutely top-notch. My recent purchase of wireless headphones exceeded expectations.", rating: 5, role: 'Verified Buyer' },
              { name: 'Sarah Miller', text: "Fastest shipping I've ever experienced. Ordered on Monday, received it by Tuesday afternoon. Incredible service!", rating: 5, role: 'Fashion Blogger' },
              { name: 'David Smith', text: "Customer support team was so helpful when I needed to exchange a size. Smoothest process ever.", rating: 4, role: 'Tech Enthusiast' },
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] relative group hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100">
                <MessageCircle className="absolute top-8 right-8 text-orange-200 group-hover:text-orange-500 transition-colors" size={40} />
                <div className="flex gap-1 text-orange-500 mb-6">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 font-medium text-lg leading-relaxed mb-8">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{review.name}</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Brands */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
            <span className="text-3xl font-black tracking-tighter">SAMSUNG</span>
            <span className="text-3xl font-black tracking-tighter">NIKE</span>
            <span className="text-3xl font-black tracking-tighter">SONY</span>
            <span className="text-3xl font-black tracking-tighter">APPLE</span>
            <span className="text-3xl font-black tracking-tighter">ADIDAS</span>
          </div>
        </div>
      </section>

      {/* 9. Newsletter */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full"></div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
              <Mail className="text-white" size={32} />
            </div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tighter">
              DON'T MISS OUT ON <br />
              <span className="text-orange-500">EXCLUSIVE DEALS</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 font-medium max-w-2xl mx-auto">
              Subscribe to our newsletter and get 10% off your first order. Plus, be the first to know about new drops and limited edition collections.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-sm">
              <input
                type="email"
                placeholder="yourname@example.com"
                className="flex-1 bg-transparent border-none px-8 py-4 text-white focus:outline-none placeholder:text-gray-500 font-medium"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-2 group">
                Subscribe <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-gray-500 text-xs mt-8 font-medium italic">
              * By subscribing, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
