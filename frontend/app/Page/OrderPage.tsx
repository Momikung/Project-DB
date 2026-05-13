"use client";
import React, { useState } from 'react';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'shipped' || s === 'delivered') 
        return <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div><span className="text-xs font-black uppercase text-emerald-500 tracking-widest">Shipped</span></div>;
    if (s === 'pending' || s === 'processing') 
        return <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div><span className="text-xs font-black uppercase text-amber-500 tracking-widest">Pending</span></div>;
    return <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div><span className="text-xs font-black uppercase text-rose-500 tracking-widest">Cancelled</span></div>;
  };

  return (
    <div className="flex min-h-screen bg-[#151521] text-gray-200">
      <Sidebar currentPage="orders" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1750px] mx-auto w-full">
        <Header user={user} onLogout={onLogout} title="Order Registry" subtitle="Global Transaction Stream" accentColor="emerald-500" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <OrderOrbiter title="Total Volume" value={stats?.total || "0"} color="#6366F1" icon={<ShoppingCart size={24}/>} />
          <OrderOrbiter title="Awaiting Processing" value={stats?.pending || "0"} color="#F59E0B" icon={<Clock size={24}/>} />
          <OrderOrbiter title="In Transit" value={stats?.shipped || "0"} color="#10B981" icon={<Truck size={24}/>} />
          <OrderOrbiter title="Terminated Nodes" value={stats?.cancelled || "0"} color="#F43F5E" icon={<XCircle size={24}/>} />
        </div>

        <div className="bg-[#20202A] border border-white/5 rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 shadow-lg backdrop-blur-md">
            <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input type="text" placeholder="Search Entity or Transaction ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#151521]/60 border border-white/5 rounded-xl pl-16 pr-8 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2 p-1.5 bg-[#151521]/60 rounded-xl border border-white/5">
                {['all', 'pending', 'shipped', 'cancelled'].map((status: string) => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-500 hover:text-white'}`}>{status}</button>
                ))}
            </div>
            <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`p-4 rounded-xl transition-all border ${showAdvancedFilters ? 'bg-white text-black border-white' : 'bg-white/[0.03] border-white/10 text-gray-300 hover:bg-white/5'}`}><Filter size={20} /></button>
        </div>

        {showAdvancedFilters && (
            <div className="bg-[#20202A] border border-white/5 rounded-2xl p-8 mb-8 shadow-lg animate-in zoom-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-4"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Registry Start</label><div className="relative group"><Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-[#151521]/60 border border-white/5 rounded-xl pl-14 pr-6 py-3.5 text-xs text-white focus:outline-none [color-scheme:dark]" /></div></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Registry End</label><div className="relative group"><Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-[#151521]/60 border border-white/5 rounded-xl pl-14 pr-6 py-3.5 text-xs text-white focus:outline-none [color-scheme:dark]" /></div></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Threshold Min ($)</label><div className="relative group"><DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="number" placeholder="0.00" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-[#151521]/60 border border-white/5 rounded-xl pl-14 pr-6 py-3.5 text-xs text-white focus:outline-none" /></div></div>
                    <div className="space-y-4"><label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Threshold Max ($)</label><div className="relative group"><DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} /><input type="number" placeholder="9999.99" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-[#151521]/60 border border-white/5 rounded-xl pl-14 pr-6 py-3.5 text-xs text-white focus:outline-none" /></div></div>
                </div>
                <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-white/5"><button onClick={clearAllFilters} className="px-8 py-3.5 rounded-xl border border-white/10 text-gray-500 font-black text-[10px] uppercase hover:bg-white/5 transition-all">Reset All</button><button onClick={() => setShowAdvancedFilters(false)} className="px-10 py-3.5 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase shadow-lg shadow-indigo-600/30">Apply Filter</button></div>
            </div>
        )}

        <div className="bg-[#20202A] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Transaction Ledger Stream</h3>
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
                    <td className="px-12 py-8 text-right pr-12"><button onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }} className="bg-white/[0.03] border border-white/5 hover:bg-white text-gray-400 hover:text-black px-8 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-3 ml-auto shadow-lg"><Eye size={16} />View Node</button></td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={6} className="p-32 text-center"><p className="text-gray-600 font-black uppercase tracking-widest text-sm mb-6">No transaction records match your parameters</p><button onClick={clearAllFilters} className="text-xs font-black text-emerald-500 uppercase border border-emerald-500/30 px-10 py-4 rounded-full hover:bg-emerald-500/10 transition-all">Clear All Nodes</button></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Overlay: Order Details */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#20202A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden text-gray-200 font-sans p-8 relative">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-500"><ShoppingCart size={24} /></div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">ORDER DETAILS</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Order Info */}
                <div>
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">Order Info</h3>
                  <div className="space-y-4">
                    <div><span className="text-gray-500 font-bold block text-xs">Order ID :</span><span className="text-white font-mono">{selectedOrder.display_id}</span></div>
                    <div><span className="text-gray-500 font-bold block text-xs">Customer Name :</span><span className="text-white">{selectedOrder.customer}</span></div>
                    <div><span className="text-gray-500 font-bold block text-xs">Date :</span><span className="text-white block">{selectedOrder.date_formatted}</span></div>
                    <div><span className="text-gray-500 font-bold block text-xs mb-1">Status :</span>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>

                {/* Right: Items */}
                <div>
                  <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-4">ITEM</h3>
                  <div className="space-y-2 mb-6">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="bg-[#151521] border border-white/5 p-3 rounded-lg text-sm text-gray-300">
                          {item.name} x{item.qty} - ${item.total.toFixed(2)}
                        </div>
                      ))
                    ) : (
                      <div className="bg-[#151521] border border-white/5 p-3 rounded-lg text-sm text-gray-500 text-center">No items found</div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>$ {((parseFloat(selectedOrder.amount) * 0.95) || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-400"><span>Tax</span><span>$ {((parseFloat(selectedOrder.amount) * 0.05) || 0).toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-white text-base mt-2 pt-2 border-t border-white/5"><span>Total</span><span>{selectedOrder.amount_formatted}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-10">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg uppercase tracking-widest">
                  SAVE PRODUCT
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg shadow-lg uppercase tracking-widest">
                  CLOSE
                </button>
              </div>
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

const OrderOrbiter = ({ title, value, color, icon }: any) => (
  <div className="relative group p-8 rounded-[2rem] bg-[#20202A]/40 border border-white/5 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/10">
    {/* Pulsing background glow */}
    <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] -z-10 group-hover:opacity-100 opacity-20 transition-opacity duration-700" style={{backgroundColor: color}}></div>
    
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-white/5 rounded-2xl text-gray-400 group-hover:text-white transition-all shadow-inner border border-white/5" style={{color: color}}>{icon}</div>
      <ArrowUpRight size={20} className="text-gray-700 group-hover:text-white transition-all" />
    </div>
    
    <div>
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">{title}</p>
      <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{value}</h4>
    </div>
  </div>
);