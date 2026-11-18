import React from 'react';
import {
  Home,
  LineChart,
  FunctionSquare,
  Triangle,
  Compass,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  BookOpen,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { NavSection } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { progress } = useProgress();
  const { t } = useLanguage();

  const handleSelect = (section: NavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const navItems = [
    { id: 'home' as NavSection, label: t.nav.home, icon: Home },
    { id: 'desmos' as NavSection, label: t.nav.desmos, icon: LineChart, badge: 'Live', badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300' },
    { id: 'algebra' as NavSection, label: t.nav.algebra, icon: FunctionSquare },
    { id: 'geometry' as NavSection, label: t.nav.geometry, icon: Triangle },
    { id: 'trigonometry' as NavSection, label: t.nav.trigonometry, icon: Compass },
    { id: 'calculus' as NavSection, label: t.nav.calculus, icon: TrendingUp },
    { id: 'statistics' as NavSection, label: t.nav.statistics, icon: BarChart2 },
    { id: 'practice' as NavSection, label: t.nav.practice, icon: CheckCircle2, badge: 'Quiz', badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300' },
    { id: 'formulas' as NavSection, label: t.nav.formulas, icon: BookOpen },
    { id: 'progress' as NavSection, label: t.nav.progress, icon: Trophy },
    { id: 'settings' as NavSection, label: t.nav.settings, icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full select-none">
      {/* Brand Logo & Collapse Toggle */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div
          onClick={() => handleSelect('home')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <span className="font-bold text-lg font-serif">∑</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate min-w-0">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                <span className="truncate">{t.appName}</span>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20 shrink-0">
                  v2.0
                </span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Interactive Learning & Graphing
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-indigo-900/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip on collapsed desktop view */}
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Creator Credit Badge in Sidebar */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/30 border border-indigo-200/80 dark:border-indigo-800/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                VA
              </div>
              <div className="truncate flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider block truncate">
                  {t.creatorTag}
                </span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">
                  {t.creatorName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                  {t.creatorRole}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] transition-all duration-300 z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0b0f19] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
