import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ShieldCheck, Building, CheckCircle2, ArrowRight } from 'lucide-react';

export const HeroRouteIllustration: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const stepsInfo = [
    { label: 'Public Road', desc: 'Standard GPS stops here' },
    { label: 'Gate B (Recommended)', desc: 'Intelligent Gate Selection' },
    { label: 'Internal Roadway', desc: 'Facility speed & vehicle rules' },
    { label: 'Tower B Lobby -> Lift 2', desc: 'Accessibility verified route' },
    { label: 'Floor 12 -> Flat B-1204', desc: 'Destination reached!' },
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto p-6 rounded-2xl glass-panel border border-cyan-accent/20 shadow-2xl overflow-hidden bg-midnight-800/90">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs font-mono text-cyan-accent pl-2 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-cyan-accent animate-pulse" />
            LMI ACTIVE ROUTING ENGINE
          </span>
        </div>
        <div className="text-xs font-mono bg-cyan-accent/10 text-cyan-accent px-2.5 py-1 rounded-full border border-cyan-accent/30">
          Latency: 12ms · Dijkstra+
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative aspect-[16/9] w-full bg-midnight-950/70 rounded-xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
        {/* Abstract Digital Map Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <svg viewBox="0 0 600 320" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3B82F6" />
              <stop offset="50%" stop-color="#67E8F9" />
              <stop offset="100%" stop-color="#22C55E" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Road Network Lines */}
          <path d="M 40 280 L 140 220 L 220 220" stroke="#1E293B" stroke-width="6" stroke-linecap="round" />
          <path d="M 220 220 L 320 160 L 420 160" stroke="#1E293B" stroke-width="6" stroke-linecap="round" />
          <path d="M 420 160 L 520 80" stroke="#1E293B" stroke-width="6" stroke-linecap="round" />

          {/* Facility Boundary Outline */}
          <rect x="180" y="40" width="380" height="240" rx="16" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 4" fill="rgba(17, 28, 47, 0.4)" />
          <text x="200" y="65" fill="#64748B" font-size="11" font-family="JetBrains Mono">FACILITY PERIMETER: GREEN VALLEY</text>

          {/* Blocked Gate A Alternative (Showing intelligent avoidance) */}
          <circle cx="210" cy="270" r="14" fill="#EF4444" fill-opacity="0.15" stroke="#EF4444" stroke-width="1.5" />
          <text x="204" y="274" fill="#EF4444" font-size="11" font-weight="bold">✕</text>
          <text x="232" y="274" fill="#EF4444" font-size="9" font-family="JetBrains Mono">Gate A (Maintenance Obstacle)</text>

          {/* Active Navigation Animated Path */}
          <motion.path
            d="M 60 265 L 140 220 L 220 220 L 320 160 L 420 160 L 500 90"
            stroke="url(#pathGradient)"
            stroke-width="4.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="url(#glowEffect)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (step + 1) / 5 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Waypoint 1: Origin */}
          <g transform="translate(60, 265)">
            <circle cx="0" cy="0" r="7" fill="#3B82F6" />
            <circle cx="0" cy="0" r="14" stroke="#3B82F6" stroke-width="1.5" opacity="0.4" />
          </g>

          {/* Waypoint 2: Recommended Gate B */}
          <g transform="translate(220, 220)">
            <circle cx="0" cy="0" r="8" fill="#67E8F9" />
            <circle cx="0" cy="0" r="16" stroke="#67E8F9" stroke-width="1.5" opacity="0.5" />
            <text x="14" y="4" fill="#67E8F9" font-size="11" font-weight="600">Gate B</text>
          </g>

          {/* Waypoint 3: Internal Road */}
          <g transform="translate(320, 160)">
            <circle cx="0" cy="0" r="6" fill="#3B82F6" />
          </g>

          {/* Waypoint 4: Tower B Lobby & Lift */}
          <g transform="translate(420, 160)">
            <circle cx="0" cy="0" r="7" fill="#67E8F9" />
            <text x="12" y="-8" fill="#94A3B8" font-size="10">Tower B Lift</text>
          </g>

          {/* Waypoint 5: Exact Destination Pin */}
          <g transform="translate(500, 90)">
            <motion.circle
              cx="0"
              cy="0"
              r="10"
              fill="#22C55E"
              filter="url(#glowEffect)"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            <motion.circle
              cx="0"
              cy="0"
              r="20"
              stroke="#22C55E"
              stroke-width="1.5"
              stroke-dasharray="3 3"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            />
          </g>
        </svg>

        {/* Destination Reached Badge Overlay */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-6 right-6 bg-emerald-500/90 text-white font-medium text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            Destination reached: Flat B-1204
          </motion.div>
        )}
      </div>

      {/* Step Progression Timeline Below */}
      <div className="mt-5 grid grid-cols-5 gap-2 text-center">
        {stepsInfo.map((s, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg transition-all duration-300 border ${
              idx <= step
                ? 'bg-cyan-accent/10 border-cyan-accent/40 text-cyan-accent'
                : 'bg-slate-800/40 border-slate-700/40 text-slate-500'
            }`}
          >
            <div className="text-[11px] font-semibold truncate">{s.label}</div>
            <div className="text-[9px] text-slate-400 truncate mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
