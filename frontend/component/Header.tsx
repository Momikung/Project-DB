"use client";
import React, { useState } from 'react';
import { LogOut, X, ShieldCheck, Mail, Clock } from 'lucide-react';

interface HeaderProps {
    user: any;
    onLogout: () => void;
    title: string;
    subtitle: string;
    accentColor?: string;
    statusLabel?: string;
}

// ✅ Static lookup map so Tailwind never purges these classes
const accentMap: Record<string, {
  dot: string;
  text: string;
  textMuted: string;
  avatarGrad: string;
  bannerGrad: string;
  avatarInner: string;
  badge: string;
  badgeBorder: string;
  badgeText: string;
  badgeIcon: string;
}> = {
  'indigo-500': {
    dot:         'bg-indigo-500',
    text:        'text-indigo-500',
    textMuted:   'text-indigo-500/80',
    avatarGrad:  'from-indigo-600 to-indigo-700',
    bannerGrad:  'from-indigo-600 to-indigo-900',
    avatarInner: 'from-indigo-500 to-indigo-400',
    badge:       'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/20',
    badgeText:   'text-indigo-500',
    badgeIcon:   'text-indigo-500',
  },
  'emerald-500': {
    dot:         'bg-emerald-500',
    text:        'text-emerald-500',
    textMuted:   'text-emerald-500/80',
    avatarGrad:  'from-emerald-600 to-indigo-700',
    bannerGrad:  'from-emerald-600 to-indigo-900',
    avatarInner: 'from-emerald-500 to-emerald-400',
    badge:       'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/20',
    badgeText:   'text-emerald-500',
    badgeIcon:   'text-emerald-500',
  },
  'rose-500': {
    dot:         'bg-rose-500',
    text:        'text-rose-500',
    textMuted:   'text-rose-500/80',
    avatarGrad:  'from-rose-600 to-indigo-700',
    bannerGrad:  'from-rose-600 to-indigo-900',
    avatarInner: 'from-rose-500 to-rose-400',
    badge:       'bg-rose-500/10',
    badgeBorder: 'border-rose-500/20',
    badgeText:   'text-rose-500',
    badgeIcon:   'text-rose-500',
  },
  'amber-500': {
    dot:         'bg-amber-500',
    text:        'text-amber-500',
    textMuted:   'text-amber-500/80',
    avatarGrad:  'from-amber-600 to-indigo-700',
    bannerGrad:  'from-amber-600 to-indigo-900',
    avatarInner: 'from-amber-500 to-amber-400',
    badge:       'bg-amber-500/10',
    badgeBorder: 'border-amber-500/20',
    badgeText:   'text-amber-500',
    badgeIcon:   'text-amber-500',
  },
};

// Fallback to indigo if accentColor is not in the map
const getAccent = (color: string) => accentMap[color] ?? accentMap['indigo-500'];

export default function Header({ user, onLogout, title, subtitle, accentColor = "indigo-500", statusLabel = "System Live" }: HeaderProps) {
    const [showProfile, setShowProfile] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const accent = getAccent(accentColor);
    const titleWords = title.split(' ');
    const titleFirst = titleWords[0];
    const titleRest = titleWords.slice(1).join(' ');

    return (
        <>
            <header className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 ${accent.dot} rounded-full animate-pulse`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accent.textMuted}`}>{statusLabel}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
                        {titleFirst} <span className={accent.text}>{titleRest}</span>
                    </h2>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-1">{subtitle}</p>
                </div>

                <div className="flex items-center gap-6 bg-white/[0.03] border border-white/[0.05] p-2 pr-6 rounded-2xl backdrop-blur-md">
                    <div className="flex items-center gap-4 pl-2">
                        <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent.avatarGrad} flex items-center justify-center text-white font-black text-xl shadow-lg cursor-pointer hover:scale-105 transition-all`}
                            onClick={() => setShowProfile(true)}
                        >
                            {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                        </div>
                        <div className="cursor-pointer" onClick={() => setShowProfile(true)}>
                            <p className="text-sm font-bold text-white leading-tight">{user?.name || 'Administrator'}</p>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{user?.role || 'Superuser'}</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10 mx-2"></div>
                    <button onClick={() => setShowLogout(true)} className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Logout Modal */}
            {showLogout && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#121218] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center text-white">
                        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8 border border-rose-500/20"><LogOut size={40} /></div>
                        <h3 className="text-2xl font-black mb-3">Sign Out</h3>
                        <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">Are you sure you want to terminate the current administrative session?</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowLogout(false)} className="flex-1 bg-white/5 border border-white/5 font-black py-4 rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest">Abort</button>
                            <button onClick={onLogout} className="flex-1 bg-rose-600 font-black py-4 rounded-2xl shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all text-xs uppercase tracking-widest">Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {showProfile && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#121218] border border-white/10 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <button onClick={() => setShowProfile(false)} className="absolute right-8 top-8 bg-black/40 text-white p-3 rounded-full z-20 border border-white/10 hover:bg-white/10 transition-all"><X size={20} /></button>
                        <div className={`h-40 bg-gradient-to-br ${accent.bannerGrad} relative`}>
                            <div className="absolute inset-0 bg-black/20"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#121218] to-transparent"></div>
                        </div>
                        <div className="p-10 pt-0 -mt-16 relative">
                            <div className="w-32 h-32 bg-[#121218] p-1.5 rounded-[2.5rem] mb-6 shadow-2xl mx-auto border border-white/5">
                                <div className={`w-full h-full bg-gradient-to-tr ${accent.avatarInner} rounded-[2rem] flex items-center justify-center text-white text-5xl font-black`}>
                                    {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                                </div>
                            </div>
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{user?.name || 'Administrator'}</h3>
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${accent.badge} border ${accent.badgeBorder} rounded-full`}>
                                    <ShieldCheck size={14} className={accent.badgeIcon} />
                                    <span className={`text-[10px] ${accent.badgeText} font-black uppercase tracking-[0.2em]`}>{user?.role || 'System Root'}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors"><Mail size={18}/></div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Primary Contact</p>
                                        <p className="text-sm font-bold text-gray-300">{user?.email || 'admin@xenior.systems'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-black/40 rounded-3xl border border-white/5 group hover:border-blue-500/30 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-500 transition-colors"><Clock size={18}/></div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Last Access Session</p>
                                        <p className="text-sm font-bold text-gray-300">Connected Instance</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="w-full mt-10 bg-white text-black font-black py-5 rounded-3xl text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-[0.98]">Update Security Credentials</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
