import React, { useState } from 'react';
import {
  Triangle,
  Circle,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { MathView } from '../common/MathView';

interface GeometryPageProps {
  onNavigateToDesmos: (expression?: string) => void;
}

export const GeometryPage: React.FC<GeometryPageProps> = ({ onNavigateToDesmos }) => {
  // Pythagorean Theorem state
  const [legA, setLegA] = useState<number>(6);
  const [legB, setLegB] = useState<number>(8);

  // Circle Geometry state
  const [radius, setRadius] = useState<number>(5);
  const [angleDeg, setAngleDeg] = useState<number>(60);

  // Pythagorean calculations
  const hypotenuse = Math.sqrt(legA * legA + legB * legB);
  const areaA = legA * legA;
  const areaB = legB * legB;
  const areaC = hypotenuse * hypotenuse;

  // Circle calculations
  const angleRad = (angleDeg * Math.PI) / 180;
  const circumference = 2 * Math.PI * radius;
  const circleArea = Math.PI * radius * radius;
  const arcLength = radius * angleRad;
  const sectorArea = 0.5 * radius * radius * angleRad;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/40 via-teal-900/20 to-slate-900/60 border border-emerald-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Triangle className="w-3.5 h-3.5" />
            <span>Interactive Euclidean Geometry</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Geometric Proofs & Coordinate Curves
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Explore geometric constructions with dynamic SVG models: test the visual Pythagorean proof with physical side squares and investigate circle sector areas and tangent lines.
          </p>
        </div>
      </div>

      {/* Module 1: Pythagorean Theorem Dynamic Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Triangle className="w-4 h-4 text-emerald-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Pythagorean Geometric Proof
              </h2>
            </div>
            <button
              onClick={() => {
                setLegA(6);
                setLegB(8);
              }}
              className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Fundamental Theorem</span>
            <div className="text-base sm:text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              <MathView math="a^2 + b^2 = c^2" />
            </div>
          </div>

          {/* Sliders for Leg A & Leg B */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Leg a (Horizontal Base):</span>
                <span className="font-mono text-emerald-500 font-bold">{legA} cm</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={legA}
                onChange={(e) => setLegA(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                Square Area A = a² = {areaA} cm²
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Leg b (Vertical Altitude):</span>
                <span className="font-mono text-indigo-500 font-bold">{legB} cm</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="1"
                value={legB}
                onChange={(e) => setLegB(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                Square Area B = b² = {areaB} cm²
              </span>
            </div>
          </div>

          {/* Calculation result pill */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Hypotenuse Calculation
            </span>
            <div className="text-sm font-mono text-slate-800 dark:text-slate-100">
              c = √( {legA}² + {legB}² ) = √( {areaA} + {areaB} ) = √{areaC.toFixed(0)}
            </div>
            <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              c = {hypotenuse.toFixed(2)} cm
            </div>
          </div>

          <button
            onClick={() => onNavigateToDesmos(`x^2 + y^2 = ${hypotenuse.toFixed(1)}^2`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Plot in Desmos Grapher</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic SVG Visual Proof */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Visual Area Proof of Euclidean Squares
            </span>
            <span className="text-xs text-slate-400">
              Sum: {areaA} + {areaB} = {areaC.toFixed(0)}
            </span>
          </div>

          {/* SVG Diagram */}
          <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg
              viewBox="0 0 380 260"
              className="w-full max-h-[280px] overflow-visible select-none"
            >
              {/* Origin corner at (120, 180) */}
              {/* Right Triangle vertices: (120, 180), (120 + legA*10, 180), (120, 180 - legB*10) */}
              {(() => {
                const ox = 110;
                const oy = 170;
                const scale = 11;
                const ax = ox + legA * scale;
                const by = oy - legB * scale;

                return (
                  <g>
                    {/* Square on Leg A (bottom) */}
                    <rect
                      x={ox}
                      y={oy}
                      width={legA * scale}
                      height={legA * scale}
                      fill="rgba(16, 185, 129, 0.25)"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <text
                      x={ox + (legA * scale) / 2}
                      y={oy + (legA * scale) / 2 + 5}
                      textAnchor="middle"
                      className="fill-emerald-600 dark:fill-emerald-400 font-mono text-xs font-bold"
                    >
                      a² = {areaA}
                    </text>

                    {/* Square on Leg B (left) */}
                    <rect
                      x={ox - legB * scale}
                      y={by}
                      width={legB * scale}
                      height={legB * scale}
                      fill="rgba(99, 102, 241, 0.25)"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                    />
                    <text
                      x={ox - (legB * scale) / 2}
                      y={by + (legB * scale) / 2 + 5}
                      textAnchor="middle"
                      className="fill-indigo-600 dark:fill-indigo-400 font-mono text-xs font-bold"
                    >
                      b² = {areaB}
                    </text>

                    {/* Right Triangle */}
                    <polygon
                      points={`${ox},${oy} ${ax},${oy} ${ox},${by}`}
                      fill="rgba(244, 63, 94, 0.3)"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                    />

                    {/* Right angle symbol */}
                    <rect
                      x={ox}
                      y={oy - 12}
                      width="12"
                      height="12"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="1"
                    />

                    {/* Hypotenuse label */}
                    <text
                      x={(ax + ox) / 2 + 8}
                      y={(oy + by) / 2 - 8}
                      className="fill-rose-500 font-mono text-xs font-bold"
                    >
                      c = {hypotenuse.toFixed(1)}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <Info className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              The green square Area ({areaA}) plus the purple square Area ({areaB}) equals the exact area of the square erected upon the hypotenuse ({areaC.toFixed(0)}).
            </span>
          </div>
        </div>
      </div>

      {/* Module 2: Circle Geometry & Arc / Sector Explorer */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-teal-500" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Circle Properties, Arc Length & Sector Area
            </h2>
          </div>
          <button
            onClick={() => onNavigateToDesmos(`(x - 0)^2 + (y - 0)^2 = ${radius}^2`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-teal-500 transition-colors"
          >
            <span>Plot Circle in Desmos</span>
            <ExternalLink className="w-3.5 h-3.5 text-teal-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Radius r:</span>
                <span className="font-mono text-teal-500 font-bold">{radius} cm</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Central Angle θ:</span>
                <span className="font-mono text-teal-500 font-bold">{angleDeg}° ({angleRad.toFixed(2)} rad)</span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                step="5"
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseInt(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Circumference (2πr)</span>
                <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                  {circumference.toFixed(2)} cm
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Total Area (πr²)</span>
                <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
                  {circleArea.toFixed(2)} cm²
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Arc Length s = rθ</span>
                <div className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                  {arcLength.toFixed(2)} cm
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono">Sector Area ½r²θ</span>
                <div className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                  {sectorArea.toFixed(2)} cm²
                </div>
              </div>
            </div>
          </div>

          {/* Circle SVG */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg viewBox="0 0 240 240" className="w-full max-h-[220px]">
              {(() => {
                const cx = 120;
                const cy = 120;
                const r = radius * 9;
                const endX = cx + r * Math.cos(-angleRad);
                const endY = cy + r * Math.sin(-angleRad);
                const largeArc = angleDeg > 180 ? 1 : 0;

                return (
                  <g>
                    {/* Circle Background */}
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#94a3b8" strokeWidth="1.5" />

                    {/* Sector Fill */}
                    <path
                      d={`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 ${largeArc} 0 ${endX} ${endY} Z`}
                      fill="rgba(20, 184, 166, 0.25)"
                      stroke="#14b8a6"
                      strokeWidth="2"
                    />

                    {/* Center point */}
                    <circle cx={cx} cy={cy} r="3" fill="#0f172a" />

                    {/* Radius line */}
                    <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#0f172a" strokeWidth="1.5" />
                    <text x={cx + r / 2} y={cy + 15} textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
                      r = {radius}
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
