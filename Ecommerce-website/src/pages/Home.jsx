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
import axiosInstance from '../services/api/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  
  // Newsletter State
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle, loading, success, error
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/category/all');
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, [dispatch]);

  // The products are now fetched from Redux
  const featuredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.category?.toLowerCase() === activeTab.toLowerCase());

  const displayFeaturedProducts = featuredProducts.slice(0, 4);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const response = await axiosInstance.post('/newsletter/subscribe', { email });
      if (response.data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage(response.data.message || 'Successfully Subscribed! 🎁 You got 10% OFF - Check your email.');
        setEmail('');
      }
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

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
            {categories.slice(0, 10).map((cat, i) => {
              const categorySlug = encodeURIComponent(cat.name);
              return (
                <Link to={`/category/${categorySlug}`} key={i} className="bg-white p-8 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all cursor-pointer group shadow-sm flex flex-col items-center justify-center">
                  <div className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform overflow-hidden rounded-2xl flex items-center justify-center bg-gray-50">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : cat.icon ? (
                      <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="text-3xl">📁</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{cat.name}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Products</p>
                </Link>
              );
            })}
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
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
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
            {displayFeaturedProducts.length > 0 ? (
              displayFeaturedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500 font-medium">
                No products found in this category.
              </div>
            )}
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
              <Link to="/offers" className="inline-block bg-white text-orange-500 px-10 py-4 rounded-xl font-black shadow-xl hover:scale-105 transition-all">
                Grab The Deal
              </Link>
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

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-sm">
              <input
                type="email"
                required
                placeholder="yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className="flex-1 bg-transparent border-none px-8 py-4 text-white focus:outline-none placeholder:text-gray-500 font-medium disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                className={`px-10 py-4 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-2 group ${
                  subscribeStatus === 'success' 
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-500/50'
                }`}
              >
                {subscribeStatus === 'loading' ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Subscribing...</>
                ) : subscribeStatus === 'success' ? (
                  <>Subscribed ✔</>
                ) : (
                  <>Subscribe <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            {/* Status Messages */}
            {subscribeMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 inline-block px-6 py-3 rounded-xl font-bold text-sm shadow-lg ${
                  subscribeStatus === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {subscribeMessage}
              </motion.div>
            )}

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
