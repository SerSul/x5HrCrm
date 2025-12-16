# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server
bun dev              # Start Vite dev server

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

## Architecture Overview

### Tech Stack
- **Build Tool:** Vite with React Compiler plugin (`babel-plugin-react-compiler`)
- **Framework:** React 19.2 with React Router 7.10
- **UI Library:** Gravity UI (@gravity-ui/uikit)
- **State Management:** Zustand for global state
- **HTTP Client:** Axios
- **Testing:** Playwright (e2e tests in `/e2e` directory)
- **Mocking:** MSW (Mock Service Worker) - active in development only

### Project Structure

**API Layer** (`src/api/`)
- `baseApi.ts` exports configured Axios instance with `baseURL: http://localhost:3000`
- API modules (e.g., `registerApi.ts`) use this base instance
- Pattern: Export typed request functions that return Axios promises

**State Management** (`src/storage/`)
- Zustand stores (e.g., `authStorage.ts`)
- Stores typically include: state interfaces, async actions, and direct state access
- `authStorage.ts` manages user authentication state and token

**Routing** (`src/routes.tsx`)
- Single router configuration using `createBrowserRouter`
- Layout wrapper: `WithToolbarLayout` contains all routes
- Current routes: `/`, `/login`, `/register`

**Pages** (`src/pages/`)
- Component structure: `PageName/PageName.tsx`
- Pages interact with Zustand stores for state management
- Form submissions call store actions that handle API calls

**Mock Service Worker** (`mocks/`)
- `handlers.ts`: Define request handlers (e.g., POST /register)
- `worker.ts`: Browser worker setup with `setupWorker`
- Service worker script: `public/mockServiceWorker.js` (auto-generated, do not edit)
- Enabled in `main.tsx` via `enableMocking()` - runs only when `import.meta.env.DEV` is true
- MSW intercepts network requests at the Service Worker level in development

### Key Conventions

**Environment Detection**
- Use `import.meta.env.DEV` for development checks (Vite convention)
- Do NOT use `process.env.NODE_ENV`

**API Response Structure**
- Axios responses accessed via `res.data`
- Auth endpoints return: `{ user: { id, name }, token: string }`

**Component Organization**
- Pages: Feature-based folders with single component file
- Layouts: Shared wrappers for routes
- Each page/component directory contains its own `.tsx` and optionally `.css`

**State Management Pattern**
- Zustand stores export `useXStore` hooks
- Actions are async functions within the store
- State updates use `set()` function

**Styling**
- Gravity UI provides themed components
- Global styles: `src/index.css`
- Layout styles: `src/layouts/App.css`
- Theme configured in `main.tsx`: `<ThemeProvider theme="light">`
- remember project structure and to use gravity ui