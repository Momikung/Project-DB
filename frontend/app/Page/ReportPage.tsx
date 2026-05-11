"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar'; // ตรวจสอบ path ให้ตรงกับของคุณ
import { Calendar, FileText, User, Package, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// ข้อมูลจำลองสำหรับ Area Chart
const monthlyData = [
  { name: 'Jan', revenue: 50 }, { name: 'Feb', revenue: 120 }, { name: 'Mar', revenue: 110 },
  { name: 'Apr', revenue: 280 }, { name: 'May', revenue: 190 }, { name: 'Jun', revenue: 360 },
  { name: 'Jul', revenue: 200 }, { name: 'Aug', revenue: 140 }, { name: 'Sep', revenue: 250 },
  { name: 'Oct', revenue: 440 }, { name: 'Nov', revenue: 210 }, { name: 'Dec', revenue: 430 },
];

// ข้อมูลจำลองสำหรับตารางด้านล่าง
const tableData = [
  { name: 'Laptop Pro', price: '$100.00', revenue: '$110.00', staff: 'Monthly Revenue', users: '129' },
  { name: 'Smartphone', price: '$70.00', revenue: '$80.00', staff: 'Monthly Revenue', users: '99' },
  { name: 'Laptop Pro', price: '$100.00', revenue: '$110.00', staff: 'Monthly Revenue', users: '129' },
  { name: 'Smartphone', price: '$70.00', revenue: '$80.00', staff: 'Monthly Revenue', users: '99' },
];

// ข้อมูลจำลองสำหรับ Inventory Bar Chart
const inventoryData = [
  { name: 'Electronics', short: 40, low: 24 },
  { name: 'Clothing', short: 30, low: 13 },
  { name: 'Home', short: 20, low: 48 },
  { name: 'Decor', short: 27, low: 39 },
];

export default function ReportPage({ setCurrentPage }: { setCurrentPage: any }) {
  return (
    <div className="flex min-h-screen bg-[#1B1D27]">
      {/* Sidebar */}
      <Sidebar currentPage="reports" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Report & Analytics</h2>
          <div className="flex items-center bg-white rounded-md px-3 py-2 w-72">
            <Calendar size={18} className="text-gray-400 mr-2" />
            <input type="text" placeholder="Mar 14, 2569 - Mar 20, 2026" className="bg-transparent text-gray-600 text-sm focus:outline-none w-full" readOnly />
          </div>
        </header>

        {/* 4 สถิติกล่องสีขาวด้านบน และปุ่ม Import */}
        <div className="flex flex-wrap justify-between items-end mb-6 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <TopStatCard title="Total Revenue" value="$ 200.00" icon={<FileText className="text-gray-400" size={20}/>} />
            <TopStatCard title="New Users" value="65" icon={<User className="text-gray-400" size={20}/>} />
            <TopStatCard title="Top Product" value="Laptop Pro" icon={<Package className="text-gray-400" size={20}/>} />
            <TopStatCard title="Top Revenue" value="360" icon={<TrendingUp className="text-gray-400" size={20}/>} />
          </div>
          <button className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-colors mb-0.5">
            IMPORT
          </button>
        </div>

        {/* ส่วนเนื้อหาตรงกลาง (กราฟหลัก + แถบด้านขวา) */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          
          {/* กราฟหลักสีขาว */}
          <div className="bg-white rounded-xl p-6 flex-1 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue Trend</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip cursor={{stroke: '#D1D5DB', strokeWidth: 1, strokeDasharray: '3 3'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* แถบด้านขวา (กล่อง Earnings & Inventory) */}
          <div className="w-full lg:w-72 flex flex-col gap-4">
            <EarningsCard percentage={80} color="text-[#64D2B2]" />
            <EarningsCard percentage={80} color="text-[#D6A2E8]" subLabel="8.5 / 10" multiColor />
            
            {/* Inventory Status Card */}
            <div className="bg-[#242632] rounded-xl p-5 shadow-lg border border-gray-700 h-full">
              <h4 className="text-gray-100 text-sm font-semibold mb-4">Inventory Status</h4>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inventoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{fill: '#9CA3AF', fontSize: 9}} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                    <Bar dataKey="short" fill="#64D2B2" radius={[2, 2, 0, 0]} barSize={10} />
                    <Bar dataKey="low" fill="#F87171" radius={[2, 2, 0, 0]} barSize={10} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ตารางคู่ด้านล่าง */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DarkTable title="Sales by Category" columns={['NAME', 'PRICE', 'REVENUE']} data={tableData} type="sales" />
          <DarkTable title="Top Performing Staff" columns={['Staff', 'PRICE', 'USERS']} data={tableData} type="staff" />
        </div>
      </main>
    </div>
  );
}

// ---------------- Components ย่อย ----------------

const TopStatCard = ({ title, value, icon }: any) => (
  <div className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm h-20">
    <div className="flex flex-col">
      <p className="text-gray-500 text-xs font-semibold mb-1">{title}</p>
      <h4 className="text-gray-800 text-lg font-bold">{value}</h4>
    </div>
    <div className="bg-gray-100 p-2 rounded-md">
      {icon}
    </div>
  </div>
);

const EarningsCard = ({ percentage, color, subLabel, multiColor }: any) => (
  <div className="bg-[#242632] rounded-xl p-5 shadow-lg border border-gray-700 relative overflow-hidden flex flex-col justify-between">
    <div>
      <p className="text-gray-400 text-xs font-semibold mb-1">Earnings</p>
      <p className="text-gray-500 text-[10px] mb-1">Total Expense</p>
      <h3 className="text-[#64D2B2] text-xl font-bold mb-1">$6078.76</h3>
      <p className="text-gray-500 text-[9px] leading-tight w-2/3">Profit is 48% More than last Month</p>
    </div>
    <div className="absolute right-[-20px] bottom-[-20px] w-28 h-28">
        <CircularProgress percentage={percentage} color={color} subLabel={subLabel} multiColor={multiColor} />
    </div>
  </div>
);

const CircularProgress = ({ percentage, color, subLabel, multiColor }: any) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-180" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="#374151" strokeWidth="12" fill="transparent" />
        {multiColor ? (
          <>
            <circle cx="50" cy="50" r={radius} stroke="#F59E0B" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference * 0.4} strokeLinecap="round" />
            <circle cx="50" cy="50" r={radius} stroke="#64D2B2" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={circumference * 0.7} strokeLinecap="round" />
          </>
        ) : (
          <circle cx="50" cy="50" r={radius} className={color} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-white text-sm font-bold">{percentage}%</span>
        {subLabel && <span className="text-gray-400 text-[8px]">{subLabel}</span>}
      </div>
    </div>
  );
};

const DarkTable = ({ title, columns, data, type }: any) => (
  <div className="bg-[#242632] rounded-xl border border-gray-700 overflow-hidden shadow-lg">
    <div className="p-5 border-b border-gray-700">
      <h3 className="text-white text-base font-bold">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700 text-gray-300 text-xs font-semibold uppercase tracking-wider bg-black/20">
            {columns.map((col: string, i: number) => <th key={i} className="p-4">{col}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((row: any, i: number) => (
            <tr key={i} className="hover:bg-white/5 transition-colors text-gray-300 text-sm">
              <td className="p-4">{type === 'sales' ? row.name : row.staff}</td>
              <td className="p-4">{row.price}</td>
              <td className="p-4">{type === 'sales' ? row.revenue : row.users}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);