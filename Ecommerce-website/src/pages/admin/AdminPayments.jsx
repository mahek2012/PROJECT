import { useState, useEffect } from 'react';
import { CreditCard, Search, CheckCircle, XCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get('/admin/payments');
      setPayments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updatePaymentStatus = async (paymentId, newStatus) => {
    if (window.confirm(`Are you sure you want to mark this payment as ${newStatus}?`)) {
      try {
        await axiosInstance.put(`/admin/payments/${paymentId}`, { status: newStatus });
        toast.success(`Payment marked as ${newStatus}`);
        fetchPayments();
      } catch (error) {
        toast.error('Failed to update payment status');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      case 'pending': return <Clock size={16} className="text-orange-500" />;
      case 'refunded': return <RotateCcw size={16} className="text-blue-500" />;
      default: return null;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'failed': return 'bg-red-50 text-red-600 border-red-100';
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'refunded': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const filteredPayments = payments.filter(p => 
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financials</h1>
        <p className="text-gray-500 font-medium">Monitor all transactions, payment methods, and process refunds</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/20">
          <div className="relative max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Transaction ID or Order ID..."
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
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <span className="font-black text-gray-900 text-sm block truncate max-w-[150px]">{p.transactionId || 'Awaiting ID'}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xs font-black text-gray-500 uppercase">#{p.orderId?.slice(-8)}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-black text-gray-900 text-base">₹{p.amount}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.method}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border ${getStatusClasses(p.status)}`}>
                      {getStatusIcon(p.status)}
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {p.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.status === 'pending' && (
                        <button 
                          onClick={() => updatePaymentStatus(p._id, 'completed')}
                          className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={14} /> Mark Paid
                        </button>
                      )}
                      {(p.status === 'completed' || p.status === 'pending') && (
                        <button 
                          onClick={() => updatePaymentStatus(p._id, 'failed')}
                          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <XCircle size={14} /> Mark Failed
                        </button>
                      )}
                      {p.status === 'completed' && (
                        <button 
                          onClick={() => updatePaymentStatus(p._id, 'refunded')}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <RotateCcw size={14} /> Process Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPayments.length === 0 && !loading && (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4"><AlertTriangle size={40} /></div>
              <p className="text-gray-400 font-black text-xl italic">No transactions recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;

