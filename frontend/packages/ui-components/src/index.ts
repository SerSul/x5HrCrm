// UI Components Package
// This package contains shared UI components used by both candidate-web and recruiter-web apps

// Re-export components
export { default as Header } from './components/Header/Header';
export { default as Link } from './components/Link/Link';
export { default as VacancyList } from './components/VacancyList/VacancyList';
export { default as ApplicationStatusBadge } from './components/ApplicationStatusBadge/ApplicationStatusBadge';
export { default as ApplicationTimeline } from './components/ApplicationTimeline/ApplicationTimeline';

// Re-export layouts
export { default as WithToolbarLayout } from './layouts/WithToolbarLayout';

// Re-export types
export type { ApplicationStage, ApplicationStageHistory } from './types/application';
export type { Vacancy } from './types/vacancy';
