"use client";
import React, { useState } from 'react';

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
  const [view, setView] = useState('login');

  return (
    <>
      {/* แก้ไขตรงนี้: เพิ่ม onSignUp ให้หน้า Login และเพิ่มเงื่อนไขสำหรับหน้า Register */}
      {view === 'login' && <Login onLogin={() => setView('dashboard')} onSignUp={() => setView('register')} />}
      {view === 'register' && <Register onNavigateToLogin={() => setView('login')} />}
      
      {/* หน้าอื่นๆ ยังคงเหมือนเดิม */}
      {view === 'dashboard' && <DashBoardPage setCurrentPage={setView} />}
      {view === 'products' && <ProductPage setCurrentPage={setView} />}
      {view === 'order' && <OrderPage setCurrentPage={setView} />}
      {view === 'users' && <UserManagePage setCurrentPage={setView} />}
      {view === 'reports' && <ReportPage setCurrentPage={setView} />}
    </>
  );
}