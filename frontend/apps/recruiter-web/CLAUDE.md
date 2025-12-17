# CLAUDE.md - Recruiter Web App

This file provides guidance to Claude Code when working with the recruiter web application.

## App Overview

This is the **recruiter application** in the X5 Bootcamp monorepo. It's a separate app from the candidate app, focused on recruiter workflows:
- Viewing and managing candidates
- Reviewing applications for job vacancies
- Managing the hiring pipeline

## Monorepo Context

This app is part of a Bun workspace monorepo:
- **Location**: `/apps/recruiter-web/`
- **Shared UI Components**: `/packages/ui-components/` (imported via `@shared/ui/*`)
- **Sibling App**: `/apps/candidate-web/` (completely separate)
- **Shared Mocks**: `/mocks/` (MSW handlers for development)

**Important**: API and state management code is **NOT shared**. Each app has its own copy for independent customization.

## Development Commands

```bash
# Development server (run from this directory)
bun dev              # Start Vite dev server (port 5174 typically)

# Build and preview
bun run build        # TypeScript check + Vite build
bun run preview      # Preview production build

# Linting
bun run lint         # Run ESLint

# E2E Testing (Playwright)
bun run e2e          # Run all e2e tests
bun run e2e:install  # Install Playwright browsers
bunx playwright test --ui              # Interactive UI mode
bunx playwright test --project=chromium # Run on specific browser
bunx playwright test example           # Run specific test file
bunx playwright test --debug           # Debug mode
bunx playwright codegen                # Generate tests with Codegen
```

## Tech Stack

- **Build Tool**: Vite 7.2.4 with React Compiler plugin
- **Framework**: React 19.2 with React Router 7.10
- **UI Library**: Gravity UI (@gravity-ui/uikit)
- **State Management**: Zustand for global state
- **HTTP Client**: Axios
- **Styling**: SCSS Modules with sass-embedded
- **Testing**: Playwright for e2e
- **Mocking**: MSW (Mock Service Worker) - active in development only

## Project Structure

```
src/
├── api/                    # API integration layer
│   ├── baseApi.ts          # Axios instance (baseURL: http://localhost:3000)
│   ├── applicationApi.ts   # Application endpoints
│   ├── candidateApi.ts     # Candidate endpoints (recruiter-specific)
│   ├── loginApi.ts         # Login endpoint
│   ├── registerApi.ts      # Register endpoints
│   └── vacancyApi.ts       # Vacancy endpoints
│
├── storage/                # Zustand state stores
│   ├── authStorage.ts      # User auth & profile state
│   ├── applicationStorage.ts  # Applications state
│   ├── candidateStorage.ts    # Candidates state (recruiter-specific)
│   └── vacancyStorage.ts      # Vacancies state
│
├── pages/                  # Page components (feature-based)
│   ├── RecruiterHomePage/      # Candidate list view
│   ├── RecruiterRegisterPage/  # Recruiter registration
│   ├── CandidateDetailPage/    # Candidate profile view
│   ├── VacancyApplicationsPage/  # Applications for vacancy
│   ├── VacancyDetailPage/      # Vacancy details
│   └── LoginPage/              # Login form
│
├── components/             # Reusable UI components
│   ├── CandidateList/         # Candidate table
│   ├── ApplicationCard/       # Application card with recruiter actions
│   └── ApplicationSidebar/    # Application details panel
│
├── routes.tsx              # Route definitions (recruiter routes only)
├── main.tsx                # Entry point
└── index.css               # Global styles
```

## Routes

All routes are scoped to recruiters:

```
/
├── /login (public)
├── /register/recruiter (public)
└── /recruiter (protected - requires recruiter role)
    ├── / (RecruiterHomePage - candidate list)
    ├── /candidates/:id (CandidateDetailPage)
    ├── /vacancies/:id (VacancyDetailPage)
    └── /vacancies/:id/applications (VacancyApplicationsPage)
```

**Route Protection**:
- `recruiterProtectedLoader` checks for authenticated user with `role === 'recruiter'`
- Redirects to `/login` if not authenticated
- Root route (`/`) redirects to `/recruiter` for authenticated recruiters

## Import Patterns

### Shared UI Components (from packages/ui-components)
```tsx
// Use @shared/ui/* alias
import { Header } from '@shared/ui/components/Header/Header';
import { Link } from '@shared/ui/components/Link/Link';
import WithToolbarLayout from '@shared/ui/layouts/WithToolbarLayout';
```

### App-Specific Code (within this app)
```tsx
// Use relative imports
import { useAuthStore } from '../../storage/authStorage';
import { fetchCandidatesRequest } from '../../api/candidateApi';
import CandidateList from '../../components/CandidateList/CandidateList';
```

## Shared Components Available

From `@shared/ui/*`:
- **Header** - Navigation bar (shows recruiter-specific links)
- **Link** - Link wrapper with variants (inline, nav)
- **VacancyList** - Vacancy cards with filtering
- **ApplicationStatusBadge** - Status indicator (pending, reviewed, accepted, rejected)
- **ApplicationTimeline** - Application stage progression timeline
- **WithToolbarLayout** - Main layout wrapper (header + content)

## State Management

### Auth Store (`storage/authStorage.ts`)
```tsx
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'recruiter' | 'candidate';
}

// Usage
const { user, token, login, logout } = useAuthStore();
```

### Candidate Store (`storage/candidateStorage.ts`) - Recruiter-specific
```tsx
// Usage
const { candidates, loading, fetchCandidates, fetchCandidateById } = useCandidateStore();
```

### Application Store (`storage/applicationStorage.ts`)
```tsx
// Recruiter-specific actions
const {
  fetchVacancyApplications,      // Get applications for a vacancy
  updateApplicationStatus,       // Change status (pending → reviewed → accepted/rejected)
  updateApplicationStage         // Move through hiring pipeline stages
} = useApplicationStore();
```

## API Patterns

All API files use Axios instance from `baseApi.ts`:
```tsx
import api from './baseApi';

export const fetchCandidatesRequest = async () => {
  return await api.get('/candidates');
};
```

**Base URL**: `http://localhost:3000`

**Response Format** (auth endpoints):
```json
{
  "user": { "id": "...", "name": "...", "role": "recruiter" },
  "token": "..."
}
```

## Styling

- **SCSS Modules**: All components use `.module.scss` files
- **Naming**: Use camelCase for SCSS class names (e.g., `.cardWrapper`, `.navSection`)
- **Variables**: Always use Gravity UI CSS variables: `var(--g-color-*)`
- **Breakpoints**: 640px (tablet), 768px (medium), 1024px (desktop), 1440px (large)
- **Spacing System**: 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem
- **Theme**: Configured in `main.tsx` with `<ThemeProvider theme="light">`

## Mock Service Worker (MSW)

- Mocks are shared from `/mocks/` at monorepo root
- Active only in development: `import.meta.env.DEV`
- Handlers support both recruiter and candidate roles
- Service worker: `public/mockServiceWorker.js` (auto-generated)

## Key Conventions

### Environment Detection
```tsx
// Use Vite's import.meta.env
if (import.meta.env.DEV) {
  // development only
}
```

### Component Organization
- Pages: Feature-based folders with component + styles
- Each page/component directory contains `.tsx` and `.module.scss` files
- Reusable components in `src/components/`

### Recruiter-Specific Features

**Candidate Management**:
- View all candidates in table format (CandidateList)
- View candidate profiles with experience, skills (CandidateDetailPage)
- Contact information displayed

**Application Management**:
- View all applications for a vacancy (VacancyApplicationsPage)
- Update application status with actions (Accept, Reject, Mark as Reviewed)
- Track candidate progress through hiring pipeline
- View application timeline and stage history

**Application Statuses**:
- `pending` - New application
- `reviewed` - Reviewed by recruiter
- `accepted` - Offer accepted
- `rejected` - Application rejected

**Application Stages**:
- `applied` - Initial application
- `screening` - Screening phase
- `phone` - Phone interview
- `technical` - Technical interview
- `final` - Final interview
- `offer` - Offer extended
- `hired` - Hired
- `rejected` - Rejected at any stage

## Important Notes

- **Role-Specific**: This app is ONLY for recruiters. All routes require `role === 'recruiter'`
- **Independent from Candidate App**: Changes here don't affect `/apps/candidate-web/`
- **API/State Not Shared**: Each app has its own copy for customization
- **MSW Required**: Development relies on mocked API responses
- **React Compiler Enabled**: Uses babel-plugin-react-compiler for optimization

## Adding New Features

1. **New Page**: Create in `src/pages/`, add to `routes.tsx`
2. **New Component**: Create in `src/components/`
3. **New API Endpoint**: Add to appropriate file in `src/api/`
4. **New State**: Add to appropriate Zustand store in `src/storage/`
5. **New Shared Component**: Add to `/packages/ui-components/` (affects both apps)

## Troubleshooting

### Import Errors
- Run `bun install` at monorepo root to link workspaces
- Check path alias in `tsconfig.app.json`
- Verify `@shared/ui/*` imports are correct

### MSW Not Working
- Check `public/mockServiceWorker.js` exists
- Verify `main.tsx` imports and starts MSW
- Ensure running in dev mode

### TypeScript Errors
- Run `bun install` at root
- Check all dependencies in `package.json`
- Verify tsconfig configuration
