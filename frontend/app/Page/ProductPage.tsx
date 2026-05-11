"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { Package, Edit, Trash2, Search, Plus, Filter, AlertTriangle, LayoutGrid, Zap, ArrowUpRight } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

export default function ProductPage({ setCurrentPage, user, onLogout }: any) {
  const {
    productsData,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    categories,
    filteredProducts,
    lowStockCount
  } = useProducts();

  if (isLoading) return null;

  return (
    <div className="flex min-h-screen bg-[#050507] text-gray-200">
      <Sidebar currentPage="products" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1750px] mx-auto w-full">
        <Header user={user} onLogout={onLogout} title="Asset Inventory" subtitle="Global Catalog Management" accentColor="rose-500" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <ProductOrbiter title="Total SKU Nodes" value={productsData.length} color="#F43F5E" icon={<Package size={24}/>} />
          <ProductOrbiter title="Active Categories" value={categories.length - 1} color="#6366F1" icon={<LayoutGrid size={24}/>} />
          <ProductOrbiter title="Critical Restock" value={lowStockCount} color="#F59E0B" icon={<AlertTriangle size={24}/>} />
          <div className="bg-[#0D0D12] border border-emerald-500/10 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-between h-52 group hover:border-emerald-500/30 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                 <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-inner"><Plus size={24}/></div>
                 <ArrowUpRight size={20} className="text-gray-700 group-hover:text-white transition-all" />
              </div>
              <div>
                 <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Asset Injection</p>
                 <h4 className="text-2xl font-black text-white uppercase">Add New SKU</h4>
              </div>
          </div>
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-6 mb-8 shadow-2xl flex items-center gap-6">
            <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500 transition-colors" size={20} />
                <input type="text" placeholder="Search Asset Name or SKU ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-sm text-white focus:outline-none focus:border-rose-500/50 [color-scheme:dark]" />
            </div>
            <div className="h-10 w-px bg-white/5"></div>
            <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-[2rem] border border-white/5">
                {categories.slice(0, 4).map((cat: string) => (
                    <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'text-gray-500 hover:text-white'}`}>{cat}</button>
                ))}
            </div>
            <button className="bg-white/[0.03] border border-white/10 text-gray-300 p-5 rounded-[2rem] hover:bg-white/5 transition-all"><Filter size={20} /></button>
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-base font-black text-white uppercase tracking-[0.2em]">Global Asset Catalog</h3>
            <Zap size={24} className="text-rose-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] bg-black/20">
                  <th className="px-12 py-8">SKU Identity</th>
                  <th className="px-12 py-8">Asset Profile</th>
                  <th className="px-12 py-8">Category Node</th>
                  <th className="px-12 py-8">Unit Value</th>
                  <th className="px-12 py-8">Health Status</th>
                  <th className="px-12 py-8 text-right pr-12">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p: any) => (
                  <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-12 py-8 font-mono text-sm text-rose-500/80 tracking-tighter">#SKU-{p.id.toString().padStart(6, '0')}</td>
                    <td className="px-12 py-8"><p className="font-black text-white text-base uppercase">{p.name}</p><p className="text-xs text-gray-600 uppercase font-bold mt-1">Physical Intelligence Node</p></td>
                    <td className="px-12 py-8"><span className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">{p.category || 'Standard'}</span></td>
                    <td className="px-12 py-8 font-black text-white text-lg font-mono">{p.price}</td>
                    <td className="px-12 py-8">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${p.stock < 10 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
                            <span className={`text-xs font-black uppercase tracking-widest ${p.stock < 10 ? 'text-amber-500' : 'text-emerald-500'}`}>{p.stock < 10 ? 'Critical' : 'Optimal'} ({p.stock})</span>
                        </div>
                    </td>
                    <td className="px-12 py-8 text-right pr-12">
                      <div className="flex justify-end gap-3">
                        <button className="p-4 bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white rounded-2xl transition-all shadow-lg"><Edit size={18} /></button>
                        <button className="p-4 bg-white/[0.03] border border-white/5 text-gray-500 hover:text-rose-500 rounded-2xl transition-all shadow-lg"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

const ProductOrbiter = ({ title, value, color, icon }: any) => (
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