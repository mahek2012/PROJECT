import { useState, useEffect } from 'react';
import { Settings, Save, Globe, Bell, Palette, Percent, DollarSign, Image as ImageIcon } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // We store both the raw MongoDB doc (for its _id) and the parsed value for the form
  const [settingsData, setSettingsData] = useState({
    general_settings: { docId: null, value: { storeName: 'Mahek E-commerce', storeEmail: 'admin@mahek.com' } },
    currency_settings: { docId: null, value: { code: 'INR', symbol: '₹' } },
    tax_settings: { docId: null, value: { gstPercentage: 18 } },
    website_branding: { docId: null, value: { logoUrl: '', bannerUrl: '' } },
    notification_settings: { docId: null, value: { emailEnabled: true, smsEnabled: false } }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/settings');
      const data = response.data.data || [];
      
      const newSettings = { ...settingsData };
      data.forEach(item => {
        if (newSettings[item.key]) {
          newSettings[item.key] = {
            docId: item._id,
            value: item.value || newSettings[item.key].value
          };
        }
      });
      setSettingsData(newSettings);
    } catch (error) {
      toast.error('Failed to load settings from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateSetting = (key, field, newValue) => {
    setSettingsData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: {
          ...prev[key].value,
          [field]: newValue
        }
      }
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    let successCount = 0;
    
    // We only save the active tab's settings to minimize API calls, or we can save all. 
    // For safety, let's save all configuration keys present on the page.
    const keysToSave = Object.keys(settingsData);
    
    try {
      for (const key of keysToSave) {
        const item = settingsData[key];
        const payload = { key, value: item.value };
        
        if (item.docId) {
          await axiosInstance.put(`/admin/settings/${item.docId}`, payload);
        } else {
          const res = await axiosInstance.post('/admin/settings', payload);
          // Update the docId in local state so future saves are PUTs
          handleUpdateDocId(key, res.data.data._id);
        }
        successCount++;
      }
      toast.success('Configuration saved successfully! ✅');
    } catch (error) {
      toast.error('Some settings failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDocId = (key, id) => {
    setSettingsData(prev => ({
      ...prev,
      [key]: { ...prev[key], docId: id }
    }));
  };

  const tabs = [
    { id: 'general', icon: <Globe size={18} />, label: 'General & Localization' },
    { id: 'appearance', icon: <Palette size={18} />, label: 'Website Branding' },
    { id: 'notifications', icon: <Bell size={18} />, label: 'Alerts & Communications' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Configuration</h1>
          <p className="text-gray-500 font-medium">Manage global website variables, taxes, and branding</p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-[2rem] font-black transition-all shadow-xl shadow-orange-200 active:scale-95 disabled:opacity-50"
        >
          {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
          {saving ? 'Committing...' : 'Commit Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-72 shrink-0 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3"><Globe className="text-orange-600" /> Store Profile</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Basic contact information</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Name</label>
                      <input 
                        type="text" 
                        value={settingsData.general_settings.value.storeName}
                        onChange={(e) => handleUpdateSetting('general_settings', 'storeName', e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                      <input 
                        type="email" 
                        value={settingsData.general_settings.value.storeEmail}
                        onChange={(e) => handleUpdateSetting('general_settings', 'storeEmail', e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Currency */}
                  <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3"><DollarSign className="text-green-500" /> Currency</h3>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Platform Default Currency</p>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Currency</label>
                      <select 
                        value={settingsData.currency_settings.value.code}
                        onChange={(e) => handleUpdateSetting('currency_settings', 'code', e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-green-500 cursor-pointer"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound (£)</option>
                      </select>
                    </div>
                  </div>

                  {/* Taxes */}
                  <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3"><Percent className="text-blue-500" /> Taxation</h3>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">GST & Revenue Rules</p>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Global GST Percentage (%)</label>
                      <input 
                        type="number" 
                        min="0" max="100"
                        value={settingsData.tax_settings.value.gstPercentage}
                        onChange={(e) => handleUpdateSetting('tax_settings', 'gstPercentage', Number(e.target.value))}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3"><Palette className="text-orange-600" /> Identity & Assets</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Control what customers see first</p>
                  
                  <div className="space-y-8">
                    {/* Logo */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-24 h-24 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {settingsData.website_branding.value.logoUrl ? (
                           <img src={settingsData.website_branding.value.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                           <ImageIcon className="text-gray-300" size={32} />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Logo URL</label>
                        <input 
                          type="url" placeholder="https://..."
                          value={settingsData.website_branding.value.logoUrl}
                          onChange={(e) => handleUpdateSetting('website_branding', 'logoUrl', e.target.value)}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" 
                        />
                        <p className="text-[10px] font-bold text-gray-400 ml-1">Recommended size: 512x512px transparent PNG</p>
                      </div>
                    </div>

                    {/* Banner */}
                    <div className="space-y-4 pt-6 border-t border-gray-50">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Homepage Hero Banner URL</label>
                        <input 
                          type="url" placeholder="https://..."
                          value={settingsData.website_branding.value.bannerUrl}
                          onChange={(e) => handleUpdateSetting('website_branding', 'bannerUrl', e.target.value)}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500" 
                        />
                        <p className="text-[10px] font-bold text-gray-400 ml-1">Recommended size: 1920x1080px (16:9 ratio)</p>
                      </div>
                      
                      <div className="w-full h-48 bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden shadow-inner flex items-center justify-center relative">
                        {settingsData.website_branding.value.bannerUrl ? (
                           <img src={settingsData.website_branding.value.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                        ) : (
                           <div className="text-center text-gray-300">
                             <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                             <p className="font-bold text-xs uppercase tracking-widest">Banner Preview</p>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3"><Bell className="text-orange-600" /> Customer Communications</h3>
                  <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8">Automated Email & SMS delivery</p>
                  
                  <div className="space-y-6">
                    <label className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <h4 className="font-black text-gray-900">Email Dispatcher</h4>
                        <p className="text-xs text-gray-500 font-bold mt-1">Send order confirmations and invoices via Email</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsData.notification_settings.value.emailEnabled}
                        onChange={(e) => handleUpdateSetting('notification_settings', 'emailEnabled', e.target.checked)}
                        className="w-6 h-6 text-orange-600 rounded-md border-gray-300 focus:ring-orange-500 bg-white" 
                      />
                    </label>

                    <label className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <h4 className="font-black text-gray-900">SMS Gateway</h4>
                        <p className="text-xs text-gray-500 font-bold mt-1">Send OTPs and delivery updates via SMS</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsData.notification_settings.value.smsEnabled}
                        onChange={(e) => handleUpdateSetting('notification_settings', 'smsEnabled', e.target.checked)}
                        className="w-6 h-6 text-orange-600 rounded-md border-gray-300 focus:ring-orange-500 bg-white" 
                      />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
