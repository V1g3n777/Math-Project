import React from 'react';
import {
  Settings,
  Sun,
  Moon,
  Compass,
  Type,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  ShieldCheck,
  Code
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            System Preferences
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Customize display mode, coordinate units, font scale, and calculation defaults to tailor your mathematical workspace.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance / Theme */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Interface Appearance
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-50/40 text-indigo-900 ring-2 ring-indigo-500/20 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-left">
                <span className="text-xs sm:text-sm block">Light Mode</span>
                <span className="text-[11px] text-slate-400">Crisp daytime contrast</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/20 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400 shrink-0" />
              <div className="text-left">
                <span className="text-xs sm:text-sm block">Dark Mode</span>
                <span className="text-[11px] text-slate-400">Desmos navy & low eye strain</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mathematical Parameters */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Mathematical Calculation Units
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Trigonometric Angle Units
              </span>
              <span className="text-xs text-slate-400">
                Default unit used for unit circle calculations and sine/cosine wave generators.
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
              <button
                onClick={() => updateSetting('angleUnit', 'radians')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  settings.angleUnit === 'radians'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Radians (π rad)
              </button>
              <button
                onClick={() => updateSetting('angleUnit', 'degrees')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  settings.angleUnit === 'degrees'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Degrees (360°)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                KaTeX Formula Typeset Scale
              </span>
              <span className="text-xs text-slate-400">
                Adjust the magnification of LaTeX equations across lessons.
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    settings.fontSize === size
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Animations & Celebrations */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Feedback & Micro-interactions
          </h2>

          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Interactive Canvas Animations
              </span>
              <span className="text-xs text-slate-400">
                Enable fluid real-time parameter rendering in graphs and geometric proofs.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.animationsEnabled}
              onChange={(e) => updateSetting('animationsEnabled', e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Quiz Celebration Confetti
              </span>
              <span className="text-xs text-slate-400">
                Show celebratory visual particle bursts upon solving problems correctly.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => updateSetting('soundEffects', e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* About Diana Math Architecture */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Technology Stack & Architecture
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Built with React 19, TypeScript, Vite 6, Tailwind CSS v4, official Desmos Graphing API v1.9, KaTeX LaTeX typesetting, and Canvas Confetti.
          </p>
        </div>
      </div>
    </div>
  );
};
