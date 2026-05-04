import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Search, Bot, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';

const AdminChat = () => {
    const [chats, setChats] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'General' });
    const [activeTab, setActiveTab] = useState('faqs'); // 'history' or 'faqs'
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [chatRes, faqRes] = await Promise.all([
                axiosInstance.get('/bot/history'),
                axiosInstance.get('/faqs')
            ]);
            setChats(chatRes.data.chats);
            setFaqs(faqRes.data);
        } catch (err) {
            toast.error('Failed to fetch chat data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddFaq = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/faqs/add', newFaq);
            toast.success('FAQ added successfully');
            setNewFaq({ question: '', answer: '', category: 'General' });
            fetchData();
        } catch (err) {
            toast.error('Failed to add FAQ');
        }
    };

    const handleDeleteFaq = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            await axiosInstance.delete(`/faqs/${id}`);
            toast.success('FAQ deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete FAQ');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-2">AI Chatbot Management</h1>
                <p className="text-gray-500 font-medium">Manage bot knowledge and monitor customer interactions</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 bg-gray-100 p-2 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('faqs')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'faqs' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Knowledge Base (FAQs)
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Chat History
                </button>
            </div>

            {activeTab === 'faqs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Add FAQ Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50 sticky top-28">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <Plus className="text-orange-500" /> Add New Knowledge
                            </h3>
                            <form onSubmit={handleAddFaq} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Question / Trigger</label>
                                    <input
                                        required
                                        type="text"
                                        value={newFaq.question}
                                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                                        placeholder="e.g. Return Policy"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Bot Response</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={newFaq.answer}
                                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                                        placeholder="Enter the answer the bot should give"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-orange-500 transition-all">
                                    Save to AI Brain
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ List */}
                    <div className="lg:col-span-2 space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq._id} className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm flex items-start justify-between group">
                                <div className="space-y-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-widest">{faq.category}</span>
                                    <h4 className="font-bold text-gray-900">Q: {faq.question}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">A: {faq.answer}</p>
                                </div>
                                <button onClick={() => handleDeleteFaq(faq._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {chats.map((chat) => (
                        <div key={chat._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 p-6 flex items-center justify-between border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{chat.userId?.fullname || 'Guest Session'}</h4>
                                        <p className="text-xs text-gray-500">{chat.userId?.email || chat.sessionId}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={12} /> {new Date(chat.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 max-h-[300px] overflow-y-auto space-y-4 bg-gray-50/30">
                                {chat.messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.sender === 'user' ? 'bg-orange-100 text-orange-900' : 'bg-white border border-gray-100 text-gray-600'}`}>
                                            <span className="block text-[10px] font-black uppercase tracking-tighter mb-1 opacity-50">{msg.sender}</span>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminChat;
