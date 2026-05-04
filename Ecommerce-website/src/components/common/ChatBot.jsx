import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Minus, Bot, User, ShoppingBag, Search, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../services/api/axiosInstance';
import { Link } from 'react-router-dom';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: "Hi! I'm ShopVerse AI. How can I help you today? Try asking for 'Shoes under 500' or check your order status.", type: 'text' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(`session_${Math.random().toString(36).substr(2, 9)}`);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { sender: 'user', text: message, type: 'text' };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/bot/chat', { message, sessionId });
            if (res.data?.success) {
                setChatHistory(prev => [...prev, {
                    sender: 'bot',
                    text: res.data.reply.text,
                    type: res.data.reply.type,
                    metadata: res.data.reply.metadata
                }]);
            }
        } catch (err) {
            setChatHistory(prev => [...prev, {
                sender: 'bot',
                text: "I'm having a bit of trouble connecting. Please try again later.",
                type: 'text'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white w-[350px] sm:w-[400px] h-[500px] rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">ShopVerse AI</h3>
                                    <span className="flex items-center gap-1 text-[10px] text-green-400">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Online Assistant
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <Minus size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                            {chatHistory.map((chat, idx) => (
                                <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] space-y-2`}>
                                        <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm ${chat.sender === 'user'
                                                ? 'bg-orange-500 text-white rounded-tr-none'
                                                : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                                            }`}>
                                            {chat.text}
                                        </div>

                                        {/* Product Recommendations */}
                                        {chat.type === 'product' && chat.metadata?.products && (
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {chat.metadata.products.map(p => (
                                                    <Link key={p.id} to={`/product/${p.id}`} className="bg-white p-2 rounded-xl border border-gray-100 hover:shadow-md transition-all group">
                                                        <img src={p.image} alt={p.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                                                        <p className="text-[10px] font-bold text-gray-900 truncate">{p.name}</p>
                                                        <p className="text-[10px] font-black text-orange-600">${p.price}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* Order Status Badge */}
                                        {chat.type === 'order_status' && (
                                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-2 rounded-lg text-xs font-bold border border-blue-100 mt-2">
                                                <Package size={14} /> Status Tracked Successfully
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask me something..."
                                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || isLoading}
                                className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-500 transition-all disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${isOpen && !isMinimized ? 'bg-white text-gray-900 border border-gray-100' : 'bg-gray-900 text-white'
                    }`}
            >
                {isOpen && !isMinimized ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white animate-bounce"></span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
