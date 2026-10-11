import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/navigation/Navbar';
import { deliveryService } from '../services/delivery.service';
import { facilityService } from '../services/facility.service';
import { routeService } from '../services/route.service';
import { Delivery, Facility, LocationNode, RouteCalculationResponse } from '../types';
import { 
  Package, 
  Plus, 
  Navigation, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Star, 
  Search,
  Truck,
  Building,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteCalculationResponse | null>(null);

  // Create Delivery Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formFacilityId, setFormFacilityId] = useState<number | null>(null);
  const [facilityDestinations, setFacilityDestinations] = useState<LocationNode[]>([]);
  const [formDestinationId, setFormDestinationId] = useState<number | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [accessInstructions, setAccessInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  useEffect(() => {
    fetchDeliveries();
    fetchFacilities();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const data = await deliveryService.getMyDeliveries();
      setDeliveries(data);
      if (data.length > 0 && !selectedDelivery) {
        setSelectedDelivery(data[0]);
        loadRouteDetails(data[0]);
      }
    } catch (err) {
      // ignore
    }
  };

  const fetchFacilities = async () => {
    try {
      const facs = await facilityService.getFacilities();
      setFacilities(facs);
      if (facs.length > 0) {
        setFormFacilityId(facs[0].id);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (!formFacilityId) return;
    const fetchNodes = async () => {
      try {
        const struct = await facilityService.getFacilityStructure(formFacilityId);
        if (struct.nodes) {
          const dests = struct.nodes.filter(
            (n) => n.nodeType !== 'ENTRY_GATE' && n.nodeType !== 'INTERNAL_ROAD'
          );
          setFacilityDestinations(dests);
          if (dests.length > 0) {
            setFormDestinationId(dests[0].id);
          }
        }
      } catch (err) {
        // ignore
      }
    };
    fetchNodes();
  }, [formFacilityId]);

  const loadRouteDetails = async (delivery: Delivery) => {
    try {
      const route = await routeService.recommendRoute({
        facilityId: delivery.facilityId,
        destinationNodeId: delivery.destinationNodeId,
      });
      setActiveRoute(route);
    } catch (err) {
      // ignore
    }
  };

  const handleSelectDelivery = (del: Delivery) => {
    setSelectedDelivery(del);
    loadRouteDetails(del);
  };

  const handleCreateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFacilityId || !formDestinationId) return;

    setIsSubmitting(true);
    try {
      const created = await deliveryService.createDelivery({
        facilityId: formFacilityId,
        destinationNodeId: formDestinationId,
        recipientName,
        recipientPhone,
        deliveryDescription,
        landmark,
        accessInstructions,
      });

      setShowCreateModal(false);
      setRecipientName('');
      setRecipientPhone('');
      setDeliveryDescription('');
      setLandmark('');
      setAccessInstructions('');
      await fetchDeliveries();
      setSelectedDelivery(created);
      loadRouteDetails(created);
    } catch (err) {
      alert('Failed to create delivery');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedDelivery) return;
    try {
      await deliveryService.submitFeedback(selectedDelivery.id, {
        rating: feedbackRating,
        comment: feedbackComment,
      });
      setShowFeedbackModal(false);
      alert('Feedback recorded. Thank you!');
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Package className="w-7 h-7 text-cyan-accent" />
              <span>Customer Delivery Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Welcome back, <strong>{user?.name}</strong>. Create deliveries and track last-meter indoor routing.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg shadow-cyan-accent/20 transition-all flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Delivery</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-midnight-800/80">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Deliveries</span>
            <div className="text-2xl font-extrabold text-white mt-1">{deliveries.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Dispatched to registered facilities</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-cyan-accent/30 bg-midnight-800/80">
            <span className="text-xs font-mono text-cyan-accent uppercase">In Transit / Active</span>
            <div className="text-2xl font-extrabold text-cyan-accent mt-1">
              {deliveries.filter((d) => d.status === 'IN_PROGRESS' || d.status === 'ACCEPTED' || d.status === 'CREATED').length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Guided via Last-Meter Intelligence</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-midnight-800/80">
            <span className="text-xs font-mono text-emerald-400 uppercase">Completed</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">
              {deliveries.filter((d) => d.status === 'COMPLETED').length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Delivered to exact doorstep</div>
          </div>
        </div>

        {/* Split Console: Deliveries List & Live Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Deliveries List */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 bg-midnight-800/90">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>My Delivery Requests</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {deliveries.length}
                </span>
              </h2>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {deliveries.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No deliveries requested yet. Click <strong>Create New Delivery</strong> above.
                </div>
              ) : (
                deliveries.map((del) => {
                  const isSelected = selectedDelivery?.id === del.id;
                  return (
                    <div
                      key={del.id}
                      onClick={() => handleSelectDelivery(del)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-accent/10 border-cyan-accent/50 shadow-md'
                          : 'bg-midnight-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-cyan-accent">
                          {del.trackingNumber}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                            del.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : del.status === 'IN_PROGRESS'
                              ? 'bg-cyan-accent/20 text-cyan-accent'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {del.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {del.facilityName}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Unit: {del.destinationNodeName}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80">
                        <span>Recipient: {del.recipientName}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Tracker & LMI Indoor Instructions */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 bg-midnight-800/90 space-y-6">
            {selectedDelivery ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Tracking ID</span>
                    <h3 className="text-xl font-mono font-bold text-cyan-accent">{selectedDelivery.trackingNumber}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedDelivery.status === 'COMPLETED' && (
                      <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 transition-all flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Rate Route Accuracy</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Meta Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-midnight-950 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Target Facility</span>
                    <strong className="text-slate-200">{selectedDelivery.facilityName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Exact Unit</span>
                    <strong className="text-slate-200">{selectedDelivery.destinationNodeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Gate Entrance</span>
                    <strong className="text-cyan-accent">{selectedDelivery.recommendedGateName || 'Gate Recommended'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-mono block">Partner Assigned</span>
                    <strong className="text-slate-200">{selectedDelivery.deliveryPartnerName || 'Unassigned'}</strong>
                  </div>
                </div>

                {/* Rationale & Obstacle Alert */}
                {activeRoute?.obstaclesAvoided && activeRoute.obstaclesAvoided.length > 0 && (
                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Dynamic Rerouting Notice:</strong> The engine bypassed {activeRoute.obstaclesAvoided.length} active reported obstacle(s) inside this facility.
                    </div>
                  </div>
                )}

                {/* Turn-by-Turn Last-Meter Steps */}
                <div>
                  <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase mb-3 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-cyan-accent" />
                    <span>LMI Indoor Turn-by-Turn Waypoints</span>
                  </h4>

                  {activeRoute?.instructions ? (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                      {activeRoute.instructions.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="flex items-start gap-3 p-3 rounded-xl bg-midnight-950 border border-slate-800 text-xs"
                        >
                          <div className="w-6 h-6 rounded-full bg-cyan-accent/20 border border-cyan-accent/40 text-cyan-accent font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="text-slate-200 font-medium">{step.instruction}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Waypoint: {step.nodeName} ({step.nodeType}) · {Math.round(step.distanceMeters)}m
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-6 text-center">Loading route instructions...</div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
                <Package className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-sm">Select a delivery to view route progress and tracking details</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal: Create Delivery */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-cyan-accent/30 bg-midnight-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-accent" />
              <span>Create Last-Meter Delivery Request</span>
            </h3>

            <form onSubmit={handleCreateDelivery} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">1. Select Target Facility</label>
                <select
                  value={formFacilityId || ''}
                  onChange={(e) => setFormFacilityId(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.facilityType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">2. Exact Internal Destination (Hierarchy)</label>
                <select
                  value={formDestinationId || ''}
                  onChange={(e) => setFormDestinationId(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  {facilityDestinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (Level {d.levelNumber || 0} · {d.nodeType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Recipient Phone</label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+91 9849012345"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Package Contents / Notes</label>
                <input
                  type="text"
                  value={deliveryDescription}
                  onChange={(e) => setDeliveryDescription(e.target.value)}
                  placeholder="e.g. Urgent Medical supplies, documents, or groceries"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Internal Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Tower B south elevator bank"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Gate / Doorstep Access Code or Notes</label>
                <textarea
                  rows={2}
                  value={accessInstructions}
                  onChange={(e) => setAccessInstructions(e.target.value)}
                  placeholder="e.g. Dial #1204 on intercom for lobby door release"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 transition-all"
                >
                  {isSubmitting ? 'Dispatching...' : 'Dispatch Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Feedback */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-800 bg-midnight-900 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Rate Last-Meter Route Accuracy</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-2">Did the route reach your doorstep accurately?</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 text-yellow-400 focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= feedbackRating ? 'fill-current' : 'opacity-30'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Optional Comments</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="e.g. Lift 2 was very quick; instructions were clear"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  className="px-5 py-2.5 rounded-lg font-bold bg-cyan-accent text-midnight-950 hover:brightness-110"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
