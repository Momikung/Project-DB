"use client";
import React, { useMemo } from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { Activity, ShoppingCart, Users, Package } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1f2128] border border-gray-700 p-2 rounded text-xs text-gray-200 shadow-xl">
        <p className="font-bold mb-1">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashBoardPage({ setCurrentPage, user, onLogout }: any) {
  const { stats, trendsMonth, trendsDay, inventory, topProducts, fulfilment, levelData } = useDashboard();

  // --- MAP REAL DB DATA TO CHARTS ---
  const visitorData = useMemo(() => {
    return (trendsMonth || []).slice(-12).map((t: any) => ({
      name: t.name.split(' ')[0], // 'Jan 24' -> 'Jan'
      visitors: t.users || 0
    }));
  }, [trendsMonth]);

  const fulfilmentData = useMemo(() => {
    return (fulfilment || []).map((t: any) => ({
      name: `Day ${t.day}`,
      'This Month': t.this_month || 0,
      'Last Month': t.last_month || 0
    }));
  }, [fulfilment]);

  const levelChartData = useMemo(() => {
    return (levelData || []).map((t: any) => ({
      name: t.name,
      volume: t.volume || 0,
      service: t.service || 0
    }));
  }, [levelData]);

  const mappedTopProducts = useMemo(() => {
    const colors = [
      { pop: 'bg-orange-400', sale: 'bg-orange-400/20 text-orange-400 border-orange-400/30' },
      { pop: 'bg-teal-400', sale: 'bg-teal-400/20 text-teal-400 border-teal-400/30' },
      { pop: 'bg-blue-400', sale: 'bg-blue-400/20 text-blue-400 border-blue-400/30' },
      { pop: 'bg-pink-400', sale: 'bg-pink-400/20 text-pink-400 border-pink-400/30' },
      { pop: 'bg-emerald-400', sale: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30' }
    ];
    
    // Find max revenue to calculate popularity percentage
    const maxRev = topProducts && topProducts.length ? Math.max(...topProducts.map((p: any) => parseFloat(p.total_revenue) || 0)) : 1;

    return (topProducts || []).map((p: any, idx: number) => {
      const rev = parseFloat(p.total_revenue) || 0;
      const popularity = Math.min(100, Math.max(10, (rev / (maxRev || 1)) * 100));
      return {
        id: `0${idx + 1}`.slice(-2),
        name: p.name,
        popularity: popularity,
        popColor: colors[idx % colors.length].pop,
        sales: p.revenue_formatted,
        salesColor: colors[idx % colors.length].sale
      };
    });
  }, [topProducts]);

  const mappedInventory = useMemo(() => {
    return (inventory || []).map((i: any) => ({
      name: i.name,
      stock: i.total,
      lowStock: (i.short || 0) + (i.low || 0)
    }));
  }, [inventory]);

  const inventoryShareData = useMemo(() => {
    const colors = ['#3B82F6', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];
    return (inventory || []).slice(0, 4).map((i: any, idx: number) => ({
      name: i.name,
      value: i.total || 0,
      color: colors[idx % colors.length]
    }));
  }, [inventory]);

  // Calculate percentage for gauges based on total revenue and users
  // Setting arbitrary goals for demonstration
  const revenueGoal = 50000; // $50,000 target
  const currentRev = stats?.total_revenue || 0;
  const revPct = Math.min(100, Math.round((currentRev / revenueGoal) * 100)) || 0;
  const gaugeData1 = [
    { name: 'Revenue', value: revPct, fill: '#34D399' },
    { name: 'Remaining', value: 100 - revPct, fill: '#374151' }
  ];

  const usersGoal = 1000;
  const currentUsers = stats?.total_users || 0;
  const userPct = Math.min(100, Math.round((currentUsers / usersGoal) * 100)) || 0;
  const gaugeData2 = [
    { name: 'Users', value: userPct, fill: '#F472B6' },
    { name: 'Remaining', value: 100 - userPct, fill: '#374151' }
  ];

  return (
    <div className="flex min-h-screen bg-[#151521] text-gray-200 font-sans">
      <Sidebar currentPage="dashboard" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <Header user={user} onLogout={onLogout} title="Dashboard Overview" subtitle="" hideSubtitle />

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard 
            title="Total Sales" 
            value={stats?.total_revenue !== undefined ? `$${stats.total_revenue.toLocaleString()}` : "$0"} 
            color="bg-indigo-500" 
            icon={<Activity size={24} className="text-white" />} 
          />
          <StatCard 
            title="Total Orders" 
            value={stats?.total_orders !== undefined ? stats.total_orders.toLocaleString() : "0"} 
            color="bg-blue-500" 
            icon={<ShoppingCart size={24} className="text-white" />} 
          />
          <StatCard 
            title="Total Users" 
            value={stats?.total_users !== undefined ? stats.total_users.toLocaleString() : "0"} 
            color="bg-yellow-500" 
            icon={<Users size={24} className="text-white" />} 
          />
          <StatCard 
            title="Low Stock Items" 
            value={stats?.low_stock !== undefined ? stats.low_stock.toLocaleString() : "0"} 
            color="bg-red-500" 
            icon={<Package size={24} className="text-white" />} 
          />
        </div>

        {/* Charts Grid Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Visitor Insights - Span 2 */}
          <div className="lg:col-span-2 bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Visitor Insights</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span className="text-gray-400">Monthly Visitors</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Fulfilment - Span 1 */}
          <div className="bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5 flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Customer Fulfilment</h3>
                <p className="text-[10px] text-gray-500 mt-1">Measured by completed orders per day</p>
            </div>
            <div className="flex-1 min-h-[160px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fulfilmentData}>
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="This Month" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Last Month" stroke="#EC4899" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-auto border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> This Month
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span> Last Month
              </div>
            </div>
          </div>

          {/* Level - Span 1 */}
          <div className="bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5 flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Level</h3>
                <p className="text-[10px] text-gray-500 mt-1">Sales Volume vs Service Rating (by Category)</p>
            </div>
            <div className="flex-1 min-h-[160px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelChartData}>
                  <XAxis dataKey="name" hide />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="volume" name="Order Volume" fill="#34D399" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="service" name="Service Points" fill="#4B5563" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs text-gray-400 mt-auto border-t border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34D399]"></span> Volume
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4B5563]"></span> Service
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Top Products - Span 2 */}
          <div className="lg:col-span-2 bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-6">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-sm border-b border-gray-800">
                    <th className="pb-4 font-normal">#</th>
                    <th className="pb-4 font-normal">Name</th>
                    <th className="pb-4 font-normal">Popularity</th>
                    <th className="pb-4 font-normal text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedTopProducts.map((product: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-800/50 last:border-0">
                      <td className="py-4 text-sm text-gray-400">{product.id}</td>
                      <td className="py-4 text-sm text-gray-200 truncate max-w-[150px] pr-4">{product.name}</td>
                      <td className="py-4 w-1/3">
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${product.popColor}`} style={{ width: `${product.popularity}%` }}></div>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`px-2 py-1 text-xs rounded border ${product.salesColor} whitespace-nowrap`}>{product.sales}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Earnings Cards - Span 1 */}
          <div className="grid grid-rows-2 gap-6">
            <div className="bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5 flex flex-col items-center relative overflow-hidden">
              <div className="w-full mb-2">
                <h3 className="text-sm font-semibold text-white">Earnings Goal</h3>
                <p className="text-xs text-gray-400">Target $50K</p>
                <p className="text-xl font-bold text-green-400 mt-2">${currentRev.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 mt-1">Based on total revenue</p>
              </div>
              <div className="h-24 w-full flex justify-center mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gaugeData1} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={45} outerRadius={55} paddingAngle={0} dataKey="value" stroke="none">
                      {gaugeData1.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center font-bold text-white text-lg">{revPct}%</div>
            </div>

            <div className="bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5 flex flex-col items-center relative overflow-hidden">
              <div className="w-full mb-2">
                <h3 className="text-sm font-semibold text-white">Users Target</h3>
                <p className="text-xs text-gray-400">Target 1,000</p>
                <p className="text-xl font-bold text-pink-400 mt-2">{currentUsers.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500 mt-1">Based on total users</p>
              </div>
              <div className="h-24 w-full flex justify-center mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gaugeData2} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={45} outerRadius={55} paddingAngle={0} dataKey="value" stroke="none">
                      {gaugeData2.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center font-bold text-white text-lg">{userPct}%</div>
            </div>
          </div>

          {/* Demographics & Inventory - Span 1 */}
          <div className="grid grid-rows-2 gap-6">
            <div className="bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-4">Inventory Share</h3>
              <div className="flex items-center h-32">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={inventoryShareData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none">
                        {inventoryShareData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 flex flex-col gap-2 justify-center pl-2">
                  {inventoryShareData.map((demo: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-400 truncate">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: demo.color }}></span>
                      <span className="truncate">{demo.name} ({demo.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#20202A] rounded-2xl p-6 shadow-lg border border-white/5 flex flex-col">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Inventory Status</h3>
                <p className="text-[10px] text-gray-500 mt-1">Comparing total stock vs low stock items</p>
              </div>
              <div className="flex-1 min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mappedInventory} layout="vertical" margin={{top: 0, right: 0, left: -20, bottom: 0}}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 10}} width={80} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                    <Bar dataKey="stock" name="Total Stock" fill="#34D399" barSize={8} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="lowStock" name="Low Stock" fill="#F87171" barSize={8} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const StatCard = ({ title, value, color, icon }: any) => (
  <div className={`p-6 rounded-2xl flex items-center gap-4 ${color} shadow-lg shadow-black/20 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm z-10">
      {icon}
    </div>
    <div className="z-10">
      <h4 className="text-sm font-semibold opacity-90">{title}</h4>
      <p className="text-2xl font-bold mt-1 tracking-tight">{value}</p>
    </div>
    {/* Decorative background element */}
    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
  </div>
);