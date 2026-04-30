import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, Truck, ChevronLeft, ShoppingBag } from 'lucide-react';
import { fetchOrders } from '../redux/slices/orderSlice';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'shipped': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-12">
        <Skeleton height={40} width={300} className="mb-10" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={200} className="rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-10">
          <Link to="/profile" className="p-2 bg-white rounded-full text-gray-600 hover:text-orange-600 shadow-sm transition-all">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Package size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">When you shop, your order status and history will appear here.</p>
            <Link to="/products" className="btn-primary py-4 px-10 inline-flex items-center gap-2">
              Start Shopping <ShoppingBag size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id} 
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6 bg-gray-50/50">
                  <div className="flex flex-wrap gap-10">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
                      <p className="font-bold text-gray-900">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date Placed</p>
                      <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="font-bold text-orange-600">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status || 'Processing')}`}>
                    {order.status || 'Processing'}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8 space-y-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">${item.price}</p>
                      </div>
                      <Link to={`/product/${item.id}`} className="hidden sm:flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
                        View Product <ChevronRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <MapPin size={16} />
                      <span className="truncate max-w-[200px]">{order.shippingAddress}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="btn-secondary py-2.5 px-6 text-sm">Track Package</button>
                    <button className="btn-primary py-2.5 px-6 text-sm">Buy Again</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
