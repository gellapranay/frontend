import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NetworkBackground } from '../components/animation/NetworkBackground';
import { Navbar } from '../components/navigation/Navbar';
import { Lock, Mail, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, UserCheck, Truck, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(email, password);
      redirectByRole(user.role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectByRole = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        navigate('/admin');
        break;
      case 'FACILITY_ADMIN':
        navigate('/facility-admin');
        break;
      case 'DELIVERY_PARTNER':
        navigate('/delivery-partner');
        break;
      case 'CUSTOMER':
      default:
        navigate('/dashboard');
        break;
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex flex-col relative">
      <NetworkBackground variant="route" />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 z-10 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Card Container */}
          <div className="glass-panel p-8 rounded-2xl border border-cyan-accent/20 shadow-2xl bg-midnight-800/90">
            <div className="text-center mb-6">
              <div className="inline-flex w-12 h-12 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 p-2 items-center justify-center text-cyan-accent mb-3">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Sign In to Antarmarg</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Last-Meter Intelligence Access Gateway
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-slate-300">Password</label>
                  <Link to="/forgot-password" className="text-[11px] text-cyan-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg shadow-cyan-accent/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700/80 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-accent font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          </div>

          {/* Quick 1-Click Evaluator Demo Accounts */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 bg-midnight-900/80">
            <div className="text-[11px] font-mono font-semibold text-cyan-accent uppercase tracking-wider mb-2.5 text-center">
              ⚡ 1-Click Evaluator Demo Accounts
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer@antarmarg.com', 'Customer@123')}
                className="p-2.5 rounded-lg bg-midnight-950 border border-slate-700 hover:border-cyan-accent flex items-center gap-2 text-left transition-colors"
              >
                <UserCheck className="w-4 h-4 text-cyan-accent shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Customer</div>
                  <div className="text-[9px] text-slate-500 font-mono">Create & Track</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('driver@antarmarg.com', 'Driver@123')}
                className="p-2.5 rounded-lg bg-midnight-950 border border-slate-700 hover:border-cyan-accent flex items-center gap-2 text-left transition-colors"
              >
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Delivery Partner</div>
                  <div className="text-[9px] text-slate-500 font-mono">Live Navigation</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@greenvalley.com', 'Facility@123')}
                className="p-2.5 rounded-lg bg-midnight-950 border border-slate-700 hover:border-cyan-accent flex items-center gap-2 text-left transition-colors"
              >
                <Building2 className="w-4 h-4 text-yellow-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Facility Admin</div>
                  <div className="text-[9px] text-slate-500 font-mono">Graph Builder</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('superadmin@antarmarg.com', 'Admin@Antarmarg2026')}
                className="p-2.5 rounded-lg bg-midnight-950 border border-slate-700 hover:border-cyan-accent flex items-center gap-2 text-left transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">Super Admin</div>
                  <div className="text-[9px] text-slate-500 font-mono">Full Metrics & Approvals</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
