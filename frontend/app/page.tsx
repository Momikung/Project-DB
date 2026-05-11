"use client";
import React, { useState, useEffect } from 'react';

// Import ตามโครงสร้างไฟล์ของคุณเป๊ะๆ
import Login from './Login/Login'; 
import Register from './Login/Register';
import DashBoardPage from './Page/DashBoardPage';
import ProductPage from './Page/ProductPage';
import OrderPage from './Page/OrderPage';
import UserManagePage from './Page/UserManagePage';
import ReportPage from './Page/ReportPage';

export default function MainApp() {
  // ใช้ State เช็คว่าจะแสดงหน้าไหน (login เป็นหน้าแรก)
  const VALID_VIEWS = ['login', 'register', 'dashboard', 'products', 'orders', 'users', 'reports'];
  const [view, setView] = useState('login');
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // โหลดสถานะหน้าล่าสุดจาก localStorage เมื่อเปิดเว็บ
  useEffect(() => {
    const savedView = localStorage.getItem('currentView');
    const savedUser = localStorage.getItem('currentUser');
    // Validate ก่อน — ถ้าค่าเก่าไม่ตรงกับหน้าที่มีอยู่ ให้ reset กลับ login
    if (savedView && VALID_VIEWS.includes(savedView)) {
      setView(savedView);
    } else if (savedView) {
      localStorage.removeItem('currentView');
    }
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentView');
      }
    }
    setIsLoaded(true);
  }, []);

  // บันทึกสถานะหน้าเมื่อมีการเปลี่ยนหน้า
  const handleSetView = (newView: string) => {
    setView(newView);
    localStorage.setItem('currentView', newView);
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    handleSetView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    handleSetView('login');
  };

  // ป้องกันการกระพริบหน้า Login ก่อนโหลดค่าเสร็จ
  if (!isLoaded) return <div className="min-h-screen bg-[#0F1014]"></div>;

  return (
    <>
      {view === 'login' && <Login onLogin={handleLogin} onSignUp={() => handleSetView('register')} />}
      {view === 'register' && <Register onNavigateToLogin={() => handleSetView('login')} />}
      
      {view === 'dashboard' && <DashBoardPage setCurrentPage={handleSetView} user={user} onLogout={handleLogout} />}
      {view === 'products' && <ProductPage setCurrentPage={handleSetView} user={user} onLogout={handleLogout} />}
      {view === 'orders' && <OrderPage setCurrentPage={handleSetView} user={user} onLogout={handleLogout} />}
      {view === 'users' && <UserManagePage setCurrentPage={handleSetView} user={user} onLogout={handleLogout} />}
      {view === 'reports' && <ReportPage setCurrentPage={handleSetView} user={user} onLogout={handleLogout} />}
    </>
  );
}
