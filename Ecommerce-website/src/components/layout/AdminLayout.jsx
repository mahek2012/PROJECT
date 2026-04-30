import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Truck, 
  Star, 
  Gift, 
  BarChart3, 
  Settings, 
  Bell, 
  Menu, 
  X,
  Search,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <ShoppingBag size={20} />, label: 'Products', path: '/admin/products' },
    { icon: <Layers size={20} />, label: 'Categories', path: '/admin/categories' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <CreditCard size={20} />, label: 'Payments', path: '/admin/payments' },
    { icon: <Truck size={20} />, label: 'Shipping', path: '/admin/shipping' },
    { icon: <Star size={20} />, label: 'Reviews', path: '/admin/reviews' },
    { icon: <Gift size={20} />, label: 'Offers', path: '/admin/offers' },
    { icon: <BarChart3 size={20} />, label: 'Reports', path: '/admin/reports' },
    { icon: <Bell size={20} />, label: 'Notifications', path: '/admin/notifications' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-gray-800">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
              <ShoppingBag className="text-white" size={24} />
            </div>
            {isSidebarOpen && (
              <span className="ml-3 text-xl font-black tracking-tight whitespace-nowrap">
                SHOP<span className="text-orange-500">ADMIN</span>
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
            <div className="px-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-xl transition-all group ${
                    location.pathname === item.path 
                      ? 'bg-orange-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className={`${location.pathname === item.path ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className="ml-4 font-bold text-sm">{item.label}</span>
                  )}
                  {isSidebarOpen && location.pathname === item.path && (
                    <ChevronRight size={16} className="ml-auto opacity-50" />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          {/* Bottom Profile Section */}
          <div className="p-4 border-t border-gray-800">
            <button 
              onClick={() => dispatch(logout())}
              className="w-full flex items-center p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-4 font-bold text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500 w-64"
              />
            </div>
            
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-px h-8 bg-gray-100"></div>

            <Link to="/admin/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-2xl transition-all group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{user?.role === 'admin' ? 'Admin' : user?.username}</p>
                <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest leading-none">Control Center</p>
              </div>
              <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-100 group-hover:scale-105 transition-transform">
                {user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
