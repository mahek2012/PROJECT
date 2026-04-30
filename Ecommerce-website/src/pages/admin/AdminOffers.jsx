import { useState, useEffect } from 'react';
import { Gift, Plus, Search, Trash2, Edit2, X, Check, Calendar, ShoppingCart, Zap } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

import { motion, AnimatePresence } from 'framer-motion';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({ 
    code: '', 
    discount: '', 
    type: 'percentage', 
    startDate: '', 
    endDate: '', 
    description: '',
    minCartValue: '',
    autoApply: false
  });

  const fetchOffers = async () => {
    try {
      const response = await axiosInstance.get('/admin/offers');
      setOffers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch offers');
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        minCartValue: formData.minCartValue ? Number(formData.minCartValue) : 0
      };

      if (editingOffer) {
        await axiosInstance.put(`/admin/offers/${editingOffer._id}`, payload);
        toast.success('Offer updated successfully ✅');
      } else {
        await axiosInstance.post('/admin/offers', payload);
        toast.success('Offer created successfully ✅');
      }
      setIsModalOpen(false);
      setEditingOffer(null);
      setFormData({ code: '', discount: '', type: 'percentage', startDate: '', endDate: '', description: '', minCartValue: '', autoApply: false });
      fetchOffers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer permanently?')) {
      try {
        await axiosInstance.delete(`/admin/offers/${id}`);
        toast.success('Offer deleted');
        fetchOffers();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const openEditModal = (offer) => {
    setEditingOffer(offer);
    setFormData({
      code: offer.code,
      discount: offer.discount,
      type: offer.type,
      startDate: offer.startDate ? offer.startDate.split('T')[0] : '',
      endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
      description: offer.description || '',
      minCartValue: offer.minCartValue || '',
      autoApply: offer.autoApply || false
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Campaigns</h1>
          <p className="text-gray-500 font-medium">Manage promotional codes, automated discounts, and cart rules</p>
        </div>
        <button 
          onClick={() => { 
            setEditingOffer(null); 
            setFormData({ code: '', discount: '', type: 'percentage', startDate: '', endDate: '', description: '', minCartValue: '', autoApply: false });
            setIsModalOpen(true); 
          }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white px-8 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-gray-200 active:scale-95"
        >
          <Plus size={20} />
          Launch Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <motion.div 
            key={offer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden flex flex-col"
          >
            {offer.autoApply && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-6 py-1.5 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-blue-200">
                <Zap size={12} className="fill-white" /> Auto Apply
              </div>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl flex items-center justify-center text-white shadow-xl ${
                offer.isActive ? 'bg-orange-600 shadow-orange-200' : 'bg-gray-400 shadow-gray-200'
              }`}>
                <Gift size={28} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(offer)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(offer._id)} className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="mb-6 flex-1">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{offer.code}</h3>
              <p className="text-sm text-gray-500 font-medium line-clamp-2">{offer.description || 'No description provided.'}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <Gift size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Discount</p>
                    <p className="text-sm font-black text-gray-900 leading-none">{offer.discount}{offer.type === 'percentage' ? '%' : '₹'} OFF</p>
                  </div>
                </div>
                
                {offer.minCartValue > 0 && (
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Min. Cart</p>
                      <p className="text-sm font-black text-gray-900 leading-none">₹{offer.minCartValue}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <ShoppingCart size={14} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={14} />
                  <span className="text-xs font-bold">Valid Till</span>
                </div>
                <p className={`text-xs font-black uppercase tracking-widest ${
                  new Date(offer.endDate) < new Date() ? 'text-red-500' : 'text-green-600'
                }`}>
                  {new Date(offer.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {offers.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4"><Gift size={40} /></div>
            <p className="text-gray-400 font-black text-xl italic">No promotional offers active</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} 
              className="bg-white rounded-[3.5rem] w-full max-w-2xl p-10 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-10 shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingOffer ? 'Edit Campaign' : 'New Campaign'}</h2>
                  <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em] mt-1">Discount Configuration</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-all"><X size={28} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Coupon Code</label>
                    <input 
                      type="text" placeholder="e.g. SUMMER50" required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 uppercase transition-all"
                      value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount Type & Value</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" placeholder="Value" required min="1"
                        className="w-1/2 px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                        value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})}
                      />
                      <select 
                        className="w-1/2 px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Flat (₹)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><ShoppingCart size={12}/> Min. Cart Value (Optional)</label>
                    <input 
                      type="number" placeholder="e.g. 1000" min="0"
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      value={formData.minCartValue} onChange={(e) => setFormData({...formData, minCartValue: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Zap size={12}/> Automation</label>
                    <label className="flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors h-[52px]">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-orange-600 rounded-md border-gray-300 focus:ring-orange-500"
                        checked={formData.autoApply} 
                        onChange={(e) => setFormData({...formData, autoApply: e.target.checked})}
                      />
                      <span className="text-sm font-bold text-gray-700">Auto-apply at checkout</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} /> Start Date</label>
                    <input 
                      type="date" required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} /> Expiry Date</label>
                    <input 
                      type="date" required
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Description</label>
                  <textarea 
                    placeholder="Briefly describe the terms of this offer..."
                    rows="3"
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="pt-6 flex gap-4 shrink-0">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-3xl font-black text-gray-400 uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Discard</button>
                  <button type="submit" className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3">
                    <Check size={20} /> {editingOffer ? 'Commit Changes' : 'Launch Campaign'}
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

export default AdminOffers;
