import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, Truck, ChevronLeft, ShoppingBag, Download, XCircle, CreditCard, AlertTriangle } from 'lucide-react';
import { fetchOrders, cancelOrder } from '../redux/slices/orderSlice';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ticketOrder, setTicketOrder] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'shipped': return 'bg-orange-100 text-orange-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const result = await dispatch(cancelOrder(orderId));
      if (cancelOrder.fulfilled.match(result)) {
        toast.success('Order cancelled successfully.');
      } else {
        toast.error(result.payload || 'Failed to cancel order.');
      }
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'No Address provided';
    if (typeof address === 'string') return address;
    return `${address.street || ''}, ${address.city || ''}, ${address.zipCode || ''}, ${address.country || ''}`;
  };

  const handleDownloadTicket = (order) => {
    setTicketOrder(order);
    setIsPrinting(true);
    // Use a small timeout to ensure the state is updated and the component is rendered before printing
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setTicketOrder(null);
    }, 500);
  };

  if (isPrinting && ticketOrder) {
    return (
      <div className="bg-white min-h-screen p-10 font-sans text-gray-900">
         <div className="max-w-3xl mx-auto border-2 border-gray-100 p-12 rounded-[2rem]">
            <div className="flex justify-between items-start mb-12 border-b pb-8">
               <div>
                  <h1 className="text-4xl font-black text-orange-600 mb-2">SHOPVERSE</h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Official Order Receipt</p>
               </div>
               <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Receipt Number</p>
                  <p className="font-black text-gray-900 text-lg">#{ticketOrder._id?.toString().slice(-12).toUpperCase()}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
               <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
                  <p className="font-black text-xl mb-1">{ticketOrder.userId?.fullName || ticketOrder.userId?.username}</p>
                  <p className="text-sm text-gray-500 font-medium">{formatAddress(ticketOrder.shippingAddress)}</p>
               </div>
               <div className="text-right">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Order Summary</h3>
                  <div className="space-y-1">
                     <p className="text-sm font-bold text-gray-600">Date: {new Date(ticketOrder.createdAt).toLocaleDateString()}</p>
                     <p className="text-sm font-bold text-gray-600">Payment: {ticketOrder.paymentMethod?.toUpperCase()}</p>
                     <p className="text-lg font-black text-orange-600 mt-2">Total: ${(ticketOrder.totalbill || 0).toFixed(2)}</p>
                  </div>
               </div>
            </div>

            <div className="border-t border-b border-gray-50 py-8 mb-12">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Ordered Items</h3>
               <div className="space-y-4">
                  {ticketOrder.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                       <div>
                          <p className="font-black text-gray-900">{item.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                       </div>
                       <p className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="text-center pt-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Thank you for shopping with us!</p>
               <div className="w-12 h-1 bg-orange-600 mx-auto rounded-full"></div>
            </div>
         </div>
      </div>
    );
  }

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
                      <p className="font-bold text-gray-900">#{order._id || order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date Placed</p>
                      <p className="font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="font-bold text-orange-600">${(order.totalbill || order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Payment</p>
                      <p className="font-bold text-gray-900 flex items-center gap-1">
                        <CreditCard size={14} className="text-gray-400" /> {order.paymentMethod || 'COD'}
                      </p>
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
                        <img 
                          src={item.image || "https://placehold.co/400x400?text=Product"} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900 mt-1">${item.price}</p>
                      </div>
                      <Link to={`/product/${item.productId || item.id}`} className="hidden sm:flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
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
                      <span className="truncate max-w-[200px]" title={formatAddress(order.shippingAddress)}>
                        {formatAddress(order.shippingAddress)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button 
                      onClick={() => handleDownloadTicket(order)}
                      className="btn-secondary py-2.5 px-4 text-sm flex items-center gap-2 bg-white"
                    >
                      <Download size={16} /> Download Ticket
                    </button>
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button 
                        onClick={() => handleCancelOrder(order._id || order.id)}
                        className="btn-secondary py-2.5 px-4 text-sm flex items-center gap-2 text-red-600 border-red-200 hover:border-red-600 hover:bg-red-50"
                      >
                        <XCircle size={16} /> Cancel Order
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2"
                    >
                      <CreditCard size={16} /> Payment Details
                    </button>
                  </div>

                </div>

                {/* Refund Reason Alert (Prominent Visibility) */}
                {order.payment?.refundReason && (
                  <div className="mx-8 mb-6 p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] mb-1">Important Update: Refund Information</p>
                      <h4 className="text-sm font-black text-red-900 mb-1">Admin Note / Refund Issue:</h4>
                      <p className="text-sm text-red-700 font-bold leading-relaxed italic">
                        "{order.payment.refundReason}"
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>


      {/* Payment Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900">Payment Details</h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Method</p>
                  <p className="text-lg font-black text-gray-900 uppercase">{selectedOrder.paymentMethod || 'COD'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Status</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {selectedOrder.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount Paid</p>
                  <p className="text-2xl font-black text-orange-600">${(selectedOrder.totalbill || 0).toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</p>
                  <p className="text-xs font-bold text-gray-900 font-mono">
                    {selectedOrder.payment?.transactionId || `TRX-${(selectedOrder._id || selectedOrder.id).toString().slice(-8).toUpperCase()}`}
                  </p>
                </div>
              </div>

              {selectedOrder.payment?.refundReason && (
                <div className="p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle size={18} />
                    <p className="text-xs font-black uppercase tracking-widest">Refund Reason / Issue</p>
                  </div>
                  <p className="text-sm text-red-700 font-bold leading-relaxed italic">
                    "{selectedOrder.payment.refundReason}"
                  </p>
                </div>
              )}


              <div className="pt-8 border-t border-gray-100 space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Billing & Shipping Address</p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {formatAddress(selectedOrder.shippingAddress)}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-full btn-primary py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-100"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hidden Printable Receipt */}
      {ticketOrder && (
        <div id="printable-receipt" className="hidden print:block fixed inset-0 bg-white z-[9999] p-10 font-sans text-gray-900">
           <div className="max-w-3xl mx-auto border-2 border-gray-100 p-12 rounded-[2rem]">
              <div className="flex justify-between items-start mb-12 border-b pb-8">
                 <div>
                    <h1 className="text-4xl font-black text-orange-600 mb-2">SHOPVERSE</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Official Order Receipt</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Receipt Number</p>
                    <p className="font-black text-gray-900 text-lg">#{ticketOrder._id?.toString().slice(-12).toUpperCase()}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12">
                 <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</h3>
                    <p className="font-black text-xl mb-1">{ticketOrder.userId?.fullName || ticketOrder.userId?.username}</p>
                    <p className="text-sm text-gray-500 font-medium">{formatAddress(ticketOrder.shippingAddress)}</p>
                 </div>
                 <div className="text-right">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Order Summary</h3>
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-gray-600">Date: {new Date(ticketOrder.createdAt).toLocaleDateString()}</p>
                       <p className="text-sm font-bold text-gray-600">Payment: {ticketOrder.paymentMethod?.toUpperCase()}</p>
                       <p className="text-lg font-black text-orange-600 mt-2">Total: ${(ticketOrder.totalbill || 0).toFixed(2)}</p>
                    </div>
                 </div>
              </div>

              <div className="border-t border-b border-gray-50 py-8 mb-12">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Ordered Items</h3>
                 <div className="space-y-4">
                    {ticketOrder.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2">
                         <div>
                            <p className="font-black text-gray-900">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Quantity: {item.quantity}</p>
                         </div>
                         <p className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="text-center pt-8">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Thank you for shopping with us!</p>
                 <div className="w-12 h-1 bg-orange-600 mx-auto rounded-full"></div>
              </div>
           </div>
        </div>
      )}

      {/* Print Specific Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          #root > * {
            display: none !important;
          }
          #printable-receipt {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            visibility: visible !important;
          }
          #printable-receipt * {
            visibility: visible !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;
