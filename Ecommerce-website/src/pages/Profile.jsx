import { useSelector, useDispatch } from 'react-redux';
import { 
  User, Mail, Phone, MapPin, Package, Heart, Settings, 
  LogOut, Camera, ChevronRight, Bell, Shield, Lock, 
  Plus, Trash2, Edit3, CreditCard, Zap, Star, ShieldCheck,
  CheckCircle2, X, Home, Briefcase, Globe
} from 'lucide-react';
import { logout, updateUser } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axiosInstance from '../services/api/axiosInstance';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeSection, setActiveSection] = useState('overview'); // overview, settings, addresses, membership
  const [stats, setStats] = useState({ orderCount: 0, wishlistCount: 0 });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/auth/stats');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const sidebarItems = [
    { id: 'overview', icon: <Package size={20} />, label: 'Overview', color: 'blue' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Account Settings', color: 'orange' },
    { id: 'addresses', icon: <MapPin size={20} />, label: 'Shipping Addresses', color: 'green' },
    { id: 'membership', icon: <Zap size={20} />, label: 'Upgrade Now', color: 'purple' },
  ];

  // Sub-components
  const Overview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/orders" className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Package size={28} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">My Orders</h3>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-none mb-4">Total Orders: {stats.orderCount}</p>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-widest">
            Track your parcels <ChevronRight size={14} />
          </div>
        </Link>
        <Link to="/wishlist" className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group">
          <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors">
            <Heart size={28} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">My Wishlist</h3>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-none mb-4">Saved Items: {stats.wishlistCount}</p>
          <div className="flex items-center gap-2 text-pink-600 text-xs font-black uppercase tracking-widest">
            View your favorites <ChevronRight size={14} />
          </div>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <span className="bg-orange-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 inline-block">
            Pro Membership
          </span>
          <h3 className="text-3xl font-black mb-4">Unlock Premium Benefits</h3>
          <p className="text-gray-400 font-medium max-w-md mb-8">Get free shipping, priority support, and exclusive early access to new collections.</p>
          <button 
            onClick={() => setActiveSection('membership')}
            className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
          >
            Upgrade Now
          </button>
        </div>
        <Zap className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
      </div>
    </div>
  );

  const AccountSettings = () => {
    const [formData, setFormData] = useState({
      fullName: user?.fullName || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      preferences: user?.preferences || { emailNotifications: true, smsAlerts: false }
    });

    const handleUpdate = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.put('/auth/update', formData);
        if (response.data.success) {
          dispatch(updateUser(response.data.user));
          toast.success('Profile updated successfully!');
        }
      } catch (error) {
        toast.error('Failed to update profile');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10 space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-8">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Phone Number</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl text-sm font-bold transition-all outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-50">
          <h3 className="text-2xl font-black text-gray-900 mb-8">Notifications & Security</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Notifications</h4>
                  <p className="text-xs text-gray-400 font-medium">Receive updates about your orders and offers</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({...formData, preferences: {...formData.preferences, emailNotifications: !formData.preferences.emailNotifications}})}
                className={`w-14 h-8 rounded-full p-1 transition-all ${formData.preferences.emailNotifications ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${formData.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">SMS Alerts</h4>
                  <p className="text-xs text-gray-400 font-medium">Get real-time tracking via text messages</p>
                </div>
              </div>
              <button 
                onClick={() => setFormData({...formData, preferences: {...formData.preferences, smsAlerts: !formData.preferences.smsAlerts}})}
                className={`w-14 h-8 rounded-full p-1 transition-all ${formData.preferences.smsAlerts ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${formData.preferences.smsAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3"
        >
          {loading ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </div>
    );
  };

  const AddressBook = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
      fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: '', addressType: 'Home'
    });

    const handleAction = async (action, addressId = null, addressData = null) => {
      try {
        const response = await axiosInstance.post('/auth/addresses', { action, addressId, address: addressData });
        if (response.data.success) {
          dispatch(updateUser(response.data.user));
          toast.success(`Address ${action} successfully!`);
          setShowAddModal(false);
        }
      } catch (error) {
        toast.error('Failed to update address');
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-gray-900">My Addresses</h3>
            <p className="text-gray-400 text-sm font-medium">Manage your delivery locations</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {user?.addresses?.map((addr) => (
            <div key={addr._id} className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all relative group ${addr.isDefault ? 'border-orange-500 bg-orange-50/20' : 'border-gray-50 hover:border-gray-200'}`}>
              {addr.isDefault && (
                <div className="absolute top-8 right-8 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Default
                </div>
              )}
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center mb-6">
                {addr.addressType === 'Home' ? <Home size={24}/> : addr.addressType === 'Office' ? <Briefcase size={24}/> : <Globe size={24}/>}
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-1">{addr.fullName}</h4>
              <p className="text-gray-500 text-sm font-medium mb-1">{addr.phone}</p>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                {addr.street}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}
              </p>
              
              <div className="flex items-center gap-3">
                {!addr.isDefault && (
                  <button 
                    onClick={() => handleAction('setDefault', addr._id)}
                    className="text-[10px] font-black uppercase text-orange-600 hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                <button 
                  onClick={() => handleAction('delete', addr._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg ml-auto transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Address Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">Add New Address</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
              </div>
              <div className="p-10 grid grid-cols-2 gap-6">
                <input placeholder="Full Name" className="p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold text-sm" onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})} />
                <input placeholder="Phone" className="p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold text-sm" onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                <input placeholder="Street" className="p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold text-sm col-span-2" onChange={(e) => setNewAddress({...newAddress, street: e.target.value})} />
                <input placeholder="City" className="p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold text-sm" onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                <input placeholder="State" className="p-4 bg-gray-50 rounded-xl outline-none border-2 border-transparent focus:border-orange-500 transition-all font-bold text-sm" onChange={(e) => setNewAddress({...newAddress, state: e.target.value})} />
                <select className="p-4 bg-gray-50 rounded-xl outline-none font-bold text-sm" onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={() => handleAction('add', null, newAddress)} className="col-span-2 py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest mt-4">Save Address</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Membership = () => {
    const plans = [
      { id: 'Free', name: 'Basic', price: '₹0', features: ['Standard Delivery', 'Access to Shop'], icon: <Globe size={24}/>, current: user?.membership?.plan === 'Free' },
      { id: 'Pro', name: 'Pro Member', price: '₹99/mo', features: ['Free Shipping', 'Faster Delivery', 'Exclusive Deals'], icon: <Star size={24}/>, current: user?.membership?.plan === 'Pro' },
      { id: 'Premium', name: 'Elite Premium', price: '₹199/mo', features: ['Everything in Pro', 'Early Access', 'Personal Stylist'], icon: <Zap size={28}/>, current: user?.membership?.plan === 'Premium', featured: true }
    ];

    const handleUpgrade = async (plan) => {
      try {
        const response = await axiosInstance.post('/auth/upgrade', { plan });
        if (response.data.success) {
          dispatch(updateUser(response.data.user));
          toast.success(`Welcome to the ${plan} plan!`);
        }
      } catch (error) {
        toast.error('Failed to upgrade membership');
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="text-center max-w-2xl mx-auto py-12">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Elevate Your Shopping</h2>
          <p className="text-gray-400 font-medium">Join thousands of members enjoying free shipping and early access to world-class fashion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div key={p.id} className={`bg-white p-10 rounded-[3.5rem] border-2 flex flex-col relative overflow-hidden transition-all ${p.featured ? 'border-orange-500 shadow-2xl scale-105 z-10' : 'border-gray-50 shadow-sm'}`}>
              {p.featured && <div className="absolute top-8 right-8 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Best Value</div>}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${p.featured ? 'bg-orange-500 text-white shadow-xl shadow-orange-100' : 'bg-gray-100 text-gray-400'}`}>
                {p.icon}
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-2">{p.name}</h4>
              <p className="text-4xl font-black text-gray-900 mb-8">{p.price}</p>
              <div className="space-y-4 mb-10 flex-1">
                {p.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                    <CheckCircle2 size={18} className="text-green-500" /> {f}
                  </div>
                ))}
              </div>
              {p.current ? (
                <button className="w-full py-5 bg-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest cursor-default">Current Plan</button>
              ) : (
                <button 
                  onClick={() => handleUpgrade(p.id)}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${p.featured ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 hover:bg-orange-700' : 'bg-gray-900 text-white hover:bg-black'}`}
                >
                  Upgrade Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container-custom max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Enhanced Sidebar */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-100 border border-gray-100 sticky top-32">
              <div className="text-center mb-10">
                <div className="relative inline-block mb-6">
                  <div 
                    onClick={() => document.getElementById('photo-upload').click()}
                    className="w-28 h-28 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-600 border-4 border-white shadow-2xl overflow-hidden group cursor-pointer relative"
                  >
                    {loading ? (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : null}
                    <img src={user?.profilePhoto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                  <input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = async () => {
                          setLoading(true);
                          try {
                            const response = await axiosInstance.put('/auth/update', { profilePhoto: reader.result });
                            if (response.data.success) {
                              dispatch(updateUser(response.data.user));
                              toast.success('Photo updated!');
                            }
                          } catch (err) {
                            toast.error('Failed to upload photo');
                          } finally {
                            setLoading(false);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1 capitalize">{user?.username}</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">{user?.role} Account</p>
              </div>


              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-sm transition-all group ${
                      activeSection === item.id 
                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`transition-colors ${activeSection === item.id ? 'text-white' : 'group-hover:text-gray-900'}`}>
                      {item.icon}
                    </div>
                    {item.label}
                    {activeSection === item.id && <ChevronRight size={16} className="ml-auto opacity-50" />}
                  </button>
                ))}
                
                <div className="h-px bg-gray-50 my-6" />

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl font-black text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={20} /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1">
            {activeSection === 'overview' && <Overview />}
            {activeSection === 'settings' && <AccountSettings />}
            {activeSection === 'addresses' && <AddressBook />}
            {activeSection === 'membership' && <Membership />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

