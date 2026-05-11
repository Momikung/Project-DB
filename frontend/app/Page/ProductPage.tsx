"use client";
import React from 'react';
import Sidebar from '../../component/Sidebar'; // ดึงจาก component/Sidebar.tsx
import { Calendar, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';

const productsData = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: '$ 100.00', userId: 'A117856', index: 150, updateAt: '2025/12/06' },
  { id: 2, name: 'Smartphone', category: 'Mobile', price: '$ 70.00', userId: 'Z255479', index: 75, updateAt: '2025/12/16' },
];

export default function ProductPage({ setCurrentPage }: { setCurrentPage: any }) {
  return (
    <div className="flex min-h-screen bg-[#0F1014]">
      {/* โยนฟังก์ชันสำหรับเปลี่ยนหน้าให้ Sidebar */}
      <Sidebar currentPage="products" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Product Inventory</h2>
          <div className="relative">
            <input type="text" placeholder="Mar 14, 2569 - Mar 20, 2026" className="bg-white text-gray-600 text-sm rounded-md py-2 px-4 w-64 focus:outline-none" />
          </div>
        </header>

        <div className="bg-[#16171D] rounded-xl border border-gray-800 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-300 text-sm font-semibold tracking-wider">
                <th className="p-4 pl-6">ID</th>
                <th className="p-4">NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">PRICE</th>
                <th className="p-4">User ID</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {productsData.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors text-gray-300 text-sm">
                  <td className="p-4 pl-6">{row.id}</td>
                  <td className="p-4 font-medium text-white">{row.name}</td>
                  <td className="p-4">{row.category}</td>
                  <td className="p-4">{row.price}</td>
                  <td className="p-4">{row.userId}</td>
                  <td className="p-4 pr-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 bg-blue-500 text-white rounded"><Edit size={16} /></button>
                      <button className="p-1.5 bg-red-500 text-white rounded"><Trash2 size={16} /></button>
                    </div>
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