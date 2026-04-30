import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star, ChevronRight, Truck, ShieldCheck, RotateCcw, Minus, Plus, Share2, Check } from 'lucide-react';
import { fetchProductById, clearProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector((state) => state.products);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const isWishlisted = wishlistItems.some((item) => item.id === product?.id);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast.info(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (isLoading) {
    return (
      <div className="container-custom py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <Skeleton height={500} className="rounded-3xl" />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <Skeleton width="40%" height={24} />
            <Skeleton width="80%" height={40} />
            <Skeleton width="30%" height={32} />
            <Skeleton count={4} />
            <Skeleton width="100%" height={60} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="container-custom py-20 text-center text-2xl font-bold">Product not found</div>;

  const images = product.images?.length > 0 ? product.images : [product.image];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 mb-10">
        <div className="container-custom flex items-center gap-2 text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <ChevronRight size={16} />
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <div className="sticky top-28 space-y-6">
              <motion.div 
                layoutId={`product-image-${product.id}`}
                className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100"
              >
                <img 
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
              
              {images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-24 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === idx ? 'border-orange-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="space-y-8">
              <div>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{product.rating || 4.5}</span>
                  </div>
                  <span className="text-gray-400 text-sm font-medium">|</span>
                  <span className="text-sm text-gray-500 font-medium">{product.reviewsCount || 128} Customer Reviews</span>
                </div>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-extrabold text-gray-900">${product.price}</span>
                {product.oldPrice && (
                  <span className="text-xl text-gray-400 line-through font-medium">${product.oldPrice}</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold">
                    Save {product.discount}%
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description || "Experience premium quality and sophisticated design with this state-of-the-art product. Engineered for performance and built to last, it's the perfect addition to your lifestyle."}
              </p>

              {/* Specs / Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">In Stock Ready</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <ShieldCheck size={18} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">1 Year Warranty</span>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="pt-6 border-t border-gray-100 space-y-6">
                <div className="flex items-center gap-10">
                  <span className="font-bold text-gray-900 uppercase tracking-wider text-sm">Quantity</span>
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="w-12 text-center font-extrabold text-gray-900 text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-xl shadow-xl shadow-orange-200"
                  >
                    <ShoppingCart size={24} /> Add to Cart
                  </button>
                  <button 
                    onClick={handleWishlist}
                    className={`w-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      isWishlisted ? 'bg-red-50 border-red-500 text-red-500 shadow-lg' : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={28} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>
                  <button className="w-16 rounded-2xl flex items-center justify-center border-2 border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <div className="flex flex-col items-center text-center p-4">
                  <Truck className="text-orange-600 mb-3" size={32} />
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Free Delivery</h4>
                  <p className="text-xs text-gray-500">Orders over $500</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <RotateCcw className="text-orange-600 mb-3" size={32} />
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Easy Returns</h4>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <ShieldCheck className="text-orange-600 mb-3" size={32} />
                  <h4 className="font-bold text-gray-900 text-sm mb-1">Secure Transaction</h4>
                  <p className="text-xs text-gray-500">SSL encrypted payment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
