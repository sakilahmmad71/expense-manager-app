# Testing Guide

This guide covers the testing strategy and best practices for the Expenser App.

## Current Status

⚠️ **Note**: The project currently has no tests implemented. This guide serves as a roadmap for adding tests.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Test Types](#test-types)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)

## Testing Philosophy

### Testing Pyramid

```
       /\
      /E2E\          <- Few, test critical user journeys
     /------\
    / Integ  \       <- Some, test component interactions
   /----------\
  /   Unit     \     <- Many, test individual units
 /--------------\
```

### What to Test

✅ **DO Test:**

- Critical user paths (authentication, expense CRUD)
- Business logic and calculations
- Component behavior with different props/states
- Error handling
- API service functions
- Utility functions

❌ **DON'T Test:**

- Implementation details
- Third-party libraries
- Trivial code
- Static content

## Testing Stack

### Recommended Tools

#### Unit & Integration Tests

- **Vitest** - Fast unit test framework (Vite-compatible)
- **React Testing Library** - Component testing
- **Testing Library User Event** - User interaction simulation
- **MSW (Mock Service Worker)** - API mocking

#### E2E Tests

- **Playwright** - Modern E2E testing
- **Cypress** (alternative) - Popular E2E framework

#### Additional Tools

- **@testing-library/jest-dom** - Custom matchers
- **@vitest/ui** - Visual test interface
- **@vitest/coverage-v8** - Code coverage

### Installation

```bash
# Unit & Integration
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @testing-library/react @testing-library/jest-dom
pnpm add -D @testing-library/user-event
pnpm add -D jsdom
pnpm add -D msw

# E2E
pnpm add -D @playwright/test
```

### Configuration

#### Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', 'src/test/'],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@lib': path.resolve(__dirname, './src/lib'),
			'@context': path.resolve(__dirname, './src/context'),
		},
	},
});
```

#### Test Setup (`src/test/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
	cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
```

## Test Types

### Unit Tests

Test individual functions and components in isolation.

#### Example: Utility Function

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
	it('formats positive numbers correctly', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56');
	});

	it('formats zero correctly', () => {
		expect(formatCurrency(0)).toBe('$0.00');
	});

	it('formats negative numbers correctly', () => {
		expect(formatCurrency(-123.45)).toBe('-$123.45');
	});
});
```

#### Example: Component

```typescript
// src/components/ui/button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### Integration Tests

Test how components work together.

```typescript
// src/pages/ExpensesPage.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ExpensesPage } from './ExpensesPage';
import { server } from '../test/mocks/server';
import { rest } from 'msw';

describe('ExpensesPage', () => {
  const renderPage = () => {
    return render(
      <BrowserRouter>
        <ExpensesPage />
      </BrowserRouter>
    );
  };

  it('displays loading state initially', () => {
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays expenses after loading', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
    });
  });

  it('allows creating a new expense', async () => {
    renderPage();

    await userEvent.click(screen.getByText(/add expense/i));
    await userEvent.type(screen.getByLabelText(/description/i), 'Test Expense');
    await userEvent.type(screen.getByLabelText(/amount/i), '50.00');
    await userEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(screen.getByText('Test Expense')).toBeInTheDocument();
    });
  });
});
```

### API Mocking with MSW

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

const API_URL = import.meta.env.VITE_API_URL;

export const handlers = [
	rest.get(`${API_URL}/expenses`, (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json([
				{ id: 1, description: 'Grocery Shopping', amount: 75.5 },
				{ id: 2, description: 'Gas', amount: 45.0 },
			])
		);
	}),

	rest.post(`${API_URL}/expenses`, (req, res, ctx) => {
		return res(ctx.status(201), ctx.json({ id: 3, ...req.body }));
	}),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### E2E Tests with Playwright

```typescript
// e2e/expenses.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Expense Management', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');

		// Login
		await page.fill('[name="email"]', 'test@example.com');
		await page.fill('[name="password"]', 'password');
		await page.click('button[type="submit"]');

		await page.waitForURL('**/dashboard');
	});

	test('should create a new expense', async ({ page }) => {
		await page.click('text=Expenses');
		await page.click('text=Add Expense');

		await page.fill('[name="description"]', 'Test Expense');
		await page.fill('[name="amount"]', '100.00');
		await page.selectOption('[name="category"]', { label: 'Food' });

		await page.click('button:has-text("Save")');

		await expect(page.locator('text=Test Expense')).toBeVisible();
	});

	test('should delete an expense', async ({ page }) => {
		await page.click('text=Expenses');

		const firstExpense = page.locator('[data-testid="expense-item"]').first();
		await firstExpense.hover();
		await firstExpense.locator('button[aria-label="Delete"]').click();

		await page.click('button:has-text("Confirm")');

		await expect(
			page.locator('text=Expense deleted successfully')
		).toBeVisible();
	});
});
```

## Running Tests

### Scripts

Add to `package.json`:

```json
{
	"scripts": {
		"test": "vitest",
		"test:ui": "vitest --ui",
		"test:run": "vitest run",
		"test:coverage": "vitest run --coverage",
		"test:e2e": "playwright test",
		"test:e2e:ui": "playwright test --ui"
	}
}
```

### Commands

```bash
# Unit tests (watch mode)
pnpm test

# Run once
pnpm test:run

# With UI
pnpm test:ui

# Coverage
pnpm test:coverage

# E2E tests
pnpm test:e2e

# E2E with UI
pnpm test:e2e:ui
```

## Best Practices

### General

1. **Test behavior, not implementation**

   ```typescript
   // Good: Test what user sees
   expect(screen.getByText('Total: $100.00')).toBeInTheDocument();

   // Bad: Test internal state
   expect(component.state.total).toBe(100);
   ```

2. **Use accessible queries**

   ```typescript
   // Good: User-centric queries
   screen.getByRole('button', { name: /submit/i });
   screen.getByLabelText(/email/i);

   // Bad: Implementation details
   container.querySelector('.submit-button');
   ```

3. **Avoid test IDs when possible**

   ```typescript
   // Good: Semantic queries
   screen.getByRole('button');
   screen.getByText('Submit');

   // Last resort: Test IDs
   screen.getByTestId('submit-button');
   ```

### React Testing Library

1. **Wait for async operations**

   ```typescript
   await waitFor(() => {
   	expect(screen.getByText('Loaded')).toBeInTheDocument();
   });
   ```

2. **Use userEvent over fireEvent**

   ```typescript
   // Good: Realistic user interaction
   await userEvent.click(button);
   await userEvent.type(input, 'text');

   // Avoid: Low-level events
   fireEvent.click(button);
   ```

3. **Query by accessibility**
   ```typescript
   // Preferred order:
   1. getByRole
   2. getByLabelText
   3. getByPlaceholderText
   4. getByText
   5. getByTestId (last resort)
   ```

### Test Organization

```typescript
describe('ComponentName', () => {
	describe('when logged in', () => {
		it('displays user profile', () => {});
		it('allows logout', () => {});
	});

	describe('when logged out', () => {
		it('displays login form', () => {});
		it('redirects to login', () => {});
	});
});
```

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Focus on critical paths rather than 100% coverage.

## Common Patterns

### Testing Forms

```typescript
it('validates form inputs', async () => {
  render(<ExpenseForm />);

  // Submit empty form
  await userEvent.click(screen.getByText(/submit/i));

  // Check validation errors
  expect(screen.getByText(/description is required/i)).toBeInTheDocument();
  expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
});
```

### Testing API Calls

```typescript
it('handles API errors gracefully', async () => {
  server.use(
    rest.get('/api/expenses', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<ExpensesPage />);

  await waitFor(() => {
    expect(screen.getByText(/error loading expenses/i)).toBeInTheDocument();
  });
});
```

### Testing Context

```typescript
it('uses auth context', () => {
  const mockAuth = {
    user: { id: 1, name: 'Test User' },
    isAuthenticated: true,
  };

  render(
    <AuthContext.Provider value={mockAuth}>
      <ProfilePage />
    </AuthContext.Provider>
  );

  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
- [MSW Documentation](https://mswjs.io/)

---

Ready to start testing? Begin with utility functions and simple components, then work your way up to integration and E2E tests!
