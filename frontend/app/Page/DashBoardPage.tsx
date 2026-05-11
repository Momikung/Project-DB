"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar'; // ดึงจาก component/Sidebar.tsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Package, UserPlus, AlertCircle } from 'lucide-react';

const visitorData = [
  { name: 'Jan', current: 200, last: 150 }, { name: 'Feb', current: 300, last: 200 },
  { name: 'Mar', current: 400, last: 250 }, { name: 'Apr', current: 350, last: 400 },
];

export default function DashBoardPage({ setCurrentPage }: { setCurrentPage: any }) {
  return (
    <div className="flex min-h-screen bg-[#0F1014]">
      {/* โยนฟังก์ชันสำหรับเปลี่ยนหน้าให้ Sidebar */}
      <Sidebar currentPage="dashboard" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Sales" value="$5,840,000" subValue="+12.5%" icon={<TrendingUp />} color="bg-rose-500" />
          <StatCard title="New Orders" value="2,352" subValue="+5.2%" icon={<Package />} color="bg-orange-500" />
          <StatCard title="Active Users" value="852" subValue="+18%" icon={<UserPlus />} color="bg-yellow-500" />
          <StatCard title="Low Stock Items" value="50" subValue="Requires Action" icon={<AlertCircle />} color="bg-red-600" />
        </div>
        {/* กราฟและข้อมูลอื่นๆ ... (ใส่ข้อมูลโค้ดตารางด้านล่างที่คุณมีต่อได้เลยครับ) */}
      </main>
    </div>
  );
}

const StatCard = ({ title, value, subValue, icon, color }: any) => (
  <div className={`${color} p-6 rounded-2xl shadow-lg flex flex-col justify-between h-32 text-white`}>
    <div className="flex justify-between items-start">
      <span className="bg-white/20 p-2 rounded-lg">{icon}</span>
      <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">{subValue}</span>
    </div>
    <div>
      <p className="text-xs text-white/80 uppercase tracking-wider mb-1">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  </div>
);