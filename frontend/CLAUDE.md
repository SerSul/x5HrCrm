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
- Each page/component directory contains its own `.tsx` and `.module.scss` file
- Reusable components in `src/components/` (e.g., `Link`, `VacancyList`, `Header`)

**State Management Pattern**
- Zustand stores export `useXStore` hooks
- Actions are async functions within the store
- State updates use `set()` function

**Styling**
- **SCSS Modules:** All components use `.module.scss` files (not plain CSS)
- **Naming:** Use camelCase for SCSS class names (e.g., `.cardWrapper`, `.navSection`)
- **Variables:** Always use Gravity UI CSS variables: `var(--g-color-*)`
- **Breakpoints:** 640px (tablet), 768px (medium), 1024px (desktop), 1440px (large)
- **Spacing System:** 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem
- Global styles: `src/index.css` (Gravity UI theme variables)
- Theme configured in `main.tsx`: `<ThemeProvider theme="light">`

### Reusable Components

**Link Component** (`src/components/Link/Link.tsx`)
- Wrapper around react-router's `Link` with consistent styling
- **Variants:**
  - `inline` (default): Blue text links with underline on hover - for content/auth forms
  - `nav`: Navigation links with padding and background on hover - for headers
- **Props:** `to`, `variant`, `children`, `className` (optional), `external` (optional)
- **Usage:**
  ```tsx
  import Link from '../../components/Link/Link';

  // Inline link in text
  <Link to="/register" variant="inline">Register here</Link>

  // Navigation link
  <Link to="/dashboard" variant="nav">Dashboard</Link>

  // External link
  <Link to="https://docs.example.com" external>Documentation</Link>
  ```

### Layout Patterns

**Auth Forms** (LoginPage, RegisterPage, RecruiterRegisterPage)
- Centered card layout with 420px max-width
- Vertical centering using flexbox: `min-height: calc(100vh - 60px)`
- Form fields wrapped in `.field` divs with 1rem gap
- Full-width submit buttons
- Footer section with border separator for navigation links
- Responsive padding: 1.5rem (mobile) → 2rem (desktop)

**Page Structure:**
```tsx
<div className={styles.page}>           // Centered container
  <div className={styles.container}>    // Max-width wrapper
    <Card className={styles.card}>      // Gravity UI Card
      <h1 className={styles.title}>Title</h1>
      <form className={styles.form}>
        <div className={styles.field}>
          <TextInput />
        </div>
        <div className={styles.actions}>
          <Button className={styles.submitButton}>Submit</Button>
        </div>
      </form>
      <div className={styles.footer}>
        <Link to="/path" variant="inline">Link text</Link>
      </div>
    </Card>
  </div>
</div>
```

**Main Layout** (`src/layouts/WithToolbarLayout.tsx`)
- Max-width container: 1400px
- Responsive padding: 1.5rem → 2rem → 3rem
- Sticky header (60px height)
- All pages wrapped in container with proper spacing