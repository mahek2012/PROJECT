import { useState, useEffect } from 'react';
import { 
  CreditCard, Search, CheckCircle, XCircle, Clock, RotateCcw, 
  AlertTriangle, Filter, Download, BarChart3, TrendingUp, DollarSign,
  ShieldCheck, Smartphone, Landmark, ToggleLeft, ToggleRight
} from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminPayments = () => {
  const [activeTab, setActiveTab] = useState('transactions'); // transactions, refunds, methods, reports
  const [payments, setPayments] = useState([]);
  const [methods, setMethods] = useState([]);
  const [stats, setStats] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, methodsRes, statsRes] = await Promise.all([
        axiosInstance.get('/admin/payments'),
        axiosInstance.get('/admin/payment-methods'),
        axiosInstance.get('/admin/stats')
      ]);
      setPayments(paymentsRes.data.data || []);
      setMethods(methodsRes.data.data || []);
      setStats(statsRes.data.stats || null);
    } catch (error) {
      toast.error('Failed to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePaymentStatus = async (paymentId, newStatus, reason = '') => {
    try {
      await axiosInstance.put(`/admin/payments/${paymentId}`, { 
        status: newStatus,
        refundReason: reason 
      });
      toast.success(`Payment marked as ${newStatus}`);
      fetchData();
      setShowRefundModal(false);
      setRefundReason('');
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const openRefundModal = (payment) => {
    setSelectedPayment(payment);
    setShowRefundModal(true);
  };

  const handleRefundSubmit = () => {
    if (!refundReason.trim()) return toast.warn('Please provide a reason for refund');
    updatePaymentStatus(selectedPayment._id, 'refunded', refundReason);
  };

  const toggleMethod = async (method) => {

    try {
      await axiosInstance.put(`/admin/payment-methods/${method._id}`, { isEnabled: !method.isEnabled });
      toast.success(`${method.name} ${!method.isEnabled ? 'Enabled' : 'Disabled'}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update method');
    }
  };

  const filteredPayments = payments.filter(p => {
    const s = searchTerm.toLowerCase();
    const transId = p.transactionId?.toLowerCase() || '';
    const orderIdStr = (typeof p.orderId === 'string' ? p.orderId : p.orderId?._id)?.toLowerCase() || '';
    const userName = (p.userId?.fullName || p.userId?.username || '').toLowerCase();
    const userEmail = p.userId?.email?.toLowerCase() || '';
    
    return transId.includes(s) || orderIdStr.includes(s) || userName.includes(s) || userEmail.includes(s);
  });

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'failed': return 'bg-red-50 text-red-600 border-red-100';
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'refunded': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header with Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financials</h1>
          <p className="text-gray-500 font-medium">Revenue, Transactions & Payment Control</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-blue-50">
          {[
            { id: 'transactions', label: 'Transactions', icon: <CreditCard size={14}/> },
            { id: 'refunds', label: 'Refunds', icon: <RotateCcw size={14}/> },
            { id: 'methods', label: 'Methods', icon: <ShieldCheck size={14}/> },
            { id: 'reports', label: 'Reports', icon: <BarChart3 size={14}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search Transaction, Order or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
              <Download size={16}/> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map((p) => (
                  <tr key={p?._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <span className="font-black text-gray-900 text-sm block truncate max-w-[150px]">{p.transactionId || 'TXN-AWAITING'}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-xs font-black text-gray-500 uppercase">
                        #{typeof p.orderId === 'string' ? p.orderId?.slice(-8) : p.orderId?._id?.slice(-8) || 'N/A'}
                      </span>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                        {p.userId?.fullName || p.userId?.username || 'Guest User'}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-black text-gray-900 text-base">₹{p.amount || 0}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.method || 'N/A'}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border ${getStatusClasses(p.status)}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {p.status || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(p.status === 'pending' || !p.status) && (
                          <button onClick={() => updatePaymentStatus(p._id, 'completed')} className="p-2 hover:bg-green-50 text-green-600 rounded-lg" title="Approve"><CheckCircle size={18}/></button>
                        )}
                        {p.status !== 'refunded' && (
                          <button onClick={() => openRefundModal(p)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Refund"><RotateCcw size={18}/></button>
                        )}
                        <button onClick={() => updatePaymentStatus(p._id, 'failed')} className="p-2 hover:bg-red-50 text-red-600 rounded-lg" title="Mark Failed"><XCircle size={18}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPayments.length === 0 && (
              <div className="py-20 text-center text-gray-400 font-bold italic">No transactions found</div>
            )}
          </div>
        </div>
      )}


      {/* Refunds Tab */}
      {activeTab === 'refunds' && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/20 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">Processed Refunds</h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">History of all returned payments</p>
            </div>
            <div className="flex bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl gap-3 items-center">
              <RotateCcw size={18}/>
              <span className="text-sm font-black uppercase tracking-widest">Total Refunded: {payments.filter(p => p.status === 'refunded').length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Refund Reason</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.filter(p => p.status === 'refunded').map((p) => (
                  <tr key={p?._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                          <RotateCcw size={20} />
                        </div>
                        <div>
                          <span className="font-black text-gray-900 text-sm block truncate max-w-[150px]">{p.transactionId || 'TXN-OLD'}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-xs font-black text-gray-500 uppercase">
                        #{typeof p.orderId === 'string' ? p.orderId?.slice(-8) : p.orderId?._id?.slice(-8) || 'N/A'}
                      </span>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                        {p.userId?.fullName || p.userId?.username || 'Guest User'}
                      </p>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-black text-red-600 text-base">₹{p.amount || 0}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.method || 'N/A'}</span>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs text-gray-600 font-medium italic line-clamp-1 max-w-[200px]" title={p.refundReason}>
                         "{p.refundReason || 'No reason provided'}"
                       </p>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button 
                         onClick={() => { setSelectedPayment(p); setShowRefundModal(true); setRefundReason(p.refundReason || ''); }}
                         className="px-4 py-2 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                       >
                         Edit Reason
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payments.filter(p => p.status === 'refunded').length === 0 && (
              <div className="py-24 text-center">
                 <RotateCcw size={48} className="text-gray-100 mx-auto mb-4" />
                 <p className="text-gray-400 font-bold italic">No refunds processed yet</p>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Methods Tab */}
      {activeTab === 'methods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { id: 'upi', name: 'UPI Payment', icon: <Smartphone size={28}/>, color: 'text-purple-600', bg: 'bg-purple-50' },
             { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard size={28}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
             { id: 'cod', name: 'Cash on Delivery', icon: <Landmark size={28}/>, color: 'text-orange-600', bg: 'bg-orange-50' }
           ].map(item => {
             const method = methods.find(m => m.code === item.id) || { isEnabled: true };
             return (
               <div key={item.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-8">
                     <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                        {item.icon}
                     </div>
                     <button onClick={() => toggleMethod(method)} className="transition-transform active:scale-95">
                        {method.isEnabled ? <ToggleRight size={44} className="text-green-500"/> : <ToggleLeft size={44} className="text-gray-300"/>}
                     </button>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    Allow customers to pay using {item.name}. Status: <span className={method.isEnabled ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>{method.isEnabled ? 'ACTIVE' : 'INACTIVE'}</span>
                  </p>
               </div>
             )
           })}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && stats && (
        <div className="space-y-8">
           {/* Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={20}/>, color: 'bg-green-500' },
                { label: 'Total Orders', value: stats.totalOrders, icon: <TrendingUp size={20}/>, color: 'bg-blue-500' },
                { label: 'Avg. Order Value', value: `₹${Math.round(stats.totalRevenue / (stats.totalOrders || 1))}`, icon: <BarChart3 size={20}/>, color: 'bg-purple-500' },
                { label: 'Success Rate', value: '98.5%', icon: <ShieldCheck size={20}/>, color: 'bg-orange-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-gray-100`}>
                      {stat.icon}
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
                </div>
              ))}
           </div>

           {/* Chart */}
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xl font-black text-gray-900">Revenue Overview</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Last 6 Months performance</p>
                 </div>
                 <select className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                 </select>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px' }}
                       labelStyle={{ fontWeight: 900, fontSize: '12px', marginBottom: '5px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      )}


      {/* Refund Reason Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900">Refund Process</h3>
              <button 
                onClick={() => setShowRefundModal(false)}
                className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Why are you refunding this?</label>
                <textarea 
                  rows="4"
                  placeholder="e.g., Product out of stock, Customer request, Quality issue..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRefundSubmit}
                  className="flex-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-100 transition-all"
                >
                  Confirm Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;



