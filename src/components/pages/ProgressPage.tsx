import React from 'react';
import {
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Bookmark,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { FORMULA_LIBRARY, PRACTICE_PROBLEMS } from '../../data/mathData';
import { MathView } from '../common/MathView';
import { NavSection } from '../../types';
import { formatStudyTime } from '../../utils/progress';

interface ProgressPageProps {
  onNavigate: (section: NavSection) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigate }) => {
  const { progress, resetProgress } = useProgress();

  const xpForNextLevel = 150;
  const currentLevelXp = progress.xp % xpForNextLevel;
  const levelProgressPercent = (currentLevelXp / xpForNextLevel) * 100;

  // Bookmarked formulas
  const bookmarkedFormulas = FORMULA_LIBRARY.filter((f) =>
    progress.bookmarks.includes(f.id)
  );

  const solvedIn = (category: string) =>
    PRACTICE_PROBLEMS.filter(
      (problem) => problem.category === category && progress.completedProblems.includes(problem.id)
    ).length;

  const visited = new Set(progress.visitedTopics);
  const ACHIEVEMENTS = [
    {
      title: 'Pythagorean Initiate',
      desc: 'Open geometry or solve a geometry quiz',
      icon: '📐',
      unlocked: visited.has('geometry') || visited.has('pythagorean-theorem') || solvedIn('geometry') > 0,
    },
    {
      title: 'Calculus Pioneer',
      desc: 'Open calculus or solve a calculus quiz',
      icon: '📈',
      unlocked: visited.has('calculus') || visited.has('derivatives-tangents') || solvedIn('calculus') > 0,
    },
    {
      title: '5-Day Streak Master',
      desc: 'Open Diana Math on 5 days in a row',
      icon: '🔥',
      unlocked: progress.streak >= 5,
    },
    {
      title: 'Gaussian Analyst',
      desc: 'Open statistics or solve a statistics quiz',
      icon: '📊',
      unlocked: visited.has('statistics') || visited.has('normal-distribution') || solvedIn('statistics') > 0,
    },
    {
      title: 'Quiz Champion',
      desc: 'Solve 3 or more practice quiz challenges',
      icon: '🏆',
      unlocked: progress.completedProblems.length >= 3,
    },
    {
      title: 'Desmos Voyager',
      desc: 'Open the graphing laboratory',
      icon: '🌌',
      unlocked: visited.has('desmos'),
    },
  ];

  const subjectMastery = [
    { subject: 'Algebra & Functions', category: 'algebra', color: 'bg-indigo-500' },
    { subject: 'Euclidean Geometry', category: 'geometry', color: 'bg-emerald-500' },
    { subject: 'Trigonometric Harmonics', category: 'trigonometry', color: 'bg-blue-500' },
    { subject: 'Differential & Integral Calculus', category: 'calculus', color: 'bg-purple-500' },
    { subject: 'Statistics & Probability Distributions', category: 'statistics', color: 'bg-amber-500' },
  ].map((item) => {
    const total = PRACTICE_PROBLEMS.filter((problem) => problem.category === item.category).length;
    const solved = solvedIn(item.category);
    return { ...item, percent: total === 0 ? 0 : Math.round((solved / total) * 100) };
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-950/40 via-indigo-950/30 to-slate-900/60 border border-amber-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Scholar Mastery Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Learning Progress & Milestones
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Track your daily streaks, experience points, completed problem sets, and unlocked mathematical achievements.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Current Streak
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {progress.streak} Days
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">
              {progress.streak <= 1 ? 'Today is day 1. Return tomorrow to continue.' : 'Return tomorrow to extend it.'}
            </span>
          </div>
        </div>

        {/* Level & XP */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Scholar Level
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Level {progress.level}
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Problems Solved */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Problems Solved
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {progress.completedProblems.length}
            </div>
            <span className="text-[11px] text-slate-400">{formatStudyTime(progress.studiedSeconds)} on this device</span>
          </div>
        </div>

        {/* Saved Formulas */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-500 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Bookmarked Formulas
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {progress.bookmarks.length}
            </div>
            <span className="text-[11px] text-slate-400">pinned for quick review</span>
          </div>
        </div>
      </div>

      {/* Curriculum Mastery Progress Bars */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Curriculum Subject Mastery
        </h2>

        <div className="space-y-4">
          {subjectMastery.map((item) => (
            <div key={item.subject}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-200">{item.subject}</span>
                <span className="font-mono text-slate-500">{item.percent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Badges */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Scholar Achievements</span>
          </h2>
          <span className="text-xs text-slate-400">
            {ACHIEVEMENTS.filter((a) => a.unlocked).length} of {ACHIEVEMENTS.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.title}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                ach.unlocked
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60'
                  : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/30 dark:bg-slate-900/20 opacity-50 grayscale'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm shrink-0">
                {ach.icon}
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {ach.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {ach.desc}
                </p>
                {ach.unlocked && (
                  <span className="inline-block text-[10px] text-emerald-500 font-semibold mt-1">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Formulas Quick Access */}
      {bookmarkedFormulas.length > 0 && (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-purple-500 fill-current" />
            <span>Pinned Formulas ({bookmarkedFormulas.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookmarkedFormulas.map((formula) => (
              <div
                key={formula.id}
                onClick={() => onNavigate('formulas')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-purple-400 transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    {formula.title}
                  </span>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                    <MathView math={formula.latex} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Progress Action */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your practice progress and XP?')) {
              resetProgress();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress History</span>
        </button>
      </div>
    </div>
  );
};
