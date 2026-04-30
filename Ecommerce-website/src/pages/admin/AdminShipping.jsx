import { useState, useEffect } from 'react';
import { Truck, Search, Package, MapPin, Settings as SettingsIcon, Save, Map, Clock, CreditCard } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminShipping = () => {
  const [activeTab, setActiveTab] = useState('deliveries'); // 'deliveries' or 'config'
  const [shipping, setShipping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Config state
  const [configId, setConfigId] = useState(null);
  const [config, setConfig] = useState({
    baseCharge: '50',
    freeShippingThreshold: '500',
    serviceablePincodes: 'All India',
    deliveryPartners: 'BlueDart, Delhivery, FedEx',
    estimatedDays: '3-5 Business Days'
  });
  const [savingConfig, setSavingConfig] = useState(false);

  const fetchShipping = async () => {
    try {
      const response = await axiosInstance.get('/admin/shipping');
      setShipping(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch shipping data');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await axiosInstance.get('/admin/settings');
      const settings = response.data.data || [];
      const shippingConfig = settings.find(s => s.key === 'shipping_config');
      
      if (shippingConfig) {
        setConfigId(shippingConfig._id);
        setConfig(shippingConfig.value);
      }
    } catch (error) {
      console.error('Failed to fetch shipping config');
    }
  };

  useEffect(() => {
    fetchShipping();
    fetchConfig();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/admin/shipping/${id}`, { status: newStatus });
      toast.success('Status updated');
      fetchShipping();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const saveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const payload = {
        key: 'shipping_config',
        value: config,
        description: 'Global shipping and delivery settings'
      };

      if (configId) {
        await axiosInstance.put(`/admin/settings/${configId}`, payload);
      } else {
        const res = await axiosInstance.post('/admin/settings', payload);
        setConfigId(res.data.data._id);
      }
      toast.success('Shipping configuration saved successfully ✅');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const filteredShipping = shipping.filter(s => 
    s.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Logistics</h1>
          <p className="text-gray-500 font-medium">Manage deliveries, tracking, and global shipping rules</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('deliveries')}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'deliveries' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            Active Deliveries
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'config' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            Global Rules
          </button>
        </div>
      </div>

      {activeTab === 'deliveries' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/20">
            <div className="relative max-w-md">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by Tracking # or Order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 shadow-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking #</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Carrier</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredShipping.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{s.trackingNumber || 'UNASSIGNED'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Order: #{s.orderId?.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-gray-400 mt-0.5" />
                        <div className="text-xs text-gray-500 font-medium max-w-[200px]">
                          <p className="font-bold text-gray-700">{s.address?.fullName}</p>
                          <p className="truncate">{s.address?.street}, {s.address?.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{s.carrier}</span>
                    </td>
                    <td className="px-10 py-6">
                      <select 
                        value={s.status}
                        onChange={(e) => updateStatus(s._id, e.target.value)}
                        className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm ${
                          s.status === 'delivered' ? 'bg-green-50 text-green-600' : 
                          s.status === 'shipped' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        <option value="preparing">Preparing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredShipping.length === 0 && !loading && (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4"><Truck size={40} /></div>
                <p className="text-gray-400 font-black text-xl italic">No active deliveries found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden p-10">
          <div className="mb-10 flex items-center gap-4">
             <div className="w-16 h-16 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
              <SettingsIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Configuration</h2>
              <p className="text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Platform-Wide Rules</p>
            </div>
          </div>

          <form onSubmit={saveConfig} className="space-y-8 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <CreditCard size={14} /> Base Shipping Charge (₹)
                </label>
                <input 
                  type="number" 
                  value={config.baseCharge}
                  onChange={e => setConfig({...config, baseCharge: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="e.g. 50"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Package size={14} /> Free Shipping Threshold (₹)
                </label>
                <input 
                  type="number" 
                  value={config.freeShippingThreshold}
                  onChange={e => setConfig({...config, freeShippingThreshold: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="e.g. 500"
                  required
                />
                <p className="text-xs text-gray-400 ml-1 font-medium">Orders above this amount get free delivery.</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                <Map size={14} /> Serviceable Pincodes
              </label>
              <textarea 
                rows="3"
                value={config.serviceablePincodes}
                onChange={e => setConfig({...config, serviceablePincodes: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                placeholder="e.g. 400001, 400002 or 'All India'"
                required
              />
              <p className="text-xs text-gray-400 ml-1 font-medium">Comma-separated list of allowed pincodes, or write 'All India'.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Truck size={14} /> Delivery Partners
                </label>
                <input 
                  type="text" 
                  value={config.deliveryPartners}
                  onChange={e => setConfig({...config, deliveryPartners: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="e.g. BlueDart, Delhivery"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  <Clock size={14} /> Estimated Delivery Time
                </label>
                <input 
                  type="text" 
                  value={config.estimatedDays}
                  onChange={e => setConfig({...config, estimatedDays: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                  placeholder="e.g. 3-5 Business Days"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={savingConfig}
                className="bg-gray-900 hover:bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-gray-200 flex items-center gap-3 disabled:opacity-50"
              >
                {savingConfig ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Commit Configuration
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;
