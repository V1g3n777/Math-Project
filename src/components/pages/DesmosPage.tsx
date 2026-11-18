import React from 'react';
import {
  LineChart,
  Sparkles,
  Info,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { DesmosCalculator } from '../calculator/DesmosCalculator';
import { MathView } from '../common/MathView';

interface DesmosPageProps {
  initialExpression?: string;
}

export const DesmosPage: React.FC<DesmosPageProps> = ({ initialExpression }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <LineChart className="w-3.5 h-3.5" />
            <span>Desmos Graphing Engine Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Advanced Graphing Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Input mathematical expressions, create interactive sliders, compute derivatives, graph parametric and polar curves, and analyze geometric intersections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.desmos.com/calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-400 transition-colors shadow-sm"
          >
            <span>Desmos.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Desmos Calculator Instance */}
      <DesmosCalculator
        initialExpression={initialExpression}
        heightClass="h-[680px]"
        showPresetsBar={true}
      />

      {/* Quick Syntax Cheat Sheet */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Desmos Keyboard & Formula Syntax Guide
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 block">Exponents & Roots</span>
            <p className="font-mono text-slate-700 dark:text-slate-300">x^2, x^n, sqrt(x), nthroot(x, 3)</p>
            <span className="text-[11px] text-slate-400">Type ^ for power, sqrt for root</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-purple-600 dark:text-purple-400 block">Trig & Inverse Trig</span>
            <p className="font-mono text-slate-700 dark:text-slate-300">sin(x), cos(x), tan(x), arctan(x)</p>
            <span className="text-[11px] text-slate-400">Type pi for π, theta for θ</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Calculus Operators</span>
            <p className="font-mono text-slate-700 dark:text-slate-300">d/dx(f(x)), int_0^1 f(x) dx</p>
            <span className="text-[11px] text-slate-400">Type d/dx or int for definite integral</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-amber-600 dark:text-amber-400 block">Sliders & Points</span>
            <p className="font-mono text-slate-700 dark:text-slate-300">a = 2, (a, a^2), r = 1 + cos(theta)</p>
            <span className="text-[11px] text-slate-400">Sliders animate parameter variations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
