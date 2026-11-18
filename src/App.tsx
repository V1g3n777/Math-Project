import React, { useEffect, useState } from 'react';
import { NavSection } from './types';
import { useProgress } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProgressProvider } from './context/ProgressContext';
import { SettingsProvider } from './context/SettingsContext';

import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { SearchModal } from './components/common/SearchModal';

import { HomeDashboard } from './components/pages/HomeDashboard';
import { DesmosPage } from './components/pages/DesmosPage';
import { AlgebraPage } from './components/pages/AlgebraPage';
import { GeometryPage } from './components/pages/GeometryPage';
import { TrigonometryPage } from './components/pages/TrigonometryPage';
import { CalculusPage } from './components/pages/CalculusPage';
import { StatisticsPage } from './components/pages/StatisticsPage';
import { PracticePage } from './components/pages/PracticePage';
import { FormulaLibraryPage } from './components/pages/FormulaLibraryPage';
import { ProgressPage } from './components/pages/ProgressPage';
import { SettingsPage } from './components/pages/SettingsPage';

function AppContent() {
  const { recordTopicVisit } = useProgress();
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Cross-page payload state
  const [desmosExpression, setDesmosExpression] = useState<string | undefined>(undefined);
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | undefined>(undefined);

  const handleNavigate = (section: NavSection, payload?: any) => {
    if (section === 'desmos' && payload) {
      setDesmosExpression(typeof payload === 'string' ? payload : payload.expression);
    } else if (section === 'formulas' && payload?.formulaId) {
      setSelectedFormulaId(payload.formulaId);
    }
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDesmos = (expression?: string) => {
    setDesmosExpression(expression);
    setActiveSection('desmos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeSection !== 'home' && activeSection !== 'settings' && activeSection !== 'progress') {
      recordTopicVisit(activeSection);
    }
  }, [activeSection, recordTopicVisit]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Header with Language Switcher & Theme Toggle */}
        <Header
          activeSection={activeSection}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          onNavigate={handleNavigate}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-5 lg:px-8 pt-4 sm:pt-5 pb-0">
          {activeSection === 'home' && (
            <HomeDashboard
              onNavigate={handleNavigate}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          )}

          {activeSection === 'desmos' && (
            <DesmosPage initialExpression={desmosExpression} />
          )}

          {activeSection === 'algebra' && (
            <AlgebraPage onNavigateToDesmos={handleNavigateToDesmos} />
          )}

          {activeSection === 'geometry' && (
            <GeometryPage onNavigateToDesmos={handleNavigateToDesmos} />
          )}

          {activeSection === 'trigonometry' && (
            <TrigonometryPage onNavigateToDesmos={handleNavigateToDesmos} />
          )}

          {activeSection === 'calculus' && (
            <CalculusPage onNavigateToDesmos={handleNavigateToDesmos} />
          )}

          {activeSection === 'statistics' && (
            <StatisticsPage onNavigateToDesmos={handleNavigateToDesmos} />
          )}

          {activeSection === 'practice' && <PracticePage />}

          {activeSection === 'formulas' && (
            <FormulaLibraryPage
              onNavigateToDesmos={handleNavigateToDesmos}
              selectedFormulaId={selectedFormulaId}
            />
          )}

          {activeSection === 'progress' && (
            <ProgressPage onNavigate={handleNavigate} />
          )}

          {activeSection === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Command Palette / Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ProgressProvider>
          <SettingsProvider>
            <AppContent />
          </SettingsProvider>
        </ProgressProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
