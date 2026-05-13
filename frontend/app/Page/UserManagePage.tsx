"use client";
import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar';
import Header from '../../component/Header';
import { Users, UserPlus, UserX, Monitor, Smartphone, Globe, Search, Zap, ArrowUpRight, ShieldCheck, ShieldAlert, Compass, UserMinus } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';

export default function UserPage({ setCurrentPage, user, onLogout }: any) {
  const {
    stats,
    searchTerm,
    setSearchTerm,
    filteredUsers
  } = useUsers();

  const [modalMode, setModalMode] = useState<'details' | 'kick' | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = filteredUsers.slice((pageIndex - 1) * itemsPerPage, pageIndex * itemsPerPage);

  // Reset page when filter changes
  React.useEffect(() => {
    setPageIndex(1);
  }, [searchTerm]);

  const openDetails = (u: any) => {
    setSelectedUser(u);
    setModalMode('details');
  };

  const openKick = (u: any) => {
    setSelectedUser(u);
    setModalMode('kick');
  };

  const closePopup = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const handleKickConfirm = () => {
    // Implement API call here if needed
    console.log("Kicked user:", selectedUser?.id);
    closePopup();
  };

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
    <div className="flex min-h-screen bg-[#151521] text-gray-200 font-sans">
      <Sidebar currentPage="users" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto max-w-[1750px] mx-auto w-full relative">
        <Header user={user} onLogout={onLogout} title="USER MANAGEMENT" subtitle="" hideSubtitle />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10 mt-6">
          <UserOrbiter title="Total Population" value={stats?.total || "332"} color="#6366F1" icon={<Users size={24}/>} />
          <UserOrbiter title="Neural Hub Nodes" value={stats?.active || "45"} color="#10B981" icon={<Globe size={24}/>} />
          <UserOrbiter title="Anomaly Reports" value={stats?.reported || "80"} color="#EF4444" icon={<ShieldAlert size={24}/>} />
          <UserOrbiter title="New Syncs" value={stats?.new || "10"} color="#F59E0B" icon={<UserPlus size={24}/>} />
        </div>

        <div className="bg-[#20202A] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs font-semibold border-b border-white/5">
                  <th className="px-8 py-5">ID</th>
                  <th className="px-8 py-5">Customer Name</th>
                  <th className="px-8 py-5">Email</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Rank</th>
                  <th className="px-8 py-5 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentUsers.map((u: any, index: number) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4 text-sm text-gray-400">{(pageIndex - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-8 py-4 text-sm text-gray-300">{u.name}</td>
                    <td className="px-8 py-4 text-sm text-gray-400">{u.email}</td>
                    <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                            <span className="text-xs text-gray-400">{u.status === 'Active' ? 'Online' : 'Offline'}</span>
                        </div>
                    </td>
                    <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                            {getPlatformIcon(u.platform)}
                            <span className="text-xs text-gray-400">Web ({u.platform})</span>
                        </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openDetails(u)} className="px-3 py-1 bg-[#3b7145]/20 text-[#3b7145] hover:bg-[#3b7145] hover:text-white rounded border border-[#3b7145]/30 text-xs transition-colors shadow-sm">View Details</button>
                        <button onClick={() => openKick(u)} className="px-3 py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded border border-red-500/30 text-xs transition-colors flex items-center gap-1 shadow-sm uppercase">
                           <UserX size={12} /> KICK User
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="p-5 border-t border-white/5 flex items-center justify-between text-sm text-gray-400">
            <div>
              Showing <span className="text-white font-medium">{(pageIndex - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(pageIndex * itemsPerPage, filteredUsers.length)}</span> of <span className="text-white font-medium">{filteredUsers.length}</span> entries
            </div>
            <div className="flex gap-2">
              <button 
                disabled={pageIndex === 1} 
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                className="px-4 py-2 bg-[#151521] border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1 px-2">
                <span className="font-medium text-white">{pageIndex}</span> / <span>{totalPages}</span>
              </div>
              <button 
                disabled={pageIndex === totalPages} 
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 bg-[#151521] border border-white/5 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Details */}
        {modalMode === 'details' && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#20202A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden text-gray-200 font-sans shadow-2xl relative">
              <div className="p-6">
                <h2 className="text-base font-bold mb-6 text-white">
                  User Details: {selectedUser.name.split(' ')[0]} ( {selectedUser.email} )
                </h2>
                
                <div className="flex gap-6 mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-[#151521] border border-white/10 shadow-sm flex items-center justify-center overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 text-sm flex-1">
                    <div className="flex items-center">
                      <span className="font-semibold w-28 text-gray-400">Status:</span>
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs font-semibold">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {selectedUser.status === 'Active' ? 'Online' : 'Offline'}
                      </div>
                    </div>
                    <div className="flex items-center"><span className="font-semibold w-28 text-gray-400">Last Active:</span><span className="text-gray-300">2 minutes ago</span></div>
                    <div className="flex items-center"><span className="font-semibold w-28 text-gray-400">Rank:</span><span className="text-gray-300">VIP</span></div>
                    <div className="flex items-center"><span className="font-semibold w-28 text-gray-400">Current Platform:</span><span className="text-gray-300">{selectedUser.platform}</span></div>
                    <div className="flex items-center"><span className="font-semibold w-28 text-gray-400">Session Start:</span><span className="text-gray-300">1 hour 35 minutes ago</span></div>
                    <div className="flex items-center"><span className="font-semibold w-28 text-gray-400">Client IP:</span><span className="text-gray-300">203.0.113.10</span></div>
                    <div className="flex items-center"><span className="font-semibold w-28 text-gray-400">Location:</span><span className="text-gray-300">London, UK</span></div>
                  </div>
                </div>

                <div className="bg-[#151521] p-4 rounded-xl border border-white/5">
                  <h3 className="font-bold text-sm mb-1 text-white">Admin Action: Confirm Kick Action</h3>
                  <p className="text-xs text-gray-500 mb-4">{selectedUser.name.split(' ')[0]} (VIP) has multiple sessions from different locations. Please review or use the action below.</p>
                  <input type="text" placeholder="Reason for kick (optional)" className="w-full bg-[#20202A] border border-white/10 text-white rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-blue-500" />
                  <div className="flex items-center gap-3">
                    <button onClick={handleKickConfirm} className="py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg transition-colors flex-1 uppercase tracking-wide">
                      KICK USER & LOGOUT SESSIONS
                    </button>
                    <button onClick={closePopup} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg shadow-lg transition-colors uppercase tracking-wide">
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Kick Confirmation */}
        {modalMode === 'kick' && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#20202A] border border-white/10 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-gray-200 font-sans text-center p-8 relative">
              <h2 className="text-lg font-black mb-4 uppercase tracking-widest text-white">KICK USER</h2>
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/10 p-5 rounded-full border border-red-500/20">
                  <UserMinus size={48} className="text-red-500" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-gray-400 mb-8 font-medium">Are you sure you want to<br/>kick user <span className="text-white font-bold">{selectedUser.name}</span> ?</p>
              
              <div className="flex justify-center gap-3">
                <button onClick={handleKickConfirm} className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg transition-colors w-32 uppercase tracking-wide">
                  CONFIRM KICK
                </button>
                <button onClick={closePopup} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg shadow-lg transition-colors w-32 uppercase tracking-wide">
                  CENCEL
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}

const UserOrbiter = ({ title, value, color, icon }: any) => (
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