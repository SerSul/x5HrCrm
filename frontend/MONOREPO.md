# X5 Bootcamp Frontend Monorepo

This is a Bun workspace monorepo containing separate apps for candidates and recruiters, with shared UI components.

## Structure

```
frontend/
├── packages/
│   └── ui-components/              # Shared UI components package
│       ├── src/
│       │   ├── components/         # Shared components
│       │   │   ├── Header/         # Navigation (role-aware)
│       │   │   ├── Link/           # Link wrapper (inline/nav variants)
│       │   │   ├── VacancyList/    # Vacancy cards with filtering
│       │   │   ├── ApplicationStatusBadge/  # Status indicator
│       │   │   └── ApplicationTimeline/     # Stage progression
│       │   ├── layouts/
│       │   │   └── WithToolbarLayout/  # Main layout wrapper
│       │   └── index.ts            # Package exports
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── candidate-web/              # Candidate application
│   │   ├── src/
│   │   │   ├── api/               # API layer (independent copy)
│   │   │   ├── storage/           # Zustand stores (independent copy)
│   │   │   ├── pages/             # Candidate-specific pages
│   │   │   │   ├── HomePage/
│   │   │   │   ├── LoginPage/
│   │   │   │   ├── RegisterPage/
│   │   │   │   ├── ProfilePage/
│   │   │   │   ├── VacancyDetailPage/
│   │   │   │   └── MyApplicationsPage/
│   │   │   ├── components/        # Candidate-specific components
│   │   │   │   ├── ApplicationCard/
│   │   │   │   └── ApplicationSidebar/
│   │   │   ├── routes.tsx         # Candidate routes only
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── recruiter-web/              # Recruiter application
│       ├── src/
│       │   ├── api/               # API layer (independent copy)
│       │   ├── storage/           # Zustand stores (independent copy)
│       │   ├── pages/             # Recruiter-specific pages
│       │   │   ├── RecruiterHomePage/
│       │   │   ├── RecruiterRegisterPage/
│       │   │   ├── CandidateDetailPage/
│       │   │   ├── VacancyApplicationsPage/
│       │   │   ├── VacancyDetailPage/
│       │   │   └── LoginPage/
│       │   ├── components/        # Recruiter-specific components
│       │   │   ├── CandidateList/
│       │   │   ├── ApplicationCard/  # With recruiter actions
│       │   │   └── ApplicationSidebar/
│       │   ├── routes.tsx         # Recruiter routes only
│       │   ├── main.tsx
│       │   └── index.css
│       ├── package.json
│       └── vite.config.ts
│
├── mocks/                          # Shared MSW mocks
│   ├── handlers.ts                 # Request handlers for both apps
│   └── worker.ts                   # Browser worker setup
│
├── package.json                    # Root workspace config
└── bun.lock
```

## Workspace Configuration

### Root package.json
```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

## Shared vs App-Specific Code

### Shared (in packages/ui-components)
- **Components**: Header, Link, VacancyList, ApplicationStatusBadge, ApplicationTimeline
- **Layouts**: WithToolbarLayout
- **Usage**: Import via `@shared/ui/*` alias

### App-Specific (duplicated in both apps)
- **API Layer**: Each app has its own copy for independent customization
  - baseApi.ts, loginApi.ts, registerApi.ts, vacancyApi.ts, applicationApi.ts, candidateApi.ts
- **State Management**: Each app has its own Zustand stores
  - authStorage.ts, vacancyStorage.ts, applicationStorage.ts, candidateStorage.ts
- **Pages**: Role-specific pages in each app
- **Components**: Components with role-specific behavior (ApplicationCard, ApplicationSidebar)

## Path Aliases

Both apps use TypeScript path aliases configured in `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/ui/*": ["../../packages/ui-components/src/*"]
    }
  }
}
```

## Dependencies

### Shared Package Dependencies
- @gravity-ui/uikit ^7.28.0
- react ^19.2.0
- react-dom ^19.2.0
- react-router ^7.10.1
- axios ^1.13.2
- zustand ^5.0.9
- sass-embedded ^1.97.0

### App Dependencies
Both apps include all the above dependencies plus:
- @x5-bootcamp/ui-components (workspace:*)
- msw ^2.12.4 (dev)
- @playwright/test ^1.57.0 (dev)

## Routes

### Candidate-Web Routes
```
/
├── /login (public)
├── /register (public)
└── /candidate
    ├── / (HomePage - vacancy list)
    ├── /vacancies/:id (VacancyDetailPage)
    ├── /applications (MyApplicationsPage - protected)
    └── /profile (ProfilePage - protected)
```

### Recruiter-Web Routes
```
/
├── /login (public)
├── /register/recruiter (public)
└── /recruiter (protected)
    ├── / (RecruiterHomePage - candidate list)
    ├── /candidates/:id (CandidateDetailPage)
    ├── /vacancies/:id (VacancyDetailPage)
    └── /vacancies/:id/applications (VacancyApplicationsPage)
```

## Development

### Install Dependencies
```bash
# At root (links workspaces)
bun install
```

### Run Apps
```bash
# Candidate app (port 5173)
cd apps/candidate-web
bun dev

# Recruiter app (port 5174)
cd apps/recruiter-web
bun dev
```

### Build Apps
```bash
# Candidate app
cd apps/candidate-web
bun run build

# Recruiter app
cd apps/recruiter-web
bun run build
```

### Run Tests
```bash
# E2E tests (each app)
cd apps/candidate-web
bun run e2e

cd apps/recruiter-web
bun run e2e
```

## Mock Service Worker (MSW)

- Shared mocks located in `/mocks/` directory at root
- Both apps reference mocks with: `import('../../../mocks/worker.ts')`
- Active only in development mode (`import.meta.env.DEV`)
- Handlers support both candidate and recruiter roles
- Service worker file: `public/mockServiceWorker.js` (auto-generated, in both apps)

## Tech Stack

- **Package Manager**: Bun
- **Build Tool**: Vite 7.2.4
- **Framework**: React 19.2.0
- **Routing**: React Router 7.10.1
- **UI Library**: Gravity UI 7.28.0
- **State Management**: Zustand 5.0.9
- **HTTP Client**: Axios 1.13.2
- **Styling**: SCSS Modules with sass-embedded
- **TypeScript**: 5.9.3
- **Testing**: Playwright 1.57.0
- **Mocking**: MSW 2.12.4
- **Compiler**: React Compiler (babel-plugin-react-compiler)

## Architecture Decisions

### Why Duplicate API and State?
Each app has its own copy of API and state management code to allow:
- Independent customization without affecting the other app
- Different API endpoints or request logic per role
- Role-specific state management needs
- Independent deployment and versioning

### Why Share UI Components?
UI components are shared to:
- Ensure consistent design across both apps
- Reduce code duplication for truly shared components
- Single source of truth for common UI patterns
- Easier maintenance of shared components

### Component Categorization

**Shared Components** (in packages/ui-components):
- Components that are truly role-agnostic
- Components that render different content based on role but have the same structure
- Generic layout components

**App-Specific Components** (duplicated):
- Components with role-specific behavior or actions
- Components used by only one role
- Components that may diverge in functionality

## Import Patterns

### Importing from Shared Package
```tsx
// Good - using alias
import { Header } from '@shared/ui/components/Header/Header';
import WithToolbarLayout from '@shared/ui/layouts/WithToolbarLayout';

// Also works - direct import
import { Header } from '@x5-bootcamp/ui-components/components/Header/Header';
```

### Importing App-Specific Code
```tsx
// Use relative imports within the same app
import { useAuthStore } from '../../storage/authStorage';
import { fetchVacanciesRequest } from '../../api/vacancyApi';
```

## Adding New Shared Components

1. Create component in `packages/ui-components/src/components/`
2. Export from `packages/ui-components/src/index.ts`
3. Import in apps using `@shared/ui/*` alias
4. Both apps automatically get updates to shared components

## Adding New App-Specific Features

1. Add pages/components to the specific app's `src/` directory
2. Update app's `routes.tsx` if adding new routes
3. Add API/storage files as needed within the app
4. No changes needed in the other app

## Troubleshooting

### Import Errors
- Ensure `bun install` was run at root to link workspaces
- Check that path aliases are configured in `tsconfig.app.json`
- Verify imports use correct paths: `@shared/ui/*` for shared components

### MSW Not Working
- Check that `public/mockServiceWorker.js` exists in the app
- Verify mocks are imported in `main.tsx`
- Ensure you're running in development mode

### TypeScript Errors
- Run `bun install` at root to ensure workspace links are correct
- Check that all required dependencies are in app's `package.json`
- Verify tsconfig extends are correct

## Future Enhancements

Potential improvements to consider:
- Add shared types package if type definitions become complex
- Add shared utils package for common utilities
- Add shared API client package if API patterns become more complex
- Add shared hooks package for reusable React hooks
- Set up shared testing utilities
- Configure monorepo task runner (turborepo, nx) for build optimization
