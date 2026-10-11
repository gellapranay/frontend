import React from 'react';
import { LocationNode, LocationEdge, Obstacle } from '../../types';

interface FacilityGraphCanvasProps {
  nodes: LocationNode[];
  edges: LocationEdge[];
  highlightPathNodeIds?: number[];
  blockedEdgeIds?: number[];
  obstacles?: Obstacle[];
  onSelectNode?: (node: LocationNode) => void;
  onSelectEdge?: (edge: LocationEdge) => void;
  className?: string;
}

export const FacilityGraphCanvas: React.FC<FacilityGraphCanvasProps> = ({
  nodes,
  edges,
  highlightPathNodeIds = [],
  blockedEdgeIds = [],
  obstacles = [],
  onSelectNode,
  onSelectEdge,
  className = 'w-full h-[460px] bg-midnight-950/80 rounded-xl border border-slate-800 p-4 overflow-hidden relative',
}) => {
  // If nodes have floorPlanX/Y use them, else calculate simple layout
  const nodeMap = new Map<number, { x: number; y: number; node: LocationNode }>();

  // Determine bounding box or fallback positions
  nodes.forEach((n, idx) => {
    let x = n.floorPlanX != null ? n.floorPlanX : 80 + (idx % 6) * 140;
    let y = n.floorPlanY != null ? n.floorPlanY : 80 + Math.floor(idx / 6) * 110;
    nodeMap.set(n.id, { x, y, node: n });
  });

  return (
    <div className={className}>
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-midnight-900/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-accent inline-block animate-pulse" />
        Interactive Facility Graph Canvas ({nodes.length} Nodes · {edges.length} Connections)
      </div>

      <svg viewBox="0 0 1000 600" className="w-full h-full select-none" fill="none">
        <defs>
          <linearGradient id="activeEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* 1. Draw Edges */}
        {edges.map((edge) => {
          const src = nodeMap.get(edge.sourceNodeId);
          const dst = nodeMap.get(edge.destinationNodeId);
          if (!src || !dst) return null;

          const isBlocked = edge.status === 'BLOCKED' || blockedEdgeIds.includes(edge.id);
          const isHighlighted =
            highlightPathNodeIds.includes(edge.sourceNodeId) &&
            highlightPathNodeIds.includes(edge.destinationNodeId);

          let strokeColor = '#334155';
          let strokeWidth = 2.5;
          let strokeDash = undefined;

          if (isBlocked) {
            strokeColor = '#EF4444';
            strokeWidth = 3;
            strokeDash = '4 4';
          } else if (isHighlighted) {
            strokeColor = '#67E8F9';
            strokeWidth = 4.5;
          }

          const midX = (src.x + dst.x) / 2;
          const midY = (src.y + dst.y) / 2;

          return (
            <g key={edge.id} className="cursor-pointer group" onClick={() => onSelectEdge?.(edge)}>
              <line
                x1={src.x}
                y1={src.y}
                x2={dst.x}
                y2={dst.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                className="transition-all duration-300 group-hover:stroke-cyan-accent"
              />
              {/* Distance badge on edge */}
              <rect
                x={midX - 16}
                y={midY - 10}
                width={32}
                height={16}
                rx={4}
                fill="#111C2F"
                stroke={isBlocked ? '#EF4444' : '#334155'}
                strokeWidth={1}
              />
              <text
                x={midX}
                y={midY + 2}
                fill={isBlocked ? '#EF4444' : '#94A3B8'}
                fontSize="9"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
              >
                {Math.round(edge.distanceMeters)}m
              </text>
            </g>
          );
        })}

        {/* 2. Draw Nodes */}
        {nodes.map((node) => {
          const pos = nodeMap.get(node.id);
          if (!pos) return null;

          const isPath = highlightPathNodeIds.includes(node.id);
          const isGate = node.nodeType === 'ENTRY_GATE';
          const isLift = node.nodeType === 'LIFT';
          const isDest = node.nodeType === 'FLAT' || node.nodeType === 'ROOM' || node.nodeType === 'OFFICE' || node.nodeType === 'SHOP' || node.nodeType === 'POSITION';

          let fillColor = '#1E293B';
          let strokeColor = '#475569';
          let radius = 16;

          if (isGate) {
            fillColor = '#0F2942';
            strokeColor = '#67E8F9';
            radius = 20;
          } else if (isDest) {
            fillColor = '#0E3326';
            strokeColor = '#22C55E';
            radius = 18;
          } else if (isLift) {
            fillColor = '#2E1065';
            strokeColor = '#A855F7';
          }

          if (isPath) {
            strokeColor = '#67E8F9';
          }

          return (
            <g
              key={node.id}
              className="cursor-pointer group"
              onClick={() => onSelectNode?.(node)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={radius}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isPath ? 3 : 2}
                className="transition-all duration-300 group-hover:scale-110"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                fill={isPath ? '#67E8F9' : '#F8FAFC'}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                {isGate ? 'GATE' : isDest ? '★' : isLift ? 'LIFT' : node.levelNumber !== 0 ? `L${node.levelNumber}` : '•'}
              </text>
              <text
                x={pos.x}
                y={pos.y + radius + 14}
                fill="#CBD5E1"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
                className="drop-shadow-md"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
