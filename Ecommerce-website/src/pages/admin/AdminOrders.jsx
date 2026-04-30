import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, Filter, Eye, ChevronLeft, Truck, Package, 
  CheckCircle2, Clock, X, Download, FileText, 
  AlertCircle, DollarSign, User, MapPin, Calendar, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllAdminOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { toast } from 'react-toastify';

const AdminOrders = () => {

  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchAllAdminOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus, newPaymentStatus) => {
    setIsUpdating(true);
    try {
      await dispatch(updateOrderStatus({ 
        orderId, 
        status: newStatus, 
        paymentStatus: newPaymentStatus 
      })).unwrap();
      toast.success('Order updated successfully! ✅');
      if (selectedOrder) {
        setSelectedOrder(prev => ({ 
          ...prev, 
          status: newStatus || prev.status,
          paymentStatus: newPaymentStatus || prev.paymentStatus
        }));
      }
    } catch (error) {
      toast.error(error || 'Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': 
      case 'confirmed': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'returned': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'refunded': return 'text-purple-600 bg-purple-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  const generateInvoice = (order) => {
    toast.info(`Generating invoice for ${order._id}... 📄`);
    // Mock invoice generation
    setTimeout(() => {
      toast.success('Invoice generated and ready for download!');
    }, 1500);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status?.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="p-3 bg-white rounded-2xl text-gray-400 hover:text-orange-600 shadow-sm transition-all">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Orders</h1>
              <p className="text-gray-500 font-medium">{filteredOrders.length} orders total</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID or Customer Name..." 
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-700 placeholder:text-gray-300"
            />
          </div>
          
          <div className="flex gap-2 bg-gray-50 p-1 rounded-2xl">
            {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${
                  statusFilter === status 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
             <div className="py-24 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-400 font-bold">Retrieving Order History...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-center px-10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200"><Package size={40} /></div>
              <p className="text-gray-400 font-black text-xl">No orders found matching your criteria</p>
              <button onClick={() => { setSearchQuery(''); setStatusFilter('All'); }} className="text-orange-600 font-black hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bill</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 font-black text-gray-900 text-sm">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-xs uppercase">
                            {order.userId?.username?.[0] || 'U'}
                          </div>
                          <span className="font-bold text-gray-700">{order.userId?.username || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-gray-500">{order.items?.length || 0} items</span>
                      </td>
                      <td className="px-8 py-6 font-black text-gray-900">₹{order.totalbill}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getPaymentStatusStyle(order.paymentStatus)}`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-3 text-orange-600 hover:bg-orange-50 rounded-2xl transition-all shadow-sm hover:shadow-orange-100"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Side Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Order Details</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Order ID: #{selectedOrder._id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Order Date</span>
                    </div>
                    <p className="font-black text-gray-900">{new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>

                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <CreditCard size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Payment</span>
                    </div>
                    <p className="font-black text-gray-900">{selectedOrder.paymentMethod || 'COD'}</p>
                  </div>
                </div>

                {/* Status Update Card */}
                <div className="p-8 bg-orange-50 rounded-[2rem] border border-orange-100 space-y-6">
                  <div className="flex items-center gap-4 text-orange-600">
                    <AlertCircle size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">Administrative Control</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Progress</label>
                      <select 
                        defaultValue={selectedOrder.status}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value, null)}
                        disabled={isUpdating}
                        className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned / Refund</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Status</label>
                      <select 
                        defaultValue={selectedOrder.paymentStatus}
                        onChange={(e) => handleStatusUpdate(selectedOrder._id, null, e.target.value)}
                        disabled={isUpdating}
                        className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Product List */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-gray-900">
                    <Package size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">Ordered Items</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-sm">{item.name || 'Product Item'}</p>
                            <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                        <p className="font-black text-gray-900">₹{item.total}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xl font-black text-gray-900">Total Amount</span>
                    <span className="text-3xl font-black text-orange-600 tracking-tight">₹{selectedOrder.totalbill}</span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <User size={20} />
                    <h3 className="font-black uppercase tracking-widest text-xs">Customer Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="text-gray-300" size={16} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                          <p className="text-sm font-bold text-gray-700">{selectedOrder.userId?.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-300" size={16} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                          <p className="text-sm font-bold text-gray-700">{selectedOrder.userId?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-300 mt-1" size={16} />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Address</p>
                          <p className="text-sm font-bold text-gray-700">
                            {selectedOrder.shippingAddress?.street || 'No street info'}<br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => generateInvoice(selectedOrder)}
                  className="flex-1 px-8 py-5 bg-gray-50 text-gray-600 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={16} /> Generate Invoice
                </button>
                <button 
                  className="flex-1 px-8 py-5 bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Notify Customer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

