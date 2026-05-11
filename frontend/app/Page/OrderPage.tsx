"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
import { ShoppingCart, Clock, Truck, XCircle } from 'lucide-react';

// ข้อมูลจำลองอ้างอิงจากในรูปภาพ
const ordersData = [
  { id: 'Order #1002', customer: 'Thanuwach Smith', date: '2026 - 03 - 19', amount: '$ 120.50', status: 'Shipped' },
  { id: 'Order #1003', customer: 'Taechapat KinMha', date: '2026 - 03 - 19', amount: '$ 220.45', status: 'Shipped' },
  { id: 'Order #1004', customer: 'Nantapob Lengsap', date: '2026 - 03 - 19', amount: '$ 210.00', status: 'Shipped' },
  { id: 'Order #1005', customer: 'Panthira Eiei', date: '2026 - 03 - 18', amount: '$ 145.00', status: 'Pending' },
  { id: 'Order #1006', customer: 'Ticha Kube', date: '2026 - 03 - 18', amount: '$ 180.00', status: 'Canceled' },
  { id: 'Order #1007', customer: 'Somwang Fafa', date: '2026 - 03 - 18', amount: '$ 155.50', status: 'Pending' },
  { id: 'Order #1008', customer: 'Chihogo Sun', date: '2026 - 03 - 18', amount: '$ 360.75', status: 'Shipped' },
  // ข้อมูลแถวที่ซ้ำกันด้านล่าง
  { id: 'Order #1006_2', customer: 'Ticha Kube', date: '2026 - 03 - 18', amount: '$ 180.00', status: 'Canceled' },
  { id: 'Order #1007_2', customer: 'Somwang Fafa', date: '2026 - 03 - 18', amount: '$ 155.50', status: 'Pending' },
  { id: 'Order #1008_2', customer: 'Chihogo Sun', date: '2026 - 03 - 18', amount: '$ 360.75', status: 'Shipped' },
];

export default function OrderPage({ setCurrentPage }: { setCurrentPage: any }) {
  
  // ฟังก์ชันสำหรับเลือกสีของป้าย Status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Shipped':
        return <span className="bg-[#4CAF50] text-white px-4 py-1.5 rounded-md text-sm font-medium">Shipped</span>;
      case 'Pending':
        return <span className="bg-[#FFC107] text-white px-4 py-1.5 rounded-md text-sm font-medium">Pending</span>;
      case 'Canceled':
        return <span className="bg-[#E53935] text-white px-4 py-1.5 rounded-md text-sm font-medium">Canceled</span>;
      default:
        return <span className="bg-gray-500 text-white px-4 py-1.5 rounded-md text-sm font-medium">{status}</span>;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1B1D27]">
      {/* Sidebar */}
      <Sidebar currentPage="orders" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Order Management</h2>
        </header>

        {/* 4 สี่เหลี่ยมแสดงสถิติด้านบน */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Order" value="332" color="bg-[#4C3BCE]" icon={<ShoppingCart className="text-white opacity-80" size={24}/>} />
          <StatCard title="Pending Order" value="45" color="bg-[#FFB300]" icon={<Clock className="text-white opacity-80" size={24}/>} />
          <StatCard title="Shipped Order" value="80" color="bg-[#43A047]" icon={<Truck className="text-white opacity-80" size={24}/>} />
          <StatCard title="Cancel Order" value="10" color="bg-[#E53935]" icon={<XCircle className="text-white opacity-80" size={24}/>} />
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="bg-[#242632] rounded-xl border border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-100 font-semibold text-sm">
                <th className="p-5 pl-8">ID</th>
                <th className="p-5">Customer Name</th>
                <th className="p-5">Date</th>
                <th className="p-5">Total Amount</th>
                <th className="p-5">Status</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {ordersData.map((order, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors text-gray-200 text-sm">
                  <td className="p-5 pl-8">{order.id.split('_')[0]}</td>
                  <td className="p-5">{order.customer}</td>
                  <td className="p-5">{order.date}</td>
                  <td className="p-5">{order.amount}</td>
                  <td className="p-5">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="p-5 pr-8 text-right">
                    <button className="bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

// Component ย่อยสำหรับกล่องสถิติด้านบน
const StatCard = ({ title, value, color, icon }: any) => (
  <div className={`${color} p-5 rounded-lg shadow-md flex items-center justify-start gap-4 text-white h-24`}>
    <div className="p-2 rounded-full">
      {icon}
    </div>
    <div className="flex flex-col">
      <p className="text-sm font-semibold">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  </div>
);