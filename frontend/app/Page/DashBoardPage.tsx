"use client";
import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, ReferenceDot } from 'recharts';
import { TrendingUp, Package, UserPlus, AlertCircle, X, Target, ArrowRightLeft, ArrowUpRight, ArrowDownRight, ChevronRight, Activity, BarChart3, Zap, Lightbulb } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

export default function DashBoardPage({ setCurrentPage, user, onLogout }: any) {
  const {
    stats,
    recentOrders,
    activeMetric,
    setActiveMetric,
    granularity,
    setGranularity,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    comparisonPoints,
    setComparisonPoints,
    filteredTrends,
    handleApplyFilter,
    applyQuickRange,
    config
  } = useDashboard();

  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-[#050507] text-gray-200">
      <Sidebar currentPage="dashboard" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1700px] mx-auto w-full">
        <Header user={user} onLogout={onLogout} title="Command Center" subtitle="Neural Dashboard Intelligence" accentColor="indigo-500" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <MetricOrbiter 
                title="Total Revenue" 
                value={stats?.total_revenue !== undefined ? `$${stats.total_revenue.toLocaleString()}` : "$0"} 
                color="#6366F1" 
                icon={<TrendingUp size={24}/>} 
                active={activeMetric === 'revenue'}
                onClick={() => setActiveMetric('revenue')}
                onInsight={() => setActiveInsight('Revenue')}
            />
            <MetricOrbiter 
                title="Total Orders" 
                value={stats?.total_orders !== undefined ? stats.total_orders.toLocaleString() : "0"} 
                color="#10B981" 
                icon={<Package size={24}/>} 
                active={activeMetric === 'orders'}
                onClick={() => setActiveMetric('orders')}
                onInsight={() => setActiveInsight('Orders')}
            />
            <MetricOrbiter 
                title="Active Nodes" 
                value={stats?.total_users !== undefined ? stats.total_users.toLocaleString() : "0"} 
                color="#F59E0B" 
                icon={<UserPlus size={24}/>} 
                active={activeMetric === 'users'}
                onClick={() => setActiveMetric('users')}
                onInsight={() => setActiveInsight('Users')}
            />
            <div className="bg-gradient-to-br from-rose-600/10 to-transparent border border-rose-500/10 p-8 rounded-[2.5rem] flex flex-col justify-between h-44 group hover:border-rose-500/30 transition-all cursor-pointer shadow-lg shadow-rose-900/5" onClick={() => setCurrentPage('products')}>
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500 shadow-inner"><AlertCircle size={24}/></div>
                    <span className="text-[10px] font-black bg-rose-500 text-white px-3 py-1 rounded-full uppercase tracking-widest">Critical Alert</span>
                </div>
                <div>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Low Stock Assets</p>
                    <h4 className="text-3xl font-black text-white">{stats?.low_stock || "0"}</h4>
                </div>
            </div>
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-6 mb-10 shadow-2xl flex flex-wrap lg:flex-nowrap items-center gap-6">
            <div className="flex bg-black/40 p-2 rounded-2xl border border-white/5 gap-1">
                {[{ label: '1Y', m: 12 }, { label: '6M', m: 6 }, { label: '3M', m: 3 }].map((p: any) => (
                    <button key={p.label} onClick={() => applyQuickRange(p.m)} className="px-6 py-2.5 rounded-xl text-xs font-black text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">{p.label}</button>
                ))}
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-2.5 rounded-2xl border border-white/5">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-xs font-black text-gray-400 outline-none uppercase px-2" />
                <span className="text-gray-700 font-black">TO</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-xs font-black text-gray-400 outline-none uppercase px-2" />
                <button onClick={handleApplyFilter} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20"><ChevronRight size={16} /></button>
            </div>
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 ml-auto">
                <button onClick={() => setGranularity('month')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${granularity === 'month' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}>
                    <Activity size={16} /> MONTHLY
                </button>
                <button onClick={() => setGranularity('day')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${granularity === 'day' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-white'}`}>
                    <BarChart3 size={16} /> DAILY
                </button>
            </div>
        </div>

        {comparisonPoints.length === 2 && (
            <div className="mb-10 bg-gradient-to-r from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-[3rem] p-10 flex flex-wrap justify-between items-center text-white backdrop-blur-xl animate-in zoom-in duration-500 shadow-2xl">
                <div className="flex items-center gap-16">
                    <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-indigo-400 mb-2 tracking-widest">{comparisonPoints[0].name}</span><span className="text-4xl font-black">{activeMetric === 'revenue' ? `$${comparisonPoints[0][config.key].toLocaleString()}` : comparisonPoints[0][config.key]}</span></div>
                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><ArrowRightLeft size={24} className="text-gray-500" /></div>
                    <div className="flex flex-col"><span className="text-[10px] font-bold uppercase text-emerald-400 mb-2 tracking-widest">{comparisonPoints[1].name}</span><span className="text-4xl font-black">{activeMetric === 'revenue' ? `$${comparisonPoints[1][config.key].toLocaleString()}` : comparisonPoints[1][config.key]}</span></div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right"><p className="text-xs font-black uppercase text-gray-500 mb-1">Quantum Shift</p><p className={`text-5xl font-black ${((comparisonPoints[1][config.key] - comparisonPoints[0][config.key]) / (comparisonPoints[0][config.key] || 1) * 100) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{((comparisonPoints[1][config.key] - comparisonPoints[0][config.key]) / (comparisonPoints[0][config.key] || 1) * 100).toFixed(1)}%</p></div>
                    <div className={`p-5 rounded-2xl ${((comparisonPoints[1][config.key] - comparisonPoints[0][config.key]) / (comparisonPoints[0][config.key] || 1) * 100) >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{(comparisonPoints[1][config.key] - comparisonPoints[0][config.key]) >= 0 ? <ArrowUpRight size={40} strokeWidth={3} /> : <ArrowDownRight size={40} strokeWidth={3} />}</div>
                    <button onClick={() => setComparisonPoints([])} className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/5 ml-6"><X size={20} className="text-gray-400" /></button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 blur-[120px] -z-10" style={{backgroundColor: `${config.color}10`}}></div>
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{config.label} <span className="text-indigo-500">Dynamics</span></h3>
                        <p className="text-xs text-gray-600 font-bold uppercase mt-1 flex items-center gap-2"><Target size={14} className="text-indigo-500" /> Interaction Mode Active</p>
                    </div>
                </div>
                <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={filteredTrends} onClick={(d: any) => d?.activePayload && setComparisonPoints(p => p.length >= 2 ? [d.activePayload[0].payload] : [...p, d.activePayload[0].payload])}>
                            <defs><linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={config.color} stopOpacity={0.3}/><stop offset="100%" stopColor={config.color} stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10, fontWeight: 700}} interval="preserveStartEnd" minTickGap={30} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10, fontWeight: 700}} width={45} />
                            <Tooltip contentStyle={{backgroundColor: '#050507', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', padding: '1.5rem'}} itemStyle={{fontWeight: 900}} cursor={{stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2}} />
                            <Area type="monotone" dataKey={config.key} stroke={config.color} strokeWidth={5} fill="url(#mainGrad)" />
                            {comparisonPoints.map((p: any, idx: number) => (
                                <React.Fragment key={idx}>
                                    <ReferenceLine x={p.name} stroke={idx === 0 ? "#6366F1" : "#F59E0B"} strokeDasharray="6 6" strokeWidth={2} />
                                    <ReferenceDot x={p.name} y={p[config.key]} r={10} fill={idx === 0 ? "#6366F1" : "#F59E0B"} stroke="#FFF" strokeWidth={3} />
                                </React.Fragment>
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] -z-10" style={{backgroundColor: `${config.color}05`}}></div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-10">Flow <span className="text-indigo-500">Density</span></h3>
                <div className="h-[450px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredTrends}>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10, fontWeight: 700}} dy={10} interval="preserveStartEnd" minTickGap={30} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10, fontWeight: 700}} width={45} />
                            <Bar dataKey={config.key} fill={config.color} radius={[12, 12, 0, 0]} barSize={24} opacity={0.3} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-base font-black text-white uppercase tracking-[0.2em]">Neural Activity Stream</h3>
            <Zap size={24} className="text-indigo-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] bg-black/20">
                        <th className="px-12 py-8">Reference ID</th>
                        <th className="px-12 py-8">Entity Name</th>
                        <th className="px-12 py-8">Status Node</th>
                        <th className="px-12 py-8 text-right pr-12">Flow Yield (USD)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {recentOrders.map((order: any) => (
                        <tr key={order.order_id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="px-12 py-7 font-mono text-sm text-indigo-500/80 tracking-tighter">#{order.order_id.toString().padStart(6, '0')}</td>
                            <td className="px-12 py-7 font-black text-white text-base uppercase">{order.shipping_name}</td>
                            <td className="px-12 py-7">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${order.order_status === 'shipped' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-amber-500 shadow-lg shadow-amber-500/50'}`}></div>
                                    <span className="text-xs font-black uppercase text-gray-400">{order.order_status}</span>
                                </div>
                            </td>
                            <td className="px-12 py-7 font-black text-white text-right pr-12 font-mono text-lg">${order.total_price.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>

        {activeInsight && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0D0D12] border border-white/10 rounded-[3.5rem] p-12 max-w-lg w-full shadow-2xl relative">
                    <button onClick={() => setActiveInsight(null)} className="absolute top-10 right-10 text-gray-600 hover:text-white"><X size={28}/></button>
                    <div className="flex items-center gap-6 mb-10">
                        <div className="p-5 bg-indigo-500/10 rounded-2xl text-indigo-500"><Lightbulb size={40}/></div>
                        <div><h4 className="text-2xl font-black text-white uppercase tracking-tight">System Insight</h4><p className="text-xs text-gray-600 font-bold uppercase">Dashboard Intelligence</p></div>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed mb-12 font-medium italic border-l-4 border-indigo-500 pl-8">
                        "Your global {activeInsight} yield is exhibiting strong resonance within the current timeframe. Real-time monitoring shows no significant disruption nodes."
                    </p>
                    <button onClick={() => setActiveInsight(null)} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">Acknowledge Stream</button>
                </div>
            </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>
    </div>
  );
}

const MetricOrbiter = ({ title, value, color, icon, active, onClick, onInsight }: any) => (
  <div onClick={onClick} className={`bg-[#0D0D12] border ${active ? 'border-white/20 ring-1 ring-white/10 shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]' : 'border-white/5 opacity-70 hover:opacity-100'} p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between h-48 cursor-pointer transition-all duration-500 group relative overflow-hidden`}>
    <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 group-hover:opacity-100 opacity-0 transition-opacity" style={{backgroundColor: `${color}20`}}></div>
    <div className="flex justify-between items-start">
        <div onClick={(e) => { e.stopPropagation(); onInsight(); }} className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-inner border border-white/5" style={{color: active ? color : undefined}}>{icon}</div>
        {active && <div className="text-[9px] font-black uppercase text-indigo-500 tracking-tighter bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 animate-pulse">Primary Context</div>}
    </div>
    <div>
        <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-4xl font-black text-white tracking-tighter leading-none">{value}</h4>
    </div>
  </div>
);