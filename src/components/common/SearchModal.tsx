import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  LineChart,
  FunctionSquare,
  Triangle,
  Compass,
  TrendingUp,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { MATH_TOPICS, FORMULA_LIBRARY } from '../../data/mathData';
import { NavSection } from '../../types';
import { MathView } from './MathView';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection, payload?: any) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global key listener for Esc and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open from parent if needed
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  // Filter topics
  const matchedTopics = cleanQ
    ? MATH_TOPICS.filter(
        (t) =>
          t.title.toLowerCase().includes(cleanQ) ||
          t.description.toLowerCase().includes(cleanQ) ||
          t.category.toLowerCase().includes(cleanQ)
      )
    : MATH_TOPICS.slice(0, 4);

  // Filter formulas
  const matchedFormulas = cleanQ
    ? FORMULA_LIBRARY.filter(
        (f) =>
          f.title.toLowerCase().includes(cleanQ) ||
          f.description.toLowerCase().includes(cleanQ) ||
          f.tags.some((tag) => tag.toLowerCase().includes(cleanQ)) ||
          f.latex.toLowerCase().includes(cleanQ)
      )
    : FORMULA_LIBRARY.slice(0, 3);

  const handleSelectTopic = (category: NavSection) => {
    onNavigate(category);
    onClose();
  };

  const handleSelectFormula = (formulaId: string) => {
    onNavigate('formulas', { formulaId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mathematical topics, formulas, tools, or theorems..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {/* Quick Actions */}
          {!cleanQ && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    onNavigate('desmos');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/60 dark:bg-slate-900/40 text-left transition-all group"
                >
                  <LineChart className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    Desmos Grapher
                  </span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('practice');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 bg-slate-50/60 dark:bg-slate-900/40 text-left transition-all group"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    Practice Quizzes
                  </span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('formulas');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 bg-slate-50/60 dark:bg-slate-900/40 text-left transition-all group"
                >
                  <BookOpen className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    Formula Library
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Topics List */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Mathematical Topics ({matchedTopics.length})</span>
            </div>
            {matchedTopics.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No matching topics found.</p>
            ) : (
              <div className="space-y-1.5">
                {matchedTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleSelectTopic(topic.category)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                        <FunctionSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span>{topic.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                            {topic.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-md">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Formulas List */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Formulas & Theorems ({matchedFormulas.length})
            </div>
            {matchedFormulas.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No matching formulas found.</p>
            ) : (
              <div className="space-y-1.5">
                {matchedFormulas.map((formula) => (
                  <button
                    key={formula.id}
                    onClick={() => handleSelectFormula(formula.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span>{formula.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                            {formula.category}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 py-0.5 truncate">
                          <MathView math={formula.latex} />
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>Navigation:</span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">↑</kbd>
              <kbd className="px-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">↵</kbd>
              to open
            </span>
          </div>
          <span>Diana Math Quick Palette</span>
        </div>
      </div>
    </div>
  );
};
