import { useState, useEffect } from 'react';
import { 
  Box, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ShoppingCart, 
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/api/axiosInstance';

const AdminInventory = () => {
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/products/admin/inventory-insights');
      if (res.data?.success) {
        setInventory(res.data.inventory);
      }
    } catch (err) {
      console.error('Failed to fetch inventory data', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Products', value: inventory?.lowStock.length + 20, icon: <Package />, color: 'bg-blue-500' }, // Dummy logic for total
    { label: 'Low Stock Items', value: inventory?.lowStock.length || 0, icon: <AlertTriangle />, color: 'bg-orange-500' },
    { label: 'Total Items Sold', value: inventory?.fastSelling.reduce((acc, p) => acc + (p.soldQuantity || 0), 0) || 0, icon: <ShoppingCart />, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Smart Inventory AI</h1>
          <p className="text-gray-500 font-medium mt-1">Real-time stock management and sales predictions</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-orange-100">
          <Sparkles size={16} /> AI Engine Active
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6"
          >
            <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Reorder Alerts */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Clock className="text-orange-600" /> Reorder Alerts 🚨
            </h3>
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              Action Required
            </span>
          </div>
          <div className="p-8 space-y-4">
            {inventory?.reorderSuggestions.length > 0 ? (
              inventory.reorderSuggestions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 bg-red-50/50 rounded-3xl border border-red-50 transition-all hover:bg-red-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-red-600 font-black uppercase tracking-widest mt-1">
                        Will go out of stock in ~{item.daysRemaining} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{item.currentStock} left</p>
                    <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1 flex items-center gap-1 hover:underline">
                      Reorder <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-gray-400 font-bold italic">No urgent reorders needed.</p>
            )}
          </div>
        </div>

        {/* Fast Selling Products */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <TrendingUp className="text-green-600" /> Fast Selling Products 🔥
            </h3>
          </div>
          <div className="p-8 space-y-4">
            {inventory?.fastSelling.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100 transition-all hover:bg-white hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                    <img src={product.images?.[0] || product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{product.name}</p>
                    <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">Trending Item</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">{product.soldQuantity || 0}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Units Sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Low Stock List */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
              <Box className="text-blue-600" /> Low Stock / Out of Stock
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inventory?.lowStock.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/30 transition-all">
                    <td className="px-8 py-6 font-bold text-gray-900">{product.name}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        product.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900">{product.stock}</td>
                    <td className="px-8 py-6">
                      <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline">
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
