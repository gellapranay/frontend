import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/navigation/Navbar';
import { FacilityMap } from '../components/maps/FacilityMap';
import { deliveryService } from '../services/delivery.service';
import { obstacleService } from '../services/obstacle.service';
import { routeService } from '../services/route.service';
import { facilityService } from '../services/facility.service';
import { 
  Delivery, 
  Obstacle, 
  RouteCalculationResponse, 
  ObstacleType, 
  LocationNode, 
  LocationEdge,
  Facility
} from '../types';
import { 
  Truck, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Phone, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DeliveryPartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteCalculationResponse | null>(null);
  const [facilityData, setFacilityData] = useState<Facility | null>(null);
  const [facilityObstacles, setFacilityObstacles] = useState<Obstacle[]>([]);

  // Obstacle Reporting Modal State
  const [showObstacleModal, setShowObstacleModal] = useState(false);
  const [obstacleType, setObstacleType] = useState<ObstacleType>('BLOCKED_ROAD');
  const [obstacleDescription, setObstacleDescription] = useState('');
  const [obstacleSeverity, setObstacleSeverity] = useState('HIGH');
  const [selectedEdgeIdToBlock, setSelectedEdgeIdToBlock] = useState<number | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const myDels = await deliveryService.getMyDeliveries();
      setActiveDeliveries(myDels);

      const avail = await deliveryService.getAvailableDeliveries();
      setAvailableDeliveries(avail);

      if (myDels.length > 0 && !selectedDelivery) {
        setSelectedDelivery(myDels[0]);
        loadDeliveryNavigation(myDels[0]);
      }
    } catch (err) {
      // ignore
    }
  };

  const loadDeliveryNavigation = async (del: Delivery) => {
    try {
      // Fetch full facility structure and route
      const struct = await facilityService.getFacilityStructure(del.facilityId);
      setFacilityData(struct);

      const obs = await obstacleService.getFacilityObstacles(del.facilityId);
      setFacilityObstacles(obs.filter((o) => o.status === 'ACTIVE'));

      const route = await routeService.recommendRoute({
        facilityId: del.facilityId,
        destinationNodeId: del.destinationNodeId,
      });
      setActiveRoute(route);
    } catch (err) {
      // ignore
    }
  };

  const handleSelectDelivery = (del: Delivery) => {
    setSelectedDelivery(del);
    loadDeliveryNavigation(del);
  };

  const handleAcceptDelivery = async (delId: number) => {
    try {
      const accepted = await deliveryService.acceptDelivery(delId);
      await fetchData();
      setSelectedDelivery(accepted);
      loadDeliveryNavigation(accepted);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept delivery');
    }
  };

  const handleStartDelivery = async (delId: number) => {
    try {
      const started = await deliveryService.startDelivery(delId);
      setSelectedDelivery(started);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start navigation');
    }
  };

  const handleArriveDelivery = async (delId: number) => {
    try {
      const arrived = await deliveryService.arriveDelivery(delId);
      setSelectedDelivery(arrived);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to mark arrival');
    }
  };

  const handleCompleteDelivery = async (delId: number) => {
    try {
      const completed = await deliveryService.completeDelivery(delId);
      setSelectedDelivery(completed);
      await fetchData();
      alert('Delivery marked as completed successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to complete delivery');
    }
  };

  const handleReportObstacle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    setIsReporting(true);
    try {
      await obstacleService.reportObstacle({
        facilityId: selectedDelivery.facilityId,
        locationEdgeId: selectedEdgeIdToBlock,
        obstacleType,
        description: obstacleDescription,
        severity: obstacleSeverity,
        durationMinutes: 180,
      });

      setShowObstacleModal(false);
      setObstacleDescription('');

      // Instantly trigger dynamic recalculation to find alternative route!
      const recalculated = await routeService.recalculateRoute(selectedDelivery.id);
      setActiveRoute(recalculated);

      // Refresh obstacle markers
      const obs = await obstacleService.getFacilityObstacles(selectedDelivery.facilityId);
      setFacilityObstacles(obs.filter((o) => o.status === 'ACTIVE'));

      alert('Obstacle reported! The route has been dynamically recalculated to bypass the blockage.');
    } catch (err) {
      alert('Failed to report obstacle');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Truck className="w-7 h-7 text-cyan-accent" />
              <span>Delivery Partner Navigation Console</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Vehicle: <strong>{user?.vehicleType || 'Motorbike'}</strong> · Plate: <strong>{user?.vehicleNumber || 'Registered'}</strong>
            </p>
          </div>

          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-midnight-800 border border-slate-700 text-slate-300 hover:text-cyan-accent flex items-center gap-2 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Pools</span>
          </button>
        </div>

        {/* Available Deliveries Banner (if any) */}
        {availableDeliveries.length > 0 && (
          <div className="glass-panel p-5 rounded-2xl border border-yellow-500/30 bg-midnight-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{availableDeliveries.length} Available Delivery Ready for Pickup</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableDeliveries.map((del) => (
                <div
                  key={del.id}
                  className="p-3.5 rounded-xl bg-midnight-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-cyan-accent block">{del.trackingNumber}</span>
                    <span className="text-slate-200 font-medium">{del.facilityName}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Dest: {del.destinationNodeName}</span>
                  </div>
                  <button
                    onClick={() => handleAcceptDelivery(del.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-accent text-midnight-950 font-bold hover:brightness-110 shrink-0 text-xs shadow"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Assignments Column */}
          <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 bg-midnight-800/90">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>My Active Deliveries</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {activeDeliveries.length}
              </span>
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {activeDeliveries.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-10">
                  No accepted deliveries. Accept a delivery from the available pool above.
                </div>
              ) : (
                activeDeliveries.map((del) => {
                  const isSelected = selectedDelivery?.id === del.id;
                  return (
                    <div
                      key={del.id}
                      onClick={() => handleSelectDelivery(del)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-accent/15 border-cyan-accent/60 shadow-lg'
                          : 'bg-midnight-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-cyan-accent">
                          {del.trackingNumber}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                          {del.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-100">{del.facilityName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Unit: {del.destinationNodeName}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-800">
                        <span>Recipient: {del.recipientName}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Turn-by-Turn Navigation & Leaflet Map Console */}
          <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 bg-midnight-800/90 space-y-6">
            {selectedDelivery ? (
              <>
                {/* Status Bar & Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-midnight-950 border border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Active Navigation State</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-pulse" />
                      <strong className="text-base text-cyan-accent font-mono font-bold">
                        {selectedDelivery.status.replace('_', ' ')}
                      </strong>
                    </div>
                  </div>

                  {/* Lifecycle Progression Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedDelivery.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleStartDelivery(selectedDelivery.id)}
                        className="px-4 py-2 rounded-xl font-bold bg-gradient-to-r from-cyan-accent to-electric-blue text-midnight-950 hover:brightness-110 shadow-lg text-xs"
                      >
                        Start Indoor Navigation
                      </button>
                    )}

                    {selectedDelivery.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleArriveDelivery(selectedDelivery.id)}
                        className="px-4 py-2 rounded-xl font-bold bg-amber-400 text-midnight-950 hover:brightness-110 shadow-lg text-xs"
                      >
                        Mark Arrival at Entrance
                      </button>
                    )}

                    {selectedDelivery.status === 'ARRIVED' && (
                      <button
                        onClick={() => handleCompleteDelivery(selectedDelivery.id)}
                        className="px-4 py-2 rounded-xl font-bold bg-emerald-400 text-midnight-950 hover:brightness-110 shadow-lg text-xs"
                      >
                        Complete Handover
                      </button>
                    )}

                    {selectedDelivery.status !== 'COMPLETED' && (
                      <button
                        onClick={() => setShowObstacleModal(true)}
                        className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:bg-red-500/20 text-xs flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Report Obstacle</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Leaflet Visual Map */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-accent" />
                      Interactive Facility Geo-Map ({selectedDelivery.facilityName})
                    </span>
                    <span className="text-cyan-accent">
                      Gate: {activeRoute?.recommendedGate?.name || 'Gate B'} · Dist: ~{Math.round(activeRoute?.totalDistanceMeters || 145)}m
                    </span>
                  </div>

                  <FacilityMap
                    centerLat={facilityData?.latitude || 17.4485}
                    centerLng={facilityData?.longitude || 78.3752}
                    zoom={17}
                    nodes={facilityData?.nodes || []}
                    edges={facilityData?.edges || []}
                    routeNodes={activeRoute?.pathNodes || []}
                    obstacles={facilityObstacles}
                    className="h-80 w-full rounded-xl overflow-hidden border border-slate-700/80 shadow-inner"
                  />
                </div>

                {/* Turn-by-Turn Waypoint Instructions */}
                <div>
                  <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-cyan-accent" />
                      Turn-by-Turn Navigation Checklist
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Step count: {activeRoute?.instructions?.length || 0}
                    </span>
                  </h4>

                  {activeRoute?.instructions ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {activeRoute.instructions.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="flex items-start gap-3 p-3 rounded-xl bg-midnight-950 border border-slate-800 text-xs"
                        >
                          <div className="w-6 h-6 rounded-full bg-cyan-accent/20 border border-cyan-accent/40 text-cyan-accent font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="text-slate-200 font-medium">{step.instruction}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Waypoint: {step.nodeName} ({step.nodeType})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-6">Loading turn-by-turn route...</div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-center text-slate-500">
                <Navigation className="w-10 h-10 text-slate-600 mb-2 animate-pulse" />
                <p className="text-sm">Select an active delivery on the left to start live navigation</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal: Report Obstacle & Dynamic Reroute */}
      {showObstacleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-red-500/30 bg-midnight-900 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Report Physical Obstacle & Trigger Reroute</span>
            </h3>

            <form onSubmit={handleReportObstacle} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Obstacle Classification</label>
                <select
                  value={obstacleType}
                  onChange={(e) => setObstacleType(e.target.value as ObstacleType)}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-red-400"
                >
                  <option value="BLOCKED_ROAD">Blocked Internal Road</option>
                  <option value="CLOSED_GATE">Closed / Locked Entry Gate</option>
                  <option value="LIFT_UNAVAILABLE">Elevator Out of Service / Under Repair</option>
                  <option value="STAIRCASE_BLOCKED">Staircase Inaccessible</option>
                  <option value="CONSTRUCTION">Paving or Structural Construction</option>
                  <option value="SECURITY_RESTRICTION">Security Checkpoint Clearance Denied</option>
                  <option value="PARKING_FULL">Parking / Loading Dock Full</option>
                  <option value="OTHER">Other Obstacle</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Select Pathway Segment to Block</label>
                <select
                  value={selectedEdgeIdToBlock || ''}
                  onChange={(e) => setSelectedEdgeIdToBlock(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-red-400"
                >
                  <option value="">-- General Facility Blockage --</option>
                  {facilityData?.edges?.map((edge) => (
                    <option key={edge.id} value={edge.id}>
                      {edge.sourceNodeName} → {edge.destinationNodeName} ({Math.round(edge.distanceMeters)}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Severity Level</label>
                <select
                  value={obstacleSeverity}
                  onChange={(e) => setObstacleSeverity(e.target.value)}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-red-400"
                >
                  <option value="HIGH">High (Completely Blocked)</option>
                  <option value="CRITICAL">Critical (Safety Hazard / Hazard Area)</option>
                  <option value="MEDIUM">Medium (Severe Delay)</option>
                  <option value="LOW">Low (Minor Congestion)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Description / Location Details</label>
                <textarea
                  rows={3}
                  required
                  value={obstacleDescription}
                  onChange={(e) => setObstacleDescription(e.target.value)}
                  placeholder="e.g. Lift 1 south door sensor failure; corridor closed for floor repainting"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-red-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowObstacleModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReporting}
                  className="px-5 py-2.5 rounded-lg font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg"
                >
                  {isReporting ? 'Submitting & Rerouting...' : 'Submit & Reroute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
