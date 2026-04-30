import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100 text-center space-y-8"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle size={56} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Order Confirmed!</h1>
            <p className="text-xl text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
              Thank you for your purchase. Your order has been placed and is being processed.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Package size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Order ID</span>
              </div>
              <p className="text-xl font-bold text-gray-900">#{orderId}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Order Date</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              We've sent a confirmation email to your registered email address with all the details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/orders" className="btn-primary py-4 px-10 flex items-center justify-center gap-2 text-lg">
                View My Orders <ArrowRight size={20} />
              </Link>
              <Link to="/products" className="btn-secondary py-4 px-10 flex items-center justify-center gap-2 text-lg">
                <ShoppingBag size={20} /> Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
