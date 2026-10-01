import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake login logic, redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md">
        
        {/* Top Toggle */}
        <div className="flex bg-white/5 rounded-full p-1 mb-10 w-max">
          <button 
            onClick={() => setMode('signup')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-[#2a2a35] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Sign up
          </button>
          <button 
            onClick={() => setMode('signin')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'signin' ? 'bg-[#2a2a35] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Sign in
          </button>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold mb-2 nyx-font-heading">
          {mode === 'signup' ? 'Create your ' : 'Sign in to your '}
          <span className="nyx-gradient-text nyx-font-serif italic font-normal">account.</span>
        </h1>
        <p className="text-gray-400 mb-8">
          {mode === 'signup' ? 'Create your account to get started.' : 'Welcome back, sign in to continue.'}
        </p>

        {/* Google Button */}
        <button className="w-full bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors mb-8">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-8">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-4 text-xs font-semibold text-gray-500 tracking-wider uppercase">
            Or with email
          </span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          Enter your email and create a secure password.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="you@brand.com"
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 tracking-wider uppercase mb-2">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#5b3ebf] hover:bg-[#4a3299] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          By signing up, you agree to our <a href="#" className="text-white underline hover:text-gray-300">Terms</a> and <a href="#" className="text-white underline hover:text-gray-300">Privacy Policy</a>.
        </p>

      </div>
    </div>
  );
}
