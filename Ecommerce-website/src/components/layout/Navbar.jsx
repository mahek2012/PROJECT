import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    { name: 'Deals / Offer', path: '/products?deal=true' },
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
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={18} />
            </button>
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
                      to={`/products?category=${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
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
