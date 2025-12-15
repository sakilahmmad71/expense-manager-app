# Contributing to Expenser App

Thank you for your interest in contributing to Expenser App! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, check existing issues. Include:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots
- Browser and OS details

### Suggesting Features

- Use clear, descriptive titles
- Explain the problem and proposed solution
- Include mockups or examples

### Code Contributions

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Docker & Docker Compose (optional)

### Setup Steps

1. **Fork and Clone**

```bash
git clone https://github.com/YOUR_USERNAME/expense-manager-app.git
cd expense-manager-app
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Set Up Environment**

```bash
cp .env.example .env
```

Update `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. **Start Development Server**

```bash
pnpm dev
```

App runs at `http://localhost:5173`

### Running with API

Ensure the API is running first:

```bash
cd ../expense-manager-apis
make dev
```

## 🔄 Development Workflow

### Branch Naming

- `feature/expense-filters`
- `fix/login-redirect-issue`
- `docs/update-readme`
- `ui/improve-dashboard-layout`

### Testing Changes

1. **Visual Testing**

   - Test on multiple screen sizes (mobile, tablet, desktop)
   - Verify responsive design
   - Check dark/light mode if applicable

2. **Functional Testing**

   - Test all user flows
   - Verify API integration
   - Check form validations
   - Test error states

3. **Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Mobile)

### Component Development

When adding new components:

```typescript
// Use shadcn/ui components
import { Button } from '@/components/ui/button';

// Follow TypeScript best practices
interface Props {
	title: string;
	onSubmit: (data: FormData) => void;
}

// Add proper types
export const MyComponent: React.FC<Props> = ({ title, onSubmit }) => {
	// Implementation
};
```

## 📝 Coding Standards

### TypeScript

- Use **strict type checking**
- Define **interfaces** for props and data structures
- Avoid **`any`** type
- Use **type inference** where possible

### React Best Practices

- Use **functional components** and hooks
- Keep components **small and focused**
- Extract **custom hooks** for reusable logic
- Use **React.memo** for expensive components
- Follow **hooks rules** (no conditionals)

### File Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── ...           # Custom components
├── context/          # React context providers
├── lib/              # Utilities and helpers
├── pages/            # Page components
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

### Styling

- Use **TailwindCSS** utility classes
- Follow **mobile-first** approach
- Use **consistent spacing** (Tailwind scale)
- Maintain **black and white theme** (no gradients)
- Use **shadcn/ui** components

Example:

```tsx
<button className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors'>
	Click Me
</button>
```

### State Management

- Use **React Context** for global state
- Use **useState** for local state
- Use **useReducer** for complex state logic
- Keep state **as local as possible**

### API Integration

```typescript
// Use axios for API calls
import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

// Add error handling
try {
	const response = await api.get('/expenses');
	return response.data;
} catch (error) {
	console.error('Failed to fetch expenses:', error);
	throw error;
}
```

## 💬 Commit Messages

Follow the format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `ui`: UI/UX improvements
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `docs`: Documentation
- `style`: Formatting
- `chore`: Maintenance

**Examples:**

```
feat(dashboard): add category breakdown chart

Add pie chart visualization for expense categories
using Recharts library.

Closes #23
```

```
fix(auth): redirect after login

Fix issue where users weren't redirected to dashboard
after successful login.
```

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Test on multiple screen sizes
2. ✅ Test in different browsers
3. ✅ Run `pnpm build` successfully
4. ✅ Update documentation
5. ✅ Add screenshots for UI changes

### PR Guidelines

1. **Descriptive title**: "Add expense filtering by date range"
2. **Fill template** with:

   - Description
   - Screenshots (for UI changes)
   - Testing steps
   - Related issues

3. **Keep focused**: One feature/fix per PR
4. **Respond to feedback**: Address review comments

### Review Process

- Automated checks pass
- Maintainer approval required
- No unresolved conversations
- Up-to-date with `main`

## 🎨 UI/UX Guidelines

### Design Principles

- **Simplicity**: Clean, uncluttered interfaces
- **Consistency**: Use same patterns throughout
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsiveness**: Mobile-first design
- **Performance**: Fast loading and interactions

### Component Guidelines

- Use **shadcn/ui** components when available
- Follow **spacing consistency** (4px, 8px, 16px, 24px, etc.)
- Maintain **readable font sizes** (minimum 14px)
- Use **semantic HTML** elements
- Add **proper ARIA labels**

### Colors

- Primary: Black (#000000)
- Secondary: White (#FFFFFF)
- Grays: Use Tailwind gray scale
- Accent: Use sparingly for CTAs

## 🔒 Security

Report security vulnerabilities to sakilahmmad71@gmail.com instead of creating public issues.

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vite Documentation](https://vitejs.dev/)

## 🎉 Recognition

Contributors are acknowledged in README and release notes. Thank you!

## 📧 Contact

- **Maintainer**: Shakil Ahmed
- **Email**: sakilahmmad71@gmail.com
- **GitHub**: [@sakilahmmad71](https://github.com/sakilahmmad71)

---

Happy Contributing! 🚀
