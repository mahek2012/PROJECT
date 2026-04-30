import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
    toast.success('Moved to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-200">
            <Heart size={48} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-10 text-lg">Save items you love to your wishlist and they'll appear here for easy access later.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 py-4 px-10 text-lg">
            Explore Products <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/products" className="p-2 bg-white rounded-full text-gray-600 hover:text-orange-600 shadow-sm transition-all">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Wishlist <span className="text-gray-400 font-medium">({items.length})</span></h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">{item.category}</p>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1 mb-2">{item.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-2xl font-black text-gray-900">${item.price}</span>
                    {item.oldPrice && <span className="text-sm text-gray-400 line-through font-medium">${item.oldPrice}</span>}
                  </div>
                  
                  <div className="mt-auto space-y-2">
                    <button 
                      onClick={() => handleMoveToCart(item)}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-100"
                    >
                      <ShoppingCart size={18} /> Move to Cart
                    </button>
                    <Link 
                      to={`/product/${item.id}`} 
                      className="w-full py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
