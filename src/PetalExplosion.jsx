import React, { useEffect, useRef } from 'react';

/**
 * 3D Petal Explosion Canvas (One-Time Triggered)
 * Bursts 55 realistic velvet red rose petals outward across the entire viewport
 * only once upon first scroll, then lets them drift gently down the site.
 */
export default function PetalExplosion({ isTriggered, origin = { x: 0.3, y: 0.6 } }) {
  const canvasRef = useRef(null);
  const petalsRef = useRef([]);
  const animStartTimeRef = useRef(null);
  const isExplodingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Resize canvas
    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initialize 55 realistic petals
    const count = 55;
    const colors = [
      { base: '#A30015', highlight: '#DC143C', shadow: '#59000C' },
      { base: '#B8001F', highlight: '#FF2E5B', shadow: '#6B0014' },
      { base: '#800020', highlight: '#C71585', shadow: '#4A0012' },
      { base: '#D90429', highlight: '#EF233C', shadow: '#7A0016' },
      { base: '#9B111E', highlight: '#E63946', shadow: '#4F070E' },
    ];

    const petals = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 11;
      const elevation = (Math.random() - 0.5) * 8;

      petals.push({
        id: i,
        // Relative coordinates from explosion center
        x: 0,
        y: 0,
        z: (Math.random() - 0.5) * 250,
        // Radial burst velocity
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.9),
        vy: Math.sin(angle) * speed * (0.8 + Math.random() * 0.9) - 2.5,
        vz: elevation,
        // Current animated position
        currentX: 0,
        currentY: 0,
        // Rotations
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.045,
        rotSpeedY: (Math.random() - 0.5) * 0.055,
        rotSpeedZ: (Math.random() - 0.5) * 0.035,
        // Appearance
        size: 18 + Math.random() * 26,
        color: colors[i % colors.length],
        opacity: 0,
        driftSeed: Math.random() * 100,
      });
    }
    petalsRef.current = petals;

    let animId;

    const render = (now) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      if (isExplodingRef.current && animStartTimeRef.current) {
        const elapsed = (now - animStartTimeRef.current) / 1000; // in seconds

        const originPxX = width * origin.x;
        const originPxY = height * origin.y;

        // Progress curve for initial burst (0 to 1 over ~1.8 seconds)
        const burstProgress = Math.min(elapsed / 1.8, 1);
        // Easing out cubic
        const easeBurst = 1 - Math.pow(1 - burstProgress, 3);

        petalsRef.current.forEach((p) => {
          // Physics rotation
          p.rotX += p.rotSpeedX;
          p.rotY += p.rotSpeedY;
          p.rotZ += p.rotSpeedZ;

          // Gentle continuous wind drift
          const wind = Math.sin(now * 0.0012 + p.driftSeed) * 25;
          // Gravity drift slowly downwards as time passes
          const driftY = Math.max(0, elapsed - 0.4) * 35 + Math.sin(now * 0.0018 + p.driftSeed) * 15;

          // Target explosion position
          const targetX = originPxX + p.vx * easeBurst * 70 + wind;
          const targetY = originPxY + p.vy * easeBurst * 70 + driftY;

          // Smooth interpolation
          p.currentX += (targetX - p.currentX) * 0.2;
          p.currentY += (targetY - p.currentY) * 0.2;

          // Opacity: rapid fade in at start, remains visible, very soft fade out after 25 seconds or near bottom
          const fadeIn = Math.min(elapsed * 3, 1);
          const scrollY = window.scrollY || 0;
          const scrollFade = Math.max(0, 1 - Math.max(0, scrollY - 3200) / 700);
          p.opacity = fadeIn * scrollFade;

          if (p.opacity <= 0.01) return;

          // 3D perspective projection
          const fov = 650;
          const scaleZ = fov / (fov + p.z + 120);
          const finalSize = p.size * scaleZ;

          // Render Rose Petal
          ctx.save();
          ctx.translate(p.currentX, p.currentY);
          ctx.rotate(p.rotZ);
          ctx.scale(Math.cos(p.rotY), Math.sin(p.rotX));
          ctx.globalAlpha = p.opacity;

          // Organic petal shape
          ctx.beginPath();
          const w = finalSize * 0.78;
          const h = finalSize * 1.15;

          ctx.moveTo(0, -h * 0.42);
          ctx.bezierCurveTo(w * 0.95, -h * 0.52, w * 1.12, h * 0.22, 0, h * 0.62);
          ctx.bezierCurveTo(-w * 1.12, h * 0.22, -w * 0.95, -h * 0.52, 0, -h * 0.42);
          ctx.closePath();

          // Velvet petal gradient
          const grad = ctx.createRadialGradient(-w * 0.2, -h * 0.15, 2, 0, 0, h);
          grad.addColorStop(0, p.color.highlight);
          grad.addColorStop(0.55, p.color.base);
          grad.addColorStop(1, p.color.shadow);

          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(70, 0, 15, 0.35)';
          ctx.shadowBlur = 9 * scaleZ;
          ctx.shadowOffsetX = 2 * scaleZ;
          ctx.shadowOffsetY = 4 * scaleZ;
          ctx.fill();

          // Delicate vein line down center of petal
          ctx.beginPath();
          ctx.moveTo(0, -h * 0.32);
          ctx.quadraticCurveTo(w * 0.06, 0, 0, h * 0.5);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.1 * scaleZ;
          ctx.stroke();

          ctx.restore();
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [origin]);

  // Handle explosion trigger (ONLY ONCE)
  useEffect(() => {
    if (isTriggered && !isExplodingRef.current) {
      isExplodingRef.current = true;
      animStartTimeRef.current = performance.now();
    }
  }, [isTriggered]);

  return (
    <canvas
      ref={canvasRef}
      className="petal-explosion-canvas"
      aria-hidden="true"
    />
  );
}
