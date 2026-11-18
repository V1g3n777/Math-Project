import React, { useState, useMemo } from 'react';
import {
  BarChart2,
  Sliders,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Activity,
  Calculator,
  Shuffle
} from 'lucide-react';
import { MathView } from '../common/MathView';

interface StatisticsPageProps {
  onNavigateToDesmos: (expression?: string) => void;
}

export const StatisticsPage: React.FC<StatisticsPageProps> = ({ onNavigateToDesmos }) => {
  // Normal Distribution state
  const [mean, setMean] = useState<number>(0);
  const [stdDev, setStdDev] = useState<number>(1);
  const [zRange, setZRange] = useState<number>(1); // -z to +z standard deviations

  // Dataset Analyzer state
  const [datasetInput, setDatasetInput] = useState<string>('12, 15, 18, 18, 20, 22, 25, 28, 30, 32, 35');

  // Parse and calculate dataset statistics
  const stats = useMemo(() => {
    const numbers = datasetInput
      .split(/[\s,]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (numbers.length === 0) {
      return { count: 0, mean: 0, median: 0, min: 0, max: 0, variance: 0, stdDev: 0, q1: 0, q3: 0, iqr: 0, mode: 'None' };
    }

    const n = numbers.length;
    const sum = numbers.reduce((acc, v) => acc + v, 0);
    const avg = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;

    // Quartiles
    const lowerHalf = numbers.slice(0, mid);
    const upperHalf = n % 2 !== 0 ? numbers.slice(mid + 1) : numbers.slice(mid);
    const q1 = lowerHalf.length > 0 ? (lowerHalf.length % 2 !== 0 ? lowerHalf[Math.floor(lowerHalf.length / 2)] : (lowerHalf[Math.floor(lowerHalf.length / 2) - 1] + lowerHalf[Math.floor(lowerHalf.length / 2)]) / 2) : numbers[0];
    const q3 = upperHalf.length > 0 ? (upperHalf.length % 2 !== 0 ? upperHalf[Math.floor(upperHalf.length / 2)] : (upperHalf[Math.floor(upperHalf.length / 2) - 1] + upperHalf[Math.floor(upperHalf.length / 2)]) / 2) : numbers[n - 1];
    const iqr = q3 - q1;

    // Variance & StdDev
    const variance = n > 1 ? numbers.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / (n - 1) : 0;
    const sDev = Math.sqrt(variance);

    // Mode
    const freq: Record<number, number> = {};
    numbers.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    let maxFreq = 0;
    let modeVal: number[] = [];
    Object.entries(freq).forEach(([k, f]) => {
      if (f > maxFreq) {
        maxFreq = f;
        modeVal = [parseFloat(k)];
      } else if (f === maxFreq && maxFreq > 1) {
        modeVal.push(parseFloat(k));
      }
    });

    return {
      count: n,
      mean: avg,
      median,
      min: numbers[0],
      max: numbers[n - 1],
      variance,
      stdDev: sDev,
      q1,
      q3,
      iqr,
      mode: maxFreq > 1 ? modeVal.join(', ') : 'None',
      sorted: numbers,
    };
  }, [datasetInput]);

  // Approximate normal area using erf
  const erf = (x: number) => {
    // Abramowitz and Stegun formula 7.1.26
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
  };

  const probWithinZ = erf(zRange / Math.SQRT2);

  // SVG Normal curve parameters
  const svgW = 360;
  const svgH = 220;
  const originX = svgW / 2;
  const originY = svgH - 25;
  const scaleX = 40; // 40px per unit of x

  const normalPdf = (x: number, m: number, s: number) => {
    return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - m) / s, 2));
  };

  const peakY = normalPdf(mean, mean, stdDev);
  const scaleY = (svgH - 60) / (peakY || 1);

  const generateNormalPath = () => {
    const points: string[] = [];
    for (let x = -4.5; x <= 4.5; x += 0.1) {
      const y = normalPdf(x, mean, stdDev);
      const sx = originX + x * scaleX;
      const sy = originY - y * scaleY;
      points.push(`${points.length === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const generateShadedAreaPath = () => {
    const xLow = mean - zRange * stdDev;
    const xHigh = mean + zRange * stdDev;
    const points: string[] = [];
    const startSx = originX + xLow * scaleX;
    points.push(`M ${startSx.toFixed(1)} ${originY}`);

    for (let x = xLow; x <= xHigh; x += 0.05) {
      const y = normalPdf(x, mean, stdDev);
      const sx = originX + x * scaleX;
      const sy = originY - y * scaleY;
      points.push(`L ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }

    const endSx = originX + xHigh * scaleX;
    points.push(`L ${endSx.toFixed(1)} ${originY} Z`);
    return points.join(' ');
  };

  const loadPresetDataset = (preset: 'normal' | 'uniform' | 'skewed') => {
    if (preset === 'normal') {
      setDatasetInput('45, 48, 50, 50, 52, 53, 55, 55, 55, 57, 58, 60, 62, 65');
    } else if (preset === 'uniform') {
      setDatasetInput('10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60');
    } else {
      setDatasetInput('10, 12, 13, 14, 15, 16, 18, 20, 25, 45, 80');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-slate-900/60 border border-blue-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Interactive Statistics Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Normal Distribution & Data Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Investigate Gaussian bell curves, standard deviation intervals, Z-score probability regions, and calculate comprehensive descriptive statistics with interactive boxplots.
          </p>
        </div>
      </div>

      {/* Module 1: Gaussian Normal Distribution Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                Gaussian Bell Curve Explorer
              </h2>
            </div>
            <button
              onClick={() => {
                setMean(0);
                setStdDev(1);
                setZRange(1);
              }}
              className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Probability Density Function (PDF)</span>
            <div className="text-sm sm:text-base font-semibold text-indigo-600 dark:text-indigo-400">
              <MathView math="f(x) = \frac{1}{\sigma \sqrt{2\pi}} e^{-\frac{(x - \mu)^2}{2\sigma^2}}" />
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Mean μ (Center):</span>
                <span className="font-mono text-indigo-500 font-bold">{mean.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.2"
                value={mean}
                onChange={(e) => setMean(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Standard Deviation σ (Spread):</span>
                <span className="font-mono text-indigo-500 font-bold">{stdDev.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={stdDev}
                onChange={(e) => setStdDev(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-300">Interval Span [μ ± Z·σ]:</span>
                <span className="font-mono text-purple-500 font-bold">±{zRange} σ</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={zRange}
                onChange={(e) => setZRange(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Calculated Probability Card */}
          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
              Probability in Shaded Region: P(μ - {zRange}σ ≤ X ≤ μ + {zRange}σ)
            </span>
            <div className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1">
              {(probWithinZ * 100).toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {zRange === 1 && 'Standard 68% rule: ~68.27% of observations fall within 1 standard deviation.'}
              {zRange === 2 && 'Standard 95% rule: ~95.45% of observations fall within 2 standard deviations.'}
              {zRange === 3 && 'Standard 99.7% rule: ~99.73% of observations fall within 3 standard deviations.'}
            </p>
          </div>

          <button
            onClick={() => onNavigateToDesmos(`y = (1/(${stdDev}*\\sqrt{2*\\pi})) * e^(-(x-${mean})^2 / (2*${stdDev}^2))`)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
          >
            <span>Plot Bell Curve in Desmos</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Dynamic Bell Curve SVG */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Probability Density Curve & Standard Deviation Zones
            </span>
            <div className="text-xs text-purple-500 font-mono font-semibold">
              Shaded: ±{zRange}σ
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              className="w-full max-h-[260px] overflow-visible select-none"
            >
              {/* Baseline axis */}
              <line x1="10" y1={originY} x2={svgW - 10} y2={originY} stroke="#64748b" strokeWidth="1.5" />
              {/* Mean axis (vertical) */}
              <line
                x1={originX + mean * scaleX}
                y1="15"
                x2={originX + mean * scaleX}
                y2={originY}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Shaded Area under curve */}
              <path d={generateShadedAreaPath()} fill="rgba(168, 85, 247, 0.35)" />

              {/* Normal Distribution Curve */}
              <path
                d={generateNormalPath()}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Markers for μ, μ-σ, μ+σ */}
              <text
                x={originX + mean * scaleX}
                y={originY + 16}
                textAnchor="middle"
                className="fill-indigo-600 dark:fill-indigo-400 font-mono text-xs font-bold"
              >
                μ = {mean.toFixed(1)}
              </text>
            </svg>
          </div>

          {/* Quick empirical rule indicators */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className={`p-2 rounded-lg border ${zRange >= 1 ? 'border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
              <span className="font-bold block">±1σ Region</span>
              <span className="text-slate-400 text-[11px]">68.27%</span>
            </div>
            <div className={`p-2 rounded-lg border ${zRange >= 2 ? 'border-purple-400 bg-purple-50/50 dark:bg-purple-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
              <span className="font-bold block">±2σ Region</span>
              <span className="text-slate-400 text-[11px]">95.45%</span>
            </div>
            <div className={`p-2 rounded-lg border ${zRange >= 3 ? 'border-pink-400 bg-pink-50/50 dark:bg-pink-950/30' : 'border-slate-200 dark:border-slate-800'}`}>
              <span className="font-bold block">±3σ Region</span>
              <span className="text-slate-400 text-[11px]">99.73%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 2: Descriptive Statistics & Dataset Analyzer */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                Descriptive Dataset Analyzer & Five-Number Summary
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter any comma-separated values to compute central tendency, spread, and quartile box plot.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadPresetDataset('normal')}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Bell Preset
            </button>
            <button
              onClick={() => loadPresetDataset('skewed')}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Skewed Preset
            </button>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
            Dataset Values (separated by commas or spaces):
          </label>
          <input
            type="text"
            value={datasetInput}
            onChange={(e) => setDatasetInput(e.target.value)}
            placeholder="e.g. 10, 20, 25, 30, 35..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Mean (x̄)</span>
            <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {stats.mean.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Median (Q₂)</span>
            <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {stats.median.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Std Dev (s)</span>
            <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.stdDev.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Variance (s²)</span>
            <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.variance.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">IQR (Q₃ - Q₁)</span>
            <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">
              {stats.iqr.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Sample Size (n)</span>
            <div className="text-base font-bold font-mono text-slate-700 dark:text-slate-300">
              {stats.count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
