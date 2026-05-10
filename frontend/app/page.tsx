'use client';

import { useDashboard } from '../hooks/useDashboard';

export default function Home() {
  const { stats, recentOrders, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Admin Dashboard Overview
          </h1>
          <p className="text-slate-400">Welcome back, here's what's happening with your store today.</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            Error loading dashboard: {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Revenue" value={`฿${stats?.revenue.toLocaleString()}`} icon="💰" color="blue" />
          <StatCard title="Total Orders" value={stats?.orders || 0} icon="📦" color="emerald" />
          <StatCard title="Total Products" value={stats?.products || 0} icon="🏷️" color="amber" />
          <StatCard title="Total Users" value={stats?.users || 0} icon="👥" color="purple" />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All Orders</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">#ORD-{order.order_id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{order.shipping_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold">฿{order.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-3xl p-6 shadow-sm`}>
      <div className="text-2xl mb-4">{icon}</div>
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'delivered': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'processing': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'pending': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'cancelled': return 'bg-red-500/10 text-red-400 border border-red-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}
