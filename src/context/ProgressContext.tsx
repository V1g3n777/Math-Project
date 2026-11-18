import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserProgressData } from '../types';
import {
  computeStreak,
  emptyProgress,
  levelFromXp,
  localDateKey,
  normalizeProgress,
  XP_PER_PROBLEM,
} from '../utils/progress';

interface ProgressContextType {
  progress: UserProgressData;
  completeProblem: (problemId: string, earnedXp?: number) => void;
  recordTopicVisit: (topicId: string) => void;
  toggleBookmark: (formulaId: string) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'axiom_progress';

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function withToday(prev: UserProgressData, today = localDateKey()): UserProgressData {
  const activeDates = prev.activeDates.includes(today) ? prev.activeDates : [...prev.activeDates, today];
  return {
    ...prev,
    activeDates,
    lastActiveDate: today,
    streak: computeStreak(activeDates, today),
  };
}

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgressData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyProgress();
    try {
      return normalizeProgress(JSON.parse(saved));
    } catch (error) {
      console.error('Error parsing progress', error);
      return emptyProgress();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    let lastTick = Date.now();

    const addVisibleTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTick) / 1000);
      lastTick = now;
      if (document.visibilityState !== 'visible' || elapsed <= 0) return;

      const capped = Math.min(elapsed, 30);
      setProgress((prev) => ({
        ...withToday(prev),
        studiedSeconds: prev.studiedSeconds + capped,
      }));
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastTick = Date.now();
        setProgress((prev) => withToday(prev));
      }
    };

    const intervalId = window.setInterval(addVisibleTime, 10000);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const completeProblem = useCallback((problemId: string, earnedXp = XP_PER_PROBLEM) => {
    setProgress((prev) => {
      const base = withToday(prev);
      if (base.completedProblems.includes(problemId)) return base;
      const xp = base.xp + earnedXp;
      return {
        ...base,
        completedProblems: [...base.completedProblems, problemId],
        xp,
        level: levelFromXp(xp),
      };
    });
  }, []);

  const recordTopicVisit = useCallback((topicId: string) => {
    setProgress((prev) => {
      const base = withToday(prev);
      const visitedTopics = base.visitedTopics.includes(topicId)
        ? base.visitedTopics
        : [...base.visitedTopics, topicId];
      const isLesson = topicId.includes('-');
      if (!isLesson) {
        return { ...base, visitedTopics };
      }
      const filtered = base.recentlyVisited.filter((item) => item.topicId !== topicId);
      return {
        ...base,
        visitedTopics,
        recentlyVisited: [{ topicId, visitedAt: new Date().toISOString() }, ...filtered].slice(0, 5),
      };
    });
  }, []);

  const toggleBookmark = useCallback((formulaId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarks.includes(formulaId);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter((id) => id !== formulaId)
          : [...prev.bookmarks, formulaId],
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(emptyProgress());
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeProblem,
        recordTopicVisit,
        toggleBookmark,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
