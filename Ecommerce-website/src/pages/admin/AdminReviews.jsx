import { useState, useEffect } from 'react';
import { Star, Search, Trash2, CheckCircle, XCircle, User, Box, MessageSquare, AlertTriangle } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get('/admin/reviews');
      // The backend populate doesn't seem to be configured for generic routes, 
      // but we will render what we have nicely.
      setReviews(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id, status) => {
    try {
      await axiosInstance.put(`/admin/reviews/${id}`, { isApproved: status });
      toast.success(status ? 'Review approved & published ✅' : 'Review rejected/hidden ❌');
      fetchReviews();
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm('Delete this review permanently? This is useful for removing spam or fake reviews.')) {
      try {
        await axiosInstance.delete(`/admin/reviews/${id}`);
        toast.success('Fake/Spam review deleted');
        fetchReviews();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rating Monitoring Stats
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter(r => r.isApproved).length;
  const pendingCount = totalReviews - approvedCount;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Feedback</h1>
        <p className="text-gray-500 font-medium">Monitor ratings, moderate reviews, and maintain store reputation</p>
      </div>

      {/* Rating Monitoring Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Star size={24} className="fill-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{averageRating} <span className="text-sm text-gray-400">/ 5.0</span></p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Average Rating</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{totalReviews}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Reviews</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{approvedCount}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Approved & Live</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{pendingCount}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Pending Review</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/20 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search in customer comments..."
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
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer / Product</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Feedback</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReviews.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-black text-gray-900">
                        <User size={14} className="text-gray-400" />
                        User ID: {r.userId?.slice(-6).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Box size={12} />
                        Prod: {r.productId?.slice(-6).toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < r.rating ? "fill-orange-500 text-orange-500" : "fill-gray-100 text-gray-100"} />
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-sm text-gray-600 font-medium max-w-sm line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="px-10 py-6">
                    {r.isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                        <CheckCircle size={12} /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-gray-200">
                        <AlertTriangle size={12} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {r.isApproved ? (
                        <button 
                          onClick={() => approveReview(r._id, false)}
                          title="Reject / Hide Review"
                          className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      ) : (
                        <button 
                          onClick={() => approveReview(r._id, true)}
                          title="Approve / Publish Review"
                          className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}
                      
                      <button 
                        onClick={() => deleteReview(r._id)}
                        title="Delete Fake Review"
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReviews.length === 0 && !loading && (
            <div className="py-24 text-center">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-4"><MessageSquare size={40} /></div>
              <p className="text-gray-400 font-black text-xl italic">No reviews require moderation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;

