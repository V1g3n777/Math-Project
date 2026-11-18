import React, { useState } from 'react';
import {
  Search,
  LineChart,
  FunctionSquare,
  CheckCircle2,
  ArrowRight,
  Flame,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import { MATH_TOPICS, FORMULA_LIBRARY, PRACTICE_PROBLEMS } from '../../data/mathData';
import { NavSection, MathTopic } from '../../types';
import { MathView } from '../common/MathView';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { DesmosCalculator } from '../calculator/DesmosCalculator';
import { formatStudyTime, formatVisitedAt } from '../../utils/progress';

interface HomeDashboardProps {
  onNavigate: (section: NavSection, payload?: any) => void;
  onOpenSearch: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenSearch,
}) => {
  const { progress, recordTopicVisit } = useProgress();
  const { t } = useLanguage();
  const [copiedFormula, setCopiedFormula] = useState(false);

  // Popular topics
  const popularTopics = MATH_TOPICS.filter((topic) => topic.popular);
  const categoryProgress = (category: string) => {
    const problems = PRACTICE_PROBLEMS.filter((problem) => problem.category === category);
    if (problems.length === 0) return 0;
    const solved = problems.filter((problem) => progress.completedProblems.includes(problem.id)).length;
    return Math.round((solved / problems.length) * 100);
  };

  // Recently visited topics resolved from data
  const recentTopics = progress.recentlyVisited
    .map((item) => {
      const topic = MATH_TOPICS.find((t) => t.id === item.topicId);
      return topic ? { ...topic, visitedAt: formatVisitedAt(item.visitedAt), progress: categoryProgress(topic.category) } : null;
    })
    .filter(Boolean) as (MathTopic & { visitedAt: string })[];

  // Formula of the Day (Euler's formula)
  const formulaOfTheDay = FORMULA_LIBRARY[4];

  const handleTopicClick = (topic: MathTopic) => {
    recordTopicVisit(topic.id);
    onNavigate(topic.category);
  };

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(formulaOfTheDay.latex);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-5 pb-6">
      {/* ============================================================== */}
      {/* 🌟 UNIFIED MASTER HERO & CREATOR DASHBOARD BANNER              */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-xl overflow-hidden text-white">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl min-w-0 flex-1">
            {/* Top Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.creatorTag}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span>Informatics Class Presentation</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                <Flame className="w-3 h-3 fill-current text-amber-400" />
                <span>{progress.streak} {t.home.streakDays}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-200 text-xs font-mono font-bold">
                <Clock className="w-3 h-3" />
                <span>{formatStudyTime(progress.studiedSeconds)} {t.home.studiedLabel}</span>
              </span>
            </div>

            {/* BIG LETTERS CREATOR NAME - CLEAN, NO UNDERLINE */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-sm break-words">
                <span className="text-indigo-300">Creator: </span>
                <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  {t.creatorName}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-indigo-200 font-semibold tracking-wide">
                {t.creatorRole}
              </p>
            </div>

            {/* Presentation Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium break-words">
              {t.creatorBio} {t.home.heroSubtitle}
            </p>

            {/* Quick Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('desmos')}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                <LineChart className="w-4 h-4" />
                <span>{t.home.launchDesmos}</span>
              </button>
              <button
                onClick={() => onNavigate('practice')}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t.home.solveDaily}</span>
              </button>
            </div>
          </div>

          {/* Right Monogram Avatar / Scholar Badge */}
          <div className="self-center lg:self-auto flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg shadow-indigo-500/40">
              VA
            </div>
            <span className="text-xs font-bold font-mono tracking-wider text-indigo-200 text-center">
              {t.creatorName}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              Junior Full-Stack
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. COMPACT FLUID SEARCH BAR                                    */}
      {/* ============================================================== */}
      <div
        onClick={onOpenSearch}
        className="cursor-pointer group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 transition-all gap-3"
      >
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors flex-1 min-w-0">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
          <span className="text-xs sm:text-sm truncate">
            {t.home.searchPlaceholder}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {t.home.pressShortcut}
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. DESMOS GRAPHING LAB EMBED SHOWCASE                          */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-indigo-500 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                {t.home.desmosShowcaseTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-words">
              {t.home.desmosShowcaseSubtitle}
            </p>
          </div>

          <button
            onClick={() => onNavigate('desmos')}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shrink-0"
          >
            <span>{t.home.expandLab}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Embedded Desmos Calculator Instance with responsive height */}
        <DesmosCalculator heightClass="h-[320px] sm:h-[400px] lg:h-[460px]" showPresetsBar={true} />
      </div>

      {/* ============================================================== */}
      {/* 4. POPULAR MATHEMATICS TOPICS                                  */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
              {t.home.popularTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {t.home.popularSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('algebra')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{t.home.viewAllTopics}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className="group cursor-pointer bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all flex flex-col justify-between min-w-0"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 truncate">
                    {topic.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Clock className="w-3 h-3" /> {topic.duration}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors break-words">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2 break-words">
                  {topic.description}
                </p>

                {topic.featuredFormula && (
                  <div className="my-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center overflow-x-auto">
                    <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      <MathView math={topic.featuredFormula} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{t.home.progressLabel}</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                    {categoryProgress(topic.category)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${categoryProgress(topic.category)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. RECENT SESSIONS & FORMULA OF THE DAY                        */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recently Visited */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  {t.home.recentlyVisitedTitle}
                </h2>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{t.home.savedSessions}</span>
            </div>

            <div className="space-y-2 mt-3">
              {recentTopics.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">{t.home.noRecentVisits}</p>
              )}
              {recentTopics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                  className="group cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3 transition-all min-w-0"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FunctionSquare className="w-4 h-4" />
                    </div>
                    <div className="truncate flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {topic.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 truncate">
                        <span className="capitalize">{topic.category}</span>
                        <span>•</span>
                        <span>{topic.visitedAt}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {topic.progress}%
                    </span>
                    <div className="p-1 rounded-md text-slate-400 group-hover:text-indigo-500 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formula of the Day & Quick Challenge */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          {/* Formula of the Day Card */}
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.home.formulaOfTheDay}</span>
              </span>
              <button
                onClick={handleCopyFormula}
                className="text-xs text-slate-400 hover:text-purple-500 flex items-center gap-1 transition-colors shrink-0"
                title="Copy LaTeX"
              >
                {copiedFormula ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">{t.common.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.common.copyLatex}</span>
                  </>
                )}
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white break-words">
              {formulaOfTheDay.title}
            </h3>

            <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-center overflow-x-auto">
              <div className="text-xs sm:text-sm text-slate-900 dark:text-white font-semibold">
                <MathView math={formulaOfTheDay.latex} block />
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
              {formulaOfTheDay.description}
            </p>

            <button
              onClick={() => onNavigate('formulas')}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
            >
              <span>{t.nav.formulas}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Problem Teaser */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900/70 to-purple-950/40 border border-indigo-500/20 shadow-sm space-y-2.5 min-w-0">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              {t.home.dailyPracticeSprint}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              {t.home.dailyPracticeText}
            </p>
            <button
              onClick={() => onNavigate('practice')}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t.home.startQuiz}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
