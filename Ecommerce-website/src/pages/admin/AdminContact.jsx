import { useState, useEffect } from 'react';
import { Search, Mail, User, Clock, CheckCircle, MessageSquare, Send, Eye, Trash2 } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/contact/all');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsSeen = async (id) => {
    try {
      await axiosInstance.put(`/contact/seen/${id}`);
      setMessages(messages.map(msg => msg._id === id ? { ...msg, status: 'seen' } : msg));
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'seen' });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsReplying(true);
    try {
      const response = await axiosInstance.put(`/contact/reply/${selectedMessage._id}`, {
        adminReply: replyText,
        status: 'replied'
      });
      
      if (response.data.success) {
        toast.success('Reply sent successfully!');
        setReplyText('');
        setMessages(messages.map(msg => 
          msg._id === selectedMessage._id ? response.data.data : msg
        ));
        setSelectedMessage(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'replied': return 'bg-green-100 text-green-700 border-green-200';
      case 'seen': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Support Inbox</h1>
          <p className="text-gray-500 font-medium text-lg">Manage user inquiries and respond to support tickets</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Messages List */}
        <div className="xl:col-span-1 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse space-y-3">
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-50 rounded w-3/4"></div>
                <div className="h-3 bg-gray-50 rounded w-1/4"></div>
              </div>
            ))
          ) : filteredMessages.length === 0 ? (
            <div className="bg-white p-12 rounded-[3rem] border border-dashed border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Mail size={32} />
              </div>
              <p className="text-gray-500 font-bold">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <motion.div
                layout
                key={msg._id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'pending') handleMarkAsSeen(msg._id);
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
                  selectedMessage?._id === msg._id 
                    ? 'bg-orange-50 border-orange-200 shadow-lg shadow-orange-100' 
                    : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <User size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 line-clamp-1">{msg.name}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{msg.subject}</h4>
                <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{msg.message}</p>
                
                {selectedMessage?._id === msg._id && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"
                  />
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Message Details & Reply Section */}
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/30">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedMessage.status)}`}>
                          {selectedMessage.status}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock size={12} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h2 className="text-3xl font-black text-gray-900">{selectedMessage.subject}</h2>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mb-8">
                    <div className="flex items-center gap-4 border-r border-gray-100 pr-6">
                      <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                        <User size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sender Name</p>
                        <p className="font-black text-gray-900 text-lg">{selectedMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                        <Mail size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                        <p className="font-bold text-gray-900 text-lg">{selectedMessage.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <MessageSquare size={14} /> Message Content
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  {selectedMessage.status === 'replied' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                          <CheckCircle className="text-green-500" /> Admin Reply Sent
                        </h3>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {selectedMessage.repliedAt ? new Date(selectedMessage.repliedAt).toLocaleString() : ''}
                        </span>
                      </div>
                      <div className="p-8 bg-green-50/50 border border-green-100 rounded-3xl relative">
                        <div className="absolute -top-3 left-8 px-4 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-green-200">
                          Official Response
                        </div>
                        <p className="text-green-900 font-medium leading-relaxed italic">
                          "{selectedMessage.adminReply}"
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = { ...selectedMessage, status: 'seen' };
                          setSelectedMessage(updated);
                        }}
                        className="text-orange-500 font-black text-sm hover:underline"
                      >
                        Edit Reply
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleReply} className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Write your response</label>
                        <textarea
                          required
                          rows="6"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply here... The user will see this in their dashboard."
                          className="w-full bg-gray-50 border-none rounded-3xl p-8 focus:ring-4 focus:ring-orange-500/10 focus:bg-white outline-none transition-all text-gray-700 font-medium resize-none shadow-inner"
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isReplying || !replyText.trim()}
                          className="px-10 py-5 bg-gray-900 hover:bg-orange-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-gray-200 hover:shadow-orange-200 flex items-center gap-3 disabled:opacity-50"
                        >
                          {isReplying ? 'Sending...' : 'Send Reply'}
                          <Send size={20} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50/50 rounded-[4rem] border-4 border-dashed border-gray-100 text-center p-12">
                <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center mb-8 text-gray-200">
                  <Eye size={64} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Select a message</h3>
                <p className="text-gray-500 max-w-sm font-medium text-lg leading-relaxed">
                  Choose an inquiry from the inbox to view full details and send a response.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
