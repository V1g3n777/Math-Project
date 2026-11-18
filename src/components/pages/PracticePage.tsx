import React, { useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Trophy,
  Zap,
  Filter,
  Check
} from 'lucide-react';
import { PRACTICE_PROBLEMS } from '../../data/mathData';
import { PracticeProblem } from '../../types';
import { MathView } from '../common/MathView';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { shuffleItems } from '../../utils/progress';

export const PracticePage: React.FC = () => {
  const { progress, completeProblem } = useProgress();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showSolved, setShowSolved] = useState(false);
  const [heldProblemId, setHeldProblemId] = useState<string | null>(null);

  // Current problem interaction state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const optionOrder = useRef<Record<string, PracticeProblem['options']>>({});

  // Filter problems
  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && p.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    return true;
  });

  const solvedIds = useMemo(() => new Set(progress.completedProblems), [progress.completedProblems]);
  const unsolvedProblems = filteredProblems.filter((problem) => !solvedIds.has(problem.id));
  const heldProblem = heldProblemId
    ? filteredProblems.find((problem) => problem.id === heldProblemId)
    : undefined;
  const currentProblem: PracticeProblem | undefined = showSolved
    ? heldProblem || filteredProblems.find((problem) => problem.id === heldProblemId) || filteredProblems[0]
    : heldProblem || unsolvedProblems[0];

  const shuffledOptions = currentProblem
    ? optionOrder.current[currentProblem.id] ||
      (optionOrder.current[currentProblem.id] = shuffleItems(currentProblem.options))
    : [];
  const visibleProblems = showSolved
    ? filteredProblems
    : filteredProblems.filter((problem) => !solvedIds.has(problem.id) || problem.id === heldProblemId);
  const visibleIndex = currentProblem
    ? Math.max(0, visibleProblems.findIndex((problem) => problem.id === currentProblem.id))
    : 0;

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || !currentProblem || isSubmitted) return;
    setIsSubmitted(true);
    setHeldProblemId(currentProblem.id);

    const chosen = currentProblem.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
      completeProblem(currentProblem.id, 50);
      setShowExplanation(true);
    }
  };

  const resetCard = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowHint(false);
    setShowExplanation(false);
  };

  const handleNextProblem = () => {
    if (!currentProblem) return;
    const currentIndex = filteredProblems.findIndex((problem) => problem.id === currentProblem.id);
    const isAvailable = (problem: PracticeProblem) =>
      showSolved || (!solvedIds.has(problem.id) && problem.id !== currentProblem.id);
    const later = filteredProblems.find((problem, index) => index > currentIndex && isAvailable(problem));
    const earlier = filteredProblems.find((problem) => problem.id !== currentProblem.id && isAvailable(problem));
    resetCard();
    setHeldProblemId((later || earlier)?.id ?? null);
  };

  const isCurrentProblemCompleted = currentProblem
    ? progress.completedProblems.includes(currentProblem.id)
    : false;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/40 via-teal-900/20 to-slate-900/60 border border-emerald-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.practice.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {t.practice.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {t.practice.subtitle}
          </p>
        </div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> {t.practice.subjectFilter}
          </span>
          {(['all', 'algebra', 'geometry', 'trigonometry', 'calculus', 'statistics'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setHeldProblemId(null);
                  setShowSolved(false);
                  resetCard();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? t.practice.allSubjects : cat}
              </button>
            )
          )}
          {progress.completedProblems.length > 0 && (
            <button
              onClick={() => {
                setShowSolved((current) => !current);
                setHeldProblemId(null);
                resetCard();
              }}
              className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {showSolved ? t.practice.hideSolved : t.practice.reviewSolved}
            </button>
          )}
        </div>

        {/* Solved Counter */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <Trophy className="w-4 h-4" /> {progress.completedProblems.length} {t.practice.solvedCount}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            +{progress.xp} {t.practice.xpEarned}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-500 dark:text-slate-400">{t.practice.savedLocally}</span>
        </div>
      </div>

      {/* Main Question Card */}
      {currentProblem ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header of problem */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 capitalize">
                {currentProblem.category}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  currentProblem.difficulty === 'Easy'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : currentProblem.difficulty === 'Medium'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
              >
                {currentProblem.difficulty}
              </span>
              {isCurrentProblemCompleted && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" /> {t.practice.solvedCount}
                </span>
              )}
            </div>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
              Problem {visibleIndex + 1} of {visibleProblems.length}
            </span>
          </div>

          {/* Question Text & Formula */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {currentProblem.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentProblem.question}
            </p>
            {currentProblem.latex && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 my-3 text-center">
                <div className="text-base sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                  <MathView math={currentProblem.latex} block />
                </div>
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {shuffledOptions.map((option, optionIndex) => {
              const isSelected = selectedOptionId === option.id;
              let optionStyle =
                'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/50';

              if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20';
              }

              if (isSubmitted) {
                if (option.isCorrect) {
                  optionStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
                } else if (isSelected && !option.isCorrect) {
                  optionStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
                }
              }

              return (
                <button
                  key={option.id}
                  disabled={isSubmitted}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${optionStyle}`}
                >
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono font-bold text-slate-500 dark:text-slate-400">
                      Option {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {option.latex ? <MathView math={option.latex} /> : option.text}
                    </div>
                  </div>

                  {isSubmitted && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  )}
                  {isSubmitted && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions Bar: Hint, Submit, Next */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>{showHint ? t.practice.hideHint : t.practice.showHint}</span>
              </button>

              {isSubmitted && (
                <button
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{showExplanation ? t.practice.hideSolution : t.practice.viewSolution}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  disabled={!selectedOptionId}
                  onClick={handleSubmit}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedOptionId
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{t.practice.submit}</span>
                  <Zap className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleNextProblem}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                  <span>{t.practice.next}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1 animate-in fade-in duration-150">
              <span className="font-bold uppercase tracking-wider block">{t.practice.hintLabel}</span>
              <p>{currentProblem.hint}</p>
            </div>
          )}

          {/* Detailed Solution Walkthrough */}
          {showExplanation && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in duration-150">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                {t.practice.solutionLabel}
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {currentProblem.explanation}
              </p>
              {currentProblem.explanationLatex && (
                <div className="py-2">
                  <MathView math={currentProblem.explanationLatex} block />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base font-bold text-slate-800 dark:text-slate-100">
            {filteredProblems.length === 0 ? 'No practice problems match the selected filters.' : t.practice.allSolvedTitle}
          </p>
          {filteredProblems.length > 0 && (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{t.practice.allSolvedText}</p>
              <button
                onClick={() => {
                  setShowSolved(true);
                  setHeldProblemId(filteredProblems[0]?.id ?? null);
                  resetCard();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                {t.practice.reviewSolved}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
