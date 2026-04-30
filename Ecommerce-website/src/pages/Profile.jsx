import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut, Camera, ChevronRight } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    ...(user?.role === 'admin' ? [{ icon: <Settings size={20} />, label: 'Admin Dashboard', link: '/admin', desc: 'Manage products, orders, and users' }] : []),
    { icon: <Package size={20} />, label: 'My Orders', link: '/orders', desc: 'Track, return or buy things again' },
    { icon: <Heart size={20} />, label: 'My Wishlist', link: '/wishlist', desc: 'Items you have saved for later' },
    { icon: <Settings size={20} />, label: 'Account Settings', link: '#', desc: 'Update your personal information' },
    { icon: <MapPin size={20} />, label: 'Shipping Addresses', link: '#', desc: 'Edit or add new addresses' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / User Info */}
          <div className="md:w-1/3 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border-4 border-white shadow-xl overflow-hidden">
                  <User size={64} />
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-gray-500 hover:text-orange-600 border border-gray-100 transition-all">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.username}</h2>
              <p className="text-gray-500 font-medium mb-6">{user?.email}</p>
              
              <div className="flex justify-center gap-4 border-t border-gray-50 pt-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Orders</p>
                </div>
                <div className="w-px h-8 bg-gray-100 mt-1"></div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">5</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Saved</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>

          {/* Main Content / Menu */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-bold text-gray-900">Account Overview</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {menuItems.map((item, index) => (
                  <Link 
                    key={index} 
                    to={item.link} 
                    className="flex items-center justify-between p-8 hover:bg-orange-50 transition-all group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-600 group-hover:shadow-md transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{item.label}</h4>
                        <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-orange-600 transform group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions / Recent Activity */}
            <div className="mt-8 bg-gradient-to-r from-orange-600 to-orange-400 p-8 rounded-3xl text-white flex items-center justify-between shadow-xl shadow-orange-100">
              <div>
                <h4 className="text-xl font-bold mb-1 text-white">Join the Membership</h4>
                <p className="text-sm opacity-90">Get exclusive deals and faster delivery on every order.</p>
              </div>
              <button className="bg-white text-orange-600 font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-all text-sm">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
