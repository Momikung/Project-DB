"use client";
import React, { useState } from 'react';

// Import ตามโครงสร้างไฟล์ของคุณเป๊ะๆ
import Login from './Login/Login'; 
import DashBoardPage from './Page/DashBoardPage';
import ProductPage from './Page/ProductPage';
import OrderPage from './Page/OrderPage';
import UserManagePage from './Page/UserManagePage';

export default function MainApp() {
  // ใช้ State เช็คว่าจะแสดงหน้าไหน (login เป็นหน้าแรก)
  const [view, setView] = useState('login');

  return (
    <>
      {view === 'login' && <Login onLogin={() => setView('dashboard')} />}
      {view === 'dashboard' && <DashBoardPage setCurrentPage={setView} />}
      {view === 'products' && <ProductPage setCurrentPage={setView} />}
      {view === 'order' && <OrderPage setCurrentPage={setView} />}
      {view === 'users' && <UserManagePage setCurrentPage={setView} />}
    </>
  );
}