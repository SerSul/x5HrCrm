# CLAUDE.md - X5 Bootcamp Frontend Monorepo

This file provides guidance to Claude Code when working with the X5 Bootcamp frontend monorepo.

## API Structure

The application follows the OpenAPI specification defined in `openapi.json` at the project root.

### Candidate App API (`apps/candidate-web/src/api/`)
- **types/openapi.ts** - TypeScript interfaces matching OpenAPI spec
- **directionApi.ts** - Direction endpoints (list, apply, withdraw, fetch apply info)
- **testApi.ts** - Test flow endpoints (start, fetch questions, submit)
- **baseApi.ts** - Axios instance configuration

### State Management (`apps/candidate-web/src/storage/`)
- **directionStorage.ts** - Direction state (list, by ID)
- **applicationStorage.ts** - Application state (apply info by direction ID)
- **testStorage.ts** - Test state (current test, results)
- **authStorage.ts** - Authentication state

### Key Data Models
- **DirectionResponse** - Direction with `test_id`, `employment_type`, `salary_min/max`, `statuses[]`, `applied` flag
- **ApplyInfoResponse** - Application info with `current_status`, `status_history[]`, `test`, `close_reason`
- **DirectionStatusResponse** - Status with `sequence_order`, `is_mandatory` for dynamic progression
- **TestStartResponse** - Test with `attempt_id`, `test_id`, `questions[]`

All entity IDs are **numbers** (not strings).

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
  - Components:
    - **VacancyList** - Displays Direction cards with employment type, salary range, test badges
    - **ApplicationTimeline** - Dynamic status progression using `DirectionStatusResponse[]` with sequence_order
    - **ApplicationStatusBadge** - Smart theme detection based on status keywords (supports Russian/English)
    - **Header** - App header with navigation
    - **Link** - Styled link component
    - **WithToolbarLayout** - Layout with sidebar

### Applications
- **candidate-web** (`apps/candidate-web/`)
  - Candidate-facing application
  - Routes:
    - `/candidate` - Home page with directions list
    - `/candidate/directions/:id` - Direction detail page with apply form and test section
    - `/candidate/test/:attemptId` - Test taking page with questions
    - `/candidate/applications` - User's applications with timelines
    - `/candidate/profile` - User profile
    - `/login`, `/register` - Authentication
  - Pages:
    - **HomePage** - Lists directions, filter by applied
    - **DirectionDetailPage** - Direction info, resume URL input, application timeline, test section
    - **TestPage** - Test questions with RadioGroup, submit answers, results screen
    - **MyApplicationsPage** - Shows applied directions with status timelines
    - **ProfilePage** - User profile management

- **recruiter-web** (`apps/recruiter-web/`)
  - Recruiter-facing application
  - Routes: /recruiter, /login, /register/recruiter
  - See `apps/recruiter-web/CLAUDE.md` for details

### Shared Mocks
- **mocks/** (at root)
  - MSW handlers for both applications
  - Shared by both apps via relative import: `../../../mocks/worker.ts`
  - Implemented endpoints:
    - **Auth**: POST /auth/register, POST /auth/login, GET /auth/me, POST /auth/logout
    - **Directions**: GET /public/directions?only_applied={bool}
    - **Applications**: POST /directions/apply/:directionId, DELETE /directions/apply/:directionId, GET /apply-info/directions/:directionId
    - **Tests**: POST /test/start, GET /test/questions/:attemptId, POST /test/submit
    - **HR** (placeholders): POST /hr/applications/list, POST /hr/applications/status, POST /hr/applications/reject
  - Mock data includes 3 directions with dynamic statuses and test questions

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
├── api/
│   ├── types/openapi.ts    # OpenAPI TypeScript interfaces
│   ├── directionApi.ts     # Direction endpoints
│   ├── testApi.ts          # Test flow endpoints
│   └── baseApi.ts          # Axios configuration
├── storage/
│   ├── directionStorage.ts  # Direction state
│   ├── applicationStorage.ts # Application state (apply info)
│   ├── testStorage.ts       # Test state
│   └── authStorage.ts       # Auth state
├── pages/
│   ├── HomePage/            # Directions list with filter
│   ├── DirectionDetailPage/ # Direction info + apply form + test
│   ├── TestPage/            # Test questions + results
│   ├── MyApplicationsPage/  # User's applications + timelines
│   ├── ProfilePage/         # User profile
│   ├── LoginPage/           # Login form
│   └── RegisterPage/        # Registration form
├── components/              # Candidate-specific components
├── routes.tsx               # Route definitions
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
- Routes: `/candidate`, `/candidate/directions/:id`, `/candidate/test/:attemptId`, `/candidate/applications`, `/login`, `/register`
- Focus: Browse directions, apply with resume URL, take tests, track applications
- Key Features:
  - Direction browsing with filter (show only applied)
  - Apply to directions with resume URL input
  - Dynamic application timeline based on DirectionStatusResponse[]
  - Full test-taking flow with RadioGroup questions
  - Test results display with score
- Data: Works with DirectionResponse, ApplyInfoResponse, TestStartResponse
- Users: Candidates with `authorities: [{ authority: 'ROLE_CANDIDATE' }]`

### Recruiter App
- Routes: `/recruiter/*`, `/login`, `/register/recruiter`
- Focus: View candidates, manage applications, hiring pipeline
- Pages: RecruiterHomePage, CandidateDetailPage, VacancyApplicationsPage
- Users: Recruiters with `authorities: [{ authority: 'ROLE_RECRUITER' }]`
- Note: Recruiter app requires migration to OpenAPI (not yet completed)

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

## E2E Testing with Playwright

### Test Location
All Playwright e2e tests are in the shared `/frontend/e2e` folder:
```
e2e/
├── setup/               # Auth setup files
│   ├── candidate.setup.ts
│   └── recruiter.setup.ts
├── utils/              # Shared test helpers
│   └── helpers.ts
├── candidate/          # Candidate app tests (11 tests)
└── recruiter/          # Recruiter app tests (8 tests)
```

### Running Tests

**Candidate Tests**:
```bash
cd apps/candidate-web
bunx playwright install        # First time only
bun run e2e                   # Run all candidate tests
bunx playwright test --ui     # Interactive UI mode
bunx playwright test --debug  # Debug mode
bunx playwright test candidate/auth.spec.ts  # Run specific file
```

**Recruiter Tests**:
```bash
cd apps/recruiter-web
bun run e2e                   # Run all recruiter tests
bunx playwright test --ui     # Interactive mode
```

### Test Data & Backend

**Backend Requirements**:
- Backend must be running at `localhost:8081`
- Database must have seed data loaded

**Seed Data Location**: `../backend/src/main/resources/db/changelog/mock-data/`

**Test Users** (password: `password`):
- Candidate: `user@example.com` (John Doe User)
- HR/Recruiter: `hr@example.com` (Helen Hr Manager)
- Admin: `admin@example.com` (Admin User Root)

**Test Directions**:
1. Junior Java Developer (ID: 1) - 80K-150K
2. Middle Java Developer (ID: 2) - 150K-250K
3. DevOps Engineer (ID: 3) - 160K-260K
4. QA Automation Engineer (ID: 4) - 120K-200K

**Test**: Universal test with 4 questions, max score 40, passing score 25

### Writing New Tests

1. **Use existing helpers** from `e2e/utils/helpers.ts`:
   - `applyToDirection(page, directionId, resumeUrl, comment?)`
   - `answerAllQuestions(page)`
   - `waitForApiResponse(page, urlPattern)`

2. **Idempotent patterns** - tests check state before acting:
```typescript
const alreadyApplied = await page.getByText(/вы уже откликнулись/i).isVisible();
if (!alreadyApplied) {
  // Apply logic
}
```

3. **Place tests in correct folder**:
   - Candidate tests → `e2e/candidate/`
   - Recruiter tests → `e2e/recruiter/`

4. **Auth is automatic** - tests use stored auth state from setup files

### Database Information

**Location**: `../backend/src/main/resources/db/`
- `changelog/` - Liquibase migration files
- `changelog/mock-data/` - Seed data for testing

**Key Tables**:
- `users` - Test users with bcrypt passwords
- `directions` - Job vacancies
- `direction_statuses` - Application pipeline stages
- `tests`, `questions`, `answer_options` - Test questions
- `applications` - User applications to directions
- `test_attempts` - Test attempts and scores

All entity IDs are **numbers** (not strings).

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

### Playwright Tests Failing
- Ensure backend is running at `localhost:8081`
- Check database has seed data loaded
- Run setup first: `bunx playwright test --project=candidate-setup`
- Clear auth state: `rm -rf e2e/.auth/`
- Check Playwright config points to correct testDir: `../../e2e`

## Best Practices

1. **Shared Components**: Only share truly role-agnostic UI components
2. **API/State Independence**: Keep API and state separate per app for flexibility
3. **Import Aliases**: Use `@shared/ui/*` for shared components, relative paths within apps
4. **Documentation**: Update CLAUDE.md files when adding major features
5. **Testing**: Test both apps after changing shared components
6. **E2E Tests**: Write idempotent tests that handle existing data gracefully
7. **Commit Organization**: Group changes by app or shared package

## Further Reading

- **MONOREPO.md** - Comprehensive monorepo documentation
- **apps/candidate-web/CLAUDE.md** - Candidate app specifics
- **apps/recruiter-web/CLAUDE.md** - Recruiter app specifics
- **packages/ui-components/README.md** - Shared components documentation
