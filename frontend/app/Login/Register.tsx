"use client";
import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGithub, FaFacebook, FaEnvelope } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function Register({ onNavigateToLogin }: { onNavigateToLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // ในอนาคตสามารถใส่โค้ดบันทึกข้อมูลสมัครสมาชิกตรงนี้ได้
    // สมัครเสร็จแล้วให้เด้งกลับไปหน้า Login
    onNavigateToLogin(); 
  };

  return (
    <div className="min-h-screen bg-[#2D2E37] flex items-center justify-center p-4 font-sans">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* ส่วนฟอร์ม Register ด้านซ้าย */}
        <div className="flex flex-col items-center md:items-start px-4 md:px-12">
          {/* Header */}
          <div className="text-center md:text-left mb-8 w-full flex flex-col items-center">
            <h1 className="text-4xl font-bold text-white tracking-widest uppercase mb-2">Sign Up</h1>
            <p className="text-gray-400 text-sm">Create a new account</p>
          </div>

          <form className="w-full space-y-4" onSubmit={handleRegister}>
            {/* ช่อง Username */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaUser /></span>
                <input type="text" required className="w-full bg-white rounded-full py-2 px-10 focus:outline-none text-gray-800" placeholder="Username" />
              </div>
            </div>

            {/* ช่อง Email */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaEnvelope /></span>
                <input type="email" required className="w-full bg-white rounded-full py-2 px-10 focus:outline-none text-gray-800" placeholder="Email Address" />
              </div>
            </div>

            {/* ช่อง Password */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaLock /></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-white rounded-full py-2 px-10 focus:outline-none text-gray-800" 
                  placeholder="Password" 
                />
                <span 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />} 
                </span>
              </div>
            </div>

            {/* ช่อง Confirm Password */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaLock /></span>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required
                  className="w-full bg-white rounded-full py-2 px-10 focus:outline-none text-gray-800" 
                  placeholder="Confirm Password" 
                />
                <span 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />} 
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#3B82F6] text-white py-3 rounded-full mt-6 font-semibold hover:bg-blue-600 transition duration-300 shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* Social Logins */}
          <div className="w-full text-center mt-6">
            <div className="flex justify-center space-x-4">
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FcGoogle className="text-red-500 text-xl" /></button>
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FaGithub className="text-black text-xl" /></button>
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FaFacebook className="text-blue-600 text-xl" /></button>
            </div>
          </div>
          
          {/* ลิงก์กลับไปหน้า Login */}
          <p className="w-full text-center mt-8 text-gray-300 text-sm">
            Already have an account? <button onClick={onNavigateToLogin} className="text-white font-bold hover:underline">Login</button>
          </p>
        </div>

        {/* รูปภาพประกอบด้านขวา */}
        <div className="hidden md:flex justify-center items-center relative">
            <div className="absolute w-[400px] h-[400px] bg-[#EBF5FF] rounded-full opacity-60 blur-3xl animate-pulse"></div>
            <img src="https://illustrations.popsy.co/white/graphic-design.svg" alt="Illustration" className="relative z-10 w-full max-w-md drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}