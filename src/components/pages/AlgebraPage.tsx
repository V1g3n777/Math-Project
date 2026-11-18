import React, { useState } from 'react';
import {
  FunctionSquare,
  Sliders,
  Sparkles,
  ExternalLink,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Layers
} from 'lucide-react';
import { MathView } from '../common/MathView';
import { NavSection } from '../../types';

interface AlgebraPageProps {
  onNavigateToDesmos: (expression?: string) => void;
}

export const AlgebraPage: React.FC<AlgebraPageProps> = ({ onNavigateToDesmos }) => {
  // Quadratic equation state: y = ax^2 + bx + c
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-2);
  const [c, setC] = useState<number>(-3);

  // Linear system state:
  // Eq 1: a1 x + b1 y = c1
  // Eq 2: a2 x + b2 y = c2
  const [a1, setA1] = useState<number>(2);
  const [b1, setB1] = useState<number>(1);
  const [c1, setC1] = useState<number>(4);
  const [a2, setA2] = useState<number>(1);
  const [b2, setB2] = useState<number>(-1);
  const [c2, setC2] = useState<number>(1);

  // Quadratic calculations
  const discriminant = b * b - 4 * a * c;
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? a * vertexX * vertexX + b * vertexX + c : c;

  let root1: string = '';
  let root2: string = '';
  let rootsType: 'two-real' | 'one-real' | 'complex' = 'two-real';

  if (discriminant > 0) {
    const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    root1 = r1.toFixed(2);
    root2 = r2.toFixed(2);
    rootsType = 'two-real';
  } else if (Math.abs(discriminant) < 1e-6) {
    const r = -b / (2 * a);
    root1 = r.toFixed(2);
    root2 = r.toFixed(2);
    rootsType = 'one-real';
  } else {
    const realPart = (-b / (2 * a)).toFixed(2);
    const imagPart = (Math.sqrt(-discriminant) / (2 * Math.abs(a))).toFixed(2);
    root1 = `${realPart} + ${imagPart}i`;
    root2 = `${realPart} - ${imagPart}i`;
    rootsType = 'complex';
  }

  // System of Equations calculations
  const det = a1 * b2 - a2 * b1;
  const isSolvable = Math.abs(det) > 1e-6;
  const sysX = isSolvable ? (c1 * b2 - c2 * b1) / det : 0;
  const sysY = isSolvable ? (a1 * c2 - a2 * c1) / det : 0;

  // Generate SVG curve points for parabola
  const svgWidth = 360;
  const svgHeight = 240;
  const scaleX = 20; // 20px per unit
  const scaleY = 12; // 12px per unit
  const originX = svgWidth / 2;
  const originY = svgHeight / 2 + 30;

  const generateParabolaPath = () => {
    const points: string[] = [];
    for (let px = -9; px <= 9; px += 0.2) {
      const py = a * px * px + b * px + c;
      const sx = originX + px * scaleX;
      const sy = originY - py * scaleY;
      points.push(`${points.length === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const handleOpenQuadraticInDesmos = () => {
    const latex = `y = ${a}x^2 + (${b})x + (${c})`;
    onNavigateToDesmos(latex);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/60 border border-indigo-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <FunctionSquare className="w-3.5 h-3.5" />
            <span>Interactive Algebra Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Polynomials, Roots & Linear Systems
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Manipulate quadratic coefficients in real-time to watch parabolas transform, calculate the discriminant, find real and complex roots, and solve simultaneous systems.
          </p>
        </div>
      </div>

      {/* Module 1: Interactive Quadratic Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Controls & Parameters */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Quadratic Explorer: $y = ax^2 + bx + c$
              </h2>
            </div>
            <button
              onClick={() => {
                setA(1);
                setB(-2);
                setC(-3);
              }}
              className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
              title="Reset parameters"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Current Equation Display */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Active Quadratic Form</span>
            <div className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              <MathView math={`y = ${a !== 1 ? (a === -1 ? '-' : a) : ''}x^2 ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}`} />
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Coefficient a (Curvature):</span>
                <span className="font-mono text-indigo-500">{a}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={a}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setA(val === 0 ? 0.5 : val);
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                {a > 0 ? 'Opens upward (minimum vertex)' : 'Opens downward (maximum vertex)'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Coefficient b (Shift/Tilt):</span>
                <span className="font-mono text-indigo-500">{b}</span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="0.5"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Constant c (y-intercept):</span>
                <span className="font-mono text-indigo-500">{c}</span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="0.5"
                value={c}
                onChange={(e) => setC(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Desmos Launch Button */}
          <button
            onClick={handleOpenQuadraticInDesmos}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Open & Analyze in Desmos Grapher</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Real-time Visualizer & Mathematical Analysis */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive SVG Graph */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dynamic Coordinate Plot
              </span>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Curve
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Vertex ({vertexX.toFixed(1)}, {vertexY.toFixed(1)})
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden p-2 flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full max-h-[260px] overflow-visible select-none"
              >
                {/* Grid Lines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800/80"
                      strokeWidth="0.8"
                    />
                  </pattern>
                </defs>
                <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

                {/* X & Y Axes */}
                <line
                  x1="0"
                  y1={originY}
                  x2={svgWidth}
                  y2={originY}
                  stroke="currentColor"
                  className="text-slate-400 dark:text-slate-600"
                  strokeWidth="1.5"
                />
                <line
                  x1={originX}
                  y1="0"
                  x2={originX}
                  y2={svgHeight}
                  stroke="currentColor"
                  className="text-slate-400 dark:text-slate-600"
                  strokeWidth="1.5"
                />

                {/* Axis of Symmetry (dashed) */}
                <line
                  x1={originX + vertexX * scaleX}
                  y1="0"
                  x2={originX + vertexX * scaleX}
                  y2={svgHeight}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* The Parabola Path */}
                <path
                  d={generateParabolaPath()}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Vertex Dot */}
                <circle
                  cx={originX + vertexX * scaleX}
                  cy={originY - vertexY * scaleY}
                  r="5"
                  fill="#f43f5e"
                  stroke="white"
                  strokeWidth="1.5"
                />

                {/* Real Roots Dots on X axis */}
                {rootsType === 'two-real' && (
                  <>
                    <circle
                      cx={originX + parseFloat(root1) * scaleX}
                      cy={originY}
                      r="4.5"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={originX + parseFloat(root2) * scaleX}
                      cy={originY}
                      r="4.5"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </>
                )}
                {rootsType === 'one-real' && (
                  <circle
                    cx={originX + parseFloat(root1) * scaleX}
                    cy={originY}
                    r="5"
                    fill="#10b981"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Mathematical Analysis Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Discriminant */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Discriminant Δ
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {discriminant.toFixed(1)}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    discriminant > 0
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : discriminant === 0
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                  }`}
                >
                  {discriminant > 0 ? '2 Real Roots' : discriminant === 0 ? '1 Double Root' : 'Complex'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                b² - 4ac = ({b})² - 4({a})({c})
              </p>
            </div>

            {/* Vertex Point */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Vertex (h, k)
              </span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {a > 0 ? 'Global Minimum' : 'Global Maximum'}
              </p>
            </div>

            {/* Roots */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                Roots x₁, x₂
              </span>
              <div className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                {rootsType === 'two-real' ? (
                  <span>{root1}, {root2}</span>
                ) : rootsType === 'one-real' ? (
                  <span>x = {root1}</span>
                ) : (
                  <span className="text-xs">{root1}</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {rootsType === 'complex' ? 'Conjugate complex pair' : 'Points where y = 0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module 2: 2x2 System of Linear Equations Solver */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Simultaneous 2x2 Linear Systems Visualizer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Solve systems of two linear equations with determinant matrix analysis and geometric intersection.
            </p>
          </div>
          <button
            onClick={() => {
              const latex1 = `${a1}x + ${b1}y = ${c1}`;
              const latex2 = `${a2}x + ${b2}y = ${c2}`;
              onNavigateToDesmos(`${latex1}, ${latex2}`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-purple-500 transition-colors"
          >
            <span>Graph Lines in Desmos</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equation 1 inputs */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block">
              Equation 1: Line L₁
            </span>
            <div className="flex items-center gap-2 font-mono text-sm">
              <input
                type="number"
                value={a1}
                onChange={(e) => setA1(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-bold"
              />
              <span>x + </span>
              <input
                type="number"
                value={b1}
                onChange={(e) => setB1(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-bold"
              />
              <span>y = </span>
              <input
                type="number"
                value={c1}
                onChange={(e) => setC1(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-bold"
              />
            </div>
            <div className="text-xs text-slate-500">
              Slope <MathView math={`m_1 = ${(-a1 / (b1 || 1)).toFixed(2)}`} />
            </div>
          </div>

          {/* Equation 2 inputs */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-purple-500 uppercase tracking-wider block">
              Equation 2: Line L₂
            </span>
            <div className="flex items-center gap-2 font-mono text-sm">
              <input
                type="number"
                value={a2}
                onChange={(e) => setA2(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-bold"
              />
              <span>x + </span>
              <input
                type="number"
                value={b2}
                onChange={(e) => setB2(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-bold"
              />
              <span>y = </span>
              <input
                type="number"
                value={c2}
                onChange={(e) => setC2(parseFloat(e.target.value) || 0)}
                className="w-16 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-center font-bold"
              />
            </div>
            <div className="text-xs text-slate-500">
              Slope <MathView math={`m_2 = ${(-a2 / (b2 || 1)).toFixed(2)}`} />
            </div>
          </div>
        </div>

        {/* Solution summary */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Matrix Determinant & System State
            </span>
            <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
              {isSolvable ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Consistent & Independent: Unique Intersection Point
                </span>
              ) : (
                <span className="text-rose-500 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Singular (det = 0): Lines are Parallel or Coincident
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Exact Solution (x*, y*)</span>
            <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {isSolvable ? `(${sysX.toFixed(2)}, ${sysY.toFixed(2)})` : 'No Unique Solution'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
