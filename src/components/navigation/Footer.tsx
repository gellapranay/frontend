import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-midnight-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-lg bg-midnight-900 border border-cyan-accent/30 p-1.5 flex items-center justify-center">
                <img src="/logo.svg" alt="Antarmarg" className="w-full h-full" />
              </div>
              <span className="font-extrabold text-xl text-slate-100 tracking-wider">
                ANTARMARG
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Universal Intelligent Internal Navigation & Last-Meter Delivery Platform powered by Last-Meter Intelligence (LMI).
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-accent/10 border border-cyan-accent/20 text-[11px] font-mono text-cyan-accent">
              <Cpu className="w-3.5 h-3.5" />
              <span>Dijkstra + PostGIS Engine</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-xs font-mono uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="/#facilities" className="hover:text-cyan-accent transition-colors">
                  Supported Facilities
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-cyan-accent transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#routing-preview" className="hover:text-cyan-accent transition-colors">
                  Route Calculator
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-accent transition-colors">
                  Partner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-xs font-mono uppercase tracking-wider">
              Facility Intelligence
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="hover:text-cyan-accent transition-colors cursor-pointer">Gated Communities & Towers</li>
              <li className="hover:text-cyan-accent transition-colors cursor-pointer">Healthcare Campuses & Hospitals</li>
              <li className="hover:text-cyan-accent transition-colors cursor-pointer">University & Research Parks</li>
              <li className="hover:text-cyan-accent transition-colors cursor-pointer">Fulfillment Centers & Warehouses</li>
            </ul>
          </div>

          {/* Architecture & Compliance */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-4 text-xs font-mono uppercase tracking-wider">
              Architecture
            </h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Designed as a final-year major engineering project and commercial platform. Spring Boot 3 + PostgreSQL + React + Vite.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WCAG 2.1 & Reduced Motion Aware</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Antarmarg. Universal Intelligent Internal Navigation Platform.
          </div>
          <div className="flex items-center space-x-6">
            <span>Primary Tagline: Beyond the Entrance. To the Exact Destination.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
