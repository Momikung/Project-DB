"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { Users, UserPlus, UserX, Monitor, Smartphone, Globe, Search, Zap, ArrowUpRight, ShieldCheck, ShieldAlert, Compass } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';

export default function UserPage({ setCurrentPage, user, onLogout }: any) {
  const {
    stats,
    searchTerm,
    setSearchTerm,
    filteredUsers
  } = useUsers();

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('chrome')) return <Globe size={16} className="text-blue-400" />;
    if (p.includes('ios') || p.includes('android')) return <Smartphone size={16} className="text-indigo-400" />;
    if (p.includes('safari')) return <Compass size={16} className="text-blue-500" />;
    return <Monitor size={16} className="text-gray-500" />;
  };

  const getRankStyle = (rank: string) => {
    switch(rank) {
      case 'Platinum': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Gold': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Silver': return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-gray-200">
      <Sidebar currentPage="users" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1750px] mx-auto w-full">
        <Header user={user} onLogout={onLogout} title="Security Nodes" subtitle="Access Control & Network Registry" accentColor="indigo-500" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <SecurityOrbiter title="Global Entities" value={stats?.total || "0"} color="#6366F1" icon={<Users size={24}/>} />
          <SecurityOrbiter title="Active Nodes" value={stats?.active || "0"} color="#10B981" icon={<ShieldCheck size={24}/>} />
          <SecurityOrbiter title="Alert Threshold" value={stats?.reported || "0"} color="#F43F5E" icon={<ShieldAlert size={24}/>} />
          <SecurityOrbiter title="New Syncs" value={stats?.new || "0"} color="#F59E0B" icon={<UserPlus size={24}/>} />
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] p-6 mb-8 shadow-2xl flex items-center gap-6">
            <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input type="text" placeholder="Search Entity Identity or Network Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-[2rem] pl-16 pr-8 py-5 text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
            </div>
            <button className="bg-white text-black font-black text-xs px-10 py-5 rounded-[2rem] hover:bg-gray-200 transition-all uppercase tracking-widest flex items-center gap-3">
                <UserPlus size={18} /> Add New Node
            </button>
        </div>

        <div className="bg-[#0D0D12] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <h3 className="text-base font-black text-white uppercase tracking-[0.2em]">Entity Access Registry</h3>
            <Zap size={24} className="text-indigo-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] bg-black/20">
                  <th className="px-12 py-8">Entity ID</th>
                  <th className="px-12 py-8">Identity Profile</th>
                  <th className="px-12 py-8">Valuation Rank</th>
                  <th className="px-12 py-8">Node Interface</th>
                  <th className="px-12 py-8">Network Status</th>
                  <th className="px-12 py-8 text-right pr-12">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-12 py-8 font-mono text-sm text-indigo-500/80 tracking-tighter">#NODE-{u.id.toString().padStart(6, '0')}</td>
                    <td className="px-12 py-8">
                        <p className="font-black text-white text-base uppercase">{u.name}</p>
                        <p className="text-xs text-gray-500 font-bold mt-1 lowercase">{u.email}</p>
                    </td>
                    <td className="px-12 py-8">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getRankStyle(u.rank)}`}>
                            {u.rank_display}
                        </span>
                    </td>
                    <td className="px-12 py-8">
                        <div className="flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
                            {getPlatformIcon(u.platform)}
                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">{u.platform}</span>
                        </div>
                    </td>
                    <td className="px-12 py-8">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-600'}`}></div>
                            <span className={`text-xs font-black uppercase tracking-widest ${u.status === 'Active' ? 'text-emerald-500' : 'text-gray-600'}`}>{u.status}</span>
                        </div>
                    </td>
                    <td className="px-12 py-8 text-right pr-12">
                      <div className="flex justify-end gap-3">
                        <button className="px-6 py-3 bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white rounded-xl text-xs font-black transition-all uppercase tracking-widest">Edit</button>
                        <button className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-black transition-all uppercase tracking-widest flex items-center gap-2">
                           <UserX size={14} /> Kick
                        </button>
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

const SecurityOrbiter = ({ title, value, color, icon }: any) => (
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