import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Navigation, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'SUPER_ADMIN':
        return '/admin';
      case 'FACILITY_ADMIN':
        return '/facility-admin';
      case 'DELIVERY_PARTNER':
        return '/delivery-partner';
      case 'CUSTOMER':
      default:
        return '/dashboard';
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'FACILITY_ADMIN':
        return 'Facility Admin';
      case 'DELIVERY_PARTNER':
        return 'Delivery Partner';
      case 'CUSTOMER':
        return 'Customer';
      default:
        return user.role;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-midnight-800 to-midnight-950 border border-cyan-accent/30 p-2 flex items-center justify-center shadow-lg group-hover:border-cyan-accent transition-all duration-300">
            <img src="/logo.svg" alt="Antarmarg Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-wider text-slate-100 font-sans group-hover:text-cyan-accent transition-colors">
                ANTARMARG
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent font-semibold tracking-widest">
                LMI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
              Beyond the Entrance · To Exact Destination
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-cyan-accent transition-colors">
            Home
          </Link>
          <a href="/#facilities" className="text-sm font-medium text-slate-300 hover:text-cyan-accent transition-colors">
            Supported Facilities
          </a>
          <a href="/#how-it-works" className="text-sm font-medium text-slate-300 hover:text-cyan-accent transition-colors">
            How It Works
          </a>
          <a href="/#routing-preview" className="text-sm font-medium text-slate-300 hover:text-cyan-accent transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-accent" />
            Live Routing
          </a>
        </nav>

        {/* Action Controls / Auth Status */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to={getDashboardPath()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-midnight-800 border border-cyan-accent/30 text-cyan-accent hover:bg-cyan-accent/10 transition-all text-sm font-semibold shadow-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{getRoleLabel()} Dashboard</span>
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Log out"
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-accent/90 to-electric-blue text-midnight-950 hover:brightness-110 transition-all shadow-lg hover:shadow-cyan-accent/20 flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-3 bg-midnight-950/95 border-b border-slate-800">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Home
          </Link>
          <a
            href="/#facilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Supported Facilities
          </a>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            How It Works
          </a>
          <a
            href="/#routing-preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Live Routing Demo
          </a>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-lg bg-cyan-accent/10 border border-cyan-accent text-cyan-accent font-semibold"
                >
                  Go to {getRoleLabel()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 text-center text-red-400 hover:bg-red-500/10 rounded-lg text-sm"
                >
                  Log Out ({user.email})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-lg bg-slate-800 text-white font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 text-center rounded-lg bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
