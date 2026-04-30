import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Search, Edit2, Trash2, X, Check, Image as ImageIcon, ChevronRight, Hash } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    image: '', 
    icon: '', 
    parent: '' 
  });

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/category/all');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        parent: formData.parent === "" ? null : formData.parent
      };

      if (editingCategory) {
        await axiosInstance.put(`/category/update/${editingCategory._id}`, payload);
        toast.success('Category updated ✅');
      } else {
        await axiosInstance.post('/category/create', payload);
        toast.success('Category created ✅');
      }
      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '', icon: '', parent: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? This might affect products using it.')) {
      try {
        await axiosInstance.delete(`/category/delete/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group categories for hierarchy display
  const parentCategories = categories.filter(c => !c.parent);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Taxonomy</h1>
          <p className="text-gray-500 font-medium">Manage product categories and hierarchies</p>
        </div>
        <button 
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gray-900 hover:bg-orange-600 text-white px-8 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-gray-100 active:scale-95"
        >
          <Plus size={20} />
          Create New
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/20">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter categories..."
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
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon / Image</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCategories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 overflow-hidden shadow-inner">
                        {cat.image ? <img src={cat.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} />}
                      </div>
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                        {cat.icon ? <img src={cat.icon} className="w-6 h-6 object-contain" /> : <Hash size={20} />}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      {cat.parent && <ChevronRight size={14} className="text-gray-300" />}
                      <span className={`font-black text-gray-900 ${cat.parent ? 'text-sm' : 'text-base'}`}>{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.parent ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {cat.parent ? 'Sub-Category' : 'Root Category'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-sm text-gray-500 font-bold line-clamp-1">{cat.description || '—'}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setFormData({ 
                            name: cat.name, 
                            description: cat.description || '', 
                            image: cat.image || '',
                            icon: cat.icon || '',
                            parent: cat.parent?._id || '' 
                          });
                          setIsModalOpen(true);
                        }}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(filteredCategories.length === 0 || loading) && (
            <div className="p-20 text-center">
              {loading ? (
                <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto" />
              ) : (
                <p className="text-gray-400 font-black text-xl italic">No categories mapped yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white rounded-[3.5rem] w-full max-w-xl p-10 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-10 shrink-0">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingCategory ? 'Update' : 'Initialize'} Category</h2>
                  <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.2em] mt-1">Classification System</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-all"><X size={28} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                    <input 
                      type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="e.g. Headphones"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Parent Category</label>
                    <select 
                      value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
                    >
                      <option value="">None (Root Category)</option>
                      {parentCategories.filter(c => c._id !== editingCategory?._id).map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                    placeholder="Enter strategic grouping details..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Image URL</label>
                    <input 
                      type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Icon URL / Path</label>
                    <input 
                      type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="e.g. electronics-icon.png"
                    />
                  </div>
                </div>
                
                <div className="pt-6 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-5 rounded-3xl font-black text-gray-400 uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Discard</button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
                  >
                    <Check size={20} />
                    {editingCategory ? 'Commit Changes' : 'Publish Category'}
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

export default AdminCategories;

