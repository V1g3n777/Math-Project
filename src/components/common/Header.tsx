import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Flame,
  Zap,
  Menu,
  Sliders,
  Command,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { NavSection } from '../../types';
import { Language } from '../../data/translations';

interface HeaderProps {
  activeSection: NavSection;
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  onNavigate: (section: NavSection) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenSearch,
  onToggleSidebar,
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { progress } = useProgress();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'hy', label: 'Հայերեն', flag: '🇦🇲' },
  ];

  const currentLangDef = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-colors gap-2">
      {/* Left: Mobile sidebar trigger & active section label */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 truncate">
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 truncate">
            <span className="truncate">{t.nav[activeSection] || 'Diana Math'}</span>
          </h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs lg:max-w-md">
            {activeSection === 'home' && t.home.welcomeBadge}
            {activeSection === 'desmos' && t.desmos.subtitle}
            {activeSection === 'practice' && t.practice.subtitle}
            {activeSection !== 'home' && activeSection !== 'desmos' && activeSection !== 'practice' && 'Interactive mathematics curriculum & tools'}
          </p>
        </div>
      </div>

      {/* Right: Search, Language Switcher, Streak, Theme Toggle, Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Search trigger button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="hidden sm:inline">{t.home.searchPlaceholder.slice(0, 16)}...</span>
          <span className="sm:hidden text-[11px]">Search</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all"
            title="Switch Language"
          >
            <span className="text-sm">{currentLangDef.flag}</span>
            <span className="hidden sm:inline font-mono">{currentLangDef.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors ${
                    language === lang.code
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Streak indicator */}
        <div
          onClick={() => onNavigate('progress')}
          className="cursor-pointer flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:scale-105 transition-transform shrink-0"
          title={`${progress.streak} ${t.home.streakDays}`}
        >
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{progress.streak}d</span>
        </div>

        {/* Level / XP Pill */}
        <div
          onClick={() => onNavigate('progress')}
          className="cursor-pointer hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold hover:scale-105 transition-transform shrink-0"
          title={`Level ${progress.level} (${progress.xp} XP)`}
        >
          <Zap className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" />
          <span>Lvl {progress.level}</span>
        </div>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('settings')}
          title="Settings"
          className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
