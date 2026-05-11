"use client";
import React from 'react';
import { LayoutDashboard, Box, ShoppingCart, Users, BarChart3, Settings } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }: any) {
    return (
        <aside className="w-64 bg-[#16171D] border-r border-gray-800 p-6 flex flex-col gap-8 shrink-0 min-h-screen">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Box size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">DLSs</h1>
            </div>

            <nav className="flex flex-col gap-2">
                <NavItem
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    active={currentPage === 'dashboard'}
                    onClick={() => setCurrentPage('dashboard')}
                />
                <NavItem
                    icon={<Box size={20} />}
                    label="Products"
                    active={currentPage === 'products'}
                    onClick={() => setCurrentPage('products')}
                />
                <NavItem icon={<ShoppingCart size={20} />} label="Orders" active={currentPage === 'order'}
                    onClick={() => setCurrentPage('order')} />
                <NavItem icon={<Users size={20} />} label="Users" active={currentPage === 'users'} 
          onClick={() => setCurrentPage('users')} />
                <NavItem icon={<BarChart3 size={20} />} label="Reports" />
                <NavItem icon={<Settings size={20} />} label="Settings" className="mt-auto" />
            </nav>
        </aside>
    );
};

const NavItem = ({ icon, label, active = false, onClick, className = "" }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'
            } ${className}`}
    >
        {icon}
        <span className="font-medium text-sm">{label}</span>
    </button>
);