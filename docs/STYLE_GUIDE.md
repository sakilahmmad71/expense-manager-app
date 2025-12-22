# Style Guide

This document outlines the coding standards and style conventions for the Expenser App.

## Table of Contents

- [General Principles](#general-principles)
- [TypeScript](#typescript)
- [React Components](#react-components)
- [Styling](#styling)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Comments](#comments)
- [Git Commit Messages](#git-commit-messages)

## General Principles

### Code Quality

- **Write readable code**: Code is read more often than written
- **Keep it simple**: Prefer simple solutions over clever ones
- **DRY (Don't Repeat Yourself)**: Extract repeated code into functions/components
- **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until needed
- **KISS (Keep It Simple, Stupid)**: Simple solutions are usually better

### Formatting

We use **Prettier** for automatic code formatting:

```bash
pnpm format        # Format all files
pnpm format:check  # Check formatting
```

Configuration in `.prettierrc`:

- Semi-colons: Yes
- Single quotes: Yes
- Tabs: Yes (2 spaces width)
- Trailing commas: ES5
- Line length: 80 characters

## TypeScript

### Type Annotations

Always use explicit types for function parameters and return values:

```tsx
// Good
function calculateTotal(items: Item[]): number {
	return items.reduce((sum, item) => sum + item.price, 0);
}

// Avoid
function calculateTotal(items) {
	return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Interfaces vs Types

- Use `interface` for object shapes that might be extended
- Use `type` for unions, intersections, and primitives

```tsx
// Good: Interface for extendable objects
interface User {
	id: number;
	name: string;
	email: string;
}

// Good: Type for unions
type Status = 'pending' | 'approved' | 'rejected';

// Good: Type for complex compositions
type ApiResponse<T> = {
	data: T;
	error?: string;
};
```

### Avoid `any`

Never use `any` unless absolutely necessary:

```tsx
// Bad
function processData(data: any) {}

// Good
function processData(data: unknown) {
	if (typeof data === 'string') {
		// Type guard narrows to string
	}
}

// Better
interface DataInput {
	value: string;
	timestamp: number;
}

function processData(data: DataInput) {}
```

### Null vs Undefined

- Use `undefined` for optional values
- Use `null` sparingly, only when required by APIs

```tsx
// Good
interface User {
	name: string;
	nickname?: string; // Optional, will be undefined if not set
}

// Avoid unless API requires it
interface User {
	name: string;
	nickname: string | null;
}
```

## React Components

### Functional Components

Use function declarations (not arrow functions) for components:

```tsx
// Good
export function ExpenseList({ expenses }: ExpenseListProps) {
	return <div>...</div>;
}

// Avoid
export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
	return <div>...</div>;
};
```

### Props Interface

Define props interface right before the component:

```tsx
interface ExpenseCardProps {
	expense: Expense;
	onEdit: (id: number) => void;
	onDelete: (id: number) => void;
}

export function ExpenseCard({ expense, onEdit, onDelete }: ExpenseCardProps) {
	// Component implementation
}
```

### Props Destructuring

Destructure props in the function signature:

```tsx
// Good
export function Button({ variant, size, children }: ButtonProps) {
	return (
		<button className={cn(variants[variant], sizes[size])}>{children}</button>
	);
}

// Avoid
export function Button(props: ButtonProps) {
	return (
		<button className={cn(variants[props.variant], sizes[props.size])}>
			{props.children}
		</button>
	);
}
```

### Component Organization

Order component internals consistently:

```tsx
export function MyComponent({ prop1, prop2 }: Props) {
	// 1. Hooks
	const [state, setState] = useState(initial);
	const { data } = useQuery();
	const navigate = useNavigate();

	// 2. Derived state and computations
	const total = useMemo(() => calculateTotal(data), [data]);

	// 3. Effects
	useEffect(() => {
		// Side effects
	}, [dependencies]);

	// 4. Event handlers
	const handleClick = () => {
		// Handler logic
	};

	// 5. Early returns
	if (loading) return <Spinner />;
	if (error) return <Error />;

	// 6. Main render
	return <div>{/* JSX */}</div>;
}
```

### Hooks Rules

1. Only call hooks at the top level
2. Only call hooks from React functions
3. Custom hooks must start with `use`

```tsx
// Good
function useExpenses() {
	const [expenses, setExpenses] = useState<Expense[]>([]);

	useEffect(() => {
		fetchExpenses().then(setExpenses);
	}, []);

	return { expenses };
}

// Use it
function ExpenseList() {
	const { expenses } = useExpenses();
	return <div>{/* ... */}</div>;
}
```

### Event Handlers

Prefix handler names with `handle`:

```tsx
// Good
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};

// Avoid
const onClick = () => {};
const submit = () => {};
const change = () => {};
```

## Styling

### TailwindCSS

Use Tailwind utility classes directly:

```tsx
// Good
<div className="flex items-center justify-between p-4 bg-white rounded-lg">

// Avoid unnecessary custom CSS
<div className="my-custom-container">
```

### Conditional Classes

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<button
  className={cn(
    'base-classes',
    isActive && 'active-classes',
    isDisabled && 'disabled-classes'
  )}
>
```

### Component Variants

Use `class-variance-authority` for component variants:

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md font-medium',
	{
		variants: {
			variant: {
				default: 'bg-black text-white hover:bg-black/90',
				outline: 'border border-black hover:bg-black/30',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 px-3 text-sm',
				lg: 'h-11 px-8',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);
```

## File Organization

### Import Order

Organize imports in this order:

```tsx
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal utilities and services
import { cn } from '@/lib/utils';
import { expenseService } from '@/lib/services';

// 3. Components
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

// 4. Types
import type { Expense } from '@/types';

// 5. Styles (if any)
import './styles.css';
```

### File Structure

```
ComponentName.tsx       # Component implementation
ComponentName.test.tsx  # Tests (if applicable)
ComponentName.types.ts  # Types (if complex)
index.ts               # Re-export (if needed)
```

## Naming Conventions

### Files

- **Components**: PascalCase - `ExpenseCard.tsx`
- **Utilities**: camelCase - `formatCurrency.ts`
- **Hooks**: camelCase with `use` prefix - `useExpenses.ts`
- **Types**: PascalCase - `Expense.types.ts`
- **Constants**: UPPER_SNAKE_CASE - `API_CONSTANTS.ts`

### Variables

```tsx
// Components: PascalCase
const ExpenseCard = () => {};

// Functions: camelCase
function calculateTotal() {}

// Constants: UPPER_SNAKE_CASE
const MAX_EXPENSES = 100;

// Boolean: is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldFetch = true;
```

### TypeScript

```tsx
// Interfaces and Types: PascalCase
interface UserProfile {}
type Status = 'active' | 'inactive';

// Enums: PascalCase
enum UserRole {
	Admin = 'ADMIN',
	User = 'USER',
}

// Generics: Single uppercase letter or PascalCase
function identity<T>(value: T): T {}
function map<TInput, TOutput>(fn: (value: TInput) => TOutput): TOutput {}
```

## Comments

### When to Comment

- **Explain why, not what**: Code should be self-explanatory
- **Complex logic**: Explain non-obvious algorithms
- **Warnings**: Note potential issues or gotchas
- **TODO/FIXME**: Mark temporary solutions

```tsx
// Good: Explains why
// We need to debounce the search to avoid too many API calls
const debouncedSearch = useMemo(() => debounce(handleSearch, 300), []);

// Bad: States the obvious
// Set loading to true
setLoading(true);
```

### JSDoc for Functions

Use JSDoc for exported functions:

```tsx
/**
 * Calculates the total amount of all expenses
 * @param expenses - Array of expense objects
 * @returns The sum of all expense amounts
 */
export function calculateTotal(expenses: Expense[]): number {
	return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}
```

### TODO Comments

```tsx
// TODO: Add pagination support
// FIXME: This breaks on mobile Safari
// HACK: Temporary workaround for API bug
// NOTE: This is required by the backend API
```

## Git Commit Messages

### Format

Follow Conventional Commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)

### Examples

```bash
# Feature
feat(expenses): add bulk delete functionality

# Bug fix
fix(auth): resolve token expiration issue

# Documentation
docs: update installation instructions

# Refactoring
refactor(api): simplify error handling logic

# Breaking change
feat(api)!: change expense API response format

BREAKING CHANGE: The API now returns `createdAt` instead of `created_at`
```

### Best Practices

- Use imperative mood: "add" not "added" or "adds"
- Keep subject line under 72 characters
- Capitalize the subject line
- Don't end subject with a period
- Separate subject from body with blank line
- Use body to explain what and why, not how

---

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guide
- [ ] TypeScript types are properly defined
- [ ] No `any` types used
- [ ] Components are properly typed
- [ ] Code is formatted with Prettier
- [ ] No ESLint errors or warnings
- [ ] Imports are organized correctly
- [ ] Comments explain complex logic
- [ ] Commit messages follow conventions
- [ ] No console.log statements
- [ ] No commented-out code

---

For questions about the style guide, open a discussion or issue!
