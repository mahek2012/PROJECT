import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const FlashSale = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 30 });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 15, seconds: 30 }; // reset mock
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter(p => p.discount >= 30);

  return (
    <div className="bg-gray-900 min-h-screen pb-20 pt-10">
      <div className="container-custom">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-sm mb-6 shadow-lg shadow-red-600/40"
          >
            <Zap size={18} fill="currentColor" /> Midnight Flash Sale Active
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8">
            Hurry Up! <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Deals End In:</span>
          </h1>

          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl font-black text-white border border-gray-700 shadow-2xl">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <span className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Hours</span>
            </div>
            <span className="text-4xl font-black text-red-500 mb-8">:</span>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl font-black text-white border border-gray-700 shadow-2xl">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <span className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Mins</span>
            </div>
            <span className="text-4xl font-black text-red-500 mb-8">:</span>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-red-600/50">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <span className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Secs</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {flashSaleProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSale;
