"use client";
import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { User, Package, TrendingUp, ChevronRight, X, ArrowUpRight, ArrowDownRight, MousePointer2, FileSpreadsheet, Filter, Lightbulb, Loader2, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Brush } from 'recharts';
import { useReport } from '../../hooks/useReport';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#F43F5E'];

export default function ReportPage({ setCurrentPage, user, onLogout }: any) {
  const {
    reportData,
    isLoading,
    zoomRange,
    setZoomRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    filteredTrends,
    applyCustomDates,
    applyQuickRange,
    distributionData
  } = useReport();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const categoryDetails = React.useMemo(() => {
    if (!selectedCategory || !reportData?.top_products) return [];
    return reportData.top_products.slice(0, 5); 
  }, [selectedCategory, reportData]);

  const exportToCSV = () => {
    if (!reportData?.trends_month) return;
    const headers = ["Year", "Month", "Full_Date", "Revenue_USD", "Order_Count", "User_Acquisition", "Avg_Order_Value"];
    const rows = reportData.trends_month.map((t: any) => {
        const date = new Date(t.full_date);
        const aov = t.orders > 0 ? (t.revenue / t.orders).toFixed(2) : "0.00";
        return [date.getFullYear(), date.getMonth() + 1, t.full_date, (t.revenue || 0).toFixed(2), (t.orders || 0), (t.users || 0), aov];
    });
    const csvContent = "data:text/csv;charset=utf-8," + "Report: Global Performance Intelligence\n" + `Export Date: ${new Date().toLocaleString()}\n\n` + headers.join(",") + "\n" + rows.map((e: any) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Statistical_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return (
    <div className="flex h-screen bg-[#050507] items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin" size={48} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050507] text-gray-200">
      <Sidebar currentPage="reports" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1800px] mx-auto w-full">
        <Header user={user} onLogout={onLogout} title="Neural Analytics" subtitle="Contextual Intelligence Hub" accentColor="indigo-500" />

        <div className="flex flex-wrap items-center gap-6 mb-8 bg-[#0D0D12] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 px-4">
                <div className="p-3.5 bg-indigo-500/10 rounded-2xl text-indigo-500 border border-indigo-500/20"><Filter size={22}/></div>
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Global Slicer</h3>
                    <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">Intelligence Parameters</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4 bg-black/40 p-3 rounded-2xl border border-white/5">
                <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="bg-transparent text-xs font-black text-gray-300 outline-none uppercase px-2" />
                <span className="text-gray-600 font-black">TO</span>
                <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="bg-transparent text-xs font-black text-gray-300 outline-none uppercase px-2" />
                <button onClick={applyCustomDates} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"><ChevronRight size={16} /></button>
            </div>

            <div className="flex gap-3 border-l border-white/5 pl-8">
                {['3Y', '1Y', '6M', '3M'].map((p: string) => (
                    <button key={p} onClick={() => applyQuickRange(p === '3Y' ? 36 : p === '1Y' ? 12 : p === '6M' ? 6 : 3)} className="px-6 py-3 rounded-xl text-xs font-black text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 uppercase tracking-widest transition-all">{p}</button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <MetricCluster title="Revenue Engine" valuePrefix="$" color="#6366F1" icon={<TrendingUp size={24}/>} data={filteredTrends} dataKey="revenue" range={zoomRange} setRange={setZoomRange} onInsight={() => setActiveInsight('revenue')} />
          <MetricCluster title="Order Flow" color="#10B981" icon={<MousePointer2 size={24}/>} data={filteredTrends} dataKey="orders" range={zoomRange} setRange={setZoomRange} onInsight={() => setActiveInsight('orders')} />
          <MetricCluster title="User Reach" color="#F59E0B" icon={<User size={24}/>} data={filteredTrends} dataKey="users" range={zoomRange} setRange={setZoomRange} onInsight={() => setActiveInsight('users')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-8 bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <div><h3 className="text-2xl font-black text-white uppercase tracking-tight">Inventory <span className="text-indigo-500">Distribution Mix</span></h3><p className="text-xs text-gray-600 font-bold uppercase mt-1">Cross-category health profiling</p></div>
                <button onClick={exportToCSV} className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30"><FileSpreadsheet size={18} /> EXPORT STATISTICAL CSV</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={distributionData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" onClick={(d: any) => setSelectedCategory(d.name)} cursor="pointer">
                                {distributionData.map((_: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" className="hover:opacity-80 transition-opacity" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: '#0D0D12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem'}} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                    {distributionData.slice(0, 5).map((item: any, index: number) => (
                        <div key={index} onClick={() => setSelectedCategory(item.name)} className={`flex justify-between items-center p-5 rounded-2xl border transition-all cursor-pointer ${selectedCategory === item.name ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                            <div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div><span className="text-xs font-black text-white uppercase tracking-widest">{item.name}</span></div>
                            <div className="flex items-center gap-6">{item.alerts > 0 && <span className="text-[10px] font-black text-rose-500 uppercase">{item.alerts} Alerts</span>}<span className="text-sm font-black text-gray-500 font-mono">{Math.round((item.value / (distributionData.reduce((acc: number, curr: any) => acc + curr.value, 0) || 1)) * 100)}%</span></div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
             <div className="bg-gradient-to-br from-rose-600/10 to-transparent border border-rose-500/10 p-10 rounded-[3.5rem] flex flex-col justify-between h-52 group hover:border-rose-500/30 transition-all cursor-pointer shadow-lg shadow-rose-900/5" onClick={() => setCurrentPage('products')}>
                <div className="flex justify-between items-start"><div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500 shadow-inner"><Package size={28}/></div><span className="text-xs font-black bg-rose-500 text-white px-4 py-1.5 rounded-full uppercase tracking-widest">Inventory Risk</span></div>
                <div><p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Critical Restock</p><h4 className="text-4xl font-black text-white">{reportData?.stats?.low_stock || "0"} <span className="text-sm text-gray-600 uppercase font-bold">Assets</span></h4></div>
             </div>

             <div className={`flex-1 bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-10 shadow-2xl transition-all ${selectedCategory ? 'opacity-100 scale-100' : 'opacity-40 grayscale scale-[0.98]'}`}>
                <div className="flex justify-between items-center mb-8"><div><h4 className="text-sm font-black text-white uppercase tracking-widest">{selectedCategory || 'Drill-down'}</h4><p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Asset Intelligence</p></div>{selectedCategory && <button onClick={() => setSelectedCategory(null)} className="text-gray-600 hover:text-white"><X size={22}/></button>}</div>
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedCategory ? categoryDetails.map((p: any, i: number) => (
                        <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center hover:border-indigo-500/20 transition-all"><span className="text-xs font-black text-gray-300 uppercase truncate max-w-[160px]">{p.name}</span><span className="text-sm font-black text-emerald-500 font-mono">{p.revenue_formatted}</span></div>
                    )) : <p className="text-center py-12 text-xs text-gray-700 font-black uppercase">No Data Selected</p>}
                </div>
             </div>
          </div>
        </div>

        <ReportTable title="High Velocity Assets" data={reportData?.top_products || []} />
      </main>

      {activeInsight && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0D0D12] border border-white/10 rounded-[3.5rem] p-12 max-w-lg w-full shadow-2xl relative">
                    <button onClick={() => setActiveInsight(null)} className="absolute top-10 right-10 text-gray-600 hover:text-white"><X size={28}/></button>
                    <div className="flex items-center gap-6 mb-10">
                        <div className="p-5 bg-indigo-500/10 rounded-2xl text-indigo-500"><Lightbulb size={40}/></div>
                        <div><h4 className="text-2xl font-black text-white uppercase tracking-tight">Neural Insight</h4><p className="text-xs text-gray-600 font-bold uppercase">Asset AI Intelligence</p></div>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed mb-12 font-medium italic border-l-4 border-indigo-500 pl-8">
                        "Your current {activeInsight} momentum is exhibiting a healthy growth pattern within this timeframe. Continue optimizing flow for 15% valuation increase."
                    </p>
                    <button onClick={() => setActiveInsight(null)} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-gray-200 transition-all shadow-xl shadow-white/5">Acknowledge</button>
                </div>
            </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .recharts-brush-slide { fill: rgba(255,255,255,0.05) !important; }
        .recharts-brush-traveller rect { fill: #FFF !important; rx: 2; }
        .recharts-brush-texts text { fill: #FFF !important; font-weight: 800; font-size: 11px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>
    </div>
  );
}

const MetricCluster = ({ title, color, icon, data, dataKey, valuePrefix = "", range, setRange, onInsight }: any) => {
    const stats = React.useMemo(() => {
        if (!data || data.length === 0) return { current: 0, momentum: { val: 0, up: true } };
        const visibleData = data.slice(range.start, range.end + 1);
        if (visibleData.length < 2) return { current: visibleData[0]?.[dataKey] || 0, momentum: { val: "0.0", up: true } };
        const latestIdx = visibleData.length - 1;
        const current = visibleData[latestIdx][dataKey] || 0;
        const prev = visibleData[latestIdx - 1][dataKey] || 0;
        const change = prev === 0 ? (current > 0 ? 100 : 0) : ((current - prev) / prev) * 100;
        return { current, momentum: { val: Math.abs(change).toFixed(1), up: change >= 0 } };
    }, [data, dataKey, range]);

    return (
        <div className="flex flex-col gap-5 group">
            <div className={`bg-[#0D0D12] border border-white/5 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between group-hover:border-white/10 transition-all`}>
                <div className="flex items-center gap-6">
                    <div onClick={onInsight} className="p-4 bg-white/5 rounded-2xl shadow-inner cursor-pointer hover:bg-white/10 border border-white/10 transition-all text-white" style={{borderColor: `${color}40`}}>{icon}</div>
                    <div>
                        <p className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-1">{title}</p>
                        <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{valuePrefix}{stats.current.toLocaleString()}</h4>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-gray-700 uppercase mb-1">Momentum</p>
                    <div className={`flex items-center gap-1 font-black text-sm ${stats.momentum.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stats.momentum.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {stats.momentum.up ? '+' : '-'}{stats.momentum.val}%
                    </div>
                </div>
            </div>

            <div className="bg-[#0D0D12] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden h-72 group-hover:border-white/10 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10" style={{backgroundColor: `${color}10`}}></div>
                <div className="h-full w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ bottom: 20 }}>
                            <defs><linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.2}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(255,255,255,0.02)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10, fontWeight: 700}} dy={10} interval={2} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 10, fontWeight: 700}} width={40} />
                            <Tooltip contentStyle={{backgroundColor: '#0D0D12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem'}} />
                            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={4} fill={`url(#grad-${dataKey})`} />
                            <Brush dataKey="name" height={15} stroke="#FFF" fill="transparent" strokeWidth={1} y={230} startIndex={range.start} endIndex={range.end} onChange={(r: any) => setRange({start: r.startIndex, end: r.endIndex})} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const ReportTable = ({ title, data }: any) => (
    <div className="bg-[#0D0D12] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-12 border-b border-white/5 flex justify-between items-center"><h3 className="text-base font-black text-white uppercase tracking-[0.2em]">{title}</h3><Zap size={24} className="text-indigo-500" /></div>
        <table className="w-full text-left">
            <thead>
                <tr className="bg-black/20 text-gray-500 text-xs font-black uppercase tracking-[0.2em]"><th className="px-12 py-8">Asset Profile</th><th className="px-12 py-8">Unit Price</th><th className="px-12 py-8">Gross Yield</th><th className="px-12 py-8 text-right pr-12">Network Nodes</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {data.map((row: any, i: number) => (
                    <tr key={i} className="text-gray-400 text-sm hover:bg-white/[0.02] transition-colors group">
                        <td className="px-12 py-8 font-black text-white uppercase text-base">{row.name}</td>
                        <td className="px-12 py-8 font-mono">{row.price_formatted}</td>
                        <td className="px-12 py-8 font-black text-emerald-500 font-mono text-lg">{row.revenue_formatted}</td>
                        <td className="px-12 py-8 text-right pr-12 font-black text-indigo-400 text-xs uppercase tracking-widest">{row.users} ACTIVE</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);