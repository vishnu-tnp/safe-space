import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { TrendingUp, Calendar } from 'lucide-react';

export const MoodTrendChart: React.FC = () => {
  const { checkInHistory, groundingHistory } = useAppContext();

  // Compute 7-day trend data
  const last7Days = React.useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString([], { weekday: 'short' });

      // Find check-ins for this date
      const checkIns = (checkInHistory || []).filter(
        (item) => item.timestamp.split('T')[0] === dateStr
      );

      let avgMood: number | null = null;
      if (checkIns.length > 0) {
        const sum = checkIns.reduce((acc, curr) => acc + curr.moodLevel, 0);
        avgMood = Math.round((sum / checkIns.length) * 10) / 10;
      }

      days.push({
        dateStr,
        dayLabel,
        avgMood,
        checkInCount: checkIns.length,
      });
    }

    return days;
  }, [checkInHistory]);

  // Overall stats
  const avgOverallMood = React.useMemo(() => {
    if (!checkInHistory || checkInHistory.length === 0) return 7;
    const sum = checkInHistory.reduce((acc, curr) => acc + curr.moodLevel, 0);
    return (sum / checkInHistory.length).toFixed(1);
  }, [checkInHistory]);

  const stabilityPercentage = React.useMemo(() => {
    if (!checkInHistory || checkInHistory.length === 0) return 100;
    const stableCount = checkInHistory.filter((item) => item.moodLevel >= 6).length;
    return Math.round((stableCount / checkInHistory.length) * 100);
  }, [checkInHistory]);

  // SVG Chart Height/Width math
  const chartHeight = 140;
  const chartWidth = 320;
  const paddingX = 20;
  const paddingY = 20;

  const points = last7Days.map((day, idx) => {
    const x = paddingX + (idx / (last7Days.length - 1)) * (chartWidth - paddingX * 2);
    // Mood level 1 (bottom) to 10 (top)
    const val = day.avgMood !== null ? day.avgMood : 7; // fallback default for rendering
    const y = chartHeight - paddingY - ((val - 1) / 9) * (chartHeight - paddingY * 2);
    return { x, y, day };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="bg-slate-800/90 border border-slate-700/50 rounded-3xl p-6 shadow-sm backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-500/20 rounded-xl">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-50 tracking-tight">Mood Trend & Stability</h2>
            <p className="text-xs text-slate-400">7-day historical analytics</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Stable</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Distressed</span>
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-700/40 p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 block font-medium">Avg Mood</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-slate-100">{avgOverallMood}</span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700/40 p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 block font-medium">Stability Index</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-emerald-400">{stabilityPercentage}%</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700/40 p-3.5 rounded-2xl">
          <span className="text-[11px] text-slate-400 block font-medium">Groundings</span>
          <div className="flex items-baseline space-x-1 mt-1">
            <span className="text-xl font-bold text-cyan-400">{(groundingHistory || []).length}</span>
            <span className="text-xs text-slate-400">total</span>
          </div>
        </div>
      </div>

      {/* SVG Trend Line Chart */}
      <div className="bg-slate-900/70 border border-slate-700/40 rounded-2xl p-4 relative">
        <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
          <span>Mood Level Trend (Last 7 Days)</span>
          <span className="text-[11px] text-emerald-400/80 font-mono">10 = Optimal | 1 = Severe</span>
        </div>

        <div className="w-full flex justify-center">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-36 overflow-visible">
            {/* Grid lines */}
            {[2, 5, 8].map((lvl) => {
              const y = chartHeight - paddingY - ((lvl - 1) / 9) * (chartHeight - paddingY * 2);
              return (
                <line
                  key={lvl}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Gradient fill */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Closed Area */}
            {points.length > 0 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`}
                fill="url(#chartGradient)"
              />
            )}

            {/* Line Path */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Points */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className={`${
                    p.day.avgMood === null
                      ? 'fill-slate-600 stroke-slate-700'
                      : p.day.avgMood >= 6
                      ? 'fill-emerald-400 stroke-slate-900'
                      : 'fill-amber-400 stroke-slate-900'
                  } stroke-2 transition-transform duration-200 group-hover:r-7`}
                />
                <text
                  x={p.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-sans"
                >
                  {p.day.dayLabel}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Weekly Stability Calendar Grid */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Weekly Stability Calendar</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {last7Days.map((day, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 ${
                day.avgMood === null
                  ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                  : day.avgMood >= 6
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              <span className="text-[10px] font-medium opacity-80 uppercase">{day.dayLabel}</span>
              <span className="text-sm font-bold mt-1">
                {day.avgMood !== null ? `${day.avgMood}` : '-'}
              </span>
              <span className="text-[9px] mt-0.5 opacity-60">
                {day.checkInCount > 0 ? `${day.checkInCount} check-in` : 'no data'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
