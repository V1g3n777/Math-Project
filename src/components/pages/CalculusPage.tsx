import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Sigma,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MathView } from '../common/MathView';

interface CalculusPageProps {
  onNavigateToDesmos: (expression?: string) => void;
}

export const CalculusPage: React.FC<CalculusPageProps> = ({ onNavigateToDesmos }) => {
  // Derivative state
  const [x0, setX0] = useState<number>(1);
  const [h, setH] = useState<number>(0.5);

  // Riemann Sum state
  const [numRects, setNumRects] = useState<number>(8);
  const [sumType, setSumType] = useState<'left' | 'right' | 'mid'>('mid');

  // Function 1: f(x) = x^3 - 3x
  const f = (x: number) => x * x * x - 3 * x;
  const fPrime = (x: number) => 3 * x * x - 3;

  const y0 = f(x0);
  const y1 = f(x0 + h);
  const secantSlope = (y1 - y0) / h;
  const tangentSlope = fPrime(x0);

  // Function 2 for Riemann Sum: g(x) = 0.5 * x^2 + 1 over [0, 4]
  const g = (x: number) => 0.5 * x * x + 1;
  const a = 0;
  const b = 4;
  const dx = (b - a) / numRects;

  let riemannSum = 0;
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  for (let i = 0; i < numRects; i++) {
    const rx = a + i * dx;
    let evalX = rx;
    if (sumType === 'right') evalX = rx + dx;
    else if (sumType === 'mid') evalX = rx + dx / 2;

    const rHeight = g(evalX);
    riemannSum += rHeight * dx;
    rects.push({ x: rx, y: rHeight, w: dx, h: rHeight });
  }

  // Exact integral of 0.5*x^2 + 1 from 0 to 4 is [x^3/6 + x]_0^4 = 64/6 + 4 = 10.666 + 4 = 14.667
  const exactIntegral = 64 / 6 + 4;
  const errorPercent = (Math.abs(riemannSum - exactIntegral) / exactIntegral) * 100;

  // SVG Derivative Canvas parameters
  const svgW = 360;
  const svgH = 240;
  const originX = svgW / 2;
  const originY = svgH / 2;
  const scaleX = 40;
  const scaleY = 25;

  const generateCubicPath = () => {
    const points: string[] = [];
    for (let px = -3; px <= 3; px += 0.1) {
      const py = f(px);
      const sx = originX + px * scaleX;
      const sy = originY - py * scaleY;
      points.push(`${points.length === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return points.join(' ');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Interactive Calculus Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Derivatives, Tangents & Riemann Sums
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Witness how secant lines collapse into instantaneous tangent slopes as the interval h approaches zero, and approximate definite integrals with dynamic Riemann sums.
          </p>
        </div>
      </div>

      {/* Module 1: Derivative Tangent Line Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Derivative Limit Explorer: f(x) = x³ - 3x
              </h2>
            </div>
            <button
              onClick={() => {
                setX0(1);
                setH(0.5);
              }}
              className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Difference Quotient Definition</span>
            <div className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400">
              <MathView math="f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}" />
            </div>
          </div>

          {/* Sliders for x0 and step h */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Point of Tangency x₀:</span>
                <span className="font-mono text-indigo-500 font-bold">{x0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                f({x0.toFixed(2)}) = {y0.toFixed(2)}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Secant Interval Step h:</span>
                <span className="font-mono text-amber-500 font-bold">{h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.05"
                value={h}
                onChange={(e) => setH(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-400">
                Notice: as h → 0, secant slope → exact derivative!
              </span>
            </div>
          </div>

          {/* Metric Comparison Pill */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase font-mono">
                Secant Slope Δy/Δx
              </span>
              <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                {secantSlope.toFixed(3)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/50">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                True f'(x₀) = 3x₀² - 3
              </span>
              <div className="text-base font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                {tangentSlope.toFixed(3)}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToDesmos(`f(x) = x^3 - 3x, \\; a = ${x0.toFixed(2)}, \\; y - f(a) = f'(a)(x - a)`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Launch Tangent Curve in Desmos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic SVG Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Secant & Tangent Lines Transition
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> True Tangent
              </span>
              <span className="flex items-center gap-1.5 text-amber-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Secant (h = {h.toFixed(2)})
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full max-h-[260px] overflow-visible select-none"
            >
              {/* Grid & Axes */}
              <line x1="0" y1={originY} x2={svgW} y2={originY} stroke="#64748b" strokeWidth="1" />
              <line x1={originX} y1="0" x2={originX} y2={svgH} stroke="#64748b" strokeWidth="1" />

              {/* Function curve */}
              <path
                d={generateCubicPath()}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Points on curve */}
              {(() => {
                const px0 = originX + x0 * scaleX;
                const py0 = originY - y0 * scaleY;
                const px1 = originX + (x0 + h) * scaleX;
                const py1 = originY - y1 * scaleY;

                // Tangent line extending across viewport
                const tSpan = 2.5;
                const txA = originX + (x0 - tSpan) * scaleX;
                const tyA = originY - (y0 - tangentSlope * tSpan) * scaleY;
                const txB = originX + (x0 + tSpan) * scaleX;
                const tyB = originY - (y0 + tangentSlope * tSpan) * scaleY;

                // Secant line
                const sxA = originX + (x0 - 1) * scaleX;
                const syA = originY - (y0 - secantSlope * 1) * scaleY;
                const sxB = originX + (x0 + h + 1) * scaleX;
                const syB = originY - (y1 + secantSlope * 1) * scaleY;

                return (
                  <g>
                    {/* Tangent line */}
                    <line x1={txA} y1={tyA} x2={txB} y2={tyB} stroke="#10b981" strokeWidth="2" />

                    {/* Secant line (dashed) */}
                    <line
                      x1={sxA}
                      y1={syA}
                      x2={sxB}
                      y2={syB}
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Base Point (x0, y0) */}
                    <circle cx={px0} cy={py0} r="5" fill="#10b981" stroke="white" strokeWidth="2" />

                    {/* Secant Point (x0+h, y1) */}
                    <circle cx={px1} cy={py1} r="5" fill="#f59e0b" stroke="white" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500">
            Current Tangent Equation:{' '}
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              y - ({y0.toFixed(2)}) = {tangentSlope.toFixed(2)} · (x - {x0.toFixed(2)})
            </span>
          </div>
        </div>
      </div>

      {/* Module 2: Riemann Sums Definite Integral Visualizer */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sigma className="w-4 h-4 text-purple-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Riemann Sums: Numerical Integration of g(x) = ½x² + 1 over [0, 4]
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Approximate the area under the curve by summing rectangles. Watch error diminish as N increases.
            </p>
          </div>
          <button
            onClick={() => onNavigateToDesmos('\\int_0^4 (0.5x^2 + 1) dx')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:border-purple-500 transition-colors"
          >
            <span>Plot Integral in Desmos</span>
            <ExternalLink className="w-3.5 h-3.5 text-purple-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Number of Rectangles (N):</span>
                <span className="font-mono text-purple-500 font-bold">{numRects} partitions</span>
              </div>
              <input
                type="range"
                min="2"
                max="32"
                step="2"
                value={numRects}
                onChange={(e) => setNumRects(parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Sum Type Selector */}
            <div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
                Approximation Rule:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'mid', 'right'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSumType(type)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                      sumType === type
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {type} Sum
                  </button>
                ))}
              </div>
            </div>

            {/* Readouts */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60">
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono uppercase">
                  Riemann Sum (Area)
                </span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {riemannSum.toFixed(3)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase">
                  Exact ∫ g(x) dx
                </span>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {exactIntegral.toFixed(3)}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Width Δx = {dx.toFixed(2)}</span>
              <span>Approximation Error: {errorPercent.toFixed(2)}%</span>
            </div>
          </div>

          {/* Rectangles SVG Canvas */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg viewBox="0 0 320 200" className="w-full max-h-[220px]">
              {(() => {
                const rw = 320;
                const rh = 200;
                const sx = 260 / 4; // 65px per unit on x
                const sy = 160 / 9; // ~17.7px per unit on y
                const ox = 30;
                const oy = rh - 20;

                // Axes
                return (
                  <g>
                    <line x1={ox} y1={oy} x2={rw - 10} y2={oy} stroke="#64748b" strokeWidth="1.5" />
                    <line x1={ox} y1={oy} x2={ox} y2="10" stroke="#64748b" strokeWidth="1.5" />

                    {/* Rectangles */}
                    {rects.map((r, i) => {
                      const rectX = ox + r.x * sx;
                      const rectY = oy - r.h * sy;
                      const rectW = r.w * sx;
                      const rectH = r.h * sy;

                      return (
                        <rect
                          key={i}
                          x={rectX}
                          y={rectY}
                          width={rectW}
                          height={rectH}
                          fill="rgba(168, 85, 247, 0.25)"
                          stroke="#a855f7"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Exact continuous curve */}
                    {(() => {
                      const pts: string[] = [];
                      for (let x = 0; x <= 4; x += 0.1) {
                        const cy = g(x);
                        const cpx = ox + x * sx;
                        const cpy = oy - cy * sy;
                        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${cpx.toFixed(1)} ${cpy.toFixed(1)}`);
                      }
                      return (
                        <path
                          d={pts.join(' ')}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      );
                    })()}
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
