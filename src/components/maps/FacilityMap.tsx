import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationNode, LocationEdge, Obstacle } from '../../types';

// Custom Map Markers with SVG Icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background: ${color};
        color: #0B1220;
        font-weight: bold;
        font-size: 10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px ${color};
        border: 2px solid #FFFFFF;
      ">
        ${label}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const gateIcon = createCustomIcon('#67E8F9', 'G');
const destIcon = createCustomIcon('#22C55E', 'D');
const obstacleIcon = createCustomIcon('#EF4444', '!');
const nodeIcon = createCustomIcon('#3B82F6', '•');

// Recenter Map Helper
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

interface FacilityMapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  nodes?: LocationNode[];
  edges?: LocationEdge[];
  routeNodes?: LocationNode[];
  obstacles?: Obstacle[];
  className?: string;
}

export const FacilityMap: React.FC<FacilityMapProps> = ({
  centerLat = 17.4485,
  centerLng = 78.3752,
  zoom = 17,
  nodes = [],
  edges = [],
  routeNodes = [],
  obstacles = [],
  className = 'h-96 w-full rounded-xl overflow-hidden border border-slate-700/80 shadow-inner',
}) => {
  // Compute route path coordinates
  const routePolyline: [number, number][] = routeNodes
    .filter((n) => n.latitude != null && n.longitude != null)
    .map((n) => [n.latitude!, n.longitude!]);

  return (
    <div className={className}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <MapRecenter center={[centerLat, centerLng]} zoom={zoom} />

        {/* High-contrast Dark Tiles from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Draw Facility Graph Nodes */}
        {nodes.map((node) => {
          if (!node.latitude || !node.longitude) return null;
          const isGate = node.nodeType === 'ENTRY_GATE';
          const icon = isGate ? gateIcon : nodeIcon;

          return (
            <Marker key={node.id} position={[node.latitude, node.longitude]} icon={icon}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-cyan-accent">{node.name}</div>
                  <div className="text-slate-300 font-mono text-[10px]">Type: {node.nodeType}</div>
                  {node.levelNumber !== undefined && (
                    <div className="text-slate-400 text-[10px]">Level: {node.levelNumber}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Draw Active Route Polyline */}
        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#67E8F9',
              weight: 5,
              opacity: 0.9,
              dashArray: '2, 6',
            }}
          />
        )}

        {/* Draw Destination Marker */}
        {routeNodes.length > 0 && routeNodes[routeNodes.length - 1].latitude && (
          <Marker
            position={[
              routeNodes[routeNodes.length - 1].latitude!,
              routeNodes[routeNodes.length - 1].longitude!,
            ]}
            icon={destIcon}
          >
            <Popup>
              <div className="text-xs font-bold text-emerald-400">
                Exact Destination: {routeNodes[routeNodes.length - 1].name}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Draw Active Obstacles */}
        {obstacles.map((obs) => {
          if (!obs.latitude || !obs.longitude) return null;
          return (
            <Marker key={obs.id} position={[obs.latitude, obs.longitude]} icon={obstacleIcon}>
              <Popup>
                <div className="text-xs">
                  <div className="font-bold text-red-400">{obs.obstacleType}</div>
                  <div className="text-slate-300 text-[11px]">{obs.description}</div>
                  <div className="text-yellow-400 text-[10px] uppercase font-mono">Severity: {obs.severity}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
