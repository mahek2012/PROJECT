import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Users, DollarSign, TrendingUp, 
  Package, BarChart3, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { fetchAllUsers } from '../../redux/slices/authSlice';
import axiosInstance from '../../services/api/axiosInstance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, pagination } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.orders);
  const { allUsers } = useSelector((state) => state.auth);

  const [dbStats, setDbStats] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
    dispatch(fetchOrders());
    dispatch(fetchAllUsers());

    const fetchDbStats = async () => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        if (response.data.success) setDbStats(response.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchDbStats();
  }, [dispatch]);


  const lowStockCount = products?.filter(p => p.stock !== undefined ? p.stock < 10 : false).length || 0;

  const stats = [
    { label: 'Total Revenue', value: `$${dbStats?.totalRevenue || 0}`, icon: <DollarSign />, color: 'bg-green-500', trend: '+12.5%' },
    { label: 'Total Orders', value: dbStats?.totalOrders || 0, icon: <ShoppingBag />, color: 'bg-blue-500', trend: '+8.2%' },
    { label: 'Total Products', value: dbStats?.totalProducts || pagination?.totalProducts || products?.length || 0, icon: <Package />, color: 'bg-orange-500', trend: '+2.4%' },
    { label: 'Active Users', value: dbStats?.totalUsers || allUsers?.length || 0, icon: <Users />, color: 'bg-purple-500', trend: '+15.3%' },
    { label: 'Low Stock Alert', value: `${lowStockCount} Items`, icon: <AlertCircle size={20} />, color: 'bg-red-500', trend: 'Critical' },
  ];


  const recentOrders = orders?.slice(0, 5).map(o => ({
    id: o._id ? `#${o._id.toString().slice(-6)}` : '#...',
    customer: o.user?.username || 'User',
    product: o.items?.[0]?.name || 'Various Items',
    amount: `$${o.totalbill || 0}`,
    status: o.status || 'Pending',
    date: new Date(o.createdAt).toLocaleDateString()
  })) || [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Control Room</h1>
          <p className="text-gray-500 font-medium text-lg">System Overview & Real-time Analytics</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-gray-900 uppercase">System Live</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index} 
            className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-default group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                stat.label === 'Low Stock Alert' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sales Graph */}
        <section className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="text-orange-600" /> Revenue Performance
            </h2>
            <select className="bg-gray-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-orange-500">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dbStats?.salesData || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#ea580c' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ea580c" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Insights / Categories */}
        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BarChart3 className="text-orange-600" /> Category Share
          </h3>
          <div className="space-y-6">
            {[
              { name: 'Electronics', percentage: 75, color: 'bg-blue-500', icon: <Package size={14}/> },
              { name: 'Fashion', percentage: 45, color: 'bg-orange-500', icon: <Package size={14}/> },
              { name: 'Beauty', percentage: 30, color: 'bg-pink-500', icon: <Package size={14}/> },
              { name: 'Groceries', percentage: 20, color: 'bg-green-500', icon: <Package size={14}/> },
            ].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="flex items-center gap-2">{cat.icon} {cat.name}</span>
                  <span className="text-gray-400">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-orange-50 rounded-[2rem] border border-orange-100">
            <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-1">Stock status</p>
            <p className="text-sm font-bold text-gray-700">You have {lowStockCount} items with low inventory levels.</p>
            <Link to="/admin/products" className="inline-block mt-4 text-xs font-black text-orange-600 hover:underline">Restock Now &rarr;</Link>
          </div>
        </section>
      </div>

      {/* Recent Activity Table */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-orange-600" /> Recent Transactions
          </h2>
          <Link to="/admin/orders" className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all">View All Orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
                        {order.customer.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-gray-900">{order.amount}</td>
                  <td className="px-8 py-5 text-xs text-gray-400 font-bold">{order.date}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-gray-400 font-bold">No recent orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};


export default AdminDashboard;
