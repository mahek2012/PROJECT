import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Edit2, Trash2, X, Shield, 
  Mail, Phone, Calendar, User, ShoppingBag, 
  Ban, CheckCircle2, ChevronRight, MapPin, 
  CreditCard, Clock, AlertTriangle
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/all/user');
      const userData = response.data.users || response.data;
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    setLoadingOrders(true);
    try {
      // Assuming a route exists to fetch orders for a specific user
      // If not, we'll filter from all orders or show a mock message
      const response = await axiosInstance.get(`/orders/admin/all`);
      const allOrders = response.data.orders || [];
      const filtered = allOrders.filter(o => o.userId?._id === userId || o.userId === userId);
      setUserOrders(filtered);
    } catch (error) {
      console.error('Failed to fetch user orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserOrders(user._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axiosInstance.delete(`/admin/user/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
        if (selectedUser?._id === id) setSelectedUser(null);
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await axiosInstance.put(`/admin/user/${user._id}/role`, { role: newRole });
      toast.success(`User role elevated to ${newRole}`);
      fetchUsers();
      if (selectedUser?._id === user._id) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (error) {
      toast.error('Role update failed');
    }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    const actionText = newStatus === 'blocked' ? 'Block' : 'Unblock';
    
    if (window.confirm(`Are you sure you want to ${actionText} this user?`)) {
      try {
        await axiosInstance.put(`/admin/user/${user._id}/status`, { status: newStatus });
        toast.success(`User ${newStatus} successfully ✅`);
        fetchUsers();
        if (selectedUser?._id === user._id) {
          setSelectedUser(prev => ({ ...prev, status: newStatus }));
        }
      } catch (error) {
        toast.error(`${actionText} action failed`);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Community</h1>
          <p className="text-gray-500 font-medium">Manage user accounts, permissions, and history</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/20">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
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
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleUserClick(user)}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg ${user.status === 'blocked' ? 'bg-gray-400' : 'bg-orange-600 shadow-orange-100'}`}>
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">{user.username}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: {user._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                        <Mail size={14} className="text-gray-300" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                         <Shield size={12} className={user.role === 'admin' ? 'text-purple-500' : 'text-gray-300'} />
                         {user.role} Account
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      user.status === 'blocked' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => toggleStatus(user)}
                        title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                        className={`p-3 rounded-2xl transition-all ${
                          user.status === 'blocked' 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        {user.status === 'blocked' ? <CheckCircle2 size={18} /> : <Ban size={18} />}
                      </button>
                      <button 
                        onClick={() => handleUserClick(user)}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                      >
                        <User size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
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
          {filteredUsers.length === 0 && !loading && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4"><Users size={40} /></div>
              <p className="text-gray-400 font-black text-xl italic">No members found in your community</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Side Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            />
            
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Profile</h2>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Profile Overview & History</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900">
                  <X size={28} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Profile Card */}
                <div className="flex items-center gap-8">
                   <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl ${selectedUser.status === 'blocked' ? 'bg-gray-400' : 'bg-orange-600 shadow-orange-100'}`}>
                    {selectedUser.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-black text-gray-900">{selectedUser.username}</h3>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    <p className="text-gray-500 font-bold flex items-center gap-2"><Mail size={16} /> {selectedUser.email}</p>
                    <div className="flex gap-2 pt-2">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        selectedUser.status === 'blocked' 
                          ? 'bg-red-50 text-red-600 border-red-100' 
                          : 'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {selectedUser.status || 'Active Account'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Member Since</span>
                    </div>
                    <p className="font-black text-gray-900">{new Date(selectedUser.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                      <ShoppingBag size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Total Orders</span>
                    </div>
                    <p className="font-black text-gray-900">{userOrders.length} Completed</p>
                  </div>
                </div>

                {/* Status Control Card */}
                <div className={`p-8 rounded-[2.5rem] border space-y-4 ${selectedUser.status === 'blocked' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                   <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">Account Permissions</h4>
                      <p className="text-xs text-gray-500 font-medium mt-1">Manage user access to the platform</p>
                    </div>
                    <button 
                      onClick={() => toggleStatus(selectedUser)}
                      className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        selectedUser.status === 'blocked' 
                          ? 'bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700' 
                          : 'bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700'
                      }`}
                    >
                      {selectedUser.status === 'blocked' ? 'Unblock Account' : 'Block Account'}
                    </button>
                  </div>
                </div>

                {/* Order History */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-900">
                      <ShoppingBag size={20} />
                      <h3 className="font-black uppercase tracking-widest text-xs">Recent Purchase History</h3>
                    </div>
                    {loadingOrders && <div className="w-4 h-4 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />}
                  </div>
                  
                  <div className="space-y-4">
                    {userOrders.length > 0 ? (
                      userOrders.map((order, idx) => (
                        <div key={idx} className="p-5 bg-white rounded-3xl border border-gray-100 flex items-center justify-between hover:border-orange-200 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                              <ShoppingBag size={20} />
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-900">₹{order.totalbill}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${order.status === 'delivered' ? 'text-green-500' : 'text-orange-500'}`}>
                              {order.status}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : !loadingOrders && (
                      <div className="p-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 font-bold text-sm">No orders found for this user.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                <button 
                  onClick={() => toggleRole(selectedUser)}
                  className="flex-1 px-8 py-5 bg-white text-gray-900 rounded-3xl font-black uppercase tracking-widest text-xs border border-gray-100 hover:bg-gray-100 transition-all shadow-sm"
                >
                  {selectedUser.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                </button>
                <button 
                  onClick={() => handleDelete(selectedUser._id)}
                  className="flex-1 px-8 py-5 bg-red-50 text-red-600 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-red-100 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;

