import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Lock, Shield, Save, Key, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (formData.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      toast.success('Password updated successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Admin Profile</h1>
        <p className="text-gray-500 font-medium">Manage your administrative account and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-orange-600 rounded-3xl flex items-center justify-center text-white text-4xl font-black shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl border-4 border-white shadow-lg">
                <Shield size={16} />
              </div>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-1">Admin Account</h2>
            <p className="text-orange-600 text-xs font-black uppercase tracking-widest bg-orange-50 inline-block px-3 py-1 rounded-lg">Super Admin</p>
            
            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4 text-left">
              <div className="flex items-center gap-3 text-gray-600">
                <User size={18} className="text-gray-400" />
                <span className="text-sm font-bold">{user?.username}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-gray-400" />
                <span className="text-sm font-bold truncate">{user?.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-[2rem] text-white overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-orange-500 text-xs font-black uppercase tracking-widest mb-4">Security Level</p>
              <h3 className="text-2xl font-black mb-2">Very High</h3>
              <p className="text-gray-400 text-sm font-medium">Your account is protected with enterprise-grade encryption.</p>
            </div>
            <Shield className="absolute -right-8 -bottom-8 text-white opacity-5 w-40 h-40" />
          </div>
        </div>

        {/* Right Column: Password Change Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <Key className="text-orange-600" /> Change Password
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 font-bold"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <Key size={18} />
                    </span>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 font-bold"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <Save size={18} />
                    </span>
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 font-bold"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-2xl flex items-start gap-4 border border-orange-100">
                <AlertCircle className="text-orange-600 shrink-0" size={20} />
                <p className="text-sm text-orange-800 font-medium leading-relaxed">
                  Important: Changing your password will log you out of all other sessions. Make sure you use a strong password with at least 8 characters.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 disabled:opacity-70 mt-4"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={20} /> Update Security Credentials
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
