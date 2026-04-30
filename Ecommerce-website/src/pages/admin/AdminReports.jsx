import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Package, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/api/axiosInstance';
import { toast } from 'react-toastify';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#ea580c', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#eab308'];

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        setStats(response.data.stats);
      } catch (error) {
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const kpiData = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: <ShoppingBag size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Products', value: stats.totalProducts.toLocaleString(), icon: <Package size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Business Reports</h1>
        <p className="text-gray-500 font-medium">Dynamic analytics and performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{kpi.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Forecast Graph */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Revenue Trends</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Last 6 Months</p>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 900, color: '#111827' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-gray-900">Category Distribution</h3>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">By Product Count</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] relative">
            {stats.categoryPerformance && stats.categoryPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryPerformance}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.categoryPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 font-bold">No categories found</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
             {stats.categoryPerformance?.slice(0, 4).map((c, i) => (
               <div key={i} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                 <span className="text-[10px] font-black text-gray-600 uppercase truncate">{c.name} ({c.value})</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900">User Growth</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Registrations / Month</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Users size={20} />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Top Rated Products</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Best performers</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <Star size={20} className="fill-purple-600" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{product.title}</h4>
                    <p className="text-xs text-gray-500 font-medium truncate">{product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-900">₹{product.price}</p>
                    <div className="flex items-center gap-1 justify-end text-orange-500 text-xs font-bold">
                      <Star size={12} className="fill-orange-500" /> {product.rating?.rate || 'N/A'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 font-bold">No products data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
