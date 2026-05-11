"use client";
import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGithub, FaFacebook, FaCheckCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

// จุดที่ 1: เพิ่ม onSignUp เข้ามาใน Props
export default function Login({ onLogin, onSignUp }: { onLogin: () => void, onSignUp: () => void }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(); // สั่งให้สลับไปหน้า Dashboard
  };

  return (
    <div className="min-h-screen bg-[#2D2E37] flex items-center justify-center p-4 font-sans">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* ส่วนฟอร์ม Login ด้านซ้าย */}
        <div className="flex flex-col items-center md:items-start px-4 md:px-12">
          {/* Header และ โลโก้ */}
          <div className="text-center md:text-left mb-8 w-full flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border-4 border-gray-400">
                <div className="relative">
                    <FaUser className="text-4xl text-[#2D2E37]" />
                    <div className="absolute -bottom-1 -right-1 bg-[#2D2E37] rounded-full p-0.5">
                        <FaLock className="text-xs text-white" />
                    </div>
                </div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-widest uppercase">Login</h1>
          </div>

          <form className="w-full space-y-4" onSubmit={handleLogin}>
            {/* ช่อง Email */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaUser /></span>
                <input type="email" className="w-full bg-white rounded-full py-2 px-10 focus:outline-none text-gray-800" placeholder="Username or Email" />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500"><FaCheckCircle /></span>
              </div>
            </div>

            {/* ช่อง Password */}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaLock /></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password"
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

            {/* ส่วน Remember Me และปุ่ม Login */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 px-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="form-checkbox h-3 w-3" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="hover:underline">Forgot your password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#1A1B22] text-white py-3 rounded-full mt-4 font-semibold hover:bg-black transition duration-300 shadow-lg"
            >
              Login
            </button>
          </form>

          {/* Social Logins */}
          <div className="w-full text-center mt-6">
            <p className="text-gray-400 text-xs mb-4">or continue with</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FcGoogle className="text-red-500 text-xl" /></button>
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FaGithub className="text-black text-xl" /></button>
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FaFacebook className="text-blue-600 text-xl" /></button>
            </div>
          </div>

          {/* จุดที่ 2: เปลี่ยน <a href> เป็นปุ่ม <button> เพื่อรองรับ onClick โยกไปหน้า Sign Up */}
          <p className="w-full text-center mt-8 text-gray-300 text-sm">
            Don't have account? <button type="button" onClick={onSignUp} className="text-white font-bold hover:underline">Sign up</button>
          </p>
        </div>

        {/* รูปภาพประกอบด้านขวา */}
        <div className="hidden md:flex justify-center items-center relative">
            <div className="absolute w-[400px] h-[400px] bg-[#F5F5FF] rounded-full opacity-90 blur-3xl animate-pulse"></div>
            <img src="https://illustrations.popsy.co/white/work-from-home.svg" alt="Illustration" className="relative z-10 w-full max-w-md drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}