import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { addItemToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';

import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  
  const isWishlisted = wishlistItems.some((item) => item.id === product._id || item.productId === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.info('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };


  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`card group ${viewMode === 'list' ? 'flex flex-row overflow-hidden' : ''}`}
    >
      <Link to={`/product/${product._id}`} className={`block relative bg-gray-100 ${viewMode === 'list' ? 'w-48 sm:w-64 shrink-0' : 'aspect-square overflow-hidden'}`}>
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              -{product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:text-red-500'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        {/* Hover Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
           <button
            onClick={handleAddToCart}
            className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white transition-colors"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </Link>

      <div className={`p-4 ${viewMode === 'list' ? 'flex flex-col justify-center flex-1' : ''}`}>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
          {product.category || 'Category'}
        </p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">({product.reviewsCount || 0})</span>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">${product.oldPrice}</span>
          )}
        </div>
        
        {viewMode === 'list' && (
          <div className="mt-4 hidden sm:block">
            <p className="text-sm text-gray-600 line-clamp-2">{product.description || 'No description available for this product.'}</p>
            <button
              onClick={handleAddToCart}
              className="mt-4 bg-orange-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
