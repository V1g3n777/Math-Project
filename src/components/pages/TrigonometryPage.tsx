import React, { useState } from 'react';
import {
  Compass,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Activity,
  Layers
} from 'lucide-react';
import { MathView } from '../common/MathView';

interface TrigonometryPageProps {
  onNavigateToDesmos: (expression?: string) => void;
}

const SPECIAL_ANGLES = [
  { deg: 0, rad: '0', label: '0' },
  { deg: 30, rad: '\\frac{\\pi}{6}', label: 'π/6 (30°)' },
  { deg: 45, rad: '\\frac{\\pi}{4}', label: 'π/4 (45°)' },
  { deg: 60, rad: '\\frac{\\pi}{3}', label: 'π/3 (60°)' },
  { deg: 90, rad: '\\frac{\\pi}{2}', label: 'π/2 (90°)' },
  { deg: 180, rad: '\\pi', label: 'π (180°)' },
  { deg: 270, rad: '\\frac{3\\pi}{2}', label: '3π/2 (270°)' },
  { deg: 360, rad: '2\\pi', label: '2π (360°)' },
];

export const TrigonometryPage: React.FC<TrigonometryPageProps> = ({ onNavigateToDesmos }) => {
  const [angleDeg, setAngleDeg] = useState<number>(45);

  const angleRad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(angleRad);
  const sinVal = Math.sin(angleRad);
  const tanVal = Math.abs(cosVal) > 1e-5 ? Math.tan(angleRad) : undefined;

  // SVG Unit Circle Dimensions
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110; // visual unit circle radius

  const pointX = cx + r * cosVal;
  const pointY = cy - r * sinVal; // canvas Y is inverted

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/50 via-blue-900/20 to-slate-900/60 border border-indigo-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Trigonometry Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            The Unit Circle & Trigonometric Waves
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Rotate the angle vector around the Euclidean unit circle. Discover how horizontal projection defines cosine, vertical projection defines sine, and how harmonic waves emerge periodically.
          </p>
        </div>
      </div>

      {/* Main Interactive Unit Circle Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Controls & Values */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Unit Circle Controller
              </h2>
            </div>
            <button
              onClick={() => setAngleDeg(45)}
              className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Current Angle Display */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 flex items-center justify-around text-center">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Degrees</span>
              <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {angleDeg}°
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Radians</span>
              <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {angleRad.toFixed(3)} rad
              </div>
            </div>
          </div>

          {/* Angle Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-600 dark:text-slate-300">Rotate Angle θ:</span>
              <span className="font-mono text-blue-500">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={angleDeg}
              onChange={(e) => setAngleDeg(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Special Angle Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Special Quadrant Angles
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {SPECIAL_ANGLES.map((ang) => (
                <button
                  key={ang.deg}
                  onClick={() => setAngleDeg(ang.deg)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    angleDeg === ang.deg
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {ang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigonometric Function Values */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/50">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase font-mono">
                cos(θ) = x
              </span>
              <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                {cosVal.toFixed(3)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/50">
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase font-mono">
                sin(θ) = y
              </span>
              <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                {sinVal.toFixed(3)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                tan(θ) = y/x
              </span>
              <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                {tanVal !== undefined ? tanVal.toFixed(3) : 'Undefined'}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToDesmos('y = \\sin(x), \\; y = \\cos(x)')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Plot Trig Harmonics in Desmos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Dynamic Interactive Unit Circle SVG & Sine Wave */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Euclidean Unit Circle Coordinate Vector
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-blue-500 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> x = cos(θ)
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> y = sin(θ)
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-h-[300px] overflow-visible select-none"
            >
              {/* Axes */}
              <line x1="10" y1={cy} x2={size - 10} y2={cy} stroke="#64748b" strokeWidth="1.2" />
              <line x1={cx} y1="10" x2={cx} y2={size - 10} stroke="#64748b" strokeWidth="1.2" />

              {/* Main Unit Circle */}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="1.8" />

              {/* Radius 1 markers */}
              <text x={cx + r + 5} y={cy - 5} className="text-[10px] font-mono fill-slate-400">1</text>
              <text x={cx - r - 15} y={cy - 5} className="text-[10px] font-mono fill-slate-400">-1</text>
              <text x={cx + 5} y={cy - r - 5} className="text-[10px] font-mono fill-slate-400">1</text>
              <text x={cx + 5} y={cy + r + 15} className="text-[10px] font-mono fill-slate-400">-1</text>

              {/* Terminal Arm Line */}
              <line x1={cx} y1={cy} x2={pointX} y2={pointY} stroke="#3b82f6" strokeWidth="2.5" />

              {/* Cosine drop line (horizontal along x-axis) */}
              <line
                x1={cx}
                y1={cy}
                x2={pointX}
                y2={cy}
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Sine drop line (vertical from point to x-axis) */}
              <line
                x1={pointX}
                y1={cy}
                x2={pointX}
                y2={pointY}
                stroke="#e11d48"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Angle Arc */}
              <path
                d={`M ${cx + 30} ${cy} A 30 30 0 ${angleDeg > 180 ? 1 : 0} 0 ${
                  cx + 30 * Math.cos(-angleRad)
                } ${cy + 30 * Math.sin(-angleRad)}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Current Point Dot */}
              <circle cx={pointX} cy={pointY} r="6" fill="#6366f1" stroke="white" strokeWidth="2" />

              {/* Coordinates Pill */}
              <text
                x={pointX + (cosVal >= 0 ? 12 : -75)}
                y={pointY + (sinVal >= 0 ? -12 : 20)}
                className="fill-slate-900 dark:fill-white font-mono text-[11px] font-bold"
              >
                ({cosVal.toFixed(2)}, {sinVal.toFixed(2)})
              </text>
            </svg>
          </div>

          {/* Identity Pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Pythagorean Identity Verification</span>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              <MathView
                math={`\\cos^2(${angleDeg}^\\circ) + \\sin^2(${angleDeg}^\\circ) = (${cosVal.toFixed(2)})^2 + (${sinVal.toFixed(2)})^2 = ${(
                  cosVal * cosVal + sinVal * sinVal
                ).toFixed(2)} = 1`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
