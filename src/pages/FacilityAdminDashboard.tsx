import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/navigation/Navbar';
import { FacilityGraphCanvas } from '../components/maps/FacilityGraphCanvas';
import { facilityService } from '../services/facility.service';
import { obstacleService } from '../services/obstacle.service';
import { Facility, LocationNode, LocationEdge, Obstacle, NodeType } from '../types';
import { 
  Building2, 
  Layers, 
  Plus, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  RefreshCw,
  Compass,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const FacilityAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);
  const [facilityData, setFacilityData] = useState<Facility | null>(null);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  // Modals
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showAddEdgeModal, setShowAddEdgeModal] = useState(false);

  // New Node Form State
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState<NodeType>('ROOM');
  const [parentNodeId, setParentNodeId] = useState<number | null>(null);
  const [nodeLevel, setNodeLevel] = useState(0);

  // New Edge Form State
  const [sourceNodeId, setSourceNodeId] = useState<number | null>(null);
  const [destinationNodeId, setDestinationNodeId] = useState<number | null>(null);
  const [edgeDistance, setEdgeDistance] = useState(25.0);
  const [edgeTime, setEdgeTime] = useState(20);
  const [isAccessible, setIsAccessible] = useState(true);
  const [allowVehicles, setAllowVehicles] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const facs = await facilityService.getFacilities();
      setFacilities(facs);
      if (facs.length > 0 && !selectedFacilityId) {
        setSelectedFacilityId(facs[0].id);
        loadFacilityDetails(facs[0].id);
      }
    } catch (err) {
      // ignore
    }
  };

  const loadFacilityDetails = async (facId: number) => {
    try {
      const struct = await facilityService.getFacilityStructure(facId);
      setFacilityData(struct);

      const obs = await obstacleService.getFacilityObstacles(facId);
      setObstacles(obs);
    } catch (err) {
      // ignore
    }
  };

  const handleSelectFacility = (id: number) => {
    setSelectedFacilityId(id);
    loadFacilityDetails(id);
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityId) return;

    try {
      await facilityService.addNode(selectedFacilityId, {
        name: nodeName,
        nodeType,
        parentNodeId,
        levelNumber: nodeLevel,
      });
      setShowAddNodeModal(false);
      setNodeName('');
      loadFacilityDetails(selectedFacilityId);
    } catch (err) {
      alert('Failed to add node');
    }
  };

  const handleAddEdge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityId || !sourceNodeId || !destinationNodeId) return;

    try {
      await facilityService.addEdge(selectedFacilityId, {
        sourceNodeId,
        destinationNodeId,
        distanceMeters: edgeDistance,
        estimatedTimeSeconds: edgeTime,
        isAccessible,
        allowVehicles,
        isBidirectional: true,
      });
      setShowAddEdgeModal(false);
      loadFacilityDetails(selectedFacilityId);
    } catch (err) {
      alert('Failed to add connection');
    }
  };

  const handleToggleEdge = async (edgeId: number, currentStatus: string) => {
    if (!selectedFacilityId) return;
    const newStatus = currentStatus === 'OPEN' ? 'BLOCKED' : 'OPEN';
    try {
      await facilityService.toggleEdgeStatus(selectedFacilityId, edgeId, newStatus);
      loadFacilityDetails(selectedFacilityId);
    } catch (err) {
      alert('Failed to update edge status');
    }
  };

  const handleResolveObstacle = async (obsId: number) => {
    try {
      await obstacleService.resolveObstacle(obsId);
      if (selectedFacilityId) {
        loadFacilityDetails(selectedFacilityId);
      }
      alert('Obstacle marked resolved; pathway reopened!');
    } catch (err) {
      alert('Failed to resolve obstacle');
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
              <Building2 className="w-7 h-7 text-cyan-accent" />
              <span>Facility Administration & Map Builder</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure universal parent-child location nodes, path edges, accessibility flags, and temporary route closures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedFacilityId || ''}
              onChange={(e) => handleSelectFacility(Number(e.target.value))}
              className="bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-accent"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.facilityType})
                </option>
              ))}
            </select>

            <button
              onClick={() => selectedFacilityId && loadFacilityDetails(selectedFacilityId)}
              className="p-2.5 rounded-xl bg-midnight-800 border border-slate-700 text-slate-300 hover:text-cyan-accent"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls & Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Location Nodes</span>
            <div className="text-2xl font-extrabold text-white mt-1">
              {facilityData?.nodes?.length || 0}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Gates, towers, floors & rooms</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Graph Connections</span>
            <div className="text-2xl font-extrabold text-cyan-accent mt-1">
              {facilityData?.edges?.length || 0}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Physical walkable/driveable paths</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Active Obstacles</span>
            <div className="text-2xl font-extrabold text-red-400 mt-1">
              {obstacles.filter((o) => o.status === 'ACTIVE').length}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Reported physical blockages</div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-2">
            <button
              onClick={() => setShowAddNodeModal(true)}
              className="flex-1 py-2 px-3 rounded-lg bg-cyan-accent/15 border border-cyan-accent/40 text-cyan-accent font-bold hover:bg-cyan-accent/25 text-xs flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Node</span>
            </button>
            <button
              onClick={() => setShowAddEdgeModal(true)}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-400 font-bold hover:bg-blue-500/25 text-xs flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Edge</span>
            </button>
          </div>
        </div>

        {/* Interactive 2D Facility Graph Canvas */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-accent" />
              <span>Interactive Floor Plan & Graph Hierarchy Editor</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Changes persist instantly to PostgreSQL
            </span>
          </div>

          <FacilityGraphCanvas
            nodes={facilityData?.nodes || []}
            edges={facilityData?.edges || []}
          />
        </div>

        {/* Pathway Edge Control & Active Obstacle Resolution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pathway Closure Toggles */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Pathway Closure Management</span>
              <span className="text-xs text-slate-400">{facilityData?.edges?.length || 0} Total</span>
            </h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {facilityData?.edges?.map((edge) => {
                const isOpen = edge.status === 'OPEN';
                return (
                  <div
                    key={edge.id}
                    className="p-3 rounded-xl bg-midnight-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">
                        {edge.sourceNodeName} ⟷ {edge.destinationNodeName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Distance: {Math.round(edge.distanceMeters)}m · {edge.isAccessible ? 'Accessible' : 'Inaccessible'}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleEdge(edge.id, edge.status)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 ${
                        isOpen
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                      }`}
                    >
                      <span>{isOpen ? 'OPEN' : 'BLOCKED'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Obstacles Review & Instant Resolution */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Facility Obstacle Monitoring</span>
              <span className="text-xs text-red-400">
                {obstacles.filter((o) => o.status === 'ACTIVE').length} Active
              </span>
            </h3>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {obstacles.filter((o) => o.status === 'ACTIVE').length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-10 flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
                  <span>No active blockages reported in this facility.</span>
                </div>
              ) : (
                obstacles
                  .filter((o) => o.status === 'ACTIVE')
                  .map((obs) => (
                    <div
                      key={obs.id}
                      className="p-3.5 rounded-xl bg-midnight-950 border border-red-500/30 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-red-400">{obs.obstacleType}</div>
                        <p className="text-slate-300 text-[11px] mt-0.5">{obs.description}</p>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1">
                          Reported by: {obs.reportedByName || 'Staff'} · Severity: {obs.severity}
                        </span>
                      </div>

                      <button
                        onClick={() => handleResolveObstacle(obs.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-midnight-950 font-bold hover:brightness-110 shrink-0 text-xs shadow"
                      >
                        Resolve & Reopen
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Add Node */}
      {showAddNodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-cyan-accent/30 bg-midnight-900 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-accent" />
              <span>Add Location Node</span>
            </h3>

            <form onSubmit={handleAddNode} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Node Name</label>
                <input
                  type="text"
                  required
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="e.g. Tower C Lobby, Room 405, Lift 3"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Node Type (Hierarchy Component)</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value as NodeType)}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  <option value="ENTRY_GATE">Entry Gate</option>
                  <option value="INTERNAL_ROAD">Internal Road</option>
                  <option value="BUILDING">Building</option>
                  <option value="TOWER">Tower</option>
                  <option value="BLOCK">Block</option>
                  <option value="FLOOR">Floor</option>
                  <option value="ZONE">Zone</option>
                  <option value="CORRIDOR">Corridor</option>
                  <option value="AISLE">Aisle</option>
                  <option value="LIFT">Lift / Elevator</option>
                  <option value="STAIRCASE">Staircase</option>
                  <option value="FLAT">Flat / Apartment</option>
                  <option value="ROOM">Room / Ward</option>
                  <option value="OFFICE">Office Suite</option>
                  <option value="SHOP">Retail Shop</option>
                  <option value="RACK">Warehouse Rack</option>
                  <option value="POSITION">Storage Position</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Parent Hierarchy Node (Optional)</label>
                <select
                  value={parentNodeId || ''}
                  onChange={(e) => setParentNodeId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  <option value="">-- No Parent (Root Level) --</option>
                  {facilityData?.nodes?.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.nodeType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Floor / Level Number</label>
                <input
                  type="number"
                  value={nodeLevel}
                  onChange={(e) => setNodeLevel(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddNodeModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-bold bg-cyan-accent text-midnight-950 hover:brightness-110"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Edge */}
      {showAddEdgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-cyan-accent/30 bg-midnight-900 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-accent" />
              <span>Connect Nodes (Add Edge)</span>
            </h3>

            <form onSubmit={handleAddEdge} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Source Node</label>
                <select
                  required
                  value={sourceNodeId || ''}
                  onChange={(e) => setSourceNodeId(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  <option value="">-- Select Source --</option>
                  {facilityData?.nodes?.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.nodeType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Destination Node</label>
                <select
                  required
                  value={destinationNodeId || ''}
                  onChange={(e) => setDestinationNodeId(Number(e.target.value))}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                >
                  <option value="">-- Select Destination --</option>
                  {facilityData?.nodes?.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.nodeType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Distance (Meters)</label>
                  <input
                    type="number"
                    value={edgeDistance}
                    onChange={(e) => setEdgeDistance(Number(e.target.value))}
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Travel Time (Seconds)</label>
                  <input
                    type="number"
                    value={edgeTime}
                    onChange={(e) => setEdgeTime(Number(e.target.value))}
                    className="w-full bg-midnight-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-accent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAccessible}
                    onChange={(e) => setIsAccessible(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-accent"
                  />
                  <span>Wheelchair Accessible</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={allowVehicles}
                    onChange={(e) => setAllowVehicles(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-accent"
                  />
                  <span>Vehicles Permitted</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEdgeModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-bold bg-cyan-accent text-midnight-950 hover:brightness-110"
                >
                  Create Edge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
