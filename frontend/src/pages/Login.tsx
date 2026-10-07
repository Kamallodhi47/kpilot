import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState<'signup' | 'signin'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let res;
      if (mode === 'signup') {
        res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
      } else {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Authentication failed');
      }

      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-white relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1920&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5
        }}
      />
      
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/">
          <img src="/img/nyx-logo.png" alt="NYX Logo" className="h-8 object-contain cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[420px] bg-[#0a0a0f] rounded-3xl p-8 sm:p-10 z-10 shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Subtle glow behind card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-purple-500/10 blur-[80px] pointer-events-none" />

        {/* Top Toggle */}
        <div className="flex bg-white/5 rounded-full p-1 mb-8 w-max relative z-10">
          <button 
            onClick={() => setMode('signup')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-[#2a2a35] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Sign in
          </button>
          <button 
            onClick={() => setMode('signin')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'signin' ? 'bg-[#2a2a35] text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Sign up
          </button>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2 nyx-font-heading relative z-10 tracking-tight">
          {mode === 'signup' ? 'Create ' : 'Welcome '}
          <span className="nyx-gradient-text nyx-font-serif italic font-normal text-4xl">
            {mode === 'signup' ? 'account.' : 'back.'}
          </span>
        </h1>
        <p className="text-gray-400 mb-8 text-sm relative z-10">
          {mode === 'signup' ? 'Create an account to build your workspace.' : 'Sign in to continue to your workspace.'}
        </p>

        {/* Google Button */}
        <button className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-white text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors mb-6 relative z-10">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6 relative z-10">
          <div className="flex-1 border-t border-white/10"></div>
          <span className="px-4 text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
            OR WITH EMAIL
          </span>
          <div className="flex-1 border-t border-white/10"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          {error && <div className="text-red-400 text-sm font-semibold text-center">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase">
                Password
              </label>
              {mode === 'signin' && (
                <a href="#" className="text-xs text-purple-400 hover:text-purple-300">Forgot password?</a>
              )}
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#5c3cbe] hover:bg-[#4a3299] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : (mode === 'signup' ? 'Sign in' : 'Sign up')} <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8 relative z-10">
          {mode === 'signup' ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button" 
            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} 
            className="text-white underline hover:text-gray-300 font-medium cursor-pointer"
          >
            {mode === 'signup' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

      </div>
    </div>
  );
}

