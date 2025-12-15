# Architecture Overview

This document provides an overview of the Expenser App architecture, design patterns, and technical decisions.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Styling Approach](#styling-approach)
- [Build & Deploy](#build--deploy)

## Tech Stack

### Core Technologies

- **React 18** - UI library with concurrent features
- **TypeScript 5** - Type safety and better developer experience
- **Vite 6** - Fast build tool and dev server
- **React Router 7** - Client-side routing

### UI & Styling

- **TailwindCSS 3** - Utility-first CSS framework
- **shadcn/ui** - Accessible, customizable component library
- **Radix UI** - Headless UI primitives
- **Lucide Icons** - Modern SVG icon library
- **class-variance-authority** - Type-safe variant styling
- **tailwind-merge** - Merge Tailwind classes efficiently

### Data Management

- **Axios** - HTTP client for API communication
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation
- **date-fns** - Date utility library

### Data Visualization

- **Recharts** - Composable charting library

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting
- **Husky** - Git hooks

## Project Structure

```
expense-manager-app/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Layout.tsx   # Main layout wrapper
│   │   └── ProtectedRoute.tsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.tsx
│   ├── lib/            # Utilities and shared logic
│   │   ├── api.ts      # Axios instance and config
│   │   ├── services.ts # API service functions
│   │   └── utils.ts    # Helper utilities
│   ├── pages/          # Page components (routes)
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ...
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── nginx/              # Nginx configuration
├── docs/               # Documentation
├── .github/            # GitHub workflows & templates
└── docker-compose*.yml # Container orchestration
```

## Design Patterns

### Component Architecture

We follow a component-based architecture with clear separation of concerns:

#### 1. Page Components (`/pages`)

- Top-level route components
- Handle data fetching and business logic
- Compose smaller UI components
- Example: `DashboardPage.tsx`, `ExpensesPage.tsx`

#### 2. Layout Components (`/components`)

- Reusable UI components
- Generic and composable
- Minimal business logic
- Example: `Layout.tsx`, `ProtectedRoute.tsx`

#### 3. UI Components (`/components/ui`)

- Low-level, highly reusable components
- Based on shadcn/ui patterns
- Styled with Tailwind and CVA
- Example: `button.tsx`, `dialog.tsx`

### Composition Pattern

We use composition over inheritance:

```tsx
// Good: Composition
<Layout>
	<ProtectedRoute>
		<ExpensesPage />
	</ProtectedRoute>
</Layout>

// Avoid: Deep inheritance hierarchies
```

### Custom Hooks

Extract reusable logic into custom hooks:

```tsx
// lib/hooks/useExpenses.ts
export function useExpenses() {
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);

	// Logic here

	return { expenses, loading, refetch };
}
```

## State Management

### Context API

We use React Context for global state:

#### AuthContext

- User authentication state
- Login/logout functionality
- Token management
- User profile data

```tsx
const { user, login, logout, isAuthenticated } = useAuth();
```

### Local State

Component-local state uses React hooks:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialData);
```

### Form State

React Hook Form manages form state:

```tsx
const {
	register,
	handleSubmit,
	formState: { errors },
} = useForm({
	resolver: zodResolver(schema),
});
```

## API Layer

### Axios Configuration (`lib/api.ts`)

Centralized API client with:

- Base URL configuration
- Request/response interceptors
- Token authentication
- Error handling

```tsx
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});
```

### Service Functions (`lib/services.ts`)

Organized API calls by domain:

```tsx
export const expenseService = {
	getAll: params => api.get('/expenses', { params }),
	create: data => api.post('/expenses', data),
	update: (id, data) => api.put(`/expenses/${id}`, data),
	delete: id => api.delete(`/expenses/${id}`),
};
```

### Error Handling

Consistent error handling with try-catch and user feedback:

```tsx
try {
	await expenseService.create(data);
	toast({ title: 'Success' });
} catch (error) {
	toast({ title: 'Error', variant: 'destructive' });
}
```

## Styling Approach

### Utility-First with TailwindCSS

Primary styling method using Tailwind utilities:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg">
```

### Component Variants with CVA

Type-safe variants using class-variance-authority:

```tsx
const buttonVariants = cva('inline-flex items-center justify-center', {
	variants: {
		variant: {
			default: 'bg-black text-white',
			outline: 'border border-black',
		},
		size: {
			default: 'h-10 px-4',
			sm: 'h-9 px-3',
		},
	},
});
```

### Utility Functions

Helper for merging classes with `tailwind-merge`:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base-classes', conditionalClasses)} />;
```

### Design System

Consistent design tokens:

- **Colors**: Black & white theme
- **Spacing**: Tailwind's spacing scale
- **Typography**: System font stack
- **Shadows**: Minimal shadow usage
- **Borders**: Subtle borders and dividers

## Build & Deploy

### Development

```bash
pnpm dev  # Vite dev server with HMR
```

- Fast HMR (Hot Module Replacement)
- TypeScript type checking
- ESLint warnings in console

### Production Build

```bash
pnpm build  # TypeScript + Vite build
```

Build process:

1. TypeScript compilation and type checking
2. Vite production build with optimizations
3. Asset hashing for cache busting
4. Code splitting for optimal loading

### Docker

Multi-stage Docker builds:

#### Development

- Hot reload enabled
- Volume mounting for live changes
- Development dependencies included

#### Production

- Multi-stage build for smaller image
- Static files served by Nginx
- Optimized for performance

### Environment Configuration

Environment-specific settings:

```bash
# Development
VITE_API_URL=http://localhost:3000/api/v1

# Production
VITE_API_URL=https://api.production.com/api/v1
```

## Performance Considerations

### Code Splitting

React.lazy for route-based splitting:

```tsx
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'));
```

### Asset Optimization

- Vite automatic code splitting
- Tree shaking for unused code
- Minification and compression
- SVG optimization for icons

### Runtime Performance

- Minimal re-renders with proper memoization
- Efficient list rendering with keys
- Debounced search and filters
- Optimistic UI updates

## Security

### Authentication

- JWT token-based authentication
- Token stored in memory (AuthContext)
- Automatic token refresh
- Protected routes with `ProtectedRoute` component

### XSS Prevention

- React's built-in XSS protection
- Sanitized user input
- Content Security Policy headers (Nginx)

### CORS

- Backend handles CORS headers
- Environment-specific origins

## Testing Strategy

Currently, the project has no tests, but here's the planned approach:

### Unit Tests

- Component testing with React Testing Library
- Service function tests
- Utility function tests

### Integration Tests

- User flow testing
- API integration tests

### E2E Tests

- Critical path testing with Playwright
- Cross-browser testing

## Future Enhancements

1. **State Management**: Consider Zustand or Redux if complexity grows
2. **Testing**: Add comprehensive test coverage
3. **Performance**: Add React Query for better data fetching
4. **Monitoring**: Integrate error tracking (Sentry)
5. **Analytics**: Add usage analytics
6. **PWA**: Progressive Web App capabilities
7. **Accessibility**: Enhanced A11y features

---

For questions or suggestions about the architecture, please open a [GitHub Discussion](https://github.com/sakilahmmad71/expense-manager-app/discussions).
