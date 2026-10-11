import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NetworkBackground } from '../components/animation/NetworkBackground';
import { Navbar } from '../components/navigation/Navbar';
import { authService } from '../services/auth.service';
import { UserCheck, Truck, Building2, ArrowRight, UserPlus, Mail, Lock, Phone, User, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'CUSTOMER' | 'DELIVERY_PARTNER' | 'FACILITY_ADMIN'>('CUSTOMER');

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delivery Partner Fields
  const [vehicleType, setVehicleType] = useState('Motorbike');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [serviceArea, setServiceArea] = useState('');

  // Facility Admin Fields
  const [organization, setOrganization] = useState('');
  const [facilityAccessRequest, setFacilityAccessRequest] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'CUSTOMER') {
        await authService.registerCustomer({ name, email, phone, password });
      } else if (role === 'DELIVERY_PARTNER') {
        await authService.registerDeliveryPartner({
          name,
          email,
          phone,
          password,
          vehicleType,
          vehicleNumber,
          serviceArea,
        });
      } else if (role === 'FACILITY_ADMIN') {
        await authService.registerFacilityAdmin({
          name,
          email,
          phone,
          password,
          organization,
          facilityAccessRequest,
        });
      }

      setSuccess('Account created successfully! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex flex-col relative">
      <NetworkBackground variant="route" />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 z-10 py-12">
        <div className="w-full max-w-lg space-y-6">
          <div className="glass-panel p-8 rounded-2xl border border-cyan-accent/20 shadow-2xl bg-midnight-800/90">
            <div className="text-center mb-6">
              <div className="inline-flex w-12 h-12 rounded-xl bg-cyan-accent/10 border border-cyan-accent/30 p-2 items-center justify-center text-cyan-accent mb-3">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Join Antarmarg</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Select your account role to continue
              </p>
            </div>

            {/* Role Tab Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-midnight-950 border border-slate-800 mb-6 text-xs">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                  role === 'CUSTOMER'
                    ? 'bg-cyan-accent/15 border border-cyan-accent/40 text-cyan-accent shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('DELIVERY_PARTNER')}
                className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                  role === 'DELIVERY_PARTNER'
                    ? 'bg-cyan-accent/15 border border-cyan-accent/40 text-cyan-accent shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Partner</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('FACILITY_ADMIN')}
                className={`py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-all ${
                  role === 'FACILITY_ADMIN'
                    ? 'bg-cyan-accent/15 border border-cyan-accent/40 text-cyan-accent shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Facility Admin</span>
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-midnight-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Partner Specific Fields */}
              {role === 'DELIVERY_PARTNER' && (
                <div className="p-4 rounded-xl bg-midnight-950/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-cyan-accent font-semibold uppercase">
                    Delivery Partner Vehicle Details
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Vehicle Type</label>
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full bg-midnight-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-accent"
                      >
                        <option value="Motorbike">Motorbike</option>
                        <option value="Scooter">Electric Scooter</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Van">Delivery Van</option>
                        <option value="Foot">On Foot (Internal Porter)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Vehicle Registration #</label>
                      <input
                        type="text"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        placeholder="TS-09-AB-1234"
                        className="w-full bg-midnight-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Preferred Service Area</label>
                    <input
                      type="text"
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      placeholder="HITEC City, Madhapur, Financial District"
                      className="w-full bg-midnight-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>
              )}

              {/* Facility Admin Specific Fields */}
              {role === 'FACILITY_ADMIN' && (
                <div className="p-4 rounded-xl bg-midnight-950/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-mono text-cyan-accent font-semibold uppercase">
                    Facility Authority Credentials
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Organization / Association</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Green Valley Residents Welfare Association"
                      className="w-full bg-midnight-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Facility Name for Management Access</label>
                    <input
                      type="text"
                      value={facilityAccessRequest}
                      onChange={(e) => setFacilityAccessRequest(e.target.value)}
                      placeholder="e.g. Green Valley Apartments, Madhapur"
                      className="w-full bg-midnight-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-accent"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg shadow-cyan-accent/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-midnight-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create {role.replace('_', ' ')} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-700/80 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-accent font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
