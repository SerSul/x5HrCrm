# CLAUDE.md - X5 Bootcamp Frontend Monorepo

This file provides guidance to Claude Code when working with the X5 Bootcamp frontend monorepo.

## Monorepo Overview

This is a **Bun workspace monorepo** with separate applications for candidates and recruiters, plus a shared UI components package.

```
frontend/
├── packages/
│   └── ui-components/      # Shared UI components
├── apps/
│   ├── candidate-web/      # Candidate application
│   └── recruiter-web/      # Recruiter application
├── mocks/                  # Shared MSW mocks
└── MONOREPO.md            # Detailed monorepo documentation
```

**Read MONOREPO.md** for comprehensive documentation about structure, architecture decisions, and workflows.

## Workspace Structure

### Shared Package
- **ui-components** (`packages/ui-components/`)
  - Shared UI components used by both apps
  - Import via `@shared/ui/*` alias
  - Contains: Header, Link, VacancyList, ApplicationStatusBadge, ApplicationTimeline, WithToolbarLayout

### Applications
- **candidate-web** (`apps/candidate-web/`)
  - Candidate-facing application
  - Routes: /candidate, /login, /register
  - See `apps/candidate-web/CLAUDE.md` for details

- **recruiter-web** (`apps/recruiter-web/`)
  - Recruiter-facing application
  - Routes: /recruiter, /login, /register/recruiter
  - See `apps/recruiter-web/CLAUDE.md` for details

### Shared Mocks
- **mocks/** (at root)
  - MSW handlers for both applications
  - Shared by both apps via relative import: `../../../mocks/worker.ts`

## Development Commands

### Monorepo Root
```bash
# Install all dependencies and link workspaces
bun install

# No build/dev commands at root - work within each app
```

### Individual Apps
```bash
# Candidate app
cd apps/candidate-web
bun dev              # Start dev server (port 5173)
bun run build        # Build for production
bun run lint         # Run ESLint
bun run e2e          # Run Playwright tests

# Recruiter app
cd apps/recruiter-web
bun dev              # Start dev server (port 5174)
bun run build        # Build for production
bun run lint         # Run ESLint
bun run e2e          # Run Playwright tests
```

## Architecture Principles

### What's Shared
✅ **UI Components** - Truly role-agnostic components in `packages/ui-components/`
- Imported via `@shared/ui/*` alias
- Single source of truth for common UI patterns
- Ensures design consistency

### What's NOT Shared (Duplicated in Each App)
❌ **API Layer** - Each app has its own `src/api/` directory
❌ **State Management** - Each app has its own `src/storage/` directory
❌ **Pages & Routes** - App-specific pages in each app
❌ **App-Specific Components** - Components with role-specific behavior

**Why?** This allows independent customization, different API logic per role, and independent deployment.

## Path Aliases

Both apps use TypeScript path aliases configured in their `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/ui/*": ["../../packages/ui-components/src/*"]
    }
  }
}
```

## Import Patterns

### Importing Shared Components
```tsx
// In candidate-web or recruiter-web
import { Header } from '@shared/ui/components/Header/Header';
import WithToolbarLayout from '@shared/ui/layouts/WithToolbarLayout';
```

### Importing App-Specific Code
```tsx
// Use relative imports within the same app
import { useAuthStore } from '../../storage/authStorage';
import { fetchVacanciesRequest } from '../../api/vacancyApi';
```

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

## Working with the Monorepo

### Adding New Shared Components
1. Create component in `packages/ui-components/src/components/`
2. Add SCSS module if needed
3. Export from `packages/ui-components/src/index.ts`
4. Both apps can now import via `@shared/ui/*`

### Adding App-Specific Features
1. Navigate to the specific app directory
2. Add pages/components/api/storage as needed
3. Update app's `routes.tsx` if adding routes
4. No changes needed in other app

### Installing Dependencies
```bash
# At root (links workspaces)
bun install

# For app-specific dependencies
cd apps/candidate-web   # or recruiter-web
bun add <package-name>
```

## File Organization

### Candidate App Structure
```
apps/candidate-web/src/
├── api/           # Candidate API layer
├── storage/       # Candidate state management
├── pages/         # Candidate pages (HomePage, RegisterPage, etc.)
├── components/    # Candidate-specific components
├── routes.tsx     # Candidate routes only
└── main.tsx
```

### Recruiter App Structure
```
apps/recruiter-web/src/
├── api/           # Recruiter API layer (includes candidateApi.ts)
├── storage/       # Recruiter state management (includes candidateStorage.ts)
├── pages/         # Recruiter pages (RecruiterHomePage, CandidateDetailPage, etc.)
├── components/    # Recruiter-specific components (CandidateList, etc.)
├── routes.tsx     # Recruiter routes only
└── main.tsx
```

### Shared Package Structure
```
packages/ui-components/src/
├── components/    # Shared components
│   ├── Header/
│   ├── Link/
│   ├── VacancyList/
│   ├── ApplicationStatusBadge/
│   └── ApplicationTimeline/
├── layouts/       # Layout components
│   └── WithToolbarLayout/
└── index.ts       # Package exports
```

## Key Differences Between Apps

### Candidate App
- Routes: `/candidate/*`, `/login`, `/register`
- Focus: Browse vacancies, apply, track applications
- Pages: HomePage, VacancyDetailPage, MyApplicationsPage, ProfilePage
- Users: Candidates with `role === 'candidate'`

### Recruiter App
- Routes: `/recruiter/*`, `/login`, `/register/recruiter`
- Focus: View candidates, manage applications, hiring pipeline
- Pages: RecruiterHomePage, CandidateDetailPage, VacancyApplicationsPage
- Users: Recruiters with `role === 'recruiter'`

## Mock Service Worker (MSW)

- Shared handlers in `/mocks/` directory
- Both apps use the same mocks via relative import
- Active only in development mode (`import.meta.env.DEV`)
- Service worker file in each app: `public/mockServiceWorker.js`

## Common Tasks

### Run Both Apps Simultaneously
```bash
# Terminal 1
cd apps/candidate-web && bun dev

# Terminal 2
cd apps/recruiter-web && bun dev
```

### Build Both Apps
```bash
cd apps/candidate-web && bun run build
cd apps/recruiter-web && bun run build
```

### Update Shared Components
```bash
# Edit files in packages/ui-components/
# Changes automatically available to both apps (no rebuild needed in dev)
```

## Troubleshooting

### Workspace Not Linked
```bash
# At root
bun install
```

### Import Errors for @shared/ui/*
- Check `tsconfig.app.json` has path alias configured
- Ensure `bun install` was run at root
- Verify importing from correct path

### Changes Not Reflecting
- Check you're in the correct app directory
- For shared components: changes should reflect immediately in dev mode
- For app-specific: check you edited the right app

## Best Practices

1. **Shared Components**: Only share truly role-agnostic UI components
2. **API/State Independence**: Keep API and state separate per app for flexibility
3. **Import Aliases**: Use `@shared/ui/*` for shared components, relative paths within apps
4. **Documentation**: Update CLAUDE.md files when adding major features
5. **Testing**: Test both apps after changing shared components
6. **Commit Organization**: Group changes by app or shared package

## Further Reading

- **MONOREPO.md** - Comprehensive monorepo documentation
- **apps/candidate-web/CLAUDE.md** - Candidate app specifics
- **apps/recruiter-web/CLAUDE.md** - Recruiter app specifics
- **packages/ui-components/README.md** - Shared components documentation
