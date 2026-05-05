import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Star, ChevronRight, Truck, ShieldCheck, RotateCcw, Minus, Plus, Share2, Check, Sparkles, ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react';
import { fetchProductById, clearProduct } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';
import axiosInstance from '../services/api/axiosInstance';
import { addItemToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.products);

  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [isRecLoading, setIsRecLoading] = useState(false);
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  const isWishlisted = wishlistItems.some((item) => item.id === product?._id || item.productId === product?._id);

  useEffect(() => {
    dispatch(fetchProductById(id));
    fetchReviews();
    fetchRecommendations();
    fetchReviewAnalysis();
    window.scrollTo(0, 0);
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}/reviews`);
      if (res.data?.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  };

  // Calculate Rating Breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const fetchRecommendations = async () => {
    try {
      setIsRecLoading(true);
      const res = await axiosInstance.get(`/products/recommendations/${id}`);
      if (res.data?.success) {
        setRecommendations(res.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    } finally {
      setIsRecLoading(false);
    }
  };

  const fetchReviewAnalysis = async () => {
    try {
      setIsAnalysisLoading(true);
      const res = await axiosInstance.get(`/products/${id}/review-analysis`);
      if (res.data?.success) {
        setReviewAnalysis(res.data.analysis);
      }
    } catch (err) {
      console.error('Failed to fetch review analysis', err);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await axiosInstance.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('Review submitted! It will appear once approved by an Admin.');
      setReviewComment('');
      setReviewRating(5);
      fetchReviews(); // refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addItemToCart({ productId: product._id, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
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
                layoutId={`product-image-${product._id}`}
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
                      className={`w-24 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activeImage === idx ? 'border-orange-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
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
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.views > 50 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                      <Sparkles size={12} /> High Demand
                    </span>
                  )}
                  {product.soldQuantity > 10 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest">
                      🔥 Selling Fast
                    </span>
                  )}
                </div>
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

              <div className="space-y-2">
                <div className="flex items-baseline gap-4">
                  <span className={`text-4xl font-extrabold ${product.priceStatus === 'dropped' ? 'text-green-600' : 'text-gray-900'}`}>
                    ${product.dynamicPrice || product.price}
                  </span>
                  {(product.dynamicPrice !== product.price || product.oldPrice) && (
                    <span className="text-xl text-gray-400 line-through font-medium">
                      ${product.price}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-bold">
                      Save {product.discount}%
                    </span>
                  )}
                </div>

                {/* AI Urgency Messages */}
                {product.urgencyMessage && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 text-sm font-black uppercase tracking-tighter ${
                      product.priceStatus === 'dropped' ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {product.priceStatus === 'dropped' ? '⚡' : '🔥'} {product.urgencyMessage}
                  </motion.div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description || "Experience premium quality and sophisticated design with this state-of-the-art product. Engineered for performance and built to last, it's the perfect addition to your lifestyle."}
              </p>

              {/* Specs / Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                  product.stock === 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    product.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {product.stock === 0 ? <X size={18} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />}
                  </div>
                  <div>
                    <span className={`text-sm font-bold block ${
                      product.stock === 0 ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : 'In Stock Ready'}
                    </span>
                    {product.stock > 0 && product.stock < 10 && (
                      <span className="text-[10px] font-black text-orange-600 uppercase">
                        ⚡ Only {product.stock} left at this price!
                      </span>
                    )}
                  </div>
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
                    disabled={product.stock === 0}
                    className={`flex-1 btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-xl shadow-xl shadow-orange-200 ${
                      product.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-400 shadow-none' : ''
                    }`}
                  >
                    <ShoppingCart size={24} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-16 rounded-2xl flex items-center justify-center border-2 transition-all ${isWishlisted ? 'bg-red-50 border-red-500 text-red-500 shadow-lg' : 'border-gray-200 text-gray-400 hover:border-red-500 hover:text-red-500'
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

        {/* Reviews Section */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Review List */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black text-gray-900">Customer Reviews</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest border border-orange-100">
                  <Sparkles size={14} /> AI Powered
                </div>
              </div>

              {/* AI Analysis Summary Box */}
              {reviewAnalysis && reviews.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12 bg-gradient-to-br from-orange-50/50 to-white border border-orange-100 rounded-[2.5rem] p-8 shadow-xl shadow-orange-50/20 relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 opacity-5">
                    <Sparkles size={200} className="text-orange-600" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 tracking-tight">AI Review Summary</h4>
                        <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          reviewAnalysis.sentiment === 'Positive' ? 'bg-green-100 text-green-700' : 
                          reviewAnalysis.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {reviewAnalysis.sentiment} Sentiment {reviewAnalysis.sentiment === 'Positive' ? '😊' : reviewAnalysis.sentiment === 'Negative' ? '😡' : '😐'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Left: Summary & Highlights */}
                      <div className="space-y-8">
                        <p className="text-lg font-bold text-gray-800 leading-relaxed italic">
                          "{reviewAnalysis.summary}"
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h5 className="flex items-center gap-2 font-black text-[10px] text-green-600 uppercase tracking-widest">
                              <ThumbsUp size={14} /> Most people liked
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {reviewAnalysis.pros?.map((pro, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white text-green-700 rounded-xl text-xs font-black border border-green-100 shadow-sm">
                                  {pro}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h5 className="flex items-center gap-2 font-black text-[10px] text-red-500 uppercase tracking-widest">
                              <ThumbsDown size={14} /> Some complained
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {reviewAnalysis.cons?.map((con, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white text-red-600 rounded-xl text-xs font-black border border-red-100 shadow-sm">
                                  {con}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Rating Breakdown */}
                      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-orange-50">
                        <h5 className="font-black text-[10px] text-gray-400 uppercase tracking-widest mb-6">Rating Breakdown</h5>
                        <div className="space-y-4">
                          {ratingBreakdown.map((item) => (
                            <div key={item.star} className="flex items-center gap-4">
                              <div className="flex items-center gap-1 w-12">
                                <span className="text-xs font-black text-gray-700">{item.star}</span>
                                <Star size={12} className="text-yellow-400" fill="currentColor" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.percentage}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className="h-full bg-orange-500 rounded-full"
                                />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 w-8">{item.count}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">{product.rating || 4.5}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Avg Rating</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">{reviews.length}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Reviews</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {reviews.length === 0 ? (
                <div className="text-gray-500 font-medium py-8">No reviews yet. Be the first to review this product!</div>
              ) : (
                <div className="space-y-8">
                  {reviews.map(review => (
                    <div key={review._id} className="bg-gray-50 p-6 rounded-[2rem]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg">
                          {review.userId?.fullname?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{review.userId?.fullname || 'Unknown User'}</h4>
                          <div className="flex text-yellow-400 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-sm text-gray-400 font-medium">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed pl-16">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review */}
            <div className="lg:w-1/3">
              <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl shadow-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-2 rounded-xl transition-all ${star <= reviewRating ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-50'
                            }`}
                        >
                          <Star size={24} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                    <textarea
                      required
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you like or dislike?"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 font-medium resize-none"
                    ></textarea>
                  </div>
                  {isAuthenticated ? (
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full btn-primary py-4 rounded-xl font-bold"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full btn-primary py-4 rounded-xl font-bold flex justify-center items-center"
                    >
                      Login to Review
                    </Link>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Smart Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-24 pt-20 border-t border-gray-100">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">You May Also Like</h3>
                <p className="text-gray-500 font-medium mt-1">Smartly selected for you based on your interests</p>
              </div>
              <Link to="/products" className="text-orange-600 font-black text-sm uppercase tracking-widest hover:underline flex items-center gap-2">
                Explore More <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendations.map((rec) => (
                <motion.div
                  key={rec._id}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden group cursor-pointer"
                >
                  <Link to={`/product/${rec._id}`} className="block">
                    <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                      <img 
                        src={rec.images?.[0] || rec.image} 
                        alt={rec.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 right-4">
                        <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">{rec.category}</p>
                      <h4 className="font-bold text-gray-900 mb-2 truncate group-hover:text-orange-600 transition-colors">{rec.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-gray-900">${rec.price}</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-bold text-gray-900">{rec.rating || 4.5}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
