import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, ChevronDown, LayoutDashboard, Bell, CheckCircle2, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { logout } from '../../redux/slices/authSlice';
import { fetchCart } from '../../redux/slices/cartSlice';
import { fetchWishlist } from '../../redux/slices/wishlistSlice';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';

import axiosInstance from '../../services/api/axiosInstance';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      dispatch(fetchNotifications());

      // AI Polling: Check for new notifications every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [dispatch, token]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          console.log('Fetching suggestions for:', searchQuery);
          const res = await axiosInstance.get(`/products/smart-search?q=${searchQuery}`);
          if (res.data?.success) {
            console.log('Suggestions received:', res.data.products.length);
            setSuggestions(res.data.products.slice(0, 5));
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error('Search API failed:', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Categories', path: '#', hasDropdown: true },
    { name: 'Deals / Offer', path: '/offers' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    'Electronics', 'Fashion', 'Mobile & Accessories', 'Groceries', 'Gaming', 'Books', 'Home & Decor', 'Beauty'
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#ff6b01] text-white text-center py-2 text-xs font-black uppercase tracking-widest">
        Free shipping on orders over $500! 🚚
      </div>

      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#ff6b01] rounded-lg flex items-center justify-center">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">
              SHOP<span className="text-[#ff6b01]">VERSE</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-12 relative">
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full bg-[#f1f3f5] border-none rounded-lg py-2.5 pl-5 pr-12 focus:ring-2 focus:ring-[#ff6b01] outline-none text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={18} />
            </button>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Suggestions</span>
                  <span className="text-[10px] font-bold text-orange-600">{suggestions.length} products found</span>
                </div>
                {suggestions.map((p) => (
                  <Link 
                    key={p._id} 
                    to={`/product/${p._id}`}
                    className="flex items-center gap-4 p-4 hover:bg-orange-50 transition-all border-b border-gray-50 last:border-0 group"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <img src={p.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-600 transition-colors">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{p.category} • {p.brand}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-900">${p.price}</span>
                      {p.discount > 0 && (
                        <p className="text-[10px] text-green-600 font-bold">-{p.discount}%</p>
                      )}
                    </div>
                  </Link>
                ))}
                <button 
                  onClick={() => navigate(`/products?search=${searchQuery}`)}
                  className="w-full p-4 bg-gray-900 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all"
                >
                  View All Results
                </button>
              </div>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link to="/wishlist" className="relative text-gray-600 hover:text-[#ff6b01] transition-colors">
              <Heart size={22} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff6b01] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsDropdownOpen(false);
                }}
                className={`relative text-gray-600 hover:text-[#ff6b01] transition-colors ${unreadCount > 0 ? 'animate-bounce-subtle' : ''}`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                  <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      Notifications <Sparkles size={14} className="text-orange-500" />
                    </h3>
                    <button 
                      onClick={() => dispatch(markAllAsRead())}
                      className="text-[10px] font-black text-orange-600 uppercase tracking-tighter hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id}
                          onClick={() => {
                            dispatch(markAsRead(notif._id));
                            if (notif.link) navigate(notif.link);
                            setIsNotifOpen(false);
                          }}
                          className={`p-5 border-b border-gray-50 hover:bg-orange-50 transition-all cursor-pointer flex gap-4 ${!notif.isRead ? 'bg-orange-50/30' : ''}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === 'price_drop' ? 'bg-green-100 text-green-600' :
                            notif.type === 'stock_alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {notif.type === 'price_drop' ? <CheckCircle2 size={18} /> :
                             notif.type === 'stock_alert' ? <AlertTriangle size={18} /> : <Info size={18} />}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 leading-tight mb-1">{notif.title}</p>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{notif.message}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-3">
                          <Bell size={24} />
                        </div>
                        <p className="text-xs text-gray-400 font-bold italic">No new notifications</p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to="/profile" 
                    className="block w-full p-4 bg-gray-50 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all"
                    onClick={() => setIsNotifOpen(false)}
                  >
                    View All Activity
                  </Link>
                </div>
              )}
            </div>

            <Link to="/cart" className="relative text-gray-600 hover:text-[#ff6b01] transition-colors">
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff6b01] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <div className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 bg-[#fff4eb] py-1.5 px-3 rounded-full border border-[#ffe0cc]"
                  >
                    <div className="w-8 h-8 bg-[#ff6b01] rounded-full flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-black text-gray-800">
                      {user.role === 'admin' ? 'Admin' : user.username}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff6b01]" onClick={() => setIsDropdownOpen(false)}>
                        <User size={18} /> My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#ff6b01] hover:bg-orange-50" onClick={() => setIsDropdownOpen(false)}>
                          <LayoutDashboard size={18} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-gray-50 mt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50">
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="bg-[#ff6b01] text-white px-6 py-2 rounded-lg font-bold text-sm">Login</Link>
              )}
            </div>

            <button className="md:hidden text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Bottom Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-10 py-3 border-t border-gray-50">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              {link.hasDropdown ? (
                <button 
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="flex items-center gap-1 text-[11px] font-black text-gray-700 hover:text-[#ff6b01] uppercase tracking-widest transition-colors"
                >
                  {link.name} <ChevronDown size={12} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link 
                  to={link.path} 
                  className="text-[11px] font-black text-gray-700 hover:text-[#ff6b01] uppercase tracking-widest transition-colors"
                >
                  {link.name}
                </Link>
              )}

              {link.hasDropdown && isCategoriesOpen && (
                <div 
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                  className="absolute left-0 mt-0 w-56 bg-white shadow-2xl border border-gray-100 py-4 rounded-xl z-50 animate-in fade-in slide-in-from-top-2"
                >
                  {categories.map((cat) => (
                    <Link 
                      key={cat}
                      to={`/category/${encodeURIComponent(cat)}`}
                      className="block px-6 py-2.5 text-xs font-bold text-gray-600 hover:text-[#ff6b01] hover:bg-orange-50 transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className="block py-2 text-sm font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
