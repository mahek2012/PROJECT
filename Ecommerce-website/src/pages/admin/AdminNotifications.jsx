import { useState, useEffect } from 'react';
import { Bell, Search, Trash2, CheckCircle, Info, AlertTriangle, XCircle, Send, Plus, Package, ShoppingBag, CreditCard } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'broadcasts'
  
  // States
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch Broadcasts from Notification Model
      const broadcastRes = await axiosInstance.get('/admin/notifications');
      setBroadcasts(broadcastRes.data.data || []);

      // Fetch Derived System Alerts
      const [productsRes, ordersRes, paymentsRes] = await Promise.all([
        axiosInstance.get('/products').catch(() => ({ data: { products: [] } })),
        axiosInstance.get('/orders/admin/all').catch(() => ({ data: { orders: [] } })),
        axiosInstance.get('/admin/payments').catch(() => ({ data: { data: [] } }))
      ]);

      const products = productsRes.data.products || productsRes.data.data || [];
      const orders = ordersRes.data.orders || ordersRes.data.data || [];
      const payments = paymentsRes.data.data || [];

      const derivedAlerts = [];

      // 1. Low Stock Alerts
      products.forEach(p => {
        if (p.stock <= 10) {
          derivedAlerts.push({
            id: `stock-${p._id}`,
            title: 'Low Stock Warning',
            message: `${p.name} is running low on stock. Only ${p.stock} units remaining.`,
            type: 'warning',
            category: 'inventory',
            createdAt: p.updatedAt || new Date().toISOString()
          });
        }
      });

      // 2. New Order Alerts (Pending orders from last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      orders.forEach(o => {
        if (o.status === 'pending' && new Date(o.createdAt) > sevenDaysAgo) {
          derivedAlerts.push({
            id: `order-${o._id}`,
            title: 'New Order Received',
            message: `Order #${o._id.substring(o._id.length - 6)} is pending fulfillment. Total: ₹${o.totalbill}.`,
            type: 'info',
            category: 'order',
            createdAt: o.createdAt
          });
        }
      });

      // 3. Payment Updates (Failed or Refunded payments)
      payments.forEach(p => {
        if (p.status === 'failed' || p.status === 'refunded') {
          derivedAlerts.push({
            id: `payment-${p._id}`,
            title: `Payment ${p.status.charAt(0).toUpperCase() + p.status.slice(1)}`,
            message: `Transaction of ₹${p.amount} via ${p.method} has been marked as ${p.status}.`,
            type: p.status === 'failed' ? 'error' : 'info',
            category: 'payment',
            createdAt: p.updatedAt || new Date().toISOString()
          });
        }
      });

      // Sort alerts by newest first
      derivedAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSystemAlerts(derivedAlerts);

    } catch (error) {
      toast.error('Failed to synchronize notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/notifications', formData);
      toast.success('Notification broadcasted globally ✅');
      setIsModalOpen(false);
      setFormData({ title: '', message: '', type: 'info' });
      fetchAllData();
    } catch (error) {
      toast.error('Failed to send broadcast');
    }
  };

  const getIcon = (type, category) => {
    if (category === 'inventory') return <Package className="text-orange-500" size={24} />;
    if (category === 'order') return <ShoppingBag className="text-blue-500" size={24} />;
    if (category === 'payment') return <CreditCard className="text-red-500" size={24} />;

    // Fallbacks for broadcasts
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-orange-500" size={24} />;
      case 'error': return <XCircle className="text-red-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Notification Center</h1>
          <p className="text-gray-500 font-medium">Monitor system alerts and broadcast updates</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white px-8 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Send size={20} />
          Broadcast Update
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`pb-4 px-4 font-black text-sm uppercase tracking-widest transition-all ${
            activeTab === 'alerts' ? 'text-orange-600 border-b-4 border-orange-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          System Alerts {systemAlerts.length > 0 && <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px]">{systemAlerts.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('broadcasts')}
          className={`pb-4 px-4 font-black text-sm uppercase tracking-widest transition-all ${
            activeTab === 'broadcasts' ? 'text-orange-600 border-b-4 border-orange-600' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Broadcast History
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'alerts' && (
              <motion.div key="alerts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-lg transition-all group">
                    <div className={`p-4 rounded-2xl shrink-0 ${
                      alert.type === 'warning' ? 'bg-orange-50' : 
                      alert.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                    }`}>
                      {getIcon(alert.type, alert.category)}
                    </div>
                    <div className="flex-1 mt-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-gray-900">{alert.title}</h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-xl">
                          {new Date(alert.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-bold mt-2 leading-relaxed max-w-3xl">{alert.message}</p>
                    </div>
                  </div>
                ))}
                {systemAlerts.length === 0 && (
                  <div className="p-20 text-center text-gray-400 font-black text-xl bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Bell size={40} className="mx-auto mb-4 text-gray-300" />
                    All clear! No pending system alerts.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'broadcasts' && (
              <motion.div key="broadcasts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                {broadcasts.map((notif) => (
                  <div key={notif._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-5 hover:shadow-lg transition-all group">
                    <div className={`p-4 rounded-2xl shrink-0 ${
                      notif.type === 'success' ? 'bg-green-50' : 
                      notif.type === 'warning' ? 'bg-orange-50' : 
                      notif.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                    }`}>
                      {getIcon(notif.type, 'broadcast')}
                    </div>
                    <div className="flex-1 mt-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-black text-gray-900">{notif.title}</h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-xl">
                          Broadcasted {new Date(notif.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-bold mt-2 leading-relaxed max-w-3xl">{notif.message}</p>
                    </div>
                  </div>
                ))}
                {broadcasts.length === 0 && (
                  <div className="p-20 text-center text-gray-400 font-black text-xl bg-white rounded-[3rem] border border-dashed border-gray-200">
                    <Send size={40} className="mx-auto mb-4 text-gray-300" />
                    No broadcast history found.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Broadcast Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} 
              className="bg-white rounded-[3.5rem] w-full max-w-xl p-10 relative shadow-2xl flex flex-col"
            >
              <h2 className="text-3xl font-black text-gray-900 mb-2">Global Broadcast</h2>
              <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em] mb-8">Send an alert to all registered users</p>
              
              <form onSubmit={handleBroadcastSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                  <input 
                    type="text" placeholder="e.g. Flash Sale Alert!" required
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500"
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alert Level</label>
                  <select 
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="info">General Information</option>
                    <option value="success">Success / Good News</option>
                    <option value="warning">Warning / Action Required</option>
                    <option value="error">Critical System Error</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Body</label>
                  <textarea 
                    placeholder="Type the broadcast message here..." required rows="4"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 resize-none"
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-3xl font-black text-gray-400 uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Discard</button>
                  <button type="submit" className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3">
                    <Send size={20} /> Publish Broadcast
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotifications;
