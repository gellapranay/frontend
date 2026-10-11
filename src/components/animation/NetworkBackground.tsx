import React, { useEffect, useRef } from 'react';

interface NetworkBackgroundProps {
  variant?: 'network' | 'route' | 'dashboard' | 'subtle';
  interactive?: boolean;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
}

export const NetworkBackground: React.FC<NetworkBackgroundProps> = ({
  variant = 'network',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return; // Respect reduced motion
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Number of nodes based on variant and screen size
    const nodeCount = variant === 'subtle' || variant === 'dashboard' ? 24 : Math.min(48, Math.floor(width / 32));
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        baseRadius: Math.random() * 2 + 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Packet or traveling beam along the network
    let routeProgress = 0;
    let routeNodes: number[] = [0, 5, 12, 18, 3];

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background radial glow
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        50,
        width * 0.5,
        height * 0.35,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
      grad.addColorStop(0.5, 'rgba(103, 232, 249, 0.03)');
      grad.addColorStop(1, 'rgba(11, 18, 32, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulsing radius
        node.pulsePhase += dt * 1.5;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.6;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? 'rgba(103, 232, 249, 0.7)' : 'rgba(59, 130, 246, 0.5)';
        ctx.shadowColor = '#67E8F9';
        ctx.shadowBlur = i % 4 === 0 ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Draw connecting network edges
      const maxDist = 160;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 4. Draw Traveling Route Highlight Beam (Last-Meter Intelligence route)
      if (nodes.length > 5 && variant !== 'subtle') {
        routeProgress += dt * 0.35;
        if (routeProgress >= routeNodes.length - 1) {
          routeProgress = 0;
        }

        const currentSegment = Math.floor(routeProgress);
        const segmentT = routeProgress - currentSegment;

        const fromNodeIdx = routeNodes[currentSegment % routeNodes.length] % nodes.length;
        const toNodeIdx = routeNodes[(currentSegment + 1) % routeNodes.length] % nodes.length;

        const n1 = nodes[fromNodeIdx];
        const n2 = nodes[toNodeIdx];

        if (n1 && n2) {
          const beamX = n1.x + (n2.x - n1.x) * segmentT;
          const beamY = n1.y + (n2.y - n1.y) * segmentT;

          // Glowing active path line
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(beamX, beamY);
          ctx.strokeStyle = 'rgba(103, 232, 249, 0.6)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#67E8F9';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Glowing pulse beacon on head
          ctx.beginPath();
          ctx.arc(beamX, beamY, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#67E8F9';
          ctx.shadowColor = '#67E8F9';
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-midnight-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
