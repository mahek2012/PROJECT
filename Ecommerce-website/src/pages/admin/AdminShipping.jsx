import { useState, useEffect, useMemo } from 'react';
import { 
  Truck, Search, Package, MapPin, Map, 
  Clock, CreditCard, Plus, Edit, Trash2, CheckCircle2,
  XCircle, Globe, Zap, AlertCircle, Filter, 
  Download, Eye, FileText, ChevronRight
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminShipping = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders, tracking, zones, charges
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({ date: '', payment: '', status: '' });
  
  // Data
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeShipments, setActiveShipments] = useState([]);
  const [zones, setZones] = useState([]);
  const [settings, setSettings] = useState({ flatRate: 50, freeThreshold: 999, codCharges: 30 });
  
  // Selection
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Modals
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [zoneForm, setZoneForm] = useState({ zoneName: '', regions: '', baseCharge: 0, freeShippingThreshold: 0, deliveryTime: '3-5 Days' });
  
  // Details Modal
  const [viewOrder, setViewOrder] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shippingRes, rulesRes, allOrdersRes, settingsRes] = await Promise.all([
        axiosInstance.get('/admin/shipping').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/admin/shipping-rules').catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/orders/admin/all').catch(() => ({ data: { orders: [] } })),
        axiosInstance.get('/admin/settings').catch(() => ({ data: { data: [] } }))
      ]);

      setPendingOrders(allOrdersRes?.data?.orders || []);
      setActiveShipments(shippingRes?.data?.data || []);
      setZones(rulesRes?.data?.data || []);
      
      if (settingsRes?.data?.data) {
        const flat = settingsRes.data.data.find(s => s.key === 'shipping_flat_rate');
        const free = settingsRes.data.data.find(s => s.key === 'shipping_free_threshold');
        const cod = settingsRes.data.data.find(s => s.key === 'shipping_cod_charge');
        setSettings({
          flatRate: flat?.value || 50,
          freeThreshold: free?.value || 999,
          codCharges: cod?.value || 30
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    return (pendingOrders || []).filter(o => {
      // Show orders needing dispatch
      const validStatus = ['pending', 'confirmed', 'packed'].includes(o?.status);
      if (!validStatus && !filters.status) return false;
      
      const matchesSearch = 
        o?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o?.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = filters.date ? new Date(o?.createdAt).toLocaleDateString() === new Date(filters.date).toLocaleDateString() : true;
      const matchesPayment = filters.payment ? o?.paymentMethod?.toLowerCase() === filters.payment.toLowerCase() : true;
      const matchesStatus = filters.status ? o?.status === filters.status : true;
      
      return matchesSearch && matchesDate && matchesPayment && matchesStatus;
    });
  }, [pendingOrders, searchTerm, filters]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/admin/${orderId}`, { status: newStatus });
      toast.success(`Order: ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleShipNow = async (order) => {
    try {
      const shippingData = {
        orderId: order._id,
        address: {
          fullName: order.userId?.fullName || order.userId?.username || 'Customer',
          phone: order.userId?.phone || '',
          street: order.shippingAddress?.street || '',
          city: order.shippingAddress?.city || '',
          state: order.shippingAddress?.state || '',
          pincode: order.shippingAddress?.zipCode || '',
          country: order.shippingAddress?.country || 'India'
        },
        carrier: 'Delhivery',
        status: 'shipped'
      };
      await axiosInstance.post('/admin/shipping', shippingData);
      await axiosInstance.put(`/orders/admin/${order._id}`, { status: 'shipped' });
      toast.success('Dispatched successfully');
      fetchData();
    } catch (error) {
      toast.error('Dispatch failed');
    }
  };

  const handleBulkDispatch = async () => {
    if (selectedOrders.length === 0) return toast.warn('Select orders');
    setLoading(true);
    try {
      await Promise.all(selectedOrders.map(id => {
        const o = pendingOrders.find(item => item._id === id);
        return handleShipNow(o);
      }));
      setSelectedOrders([]);
      toast.success('Bulk dispatch successful');
      fetchData();
    } catch (error) {
      toast.error('Bulk dispatch failed');
    } finally {
      setLoading(false);
    }
  };

  const updateTrackingDetails = async (id, field, value) => {
    try {
      await axiosInstance.put(`/admin/shipping/${id}`, { [field]: value });
      toast.success('Updated');
      fetchData();
    } catch (error) {
      toast.error('Failed');
    }
  };

  const updateGlobalSetting = async (key, value) => {
    try {
      await axiosInstance.post('/admin/settings', { key, value });
      toast.success('Setting saved');
      fetchData();
    } catch (error) {
      toast.error('Failed');
    }
  };

  const saveZone = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...zoneForm,
        regions: typeof zoneForm.regions === 'string' ? zoneForm.regions.split(',').map(r => r.trim()) : zoneForm.regions
      };
      if (editingZone) await axiosInstance.put(`/admin/shipping-rules/${editingZone._id}`, payload);
      else await axiosInstance.post('/admin/shipping-rules', payload);
      setShowZoneModal(false);
      fetchData();
      toast.success('Zone updated');
    } catch (error) {
      toast.error('Failed');
    }
  };

  if (loading && pendingOrders.length === 0) {
    return <div className="flex justify-center py-40"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 pb-20 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-8 rounded-[2.5rem] border shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-100">
              <Truck size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Logistics Hub</h1>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 System Online • Pending Dispatch: {pendingOrders.filter(o => o.status === 'pending').length}
              </p>
           </div>
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-[1.8rem] border">
           {[
             { id: 'orders', label: 'Orders', icon: <Package size={16}/> },
             { id: 'tracking', label: 'Tracking', icon: <MapPin size={16}/> },
             { id: 'zones', label: 'Zones', icon: <Globe size={16}/> },
             { id: 'charges', label: 'Charges', icon: <CreditCard size={16}/> }
           ].map(t => (
             <button 
               key={t.id} 
               onClick={() => setActiveTab(t.id)}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
             >
               {t.icon} {t.label}
             </button>
           ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border shadow-sm">
               <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input type="text" placeholder="Search orders..." className="pl-12 pr-6 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none border-2 border-transparent focus:border-orange-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                     <input type="date" className="px-4 py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase outline-none border" value={filters.date} onChange={(e) => setFilters({...filters, date: e.target.value})} />
                     <select className="px-4 py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase outline-none border" value={filters.payment} onChange={(e) => setFilters({...filters, payment: e.target.value})}>
                        <option value="">All Payment</option>
                        <option value="cod">COD</option>
                        <option value="paid">Paid</option>
                     </select>
                     <select className="px-4 py-3 bg-gray-50 rounded-xl text-[10px] font-black uppercase outline-none border" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                     </select>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  {selectedOrders.length > 0 && (
                    <button onClick={handleBulkDispatch} className="bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 flex items-center gap-2 animate-bounce">
                       <Zap size={18}/> Dispatch Selected ({selectedOrders.length})
                    </button>
                  )}
                  <button className="p-3.5 bg-white border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-orange-600 hover:border-orange-500 transition-all"><Download size={20}/></button>
               </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] border overflow-hidden shadow-sm">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b">
                        <th className="px-8 py-5 w-12 text-center">
                           <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-600" onChange={(e) => setSelectedOrders(e.target.checked ? filteredOrders.map(o => o._id) : [])} checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} />
                        </th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer & Payment</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredOrders.map(o => (
                        <tr key={o?._id} className={`hover:bg-gray-50/50 transition-all group ${selectedOrders.includes(o._id) ? 'bg-orange-50/30' : ''}`}>
                          <td className="px-8 py-8 text-center">
                             <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-orange-600" checked={selectedOrders.includes(o._id)} onChange={() => setSelectedOrders(prev => prev.includes(o._id) ? prev.filter(i => i !== o._id) : [...prev, o._id])} />
                          </td>
                          <td className="px-6 py-8">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-black text-[10px]">
                                   {o?.items?.length}
                                </div>
                                <div>
                                   <p className="font-black text-gray-900 text-sm tracking-tight">#{o?._id?.slice(-8).toUpperCase()}</p>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(o?.createdAt).toLocaleDateString()}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-8">
                             <p className="font-black text-gray-800 text-sm">{o?.userId?.fullName || o?.userId?.username || 'Guest'}</p>
                             <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${o?.paymentMethod === 'cod' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'}`}>
                               {o?.paymentMethod || 'Paid'}
                             </span>
                          </td>
                          <td className="px-6 py-8">
                             <div className="max-w-[200px]">
                                <p className="text-xs font-bold text-gray-600 truncate">{o?.shippingAddress?.street}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{o?.shippingAddress?.city}</p>
                             </div>
                          </td>
                          <td className="px-6 py-8">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${o?.status === 'packed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse'}`}>
                               {o?.status}
                             </span>
                          </td>
                          <td className="px-6 py-8 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => setViewOrder(o)} className="p-3 bg-white border rounded-xl text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all" title="View Details"><Eye size={16}/></button>
                                {o?.status !== 'packed' && <button onClick={() => updateOrderStatus(o._id, 'packed')} className="p-3 bg-white border rounded-xl text-blue-500 hover:bg-blue-50 transition-all" title="Mark Packed"><CheckCircle2 size={16}/></button>}
                                <button onClick={() => handleShipNow(o)} className="bg-gray-900 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all">Ship Now</button>
                                <button onClick={() => updateOrderStatus(o._id, 'cancelled')} className="p-3 bg-white border rounded-xl text-red-500 hover:bg-red-50 transition-all" title="Cancel Order"><XCircle size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length === 0 && (
                    <div className="py-32 text-center">
                       <Package size={50} className="text-gray-100 mx-auto mb-6" />
                       <p className="text-gray-400 font-black italic uppercase tracking-[0.2em]">No orders awaiting dispatch</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="bg-white rounded-[2.5rem] border overflow-hidden shadow-sm">
             <div className="p-8 border-b bg-gray-50/30 flex items-center justify-between">
                <h3 className="font-black text-xs uppercase tracking-[0.3em]">Live Tracking Matrix</h3>
                <div className="flex gap-4">
                   <div className="bg-orange-50 text-orange-600 px-6 py-2 rounded-2xl font-black text-[10px] uppercase border border-orange-100">In Transit: {activeShipments.filter(s => s.status === 'shipped').length}</div>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b">
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order / Tracking ID</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Partner</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Status</th>
                      <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Last Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activeShipments.map(s => (
                      <tr key={s?._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-10 py-8">
                           <div className="space-y-2">
                              <input 
                                type="text" 
                                placeholder="SET TRACKING ID" 
                                defaultValue={s?.trackingNumber || ''} 
                                onBlur={(e) => updateTrackingDetails(s._id, 'trackingNumber', e.target.value)} 
                                className="bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase outline-none transition-all w-48" 
                              />
                              <p className="text-[10px] text-gray-400 font-bold uppercase ml-1">
                                Ref: #{s?.orderId ? s.orderId.toString().slice(-8).toUpperCase() : 'N/A'}
                              </p>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <select defaultValue={s?.carrier} onChange={(e) => updateTrackingDetails(s._id, 'carrier', e.target.value)} className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-3 text-xs font-black uppercase outline-none focus:border-orange-500">
                              <option value="Delhivery">Delhivery</option>
                              <option value="BlueDart">BlueDart</option>
                              <option value="Ecom Express">Ecom Express</option>
                              <option value="Internal">Internal Fleet</option>
                           </select>
                        </td>
                        <td className="px-10 py-8">
                           <select value={s?.status} onChange={(e) => updateTrackingDetails(s._id, 'status', e.target.value)} className={`text-[10px] font-black uppercase px-6 py-3 rounded-[1.5rem] border-none shadow-lg cursor-pointer ${s?.status === 'delivered' ? 'bg-green-600 text-white' : s?.status === 'shipped' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'}`}>
                              <option value="shipped">🚀 Shipped</option>
                              <option value="out_for_delivery">🏠 Out for Delivery</option>
                              <option value="delivered">✅ Delivered</option>
                              <option value="returned">❌ Returned</option>
                           </select>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <p className="text-[11px] font-black text-gray-900">{new Date(s?.updatedAt).toLocaleDateString()}</p>
                           <p className="text-[10px] text-gray-400 font-bold">{new Date(s?.updatedAt).toLocaleTimeString()}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activeShipments.length === 0 && (
                  <div className="py-32 text-center">
                    <Truck size={50} className="text-gray-100 mx-auto mb-6" />
                    <p className="text-gray-400 font-black italic uppercase tracking-[0.2em]">No active shipments to track</p>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Zones Tab */}
        {activeTab === 'zones' && (
          <div className="space-y-8">
             <div className="bg-white p-10 rounded-[3rem] border flex items-center justify-between shadow-sm">
                <div>
                   <h3 className="text-3xl font-black text-gray-900">Regional Coverage</h3>
                   <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Geo-Spatial Delivery Rules</p>
                </div>
                <button onClick={() => { setEditingZone(null); setZoneForm({ zoneName: '', regions: '', baseCharge: 0, freeShippingThreshold: 0, deliveryTime: '3-5 Days' }); setShowZoneModal(true); }} className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-orange-600 transition-all"><Plus size={20}/> New Region</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {zones.map(z => (
                  <div key={z?._id} className="bg-white p-12 rounded-[4rem] border-2 border-transparent hover:border-orange-500 shadow-sm transition-all group relative">
                     <div className="absolute top-10 right-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingZone(z); setZoneForm({ ...z, regions: z.regions.join(', ') }); setShowZoneModal(true); }} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit size={18}/></button>
                        <button onClick={() => { if(window.confirm('Delete?')) axiosInstance.delete(`/admin/shipping-rules/${z._id}`).then(fetchData) }} className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={18}/></button>
                     </div>
                     <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-10"><Globe size={40} /></div>
                     <h4 className="text-3xl font-black text-gray-900 mb-2">{z?.zoneName}</h4>
                     <p className="text-orange-600 text-[11px] font-black uppercase tracking-widest mb-8 flex items-center gap-2"><Clock size={14}/> {z?.deliveryTime} Transit</p>
                     <div className="flex flex-wrap gap-2 mb-10 min-h-[60px]">
                        {z?.regions?.map((r, i) => (
                          <span key={i} className="px-4 py-2 bg-gray-50 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest border">{r}</span>
                        ))}
                     </div>
                     <div className="pt-10 border-t flex justify-between items-end">
                        <div><p className="text-[10px] font-black text-gray-400 uppercase mb-2">Base Cost</p><p className="text-4xl font-black text-gray-900">₹{z?.baseCharge}</p></div>
                        <div className="text-right"><p className="text-[10px] font-black text-gray-400 uppercase mb-2">Free At</p><p className="text-sm font-black text-green-600 bg-green-50 px-4 py-1.5 rounded-xl border border-green-100">₹{z?.freeShippingThreshold}</p></div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Charges Tab */}
        {activeTab === 'charges' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-white p-14 rounded-[5rem] border shadow-xl shadow-gray-100/50 space-y-12">
                <div className="w-24 h-24 bg-gray-900 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl"><CreditCard size={44} /></div>
                <h3 className="text-4xl font-black text-gray-900">Global Pricing</h3>
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">Flat Shipping Cost (₹)</label>
                      <div className="flex gap-4">
                         <input type="number" value={settings.flatRate} onChange={(e) => setSettings({...settings, flatRate: e.target.value})} className="flex-1 px-8 py-6 bg-gray-50 border-none rounded-[2.5rem] font-black text-2xl outline-none" />
                         <button onClick={() => updateGlobalSetting('shipping_flat_rate', settings.flatRate)} className="bg-orange-600 text-white px-10 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl">Apply</button>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">COD Extra Surcharge (₹)</label>
                      <div className="flex gap-4">
                         <input type="number" value={settings.codCharges} onChange={(e) => setSettings({...settings, codCharges: e.target.value})} className="flex-1 px-8 py-6 bg-gray-50 border-none rounded-[2.5rem] font-black text-2xl outline-none" />
                         <button onClick={() => updateGlobalSetting('shipping_cod_charge', settings.codCharges)} className="bg-gray-900 text-white px-10 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl">Apply</button>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-14 rounded-[5rem] text-white shadow-2xl shadow-orange-200 space-y-12 relative overflow-hidden">
                <div className="w-24 h-24 bg-white text-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-xl relative z-10"><Zap size={44} /></div>
                <div className="relative z-10">
                   <h3 className="text-4xl font-black mb-4">Incentive Logic</h3>
                   <p className="text-orange-100 font-bold text-xs uppercase tracking-widest mb-12">Automated Free Shipping Thresholds</p>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-orange-200 uppercase tracking-widest ml-3">Waive Charges Above (₹)</label>
                      <div className="flex gap-4">
                         <input type="number" value={settings.freeThreshold} onChange={(e) => setSettings({...settings, freeThreshold: e.target.value})} className="flex-1 px-8 py-6 bg-white/10 border-2 border-white/20 rounded-[2.5rem] font-black text-white text-2xl outline-none focus:bg-white/20 transition-all" />
                         <button onClick={() => updateGlobalSetting('shipping_free_threshold', settings.freeThreshold)} className="bg-white text-orange-600 px-10 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">Save Rule</button>
                      </div>
                   </div>
                </div>
                <div className="p-8 bg-white/10 rounded-[3.5rem] border border-white/10 backdrop-blur-md relative z-10">
                   <div className="flex items-center gap-3 mb-3 text-orange-200 font-black uppercase text-[10px]"><AlertCircle size={20}/> Strategy Insight</div>
                   <p className="text-sm font-medium leading-relaxed italic text-white/90">Orders above ₹{settings.freeThreshold} typically convert 30% higher. Monitor performance weekly.</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[9999] flex items-center justify-center p-6">
           <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-12 border-b flex justify-between items-center bg-gray-50/50">
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-1">Order Summary</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">#{viewOrder._id.slice(-12).toUpperCase()}</p>
                 </div>
                 <button onClick={() => setViewOrder(null)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all"><XCircle size={24}/></button>
              </div>
              <div className="p-12 space-y-10">
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Customer Info</label>
                       <p className="font-black text-xl text-gray-900">{viewOrder.userId?.fullName || viewOrder.userId?.username}</p>
                       <p className="text-sm text-gray-500 font-medium">{viewOrder.userId?.email || 'No email provided'}</p>
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Delivery Target</label>
                       <p className="text-sm font-bold text-gray-700 leading-relaxed">{viewOrder.shippingAddress?.street}, {viewOrder.shippingAddress?.city}, {viewOrder.shippingAddress?.zipCode}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Products ({viewOrder.items?.length})</label>
                    <div className="space-y-3">
                       {viewOrder.items?.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <span className="text-sm font-black text-gray-900">{item.product?.name || 'Unknown Product'}</span>
                            <span className="text-xs font-bold text-orange-600">x{item.quantity}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex gap-4 pt-6">
                    <button className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3"><FileText size={18}/> Download Invoice</button>
                    <button onClick={() => setViewOrder(null)} className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Dismiss</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Zone Modal */}
      {showZoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-8">{editingZone ? 'Update Zone' : 'Establish Region'}</h2>
            <form onSubmit={saveZone} className="space-y-6">
              <input placeholder="Zone Name (e.g. West Coast)" className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-500 transition-all" value={zoneForm.zoneName} onChange={e => setZoneForm({...zoneForm, zoneName: e.target.value})} required />
              <textarea placeholder="Regions (comma separated)" className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-500 transition-all resize-none" rows="3" value={zoneForm.regions} onChange={e => setZoneForm({...zoneForm, regions: e.target.value})} required />
              <div className="grid grid-cols-2 gap-6">
                <input type="number" placeholder="Fee (₹)" className="px-8 py-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-500 transition-all" value={zoneForm.baseCharge} onChange={e => setZoneForm({...zoneForm, baseCharge: e.target.value})} required />
                <input type="text" placeholder="Time (e.g. 2-4 Days)" className="px-8 py-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-500 transition-all" value={zoneForm.deliveryTime} onChange={e => setZoneForm({...zoneForm, deliveryTime: e.target.value})} required />
              </div>
              <input type="number" placeholder="Free Shipping Above (₹)" className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-orange-500 transition-all" value={zoneForm.freeShippingThreshold} onChange={e => setZoneForm({...zoneForm, freeShippingThreshold: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all">Publish Rule</button>
                <button type="button" onClick={() => setShowZoneModal(false)} className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipping;
