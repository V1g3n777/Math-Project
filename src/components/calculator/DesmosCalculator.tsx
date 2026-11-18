import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Layers,
  ExternalLink,
  ChevronDown,
  Monitor,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface PresetCurve {
  name: string;
  category: string;
  description: string;
  equation: string;
  paramA?: number;
  paramB?: number;
}

const PRESETS: PresetCurve[] = [
  {
    name: 'Cubic with Tangent Line',
    category: 'Calculus',
    description: 'Dynamic tangent line sliding along f(x) = x³ - 3x',
    equation: 'y = x^3 - 3x',
    paramA: 1.0,
  },
  {
    name: 'Sine & Cosine Harmonics',
    category: 'Trigonometry',
    description: 'Fundamental wave oscillation with frequency harmonics',
    equation: 'y = \\sin(x) + 0.5\\cos(2x)',
    paramA: 2.0,
  },
  {
    name: 'Quadratic & Vertex Form',
    category: 'Algebra',
    description: 'Interactive parabola with movable vertex (h, k)',
    equation: 'y = a(x - 2)^2 - 1',
    paramA: 1.0,
  },
  {
    name: 'Ellipse & Conic Sections',
    category: 'Geometry',
    description: 'Standard Cartesian conic section with focal points',
    equation: 'x^2/16 + y^2/9 = 1',
    paramA: 4,
  },
  {
    name: 'Gaussian Normal Bell Curve',
    category: 'Statistics',
    description: 'Standard probability density function with mean and standard deviation',
    equation: 'y = (1/(\\sigma\\sqrt{2\\pi})) e^{-(x-\\mu)^2/(2\\sigma^2)}',
    paramA: 1.2,
  },
  {
    name: 'Polar Rose Petals',
    category: 'Advanced',
    description: 'Multifoliate polar coordinate equation r = 3 cos(kθ)',
    equation: 'r = 3\\cos(4\\theta)',
    paramA: 4,
  },
];

interface DesmosCalculatorProps {
  initialExpression?: string;
  heightClass?: string;
  showPresetsBar?: boolean;
}

export const DesmosCalculator: React.FC<DesmosCalculatorProps> = ({
  initialExpression,
  heightClass = 'h-[620px]',
  showPresetsBar = true,
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [engineMode, setEngineMode] = useState<'desmos-embed' | 'native-grapher'>('desmos-embed');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>(PRESETS[0].name);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const [iframeKey, setIframeKey] = useState<number>(1);

  // Native Grapher state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(35); // pixels per unit
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const isDark = theme === 'dark';

  // Draw native canvas curve when in native-grapher mode
  useEffect(() => {
    if (engineMode !== 'native-grapher' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = isDark ? '#0b0f19' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const originX = width / 2;
    const originY = height / 2;

    // Draw Grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';

    const step = zoom;
    for (let x = originX % step; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = originY % step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Axes
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis numbers
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
    for (let i = -15; i <= 15; i++) {
      if (i === 0) continue;
      const px = originX + i * zoom;
      const py = originY - i * zoom;
      if (px > 0 && px < width) ctx.fillText(i.toString(), px - 4, originY + 12);
      if (py > 0 && py < height) ctx.fillText(i.toString(), originX + 5, py + 3);
    }

    // Function evaluation based on active preset
    const evaluateFunc = (x: number): number => {
      if (activePreset === 'Sine & Cosine Harmonics') {
        return Math.sin(x) + 0.5 * Math.cos(paramA * x);
      }
      if (activePreset === 'Quadratic & Vertex Form') {
        return paramA * Math.pow(x - 2, 2) - 1;
      }
      if (activePreset === 'Gaussian Normal Bell Curve') {
        const s = Math.max(0.3, paramA);
        return (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(x / s, 2));
      }
      // Default: Cubic with Tangent f(x) = x^3 - 3x
      return Math.pow(x, 3) - 3 * x;
    };

    // Plot Main Curve
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#6366f1';
    ctx.beginPath();
    let isFirst = true;

    for (let screenX = 0; screenX <= width; screenX += 2) {
      const mathX = (screenX - originX) / zoom;
      const mathY = evaluateFunc(mathX);
      const screenY = originY - mathY * zoom;

      if (isFirst) {
        ctx.moveTo(screenX, screenY);
        isFirst = false;
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();

    // If Cubic preset, draw dynamic tangent line at paramA
    if (activePreset === 'Cubic with Tangent Line') {
      const a = paramA;
      const fa = evaluateFunc(a);
      const fPrimeA = 3 * a * a - 3;

      // Draw tangent line
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();

      const span = 4;
      const x1 = a - span;
      const y1 = fa - fPrimeA * span;
      const x2 = a + span;
      const y2 = fa + fPrimeA * span;

      ctx.moveTo(originX + x1 * zoom, originY - y1 * zoom);
      ctx.lineTo(originX + x2 * zoom, originY - y2 * zoom);
      ctx.stroke();

      // Tangent point
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(originX + a * zoom, originY - fa * zoom, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hover Tracer dot
    if (mousePos) {
      const hx = (mousePos.x - originX) / zoom;
      const hy = evaluateFunc(hx);
      const sy = originY - hy * zoom;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(mousePos.x, sy, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip coordinate pill
      ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
      ctx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
      ctx.lineWidth = 1;
      const text = `(${hx.toFixed(2)}, ${hy.toFixed(2)})`;
      ctx.fillRect(mousePos.x + 8, sy - 22, text.length * 8 + 12, 18);
      ctx.strokeRect(mousePos.x + 8, sy - 22, text.length * 8 + 12, 18);

      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillText(text, mousePos.x + 14, sy - 10);
    }
  }, [engineMode, activePreset, paramA, paramB, zoom, isDark, mousePos]);

  const loadPreset = (preset: PresetCurve) => {
    setActivePreset(preset.name);
    if (preset.paramA !== undefined) setParamA(preset.paramA);
    setShowPresetDropdown(false);
  };

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : ''
      }`}
    >
      {/* Top Header Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#0b0f19]/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Dual Engine Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60 text-xs">
            <button
              onClick={() => setEngineMode('desmos-embed')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                engineMode === 'desmos-embed'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t.desmos.officialEmbedTab}</span>
            </button>
            <button
              onClick={() => setEngineMode('native-grapher')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                engineMode === 'native-grapher'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{t.desmos.nativeGrapherTab}</span>
            </button>
          </div>

          {/* Preset Selector Dropdown */}
          {showPresetsBar && (
            <div className="relative">
              <button
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                  {activePreset}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPresetDropdown && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.desmos.presets}
                  </div>
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => loadPreset(p)}
                      className={`w-full text-left px-3 py-2 text-xs flex flex-col transition-colors ${
                        activePreset === p.name
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{p.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {p.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate mt-0.5">
                        {p.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          {engineMode === 'desmos-embed' && (
            <button
              onClick={reloadIframe}
              title="Reload Desmos Frame"
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {engineMode === 'native-grapher' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">Zoom:</span>
              <button
                onClick={() => setZoom((z) => Math.max(15, z - 5))}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                -
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(80, z + 5))}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                +
              </button>
              <button
                onClick={() => setZoom(35)}
                title="Reset zoom"
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit fullscreen' : 'Full screen'}
            className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Graphing Canvas / Embed Container */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1' : heightClass} bg-slate-100 dark:bg-[#0b0f19]`}>
        {engineMode === 'desmos-embed' ? (
          <iframe
            key={iframeKey}
            src="https://www.desmos.com/calculator?embed"
            title="Official Desmos Calculator"
            className="w-full h-full border-0 rounded-b-3xl"
            allow="fullscreen"
          />
        ) : (
          <div className="relative w-full h-full flex flex-col">
            <canvas
              ref={canvasRef}
              onMouseMove={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                  setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                }
              }}
              onMouseLeave={() => setMousePos(null)}
              className="w-full flex-1 cursor-crosshair"
            />

            {/* Native Grapher Bottom Slider Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  Parameter a (Slider): <span className="font-mono text-indigo-500 font-bold">{paramA.toFixed(2)}</span>
                </span>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.05"
                  value={paramA}
                  onChange={(e) => setParamA(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="text-xs text-slate-400 font-mono hidden sm:block">
                Hover anywhere on canvas to inspect exact (x, y) coordinates
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0b0f19]/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>
            {engineMode === 'desmos-embed'
              ? 'Desmos Official Calculator Engine active'
              : 'Diana Native High-Performance Grapher active'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.desmos.com/calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 flex items-center gap-1 transition-colors"
          >
            <span>Desmos.com</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
