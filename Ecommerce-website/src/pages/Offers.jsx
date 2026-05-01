import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { Clock, Tag, Percent, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../services/api/axiosInstance';

const Offers = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);

  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [priceRange, setPriceRange] = useState(5000);
  const [dbOffers, setDbOffers] = useState([]);
  const navigate = useNavigate();

  const fetchDbOffers = async () => {
    try {
      const response = await axiosInstance.get('/offers');
      if (response.data?.success) {
        setDbOffers(response.data.offers);
      }
    } catch (error) {
      console.error("Failed to fetch offers", error);
    }
  };

  const handleCouponClick = (code, action) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon ${code} Copied!`, { position: "bottom-center" });
    
    if (action === 'products') navigate('/products');
    if (action === 'register') navigate('/register');
    if (action === 'flash-sale') navigate('/flash-sale');
  };

  useEffect(() => {
    dispatch(fetchProducts());
    fetchDbOffers();
  }, [dispatch]);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 }; // reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products with discounts
  const discountedProducts = products.filter(p => p.discount && p.discount > 0);
  const flat50Products = discountedProducts.filter(p => p.discount >= 50);

  const availableCategories = ['All', ...new Set(discountedProducts.map(p => p.category).filter(Boolean))];

  const filteredOffers = discountedProducts.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchDiscount = p.discount >= selectedDiscount;
    const matchPrice = p.price <= priceRange;
    return matchCategory && matchDiscount && matchPrice;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Banner with Timer */}
      <section className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2 shadow-lg shadow-orange-500/30">
              <Zap size={14} fill="currentColor" /> Flash Sale Active
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Unbeatable <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Deals & Offers</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 font-medium">Grab your favorite products at massive discounts. Hurry, offers end soon!</p>
            
            {/* Urgency Timer */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black text-white border border-white/20 shadow-xl">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Hours</span>
              </div>
              <span className="text-3xl font-black text-orange-500 mb-6">:</span>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black text-white border border-white/20 shadow-xl">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Mins</span>
              </div>
              <span className="text-3xl font-black text-orange-500 mb-6">:</span>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-orange-500/50">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Secs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coupon Banners */}
      <section className="py-12">
        <div className="container-custom">
          {dbOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbOffers.map((offer, index) => {
                // Determine colors and icon based on index or type
                const gradients = [
                  "from-purple-600 to-indigo-700",
                  "from-emerald-500 to-teal-600",
                  "from-pink-500 to-rose-600",
                  "from-orange-500 to-red-600"
                ];
                const bgGradient = gradients[index % gradients.length];
                const Icon = index % 2 === 0 ? Tag : Percent;

                return (
                  <div key={offer._id || offer.id} className={`bg-gradient-to-br ${bgGradient} p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group`}>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                        <Icon size={24} />
                      </div>
                      <h3 className="text-2xl font-black mb-2 uppercase tracking-wide">
                        {offer.discount}{offer.type === 'percentage' ? '%' : '$'} OFF
                      </h3>
                      <p className="text-white/80 font-medium mb-6 min-h-[48px]">
                        {offer.description || `Applicable on orders above $${offer.minCartValue || 0}.`}
                      </p>
                      <div 
                        onClick={() => handleCouponClick(offer.code, 'products')}
                        className="bg-white/10 border border-white/30 px-4 py-3 rounded-xl inline-block text-lg font-mono font-bold tracking-widest group-hover:bg-white group-hover:text-gray-900 transition-colors cursor-pointer text-center"
                      >
                        {offer.code}
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      <Icon size={150} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 font-bold">No active coupons available at the moment. Check back later!</div>
          )}
        </div>
      </section>

      {/* Flat 50% OFF Section */}
      {flat50Products.length > 0 && (
        <section className="py-16">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                  <Percent size={24} className="font-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Flat 50% OFF & More</h2>
                  <p className="text-gray-500 font-medium mt-1">Biggest price drops of the season</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {flat50Products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Discounted Products */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-orange-600 font-black uppercase tracking-widest text-xs mb-2 inline-block">All Deals</span>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Trending Offers</h2>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                {filteredOffers.length} Products found
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 shrink-0 space-y-8 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {availableCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                        selectedCategory === cat ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Max Price: ${priceRange}</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-orange-600" 
                />
                <div className="flex justify-between text-xs font-bold text-gray-400 mt-2">
                  <span>$0</span>
                  <span>$5000</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Min Discount</h3>
                <div className="space-y-2">
                  {[0, 20, 30, 40, 50].map((discount) => (
                    <label key={discount} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="discount"
                        checked={selectedDiscount === discount}
                        onChange={() => setSelectedDiscount(discount)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300" 
                      />
                      <span className={`text-sm font-medium ${selectedDiscount === discount ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                        {discount === 0 ? 'All Discounts' : `${discount}% & Up`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                </div>
              ) : filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredOffers.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                  <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">No active offers match your filters</h3>
                  <button onClick={() => { setSelectedCategory('All'); setSelectedDiscount(0); setPriceRange(5000); }} className="mt-4 text-orange-600 font-bold hover:underline">
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Offers;
