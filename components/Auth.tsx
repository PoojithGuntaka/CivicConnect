
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, Mail, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<Props> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('citizen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network request
    setTimeout(() => {
      // For demo purposes: if email contains 'admin', force official role during login
      // During signup, respect the selected role.
      const determinedRole = isLogin 
        ? (email.toLowerCase().includes('admin') ? 'official' : 'citizen')
        : role;

      const user: User = {
        id: Date.now().toString(),
        email,
        name: isLogin ? (name || email.split('@')[0]) : name,
        role: determinedRole
      };
      
      onLogin(user);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-blue-500 opacity-50"></div>
          <div className="relative z-10">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4 shadow-inner">
               <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">CivicConnect</h1>
            <p className="text-blue-100 text-sm">Digital Governance & Engagement</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex gap-4 mb-6 border-b border-slate-100 pb-1">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${isLogin ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${!isLogin ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={isLogin ? "user@example.com (use 'admin' for official)" : "name@example.com"}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
               <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setRole('citizen')}
                    className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${role === 'citizen' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="text-sm font-semibold">Citizen</div>
                  </div>
                  <div 
                    onClick={() => setRole('official')}
                    className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${role === 'official' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                  >
                    <div className="text-sm font-semibold">Official</div>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400 leading-relaxed">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>.
          </div>
        </div>
      </div>
    </div>
  );
};
