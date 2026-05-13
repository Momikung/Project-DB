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

interface UserData {
  email: string;
  name: string;
}

const VALID_VIEWS = ['login', 'register', 'dashboard', 'products', 'orders', 'users', 'reports'];

export default function MainApp() {
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentView');
      return (saved && VALID_VIEWS.includes(saved)) ? saved : 'login';
    }
    return 'login';
  });
  const [user, setUser] = useState<UserData | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setIsLoaded(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleSetView = (newView: string) => {
    setView(newView);
    localStorage.setItem('currentView', newView);
  };

  const handleLogin = (userData: UserData) => {
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
