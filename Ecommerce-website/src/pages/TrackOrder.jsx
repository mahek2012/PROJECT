import { useState } from 'react';
import { PackageSearch, ArrowRight, Truck, CheckCircle2, Package } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null); // 'searching', 'found', 'error'

  const handleTrack = (e) => {
    e.preventDefault();
    setStatus('searching');
    setTimeout(() => {
      if (orderId.length > 5) {
        setStatus('found');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom max-w-3xl">
        <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageSearch className="text-orange-500" size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-500 text-lg mb-10">Enter your Order ID to track the current status of your shipment.</p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-10">
            <input 
              type="text" 
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g., ORD-123456789"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 font-bold focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 uppercase"
            />
            <button 
              type="submit"
              disabled={status === 'searching'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2"
            >
              {status === 'searching' ? 'Searching...' : 'Track'}
            </button>
          </form>

          {status === 'error' && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold">
              Invalid Order ID. Please check and try again.
            </div>
          )}

          {status === 'found' && (
            <div className="mt-12 text-left border-t border-gray-100 pt-12">
              <h3 className="text-xl font-black text-gray-900 mb-8">Order Status: <span className="text-orange-500">Shipped</span></h3>
              
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Order Confirmed</h4>
                      <p className="text-sm text-gray-500 mt-1">April 28, 2024 - 10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                      <Package className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Processing</h4>
                      <p className="text-sm text-gray-500 mt-1">April 29, 2024 - 02:15 PM</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0 border-4 border-white shadow-sm shadow-orange-200 ring-4 ring-orange-50">
                      <Truck className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Shipped</h4>
                      <p className="text-sm text-gray-500 mt-1">Package is in transit.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start opacity-50">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0 border-4 border-white">
                      <CheckCircle2 className="text-gray-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Delivered</h4>
                      <p className="text-sm text-gray-500 mt-1">Estimated: May 02, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
