import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { updateQuantity, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const shipping = totalAmount > 500 ? 0 : 50;
  const tax = totalAmount * 0.1; // 10% tax
  const total = totalAmount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-10 text-lg">Looks like you haven't added anything to your cart yet. Explore our latest collections and find something you love!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2 py-4 px-10 text-lg">
            Start Shopping <ArrowRight size={20} />
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
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Shopping Cart <span className="text-gray-400 font-medium">({items.length})</span></h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 relative group"
                >
                  <Link to={`/product/${item.id}`} className="w-full sm:w-32 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">{item.category}</p>
                        <Link to={`/product/${item.id}`}>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">{item.name}</h3>
                        </Link>
                      </div>
                      <button 
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-400 font-medium">${item.price} each</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-gray-500 font-bold hover:text-red-600 flex items-center gap-2 transition-colors px-2"
            >
              <Trash2 size={18} /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-28 space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-bold">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : 'text-gray-900 font-bold'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Tax (10%)</span>
                  <span className="text-gray-900 font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link 
                  to="/checkout" 
                  className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg shadow-xl shadow-orange-100"
                >
                  <CreditCard size={20} /> Checkout Now
                </Link>
                <Link 
                  to="/products" 
                  className="w-full py-4 border-2 border-gray-100 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                >
                  <ArrowRight size={20} className="rotate-180" /> Continue Shopping
                </Link>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <Truck size={20} className="text-gray-400" />
                  <span>Estimated delivery within 3-5 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <ShieldCheck size={20} className="text-gray-400" />
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
