export type Language = 'en' | 'ru' | 'hy';

export interface Translations {
  appName: string;
  creatorTag: string;
  creatorName: string;
  creatorRole: string;
  creatorBio: string;
  nav: {
    home: string;
    desmos: string;
    algebra: string;
    geometry: string;
    trigonometry: string;
    calculus: string;
    statistics: string;
    practice: string;
    formulas: string;
    progress: string;
    settings: string;
  };
  home: {
    welcomeBadge: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    launchDesmos: string;
    solveDaily: string;
    searchPlaceholder: string;
    pressShortcut: string;
    desmosShowcaseTitle: string;
    desmosShowcaseSubtitle: string;
    expandLab: string;
    popularTitle: string;
    popularSubtitle: string;
    viewAllTopics: string;
    recentlyVisitedTitle: string;
    savedSessions: string;
    formulaOfTheDay: string;
    dailyPracticeSprint: string;
    dailyPracticeText: string;
    startQuiz: string;
    progressLabel: string;
    streakDays: string;
    studiedLabel: string;
    noRecentVisits: string;
  };
  desmos: {
    title: string;
    subtitle: string;
    officialEmbedTab: string;
    nativeGrapherTab: string;
    presets: string;
    clear: string;
    reset: string;
    fullscreen: string;
    syntaxGuide: string;
  };
  practice: {
    badge: string;
    title: string;
    subtitle: string;
    subjectFilter: string;
    allSubjects: string;
    solvedCount: string;
    xpEarned: string;
    submit: string;
    next: string;
    showHint: string;
    hideHint: string;
    viewSolution: string;
    hideSolution: string;
    hintLabel: string;
    solutionLabel: string;
    savedLocally: string;
    allSolvedTitle: string;
    allSolvedText: string;
    reviewSolved: string;
    hideSolved: string;
  };
  common: {
    copyLatex: string;
    copied: string;
    plotInDesmos: string;
    resetDefaults: string;
    exploreModule: string;
    level: string;
    streak: string;
    easy: string;
    medium: string;
    hard: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'Diana Math',
    creatorTag: 'Creator & Student',
    creatorName: 'Vigen Avagyan',
    creatorRole: 'Junior Full-Stack Developer',
    creatorBio: 'This website was created for my Informatics class presentation.',
    nav: {
      home: 'Home',
      desmos: 'Desmos Calculator',
      algebra: 'Algebra',
      geometry: 'Geometry',
      trigonometry: 'Trigonometry',
      calculus: 'Calculus',
      statistics: 'Statistics',
      practice: 'Practice Problems',
      formulas: 'Formula Library',
      progress: 'My Progress',
      settings: 'Settings',
    },
    home: {
      welcomeBadge: 'Interactive Educational Platform & Graphing Lab',
      heroTitle: 'Master the Universe of',
      heroTitleHighlight: 'Mathematics Visually',
      heroSubtitle: 'A modern synthesis of rigorous mathematical curricula and powerful graphing tools. Explore quadratic curves, unit circle vectors, derivative slopes, and Desmos graphing.',
      launchDesmos: 'Launch Desmos Calculator',
      solveDaily: 'Start Daily Practice',
      searchPlaceholder: 'Search mathematical topics, formulas, tools, or theorems...',
      pressShortcut: 'Press ⌘K / Ctrl+K',
      desmosShowcaseTitle: 'Interactive Graphing Laboratory',
      desmosShowcaseSubtitle: 'Full-featured graphing engine with real-time function plots, sliders, and analytical tools.',
      expandLab: 'Open Full Screen Lab',
      popularTitle: 'Popular Mathematics Topics',
      popularSubtitle: 'Structured interactive visual modules for deep intuition',
      viewAllTopics: 'View All Curricula',
      recentlyVisitedTitle: 'Recently Visited & Continue Learning',
      savedSessions: 'Active learning trajectory',
      formulaOfTheDay: 'Formula of the Day',
      dailyPracticeSprint: 'Daily Problem Arena',
      dailyPracticeText: 'Sharpen your problem-solving skills across algebra, geometry, calculus, and probability.',
      startQuiz: 'Start Quiz Arena',
      progressLabel: 'Progress',
      streakDays: 'Day Streak',
      studiedLabel: 'studied',
      noRecentVisits: 'Open a lesson and it will show up here.',
    },
    desmos: {
      title: 'Advanced Graphing Laboratory',
      subtitle: 'Plot mathematical equations, create animated sliders, evaluate calculus derivatives, and visualize complex graphs.',
      officialEmbedTab: 'Official Desmos Calculator',
      nativeGrapherTab: 'Native Diana Grapher',
      presets: 'Interactive Presets',
      clear: 'Clear',
      reset: 'Reset Zoom',
      fullscreen: 'Full Screen',
      syntaxGuide: 'Desmos Keyboard & Formula Syntax Guide',
    },
    practice: {
      badge: 'Interactive Problem Arena',
      title: 'Practice Problems & Challenges',
      subtitle: 'Strengthen mathematical intuition with instant feedback, guided hints, and detailed LaTeX solutions.',
      subjectFilter: 'Subject:',
      allSubjects: 'All',
      solvedCount: 'Solved',
      xpEarned: 'XP Earned',
      submit: 'Submit Answer',
      next: 'Next Challenge',
      showHint: 'Show Hint',
      hideHint: 'Hide Hint',
      viewSolution: 'View Full Solution',
      hideSolution: 'Hide Solution',
      hintLabel: 'Hint:',
      solutionLabel: 'Step-by-Step Mathematical Walkthrough:',
      savedLocally: 'Solved quizzes stay saved in this browser',
      allSolvedTitle: 'You already solved these quizzes',
      allSolvedText: 'Finished quizzes are stored on this device, so they will not be repeated. Change the subject filter or review the ones you already completed.',
      reviewSolved: 'Review solved quizzes',
      hideSolved: 'Hide solved quizzes',
    },
    common: {
      copyLatex: 'Copy LaTeX',
      copied: 'Copied!',
      plotInDesmos: 'Plot in Desmos',
      resetDefaults: 'Reset',
      exploreModule: 'Explore Module',
      level: 'Level',
      streak: 'Streak',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
    },
  },
  ru: {
    appName: 'Diana Math',
    creatorTag: 'Создатель проекта',
    creatorName: 'Виген Авагян',
    creatorRole: 'Junior Full-Stack разработчик',
    creatorBio: 'Этот веб-сайт создан для презентации по информатике.',
    nav: {
      home: 'Главная',
      desmos: 'Калькулятор Desmos',
      algebra: 'Алгебра',
      geometry: 'Геометрия',
      trigonometry: 'Тригонометрия',
      calculus: 'Мат. анализ',
      statistics: 'Статистика',
      practice: 'Практические задачи',
      formulas: 'База формул',
      progress: 'Мой прогресс',
      settings: 'Настройки',
    },
    home: {
      welcomeBadge: 'Интерактивная образовательная платформа и лаборатория графиков',
      heroTitle: 'Исследуйте мир математики с',
      heroTitleHighlight: 'наглядной интуицией',
      heroSubtitle: 'Синтез учебных программ и мощного графического калькулятора. Исследуйте параболы, тригонометрическую окружность, производные и графики Desmos.',
      launchDesmos: 'Открыть калькулятор Desmos',
      solveDaily: 'Решать задачи дня',
      searchPlaceholder: 'Поиск тем, формул, теорем или инструментов...',
      pressShortcut: 'Нажмите ⌘K / Ctrl+K',
      desmosShowcaseTitle: 'Интерактивная лаборатория графиков',
      desmosShowcaseSubtitle: 'Графический движок с поддержкой функций, ползунков и аналитических инструментов.',
      expandLab: 'Развернуть лабораторию',
      popularTitle: 'Популярные математические разделы',
      popularSubtitle: 'Интерактивные визуальные модули для глубокого понимания',
      viewAllTopics: 'Все разделы',
      recentlyVisitedTitle: 'Недавние темы и продолжение обучения',
      savedSessions: 'История обучения',
      formulaOfTheDay: 'Формула дня',
      dailyPracticeSprint: 'Математический спринт',
      dailyPracticeText: 'Развивайте математическое мышление с помощью интерактивных тестов с подсказками.',
      startQuiz: 'Начать тест',
      progressLabel: 'Прогресс',
      streakDays: 'дней подряд',
      studiedLabel: 'занятий',
      noRecentVisits: 'Откройте урок, и он появится здесь.',
    },
    desmos: {
      title: 'Лаборатория графиков',
      subtitle: 'Стройте математические функции, используйте анимированные ползунки, находите производные и стройте графики.',
      officialEmbedTab: 'Официальный калькулятор Desmos',
      nativeGrapherTab: 'Встроенный графер Diana',
      presets: 'Готовые шаблоны',
      clear: 'Очистить',
      reset: 'Сбросить масштаб',
      fullscreen: 'Во весь экран',
      syntaxGuide: 'Справочник синтаксиса формул Desmos',
    },
    practice: {
      badge: 'Арена практических задач',
      title: 'Практика и тесты',
      subtitle: 'Закрепляйте знания с мгновенной проверкой, подсказками и пошаговыми решениями в LaTeX.',
      subjectFilter: 'Предмет:',
      allSubjects: 'Все',
      solvedCount: 'Решено',
      xpEarned: 'XP получено',
      submit: 'Ответить',
      next: 'Следующий вопрос',
      showHint: 'Показать подсказку',
      hideHint: 'Скрыть подсказку',
      viewSolution: 'Показать полное решение',
      hideSolution: 'Скрыть решение',
      hintLabel: 'Подсказка:',
      solutionLabel: 'Пошаговый математический разбор:',
      savedLocally: 'Решённые тесты сохраняются в этом браузере',
      allSolvedTitle: 'Эти тесты уже решены',
      allSolvedText: 'Пройденные тесты хранятся на этом устройстве и больше не повторяются. Смените предмет или откройте уже решённые.',
      reviewSolved: 'Показать решённые',
      hideSolved: 'Скрыть решённые',
    },
    common: {
      copyLatex: 'Копировать LaTeX',
      copied: 'Скопировано!',
      plotInDesmos: 'Построить в Desmos',
      resetDefaults: 'Сброс',
      exploreModule: 'Открыть модуль',
      level: 'Уровень',
      streak: 'Серия',
      easy: 'Легкий',
      medium: 'Средний',
      hard: 'Сложный',
    },
  },
  hy: {
    appName: 'Diana Math',
    creatorTag: 'Նախագծի հեղինակ',
    creatorName: 'Վիգեն Ավագյան',
    creatorRole: 'Junior Full-Stack ծրագրավորող',
    creatorBio: 'Այս կայքը ստեղծվել է իմ Ինֆորմատիկայի դասի շնորհանդեսի (պրեզենտացիայի) համար:',
    nav: {
      home: 'Գլխավոր',
      desmos: 'Desmos Հաշվիչ',
      algebra: 'Ալգեբրա',
      geometry: 'Երկրաչափություն',
      trigonometry: 'Եռանկյունաչափություն',
      calculus: 'Մաթ. Անալիզ',
      statistics: 'Վիճակագրություն',
      practice: 'Գործնական Խնդիրներ',
      formulas: 'Բանաձևերի Գրադարան',
      progress: 'Իմ Առաջընթացը',
      settings: 'Կարգավորումներ',
    },
    home: {
      welcomeBadge: 'Ինտերակտիվ մաթեմատիկական հարթակ',
      heroTitle: 'Բացահայտեք մաթեմատիկան',
      heroTitleHighlight: 'վիզուալ ինտուիցիայով',
      heroSubtitle: 'Մաթեմատիկական դասընթացների և հզոր գրաֆիկական գործիքների համադրություն: Ուսումնասիրեք քառակուսային ֆունկցիաներ, եռանկյունաչափական շրջան և Desmos գրաֆիկներ:',
      launchDesmos: 'Բացել Desmos Հաշվիչը',
      solveDaily: 'Լուծել Օրվա Խնդիրը',
      searchPlaceholder: 'Փնտրել թեմաներ, բանաձևեր, թեորեմներ...',
      pressShortcut: 'Սեղմեք ⌘K / Ctrl+K',
      desmosShowcaseTitle: 'Գրաֆիկական Լաբորատորիա',
      desmosShowcaseSubtitle: 'Ֆունկցիաների, սահիչների և վերլուծական գործիքների հզոր գրաֆիկական համակարգ:',
      expandLab: 'Բացել ամբողջ էկրանով',
      popularTitle: 'Հանրաճանաչ Մաթեմատիկական Թեմաներ',
      popularSubtitle: 'Ինտերակտիվ վիզուալ դասեր խորը ըմբռնման համար',
      viewAllTopics: 'Դիտել Բոլոր Դասերը',
      recentlyVisitedTitle: 'Վերջերս Դիտված Թեմաներ',
      savedSessions: 'Ուսումնական պատմություն',
      formulaOfTheDay: 'Օրվա Բանաձևը',
      dailyPracticeSprint: 'Ամենօրյա Մարտահրավեր',
      dailyPracticeText: 'Զարգացրեք ձեր տրամաբանությունը ինտերակտիվ խնդիրների և հուշումների միջոցով:',
      startQuiz: 'Սկսել Թեստը',
      progressLabel: 'Առաջընթաց',
      streakDays: 'օր անընդմեջ',
      studiedLabel: 'ուսուցում',
      noRecentVisits: 'Բացեք դաս, և այն կհայտնվի այստեղ:',
    },
    desmos: {
      title: 'Գրաֆիկական Լաբորատորիա',
      subtitle: 'Կառուցեք մաթեմատիկական հավասարումներ, կառավարեք սահիչները, հաշվեք ածանցյալներ և ուսումնասիրեք գրաֆիկներ:',
      officialEmbedTab: 'Պաշտոնական Desmos Հաշվիչ',
      nativeGrapherTab: 'Diana ներկառուցված գրաֆեր',
      presets: 'Պատրաստի Նմուշներ',
      clear: 'Մաքրել',
      reset: 'Վերականգնել Մասշտաբը',
      fullscreen: 'Ամբողջ Էկրանով',
      syntaxGuide: 'Desmos Ստեղնաշարի և Բանաձևերի Ուղեցույց',
    },
    practice: {
      badge: 'Գործնական Խնդիրների Տարածք',
      title: 'Խնդիրներ և Թեստեր',
      subtitle: 'Ամրապնդեք ձեր գիտելիքները ակնթարթային ստուգմամբ, հուշումներով և քայլ առ քայլ լուծումներով:',
      subjectFilter: 'Առարկա՝',
      allSubjects: 'Բոլորը',
      solvedCount: 'Լուծված',
      xpEarned: 'XP վաստակած',
      submit: 'Հաստատել Պատասխանը',
      next: 'Հաջորդ Խնդիրը',
      showHint: 'Ցույց տալ հուշումը',
      hideHint: 'Թաքցնել հուշումը',
      viewSolution: 'Դիտել ամբողջական լուծումը',
      hideSolution: 'Թաքցնել լուծումը',
      hintLabel: 'Հուշում՝',
      solutionLabel: 'Քայլ առ քայլ մաթեմատիկական լուծում՝',
      savedLocally: 'Լուծված թեստերը պահվում են այս դիտարկիչում',
      allSolvedTitle: 'Այս թեստերն արդեն լուծված են',
      allSolvedText: 'Ավարտված թեստերը պահվում են այս սարքում և այլևս չեն կրկնվում: Փոխեք առարկան կամ վերանայեք լուծվածները:',
      reviewSolved: 'Դիտել լուծվածները',
      hideSolved: 'Թաքցնել լուծվածները',
    },
    common: {
      copyLatex: 'Պատճենել LaTeX',
      copied: 'Պատճենված է!',
      plotInDesmos: 'Գծել Desmos-ում',
      resetDefaults: 'Վերականգնել',
      exploreModule: 'Բացել Դասը',
      level: 'Մակարդակ',
      streak: 'Շարք',
      easy: 'Հեշտ',
      medium: 'Միջին',
      hard: 'Բարդ',
    },
  },
};
