"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { ShoppingCart, Clock, Truck, XCircle, Search, Eye, Filter, Calendar, DollarSign, Zap, ArrowUpRight } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';

export default function OrderPage({ setCurrentPage, user, onLogout }: any) {
  const {
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    showAdvancedFilters,
    setShowAdvancedFilters,
    filteredOrders,
    clearAllFilters
  } = useOrders();

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'shipped' || s === 'delivered') 
        return <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span className="text-xs font-black uppercase text-emerald-500 tracking-widest">Shipped</span></div>;
    if (s === 'pending' || s === 'processing') 
        return <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div><span className="text-xs font-black uppercase text-amber-500 tracking-widest">Pending</span></div>;
    return <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div><span className="text-xs font-black uppercase text-rose-500 tracking-widest">Cancelled</span></div>;
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-gray-200">
      <Sidebar currentPage="orders" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1750px] mx-auto w-full">
        <Header user={user} onLogout={onLogout} title="Order Registry" subtitle="Global Transaction Stream" accentColor="emerald-500" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <OrderOrbiter title="Total Volume" value={stats?.total || "0"} color="#6366F1" icon={<ShoppingCart size={24}/>} />
          <OrderOrbiter title="Awaiting Processing" value={stats?.pending || "0"} color="#F59E0B" icon={<Clock size={24}/>} />
          <OrderOrbiter title="In Transit" value={stats?.shipped || "0"} color="#10B981" icon={<Truck size={24}/>} />
          <OrderOrbiter title="Terminated Nodes" value={stats?.cancelled || "0"} color="#F43F5E" icon={<XCircle size={24}/>} />
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-6 mb-8 shadow-2xl flex items-center gap-6">
            <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input type="text" placeholder="Search Entity or Transaction ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
            </div>
            <div className="h-10 w-px bg-white/5"></div>
            <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-[2rem] border border-white/5">
                {['all', 'pending', 'shipped', 'cancelled'].map((status: string) => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-500 hover:text-white'}`}>{status}</button>
                ))}
            </div>
            <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`p-5 rounded-[2rem] transition-all border ${showAdvancedFilters ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/5'}`}><Filter size={20} /></button>
        </div>

        {showAdvancedFilters && (
            <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-10 mb-8 shadow-2xl animate-in zoom-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="space-y-4"><label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Registry Start</label><div className="relative group"><Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:outline-none [color-scheme:dark]" /></div></div>
                    <div className="space-y-4"><label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Registry End</label><div className="relative group"><Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:outline-none [color-scheme:dark]" /></div></div>
                    <div className="space-y-4"><label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Threshold Min ($)</label><div className="relative group"><DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="number" placeholder="0.00" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:outline-none" /></div></div>
                    <div className="space-y-4"><label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Threshold Max ($)</label><div className="relative group"><DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="number" placeholder="9999.99" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs text-white focus:outline-none" /></div></div>
                </div>
                <div className="flex justify-end gap-4 mt-10 pt-8 border-t border-white/5"><button onClick={clearAllFilters} className="px-8 py-4 rounded-2xl border border-white/10 text-gray-500 font-black text-xs uppercase hover:bg-white/5 transition-all">Reset All Parameters</button><button onClick={() => setShowAdvancedFilters(false)} className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase shadow-lg shadow-indigo-600/30">Apply Filter Map</button></div>
            </div>
        )}

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-base font-black text-white uppercase tracking-[0.2em]">Transaction Ledger Stream</h3>
            <Zap size={24} className="text-indigo-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] bg-black/20"><th className="px-12 py-8">Ledger ID</th><th className="px-12 py-8">Customer Identity</th><th className="px-12 py-8">Registry Date</th><th className="px-12 py-8">Total Yield (USD)</th><th className="px-12 py-8">Node Status</th><th className="px-12 py-8 text-right pr-12">Verification</th></tr></thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-12 py-8 font-mono text-sm text-indigo-500/80 tracking-tighter">#{order.id.toString().padStart(6, '0')}</td>
                    <td className="px-12 py-8"><p className="font-black text-white text-base uppercase">{order.customer}</p><p className="text-xs text-gray-600 uppercase font-bold mt-1">Primary Node Entity</p></td>
                    <td className="px-12 py-8 text-gray-400 text-sm font-bold uppercase">{order.date_formatted}</td><td className="px-12 py-8 font-black text-white text-lg font-mono">{order.amount_formatted}</td><td className="px-12 py-8">{getStatusBadge(order.status)}</td>
                    <td className="px-12 py-8 text-right pr-12"><button className="bg-white/[0.03] border border-white/5 hover:bg-white text-gray-400 hover:text-black px-8 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-3 ml-auto shadow-lg"><Eye size={16} />View Node</button></td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={6} className="p-32 text-center"><p className="text-gray-600 font-black uppercase tracking-widest text-sm mb-6">No transaction records match your parameters</p><button onClick={clearAllFilters} className="text-xs font-black text-emerald-500 uppercase border border-emerald-500/30 px-10 py-4 rounded-full hover:bg-emerald-500/10 transition-all">Clear All Nodes</button></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
      `}</style>
    </div>
  );
}

const OrderOrbiter = ({ title, value, color, icon }: any) => (
  <div className={`bg-[#0D0D12] border border-white/5 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between h-52 group relative overflow-hidden transition-all duration-500 hover:border-white/10`}>
    <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 group-hover:opacity-100 opacity-30 transition-opacity" style={{backgroundColor: `${color}20`}}></div>
    <div className="flex justify-between items-start">
        <div className="p-5 bg-white/5 rounded-2xl text-gray-400 group-hover:text-white transition-all shadow-inner border border-white/5" style={{color: color}}>{icon}</div>
        <ArrowUpRight size={20} className="text-gray-700 group-hover:text-white transition-all" />
    </div>
    <div>
        <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-4xl font-black text-white tracking-tighter leading-none">{value}</h4>
    </div>
  </div>
);