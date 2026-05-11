"use client";
import Sidebar from '../../component/Sidebar'; // ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ
import { User, Users, UserPlus, AlertTriangle, UserX, Monitor, Smartphone, Compass, Globe } from 'lucide-react';

// ข้อมูลจำลองอ้างอิงจากในรูปภาพ
const usersData = [
  { id: 1, name: 'Thanuwach Smith', email: 'Thanuwach@gmail.com', status: 'Online', rank: 'Web (Chrome)', platform: 'chrome' },
  { id: 2, name: 'Taechapat KinMha', email: 'Taechapat@gmail.com', status: 'Online', rank: 'IOS App', platform: 'ios' },
  { id: 3, name: 'Nantapob Lengsap', email: 'Nantapob@gmail.com', status: 'Online', rank: 'IOS App', platform: 'ios' },
  { id: 4, name: 'Panthira Eiei', email: 'Panthira@gmail.com', status: 'Offline', rank: 'Web (Safari)', platform: 'safari' },
  { id: 5, name: 'Ticha Kube', email: 'Ticha@gmail.com', status: 'Offline', rank: 'Android', platform: 'android' },
  { id: 6, name: 'Somwang Fafa', email: 'Somwang@gmail.com', status: 'Online', rank: 'Android', platform: 'android' },
  { id: 7, name: 'Chihogo Sun', email: 'Chihogo@gmail.com', status: 'Offline', rank: 'Web (Safari)', platform: 'safari' },
  { id: 8, name: 'Ticha Kube', email: 'Ticha@gmail.com', status: 'Offline', rank: 'Android', platform: 'android' },
  { id: 9, name: 'Somwang Fafa', email: 'Somwang@gmail.com', status: 'Online', rank: 'Android', platform: 'android' },
  { id: 10, name: 'Chihogo Sun', email: 'Chihogo@gmail.com', status: 'Offline', rank: 'Web (Safari)', platform: 'safari' },
];

export default function UserPage({ setCurrentPage }: { setCurrentPage: any }) {
  
  // ฟังก์ชันแสดงไอคอนตามแพลตฟอร์ม
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'chrome':
        return <Globe size={16} className="text-blue-400" />; // ใช้สีใกล้เคียงโลโก้
      case 'ios':
        return <Smartphone size={16} className="text-gray-300" />; // แทน Apple
      case 'safari':
        return <Compass size={16} className="text-blue-500" />;
      case 'android':
        return <Smartphone size={16} className="text-green-500" />; // แทนตัว Android
      default:
        return <Monitor size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1B1D27]">
      {/* Sidebar */}
      <Sidebar currentPage="users" setCurrentPage={setCurrentPage} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">User Management</h2>
        </header>

        {/* 4 สี่เหลี่ยมแสดงสถิติด้านบน */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value="332" color="bg-[#D6A2E8]" icon={<User className="text-white opacity-90" size={24}/>} textColor="text-white" />
          <StatCard title="Online Shop" value="45" color="bg-[#4CAF50]" icon={<Users className="text-white opacity-90" size={24}/>} textColor="text-white" />
          <StatCard title="Report Users" value="80" color="bg-[#F2A9A9]" icon={<AlertTriangle className="text-white opacity-90" size={24}/>} textColor="text-white" />
          <StatCard title="New Signup" value="10" color="bg-[#3B82F6]" icon={<UserPlus className="text-white opacity-90" size={24}/>} textColor="text-white" />
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="bg-[#242632] rounded-xl border border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-100 font-semibold text-sm">
                <th className="p-4 pl-8 w-16">ID</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rank</th>
                <th className="p-4 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors text-gray-200 text-sm">
                  <td className="p-4 pl-8">{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                      {user.status}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(user.platform)}
                      <span>{user.rank}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="bg-[#4CAF50] hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
                        View Details
                      </button>
                      <button className="bg-[#E53935] hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1">
                        <UserX size={14} />
                        Kick User
                      </button>
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

// Component ย่อยสำหรับกล่องสถิติด้านบน
const StatCard = ({ title, value, color, icon, textColor }: any) => (
  <div className={`${color} p-5 rounded-lg shadow-md flex items-center justify-start gap-4 h-24`}>
    <div className="p-2 rounded-lg bg-white/20">
      {icon}
    </div>
    <div className={`flex flex-col ${textColor}`}>
      <p className="text-sm font-semibold">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  </div>
);