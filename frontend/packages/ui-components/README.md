# @x5-bootcamp/ui-components

Shared UI components package for the X5 Bootcamp frontend monorepo.

## Components

- **Header** - Navigation bar with role-aware content
- **Link** - React Router Link wrapper with variants (inline, nav)
- **VacancyList** - Vacancy cards with filtering
- **ApplicationStatusBadge** - Application status indicator
- **ApplicationTimeline** - Application stage progression timeline

## Layouts

- **WithToolbarLayout** - Main layout wrapper with header and content area

## Usage

```tsx
import { Header, Link, WithToolbarLayout } from '@x5-bootcamp/ui-components';
// or
import { Header } from '@shared/ui/components/Header/Header';
```

## Development

This package is part of a Bun workspace monorepo. It's used by:
- `apps/candidate-web`
- `apps/recruiter-web`
