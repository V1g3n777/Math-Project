import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Copy,
  ExternalLink,
  Sparkles,
  Filter,
  Check
} from 'lucide-react';
import { FORMULA_LIBRARY } from '../../data/mathData';
import { FormulaItem } from '../../types';
import { MathView } from '../common/MathView';
import { useProgress } from '../../context/ProgressContext';

interface FormulaLibraryPageProps {
  onNavigateToDesmos: (expression?: string) => void;
  selectedFormulaId?: string;
}

export const FormulaLibraryPage: React.FC<FormulaLibraryPageProps> = ({
  onNavigateToDesmos,
  selectedFormulaId,
}) => {
  const { progress, toggleBookmark } = useProgress();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'];

  const filteredFormulas = FORMULA_LIBRARY.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchLatex = item.latex.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchTags || matchLatex;
    }
    return true;
  });

  const handleCopyLatex = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-purple-950/40 via-indigo-900/20 to-slate-900/60 border border-purple-500/20 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mathematical Reference</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Formula Library & Theorems
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            A comprehensive repository of mathematical identities, calculus rules, geometric laws, and statistical models. Copy LaTeX or launch directly into Desmos.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by theorem, formula, symbol, or tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFormulas.map((item) => {
          const isBookmarked = progress.bookmarks.includes(item.id);
          const isSelected = selectedFormulaId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-[#0f172a] rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                isSelected
                  ? 'border-purple-500 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header: Title, Category & Bookmark */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      {item.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleBookmark(item.id)}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark formula'}
                    className={`p-2 rounded-xl transition-colors ${
                      isBookmarked
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Formula LaTeX Display */}
                <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-center overflow-x-auto">
                  <div className="text-base sm:text-lg text-slate-900 dark:text-slate-100 font-semibold">
                    <MathView math={item.latex} block copyable={false} />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {item.description}
                </p>

                {/* Variable Breakdown */}
                {item.variables.length > 0 && (
                  <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Variable Key
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {item.variables.map((v, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-semibold text-indigo-500">
                            <MathView math={v.symbol} />
                          </span>
                          <span>: {v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Copy LaTeX & Open in Desmos */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopyLatex(item.id, item.latex)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy LaTeX</span>
                    </>
                  )}
                </button>

                {item.desmosExpression && (
                  <button
                    onClick={() => onNavigateToDesmos(item.desmosExpression)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-colors"
                  >
                    <span>Plot in Desmos</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
