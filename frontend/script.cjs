const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf-8');

const oldForm = `        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="you@email.com"
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
              placeholder="        "
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#5c3cbe] hover:bg-[#4a3299] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
          >
            {mode === 'signup' ? 'Sign up' : 'Login'} <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>`;

const newForm = `        {/* Form */}
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
              placeholder="        "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={\`w-full bg-[#5c3cbe] hover:bg-[#4a3299] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 \${loading ? 'opacity-50 cursor-not-allowed' : ''}\`}
          >
            {loading ? 'Processing...' : (mode === 'signup' ? 'Sign up' : 'Login')} <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>`;

content = content.replace(oldForm, newForm);
fs.writeFileSync('src/pages/Login.tsx', content, 'utf-8');
console.log('done');
