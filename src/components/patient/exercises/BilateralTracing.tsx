import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';


export const BilateralTracing: React.FC = () => {
  const { setActiveExercise, logGroundingSession } = useAppContext();
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [secondsSpent, setSecondsSpent] = useState<number>(0);
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scaleX = Math.min(canvas.width * 0.38, 220);
      const scaleY = scaleX * 0.55;

      // Infinity formula (Bernoulli Lemniscate parametric representation)
      // x(t) = scaleX * cos(t) / (1 + sin^2(t))
      // y(t) = scaleY * sin(t) * cos(t) / (1 + sin^2(t))

      // Draw background figure-8 glowing track
      ctx.beginPath();
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.8)';
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.02) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const denom = 1 + sin * sin;
        const x = centerX + (scaleX * cos) / denom;
        const y = centerY + (scaleY * sin * cos) / denom;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Inner stroke
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.02) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const denom = 1 + sin * sin;
        const x = centerX + (scaleX * cos) / denom;
        const y = centerY + (scaleY * sin * cos) / denom;
        if (angle === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current guide point position
      const sinT = Math.sin(t);
      const cosT = Math.cos(t);
      const denomT = 1 + sinT * sinT;
      const orbX = centerX + (scaleX * cosT) / denomT;
      const orbY = centerY + (scaleY * sinT * cosT) / denomT;

      // Update active side state for EMDR visual cue
      if (orbX < centerX - 10) {
        setActiveSide('left');
      } else if (orbX > centerX + 10) {
        setActiveSide('right');
      }

      // Draw Orb Glow
      const gradient = ctx.createRadialGradient(orbX, orbY, 2, orbX, orbY, 24);
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(0.4, '#818cf8');
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(orbX, orbY, 24, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Solid inner core
      ctx.beginPath();
      ctx.arc(orbX, orbY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handlePointerDown = () => {
    setIsTracing(true);
  };

  const handlePointerUp = () => {
    setIsTracing(false);
  };

  const handleExit = () => {
    logGroundingSession('bilateral_tracing', secondsSpent);
    setActiveExercise(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Bilateral Pattern Tracing</h2>
          <p className="text-xs text-slate-400">EMDR-style infinity loop • {secondsSpent}s</p>
        </div>
        <button
          onClick={handleExit}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          title="Exit"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Bilateral Side Indicators */}
      <div className="w-full max-w-md flex justify-between px-8 z-10 my-2">
        <div
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            activeSide === 'left'
              ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.8)] scale-110'
              : 'bg-slate-800/60 text-slate-500'
          }`}
        >
          LEFT BRAIN Focus
        </div>
        <div
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
            activeSide === 'right'
              ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] scale-110'
              : 'bg-slate-800/60 text-slate-500'
          }`}
        >
          RIGHT BRAIN Focus
        </div>
      </div>

      {/* Interactive Tracing Canvas Area */}
      <div
        className="relative w-full max-w-xl h-[50vh] flex items-center justify-center my-auto cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-2 text-center text-xs text-slate-400/80 pointer-events-none">
          {isTracing ? '✨ Tracing pattern...' : 'Trace the glowing orb with your finger'}
        </div>
      </div>

      {/* Controls Footer */}
      <div className="w-full max-w-md flex items-center justify-center gap-4 z-10 mb-4">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3.5 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <CheckCircle2 className="w-5 h-5" /> Done & Calmed
        </button>
      </div>
    </div>
  );
};
