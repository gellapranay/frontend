import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Compass, 
  Layers, 
  ArrowRight, 
  AlertTriangle, 
  Accessibility, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Warehouse, 
  GraduationCap, 
  Hospital, 
  ShoppingBag, 
  Hotel,
  CornerDownRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { NetworkBackground } from '../components/animation/NetworkBackground';
import { HeroRouteIllustration } from '../components/animation/HeroRouteIllustration';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';
import { facilityService } from '../services/facility.service';
import { routeService } from '../services/route.service';
import { Facility, LocationNode, RouteCalculationResponse } from '../types';

export const LandingPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [facilityNodes, setFacilityNodes] = useState<LocationNode[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);
  const [requireAccessible, setRequireAccessible] = useState<boolean>(false);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteCalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const facs = await facilityService.getFacilities();
        setFacilities(facs);
        if (facs.length > 0) {
          setSelectedFacilityId(facs[0].id);
        }
      } catch (err) {
        // Fallback demo facilities if backend is initializing
      }
    };
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (!selectedFacilityId) return;
    const fetchStructure = async () => {
      try {
        const structure = await facilityService.getFacilityStructure(selectedFacilityId);
        if (structure.nodes) {
          const destinations = structure.nodes.filter(
            (n) => n.nodeType !== 'ENTRY_GATE' && n.nodeType !== 'INTERNAL_ROAD'
          );
          setFacilityNodes(destinations);
          if (destinations.length > 0) {
            setSelectedDestinationId(destinations[destinations.length - 1].id);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchStructure();
  }, [selectedFacilityId]);

  const handleCalculateRoute = async () => {
    if (!selectedFacilityId || !selectedDestinationId) return;
    setIsCalculating(true);
    try {
      const result = await routeService.recommendRoute({
        facilityId: selectedFacilityId,
        destinationNodeId: selectedDestinationId,
        requireAccessible,
      });
      setCalculatedRoute(result);
    } catch (err) {
      // ignore
    } finally {
      setIsCalculating(false);
    }
  };

  const facilitiesList = [
    {
      title: 'Apartments & Gated Communities',
      icon: Building2,
      example: 'Gate B → Tower B → Lobby → Lift 2 → Floor 12 → Flat B-1204',
      desc: 'Solves the multi-tower maze, floor-level security gates, and express delivery access.',
      tag: 'Residential',
    },
    {
      title: 'Universities & Colleges',
      icon: GraduationCap,
      example: 'Gate 2 → Engineering Way → CSE Block → Lift 2 → Floor 3 → Room 305',
      desc: 'Seamless routing across academic blocks, departments, labs, and seminar halls.',
      tag: 'Education',
    },
    {
      title: 'Hospitals & Medical Campuses',
      icon: Hospital,
      example: 'Service Gate → Block B → Stretcher Lift 3 → Floor 4 → Cardiology → Room 412',
      desc: 'Critical emergency gate prioritization, patient ward navigation, and wheelchair accessibility.',
      tag: 'Healthcare',
    },
    {
      title: 'Corporate Parks & IT Offices',
      icon: Compass,
      example: 'Gate 2 → Building Alpha → Reception → Lift 2 → Floor 8 → Office 804',
      desc: 'Security clearance checkpoints, visitor escort pathways, and executive tower suites.',
      tag: 'Enterprise',
    },
    {
      title: 'Warehouses & Logistics Hubs',
      icon: Warehouse,
      example: 'Truck Gate → Loading Dock 4 → Zone C → Aisle 7 → Rack 14 → Position 08',
      desc: 'High-density rack routing, forklift clearance validation, and dock coordination.',
      tag: 'Logistics',
    },
    {
      title: 'Shopping Malls & Retail',
      icon: ShoppingBag,
      example: 'Basement Parking B2 → Entrance B → Floor 3 → Zone C → Shop 3C-21',
      desc: 'Guiding shoppers and delivery agents straight from parking slots to specific storefronts.',
      tag: 'Commercial',
    },
    {
      title: 'Hotels & Luxury Resorts',
      icon: Hotel,
      example: 'Main Porte-Cochere → Royal Wing → Guest Lift → Floor 5 → Suite 502',
      desc: 'Room service optimization, guest baggage routing, and service elevator separation.',
      tag: 'Hospitality',
    },
    {
      title: 'Exhibition & Convention Centers',
      icon: Layers,
      example: 'VIP Gate → Hall A Grand Pavilion → Zone 1 → Booth 42 (Demo Area)',
      desc: 'Dynamic booth discovery, load-in vehicle routes, and temporary stall configurations.',
      tag: 'Events',
    },
  ];

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 relative">
      <NetworkBackground variant="network" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent text-xs font-mono font-semibold tracking-wider mb-6"
            >
              <Cpu className="w-3.5 h-3.5" />
              LAST-METER INTELLIGENCE (LMI) PLATFORM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
            >
              Navigation Doesn't End <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-accent via-blue-400 to-indigo-300">
                at the Gate.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Antarmarg connects outdoor navigation with intelligent internal routing, guiding
              deliveries and people from facility entrances to their <strong className="text-cyan-accent">exact destinations</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg shadow-cyan-accent/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#routing-preview"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold glass-panel text-slate-200 hover:text-cyan-accent hover:border-cyan-accent/40 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-accent" />
                <span>Try Live Route Preview</span>
              </a>
            </motion.div>
          </div>

          {/* Hero Navigation Concept Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <HeroRouteIllustration />
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 relative z-10 border-t border-slate-800/80 bg-midnight-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold text-cyan-accent uppercase tracking-widest mb-3">
              The Reality of Last-Meter Delivery
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Traditional GPS Fails Beyond the Gate
            </h3>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Standard GPS maps treat a 50-acre gated community or a 10-story medical campus as a single pin. The hardest 10% of the journey accounts for 50% of lost time and frustration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-xl border border-red-500/20 bg-midnight-900/60">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 mb-2">Wrong Gate Bottleneck</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Delivery agents arrive at Gate 1 only to learn that Tower C is strictly accessed via Gate 3, adding 15 minutes of confusion.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-yellow-500/20 bg-midnight-900/60">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 mb-2">Unreported Obstacles</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Closed corridors, broken elevators, or paving construction leave delivery partners trapped with heavy packages.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-blue-500/20 bg-midnight-900/60">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 mb-2">Vertical Navigation Blindspot</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Outdoor satellites cannot see floors, wings, or internal stairways. Indoor paths remain invisible.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-emerald-500/20 bg-midnight-900/60">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 mb-2">High Cost per Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lost time inside complexes reduces daily completed trips per driver and spikes delivery delay complaints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Journey Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-mono font-semibold text-cyan-accent uppercase tracking-widest mb-2">
              The Antarmarg Guarantee
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              End-to-End Last-Meter Intelligence
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              Continuous, unified guidance from outdoor roads directly into the exact unit.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-panel border border-cyan-accent/20 bg-midnight-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div className="p-4 rounded-xl bg-midnight-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">STEP 1</span>
                <div className="text-sm font-bold text-slate-200 mt-1">Public Road</div>
                <div className="text-[10px] text-slate-400 mt-0.5">GPS Navigation</div>
              </div>

              <div className="p-4 rounded-xl bg-midnight-900/80 border border-cyan-accent/40 shadow-sm shadow-cyan-accent/10">
                <span className="text-[10px] font-mono text-cyan-accent">STEP 2</span>
                <div className="text-sm font-bold text-cyan-accent mt-1">Recommended Gate</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Intelligent Gate Selection</div>
              </div>

              <div className="p-4 rounded-xl bg-midnight-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">STEP 3</span>
                <div className="text-sm font-bold text-slate-200 mt-1">Internal Roadway</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Vehicle Restrictions</div>
              </div>

              <div className="p-4 rounded-xl bg-midnight-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">STEP 4</span>
                <div className="text-sm font-bold text-slate-200 mt-1">Building / Tower</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Lobby Access & Check-in</div>
              </div>

              <div className="p-4 rounded-xl bg-midnight-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500">STEP 5</span>
                <div className="text-sm font-bold text-slate-200 mt-1">Floor / Lift / Aisle</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Accessibility Verified</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
                <span className="text-[10px] font-mono text-emerald-400">FINAL</span>
                <div className="text-sm font-bold text-emerald-400 mt-1">Exact Destination</div>
                <div className="text-[10px] text-slate-300 mt-0.5">Doorstep Handover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Route Preview Demo Section */}
      <section id="routing-preview" className="py-20 relative z-10 border-t border-slate-800 bg-midnight-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-cyan-accent/10 border border-cyan-accent/30 text-cyan-accent font-mono text-xs font-semibold">
              LIVE ENGINE DEMO
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
              Test Real Dijkstra Route Calculation
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              Select a facility and destination below to trigger real-time graph routing through our Spring Boot backend.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Panel */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 bg-midnight-900/80">
              <h4 className="font-bold text-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-accent" />
                <span>Configure Route Parameters</span>
              </h4>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">1. Select Facility</label>
                <select
                  value={selectedFacilityId || ''}
                  onChange={(e) => setSelectedFacilityId(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.facilityType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">2. Choose Exact Destination</label>
                <select
                  value={selectedDestinationId || ''}
                  onChange={(e) => setSelectedDestinationId(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  {facilityNodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} (Level {n.levelNumber || 0} · {n.nodeType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <input
                  type="checkbox"
                  id="requireAcc"
                  checked={requireAccessible}
                  onChange={(e) => setRequireAccessible(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-midnight-950 text-cyan-accent focus:ring-0"
                />
                <label htmlFor="requireAcc" className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <Accessibility className="w-4 h-4 text-cyan-accent" />
                  Require wheelchair / elevator accessible path
                </label>
              </div>

              <button
                onClick={handleCalculateRoute}
                disabled={isCalculating || !selectedFacilityId || !selectedDestinationId}
                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg shadow-cyan-accent/20 transition-all flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
                    <span>Calculating LMI Path...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Calculate Last-Meter Route</span>
                  </>
                )}
              </button>

              <div className="p-3.5 rounded-lg bg-midnight-950 border border-slate-800 text-[11px] text-slate-400">
                <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Dynamic Obstacle Awareness
                </div>
                Active obstacles in the database are dynamically factored in. If an edge is blocked, the engine instantly diverts to open alternatives.
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 bg-midnight-900/80 min-h-[380px]">
              {calculatedRoute ? (
                <div className="space-y-5">
                  {/* Summary Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-midnight-950 border border-cyan-accent/30">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-accent block uppercase">Recommended Entrance</span>
                      <span className="font-bold text-slate-100 text-base">{calculatedRoute.recommendedGate?.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">Distance</span>
                        <span className="font-bold text-slate-200">{Math.round(calculatedRoute.totalDistanceMeters)} meters</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block">Est. Time</span>
                        <span className="font-bold text-emerald-400">~{Math.ceil(calculatedRoute.estimatedTimeSeconds / 60)} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Rationale */}
                  <div className="p-3 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 text-xs text-cyan-accent">
                    <strong>LMI Rationale:</strong> {calculatedRoute.recommendationRationale}
                  </div>

                  {/* Ordered Navigation Instructions */}
                  <div>
                    <h5 className="text-xs font-mono font-semibold text-slate-300 uppercase mb-3">
                      Ordered Turn-by-Turn Navigation Steps ({calculatedRoute.instructions.length} steps)
                    </h5>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {calculatedRoute.instructions.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="flex items-start gap-3 p-2.5 rounded-lg bg-midnight-950/70 border border-slate-800 text-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-cyan-accent/20 text-cyan-accent font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {step.stepNumber}
                          </span>
                          <div className="flex-1">
                            <span className="text-slate-200 font-medium">{step.instruction}</span>
                            <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                              Waypoint: {step.nodeName} ({step.nodeType})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <Compass className="w-12 h-12 text-slate-600 mb-3 animate-pulse-slow" />
                  <p className="text-sm font-medium text-slate-400">No route calculated yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Select a facility and click <strong>Calculate Last-Meter Route</strong> to preview genuine path resolution.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Supported Facilities Section */}
      <section id="facilities" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold text-cyan-accent uppercase tracking-widest mb-2">
              Configurable Graph Hierarchy
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              Every Facility Type Supported Out-of-the-Box
            </h3>
            <p className="mt-3 text-slate-400 text-sm">
              Antarmarg adapts its parent-child hierarchy to fit any physical environment without schema alterations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilitiesList.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-800 bg-midnight-900/60 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-cyan-accent">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {fac.tag}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-base mb-2">{fac.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{fac.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-cyan-accent block uppercase">Example LMI Route:</span>
                    <span className="text-[11px] text-slate-300 font-mono block mt-0.5 leading-snug">
                      {fac.example}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Workflow Section */}
      <section id="how-it-works" className="py-20 relative z-10 border-t border-slate-800 bg-midnight-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono font-semibold text-cyan-accent uppercase tracking-widest mb-2">
              Precision Lifecycle
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Antarmarg Operates in 7 Steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center">
            {[
              { num: '01', title: 'Select Facility', desc: 'Identify target campus or building' },
              { num: '02', title: 'Specify Unit', desc: 'Select exact floor, room or flat' },
              { num: '03', title: 'Gate Scoring', desc: 'LMI selects closest open entry gate' },
              { num: '04', title: 'Navigate Path', desc: 'Turn-by-turn indoor instructions' },
              { num: '05', title: 'Report Obstacle', desc: 'Live blockage alert submission' },
              { num: '06', title: 'Dynamic Reroute', desc: 'Instant alternative recalculation' },
              { num: '07', title: 'Doorstep Arrival', desc: 'Delivery completion confirmation' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl glass-panel border border-slate-800 flex flex-col justify-center"
              >
                <div className="text-sm font-mono font-extrabold text-cyan-accent mb-1">{step.num}</div>
                <div className="text-xs font-bold text-slate-200 mb-1">{step.title}</div>
                <div className="text-[10px] text-slate-400">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Footer Banner */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-10 md:p-14 rounded-3xl border border-cyan-accent/30 bg-gradient-to-br from-midnight-800 via-midnight-900 to-midnight-950 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Experience the Future of Indoor Navigation
            </h3>
            <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
              Sign in with one of our preloaded demo accounts or create your own profile to explore our interactive graph builder, delivery tracking, and live dynamic rerouting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg shadow-cyan-accent/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Demo Portals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold glass-panel text-slate-200 hover:text-cyan-accent transition-all"
              >
                Register New User
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
