"use client";

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { LuUsers, LuShirt, LuShoppingCart, LuTrendingUp, LuStore, LuUser, LuCheck } from 'react-icons/lu';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';

const StatCard = ({ title, value, icon, gradient, delay }: { title: string; value: string; icon: React.ReactNode; gradient: string; delay: string }) => (
  <div className={`relative overflow-hidden bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100/50 group hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 fill-mode-both ${delay}`}>
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${gradient} opacity-[0.03] group-hover:scale-150 transition-transform duration-700`}></div>

    <div className="relative flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white text-2xl shadow-lg ring-[6px] ring-white group-hover:rotate-12 transition-all duration-500`}>
        {icon}
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2">
      <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
        <LuTrendingUp className="mr-1" /> +12.5%
      </span>
      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">vs last month</span>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchDashboardData = async () => {
      try {
        const isAdmin = JSON.parse(storedUser || '{}').role === 'admin';
        const statsRes = isAdmin ? await api.get('/admin/stats') : null;
        if (statsRes) setStats(statsRes.data.data);

        const ordersRes = await api.get('/orders');
        setRecentOrders(ordersRes.data.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-black text-blue-600 text-xs uppercase animate-pulse">Sync</div>
      </div>
    </div>
  );

  const isAdmin = user?.role === 'admin';

  const chartData = stats?.revenueTrends?.length > 0 ? stats.revenueTrends : [
    { _id: 'Mon', total: 4000 },
    { _id: 'Tue', total: 5500 },
    { _id: 'Wed', total: 4800 },
    { _id: 'Thu', total: 8000 },
    { _id: 'Fri', total: 11000 },
    { _id: 'Sat', total: 9500 },
    { _id: 'Sun', total: 14000 },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-5xl font-black text-gray-900 tracking-tightest leading-none">
            {isAdmin ? 'PLATFORM HQ' : 'SHOP HUB'}
          </h2>
          <p className="text-gray-400 mt-2 font-bold uppercase tracking-[0.25em] text-xs">
            Welcome back, <span className="text-blue-600 underline decoration-4 underline-offset-4">{user?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">System Cloud: Connected</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {isAdmin ? (
          <>
            <StatCard title="Total Garments" value={stats?.totalVendors?.toString() || '0'} icon={<LuStore />} gradient="from-blue-600 to-cyan-500" delay="delay-0" />
            <StatCard title="Product Pulse" value={stats?.totalProducts?.toString() || '0'} icon={<LuShirt />} gradient="from-indigo-600 to-blue-500" delay="delay-100" />
            <StatCard title="Order Stream" value={stats?.totalOrders?.toString() || '0'} icon={<LuShoppingCart />} gradient="from-rose-600 to-pink-500" delay="delay-200" />
            <StatCard title="Revenue (LKR)" value={stats?.totalRevenue?.toLocaleString() || '0'} icon={<LuTrendingUp />} gradient="from-emerald-600 to-teal-500" delay="delay-300" />
          </>
        ) : (
          <>
            <StatCard title="Active Orders" value={recentOrders.length.toString()} icon={<LuShoppingCart />} gradient="from-blue-600 to-cyan-500" delay="delay-0" />
            <StatCard title="Inventory" value="Verified" icon={<LuShirt />} gradient="from-emerald-600 to-teal-500" delay="delay-100" />
            <StatCard title="Verification" value={user?.garmentDetails?.isApproved ? 'LIVE' : 'PENDING'} icon={<LuCheck />} gradient="from-indigo-600 to-blue-500" delay="delay-200" />
            <StatCard title="Shop Earning" value="0.00" icon={<LuTrendingUp />} gradient="from-rose-600 to-pink-500" delay="delay-300" />
          </>
        )}
      </div>

      {/* Charts Section */}
      {isAdmin && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100/40 border border-gray-100/50">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Financial Velocity</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Real-time revenue stream (LKR)</p>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 900 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 900 }} dx={-10} />
                  <Tooltip
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 900 }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100/40 border border-gray-100/50">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">Trend Leaders</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-10">Top Performing Categories</p>

            <div className="space-y-8">
              {[
                { name: "Men's Casual", value: 85, color: "bg-blue-600" },
                { name: "Evening Wear", value: 72, color: "bg-indigo-600" },
                { name: "Summer Kits", value: 45, color: "bg-rose-500" },
                { name: "Work Wear", value: 30, color: "bg-emerald-500" }
              ].map((item) => (
                <div key={item.name} className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="text-gray-400">{item.value}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10">
              <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-relaxed">
                  "Platform growth is currently exceeding 24% month-over-month. Focus on vendor onboarding."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-100/40 border border-gray-100/50 overflow-hidden">
        <div className="p-10 flex justify-between items-center border-b border-gray-50">
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Pulse Feed</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Live Transaction Stream</p>
          </div>
          <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200">
            View Full Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em]">
              <tr>
                <th className="px-10 py-6">Identity</th>
                <th className="px-10 py-6">Authority</th>
                <th className="px-10 py-6">Valuation</th>
                <th className="px-10 py-6">State</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-bold">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-10 py-20 text-center text-gray-300 italic font-medium">Silent Stream. No transactions detected.</td></tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-7">
                      <div className="text-blue-600 font-black text-xs">#RD-{order._id.slice(-6).toUpperCase()}</div>
                      <div className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-10 py-7 text-gray-800 text-sm tracking-tight">{order.customer?.name || 'Verified Buyer'}</td>
                    <td className="px-10 py-7 text-emerald-600 font-black">LKR {order.totalPrice?.toLocaleString()}</td>
                    <td className="px-10 py-7">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${order.orderItems?.[0]?.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                        {order.orderItems?.[0]?.status || 'In-Flow'}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4 hover:text-gray-900 transition-colors">Observe</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}