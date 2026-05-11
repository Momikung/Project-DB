"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGithub, FaFacebook, FaCheckCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function Login({ onLogin, onSignUp }: { onLogin: (user: any) => void, onSignUp: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // โหลด email จาก localStorage ถ้าเคยกด Remember Me ไว้
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // จัดการ Remember Me
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // สมมติว่า Login สำเร็จ
    onLogin({ email, name: email.split('@')[0] }); 
  };

  return (
    <div className="min-h-screen bg-[#2D2E37] flex items-center justify-center p-4 font-sans">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        <div className="flex flex-col items-center md:items-start px-4 md:px-12">
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
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaUser /></span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white rounded-full py-2 px-10 focus:outline-none text-gray-800" 
                  placeholder="Email" 
                />
                {email && <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500"><FaCheckCircle /></span>}
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-1 block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-900"><FaLock /></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  minLength={6}
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

            <div className="flex items-center justify-between text-[10px] text-gray-400 px-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-3 w-3" 
                />
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

          <div className="w-full text-center mt-6">
            <p className="text-gray-400 text-xs mb-4">or continue with</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FcGoogle className="text-red-500 text-xl" /></button>
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FaGithub className="text-black text-xl" /></button>
              <button className="bg-white p-2 rounded-lg w-16 flex justify-center hover:bg-gray-200 transition"><FaFacebook className="text-blue-600 text-xl" /></button>
            </div>
          </div>

          <p className="w-full text-center mt-8 text-gray-300 text-sm">
            Don't have account? <button type="button" onClick={onSignUp} className="text-white font-bold hover:underline">Sign up</button>
          </p>
        </div>

        <div className="hidden md:flex justify-center items-center relative">
            <div className="absolute w-[400px] h-[400px] bg-[#F5F5FF] rounded-full opacity-90 blur-3xl animate-pulse"></div>
            <img src="https://illustrations.popsy.co/white/work-from-home.svg" alt="Illustration" className="relative z-10 w-full max-w-md drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}