# Expenser App

<div align="center">
  <h3>A modern, fully responsive expense tracking application</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  
  [Features](#features) •
  [Tech Stack](#tech-stack) •
  [Getting Started](#getting-started) •
  [Documentation](#-documentation) •
  [Contributing](CONTRIBUTING.md) •
  [License](#-license)
</div>

---

## 🏗️ Related Repositories

This frontend application is part of the Expenser ecosystem:

- **[expense-manager-apis](https://github.com/sakilahmmad71/expense-manager-apis)** - Backend REST API
- **[expense-manager-loadbalancer](https://github.com/sakilahmmad71/expense-manager-loadbalancer)** - Nginx load balancer
- **[expense-manager-landing](https://github.com/sakilahmmad71/expense-manager-landing)** - Marketing landing page

A modern, fully responsive expense tracking application built with React, TypeScript, Vite, TailwindCSS, and shadcn/ui. Features a clean black and white design with comprehensive expense management capabilities.

## Features

- 🔐 **Authentication** - Secure login, registration, and profile management
- 👤 **User Profile** - Update personal information and password
- 📊 **Dashboard** - Visual analytics with interactive charts and graphs
- 💰 **Expense Management** - Full CRUD operations with advanced filtering
- 🏷️ **Category Management** - Create and customize expense categories with colors and emojis
- 🎨 **Clean Design** - Simple black and white theme (no gradients) with shadcn/ui
- 📱 **100% Mobile Responsive** - Optimized for all screen sizes and devices
- 🔍 **Advanced Filtering** - Search, sort, and filter expenses by multiple criteria
- 📈 **Bulk Operations** - Select and delete multiple expenses at once
- 📤 **Export Data** - Export expenses to CSV format
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development
- 🐳 **Docker Support** - Easy deployment with Docker and Docker Compose

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Headless UI primitives (dropdown menus, dialogs)
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Interactive data visualization
- **Lucide Icons** - Modern icon library
- **date-fns** - Date utility library

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Docker & Docker Compose (optional)

### Installation

1. Navigate to the project directory:

```bash
cd expense-manager-app
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### 🐳 Docker Development

For containerized development:

```bash
# Start development environment
make dev-up

# View logs
make dev-logs

# Stop environment
make dev-down
```

## 🚀 Development

### 📋 Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting

# Utilities
pnpm clean            # Clean build artifacts
```

### 🏗️ Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── Layout.tsx   # Main layout component
│   └── ProtectedRoute.tsx
├── context/         # React context providers
├── lib/            # Utility functions and configurations
├── pages/          # Page components (routes)
└── App.tsx         # Main app component
```

### 🛠️ Development Guidelines

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting (run `pnpm format`)
- **Component Structure**: Use functional components with hooks
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: React Context API

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🎯 Good First Issues

Look for issues labeled [`good first issue`](https://github.com/sakilahmmad71/expense-manager-app/labels/good%20first%20issue) - these are perfect for new contributors.

### 📋 How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our [coding standards](CONTRIBUTING.md#coding-standards)
4. **Test your changes** thoroughly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### 📖 Contribution Guidelines

Please read our [Contributing Guidelines](CONTRIBUTING.md) for detailed information about:

- Development setup
- Coding standards
- Commit message format
- Pull request process

## 📸 Screenshots

### 🖥️ Desktop Views

<details>
<summary>Click to view desktop screenshots</summary>

| Dashboard                                            | Expenses                                           | Categories                                             |
| ---------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| ![Dashboard](docs/screenshots/dashboard-desktop.png) | ![Expenses](docs/screenshots/expenses-desktop.png) | ![Categories](docs/screenshots/categories-desktop.png) |

</details>

### 📱 Mobile Views

<details>
<summary>Click to view mobile screenshots</summary>

| Dashboard                                                  | Expenses                                                 | Categories                                                   |
| ---------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| ![Dashboard Mobile](docs/screenshots/dashboard-mobile.png) | ![Expenses Mobile](docs/screenshots/expenses-mobile.png) | ![Categories Mobile](docs/screenshots/categories-mobile.png) |

</details>

## 🎯 API Integration

This frontend connects to the [expense-manager-apis](https://github.com/sakilahmmad71/expense-manager-apis) backend. Make sure to:

1. **Start the backend server** first
2. **Configure the API URL** in your `.env` file
3. **Ensure CORS is configured** on the backend

### 🔗 API Endpoints Used

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /expenses` - Fetch expenses
- `POST /expenses` - Create new expense
- `GET /categories` - Fetch categories
- And more...

## 📦 Deployment

### 🐳 Production Deployment

```bash
# Build production Docker image
make prod-build

# Start production environment
make prod-up

# View production logs
make prod-logs
```

### 🌐 Environment Variables

#### Development (`.env`)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

#### Production (`.env.production`)

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📚 Documentation

Comprehensive documentation to help you understand and contribute to the project:

### For Users

- **[README](README.md)** - Project overview and quick start (you are here)
- **[DEPLOYMENT](DEPLOYMENT.md)** - Production deployment guide
- **[SUPPORT](SUPPORT.md)** - Getting help and support
- **[CHANGELOG](CHANGELOG.md)** - Version history and changes

### For Contributors

- **[CONTRIBUTING](CONTRIBUTING.md)** - How to contribute
- **[CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)** - Community guidelines
- **[STYLE_GUIDE](docs/STYLE_GUIDE.md)** - Coding standards and conventions
- **[DEVELOPMENT](docs/DEVELOPMENT.md)** - Development environment setup
- **[ARCHITECTURE](docs/ARCHITECTURE.md)** - System architecture and design
- **[API](docs/API.md)** - API documentation
- **[TESTING](docs/TESTING.md)** - Testing guide and practices

### Legal & Licensing

- **[LICENSE](LICENSE)** - MIT License
- **[CLA](CLA.md)** - Contributor License Agreement
- **[SECURITY](SECURITY.md)** - Security policy
- **[CONTRIBUTORS](CONTRIBUTORS.md)** - List of contributors

#### Production (`.env.production`)

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🐛 Troubleshooting

### Common Issues

<details>
<summary>Development server won't start</summary>

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

</details>

<details>
<summary>Build fails with TypeScript errors</summary>

```bash
# Run type checking
pnpm type-check

# Fix any type issues and try again
pnpm build
```

</details>

<details>
<summary>Docker container issues</summary>

```bash
# Rebuild containers
make dev-rebuild

# Check logs for errors
make dev-logs
```

</details>

For more help, see our [Support Guide](SUPPORT.md) or [create an issue](https://github.com/sakilahmmad71/expense-manager-app/issues/new).

## 📈 Roadmap

### 🔮 Upcoming Features

- [ ] **Multi-currency support**
- [ ] **Recurring expenses**
- [ ] **Budget planning and alerts**
- [ ] **Data import from bank statements**
- [ ] **Mobile app (React Native)**
- [ ] **Advanced reporting and analytics**
- [ ] **Team/family expense sharing**
- [ ] **Receipt photo upload**

### 🎯 Technical Improvements

- [ ] **Unit and integration tests**
- [ ] **E2E testing with Playwright**
- [ ] **Performance optimization**
- [ ] **Accessibility improvements**
- [ ] **PWA support**
- [ ] **Offline functionality**

Vote on features or suggest new ones in our [Discussions](https://github.com/sakilahmmad71/expense-manager-app/discussions)!

## 🤝 Community

- **🐛 Report bugs**: [Create an issue](https://github.com/sakilahmmad71/expense-manager-app/issues/new?template=bug_report.yml)
- **💡 Request features**: [Submit ideas](https://github.com/sakilahmmad71/expense-manager-app/issues/new?template=feature_request.yml)
- **💬 Discussions**: [Join the conversation](https://github.com/sakilahmmad71/expense-manager-app/discussions)
- **📧 Email**: [sakilahmmad71@gmail.com](mailto:sakilahmmad71@gmail.com)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[shadcn/ui](https://ui.shadcn.com/)** - For the beautiful component library
- **[Radix UI](https://www.radix-ui.com/)** - For accessible UI primitives
- **[Lucide](https://lucide.dev/)** - For the awesome icon library
- **[Recharts](https://recharts.org/)** - For data visualization components
- **All contributors** who help make this project better

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/sakilahmmad71/expense-manager-app?style=social)
![GitHub forks](https://img.shields.io/github/forks/sakilahmmad71/expense-manager-app?style=social)
![GitHub issues](https://img.shields.io/github/issues/sakilahmmad71/expense-manager-app)
![GitHub pull requests](https://img.shields.io/github/issues-pr/sakilahmmad71/expense-manager-app)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/sakilahmmad71">Shakil Ahmed</a></p>
  <p>If this project helped you, consider giving it a ⭐️!</p>
</div>

## Docker Deployment

### Development

```bash
# Using docker compose
docker compose -f docker-compose.development.yml up

# Or using Make
make dev-docker
```

### Local Testing (Production Build)

```bash
# Build and start
docker-compose up -d

# Or using Make
make start

# View logs
make logs
```

### Production Deployment

For production deployment, use the production-ready configuration:

```bash
# Build production image
make build-prod

# Deploy to production
make deploy-prod

# Or manually
docker compose -f docker-compose.production.yml up -d
```

**Important**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive production deployment guide including:

- Environment configuration
- Reverse proxy setup (Nginx/Cloudflare)
- SSL/TLS configuration
- Security best practices
- Monitoring and maintenance
- Troubleshooting guide

The production build:

- Uses multi-stage Docker build for optimized image size
- Includes security hardening (limited capabilities, non-root user)
- Configures Nginx with performance optimizations
- Implements health checks and logging
- Sets resource limits (256MB RAM, 0.3 CPU)
- Should NOT be directly exposed - use reverse proxy

## Available Scripts

### pnpm Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint

### Make Commands

- `make help` - Show all available commands
- `make install` - Install dependencies
- `make dev` - Start Vite dev server
- `make build` - Build production bundle
- `make deploy-prod` - Build and deploy production
- `make logs-prod` - View production logs
- `make health` - Check container health
- See `make help` for more commands

## Project Structure

```
expense-manager-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Layout.tsx       # App layout with navigation and footer
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/
│   │   ├── api.ts           # Axios configuration
│   │   ├── services.ts      # API service functions
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── LoginPage.tsx      # User login
│   │   ├── RegisterPage.tsx   # User registration
│   │   ├── ProfilePage.tsx    # User profile management
│   │   ├── DashboardPage.tsx  # Analytics and insights
│   │   ├── ExpensesPage.tsx   # Expense CRUD with filters
│   │   └── CategoriesPage.tsx # Category management
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles and Tailwind
├── nginx/                   # Nginx configurations
│   ├── nginx.conf           # Main nginx config
│   ├── default.conf         # Development config
│   ├── production.conf      # Production config
│   └── docker-entrypoint.sh # Startup script
├── public/
├── Dockerfile.production    # Production Docker image
├── Dockerfile.development   # Development Docker image
├── docker-compose.production.yml   # Production compose
├── docker-compose.development.yml   # Development compose
├── Makefile                 # Common commands
├── DEPLOYMENT.md            # Production deployment guide
├── DEPLOYMENT.md            # Production deployment guide
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Features Overview

### Authentication & Profile

- User registration with email validation
- Secure login with JWT tokens
- Profile management (update name, email, password)
- Profile dropdown menu with user info and logout
- Protected routes with automatic redirect
- Automatic token refresh

### Dashboard

- Total expenses summary with stats cards
- Expense count and average calculations
- Category breakdown (Interactive pie chart)
- Monthly trends (Bar chart)
- Category analytics table with detailed metrics
- Recent expenses list
- Date range filtering
- Responsive charts for all screen sizes

### Expense Management

- Create new expenses with title, amount, description, date
- Edit existing expenses
- Delete single or multiple expenses (bulk delete)
- Advanced filtering:
  - Search by title or description
  - Filter by category
  - Filter by date range
  - Sort by date or amount (ascending/descending)
- Quick date filters (Today, Week, Month, Last Month, Year)
- Pagination with page navigation
- Export expenses to CSV format
- Responsive list view optimized for mobile

### Category Management

- Create custom categories
- Edit category details
- Delete categories
- Color picker for category colors
- Emoji selector for category icons
- Search categories
- Pagination for large category lists
- Responsive grid layout

### Mobile Optimization

- 100% mobile responsive design
- Touch-optimized buttons and controls
- Stacked layouts on mobile devices
- Responsive text sizing (sm: breakpoints)
- Horizontal scroll for tables
- Compact navigation with backdrop blur
- Optimized for all screen sizes (320px+)

## UI Components

The app uses shadcn/ui components for a consistent, accessible design:

- **Button** - Various button styles and sizes with responsive design
- **Card** - Content containers with headers and footers
- **Input** - Form inputs with validation
- **Label** - Accessible form labels
- **Select** - Dropdown selections with search
- **Dialog** - Modal dialogs for forms and confirmations
- **Dropdown Menu** - Profile menu and action menus
- **Toast** - Success and error notifications
- **Checkbox** - Multi-select functionality
- **Calendar** - Date picker for expense dates

All components are fully responsive and optimized for mobile devices.

## API Integration

The app connects to the Expenser API backend. Configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### API Endpoints Used

- **Authentication**
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `GET /auth/profile` - Get user profile
  - `PUT /auth/profile` - Update user profile

- **Expenses**
  - `GET /expenses` - Get all expenses with pagination and filters
  - `GET /expenses/:id` - Get single expense
  - `POST /expenses` - Create expense
  - `PUT /expenses/:id` - Update expense
  - `PATCH /expenses/:id` - Partial update expense
  - `DELETE /expenses/:id` - Delete expense

- **Categories**
  - `GET /categories` - Get all categories
  - `GET /categories/:id` - Get single category
  - `POST /categories` - Create category
  - `PUT /categories/:id` - Update category
  - `DELETE /categories/:id` - Delete category

- **Dashboard**
  - `GET /dashboard/summary` - Get dashboard summary with stats
  - `GET /dashboard/monthly-trends` - Get monthly trends data
  - `GET /dashboard/recent-expenses` - Get recent expenses (limit: 5)
  - `GET /dashboard/category-analytics` - Get category analytics with filters

## Customization

### Design System

The app uses a clean black and white design system with no gradients. Key colors:

- **Primary Accent**: `bg-gray-900` (black)
- **Hover States**: `hover:bg-gray-50`, `hover:bg-gray-100`
- **Text**: `text-gray-900` (headings), `text-gray-600` (body)
- **Borders**: `border-gray-200`, `border-gray-300`

### Theme Colors

Edit `src/index.css` to customize the color scheme:

```css
:root {
	--primary: 221.2 83.2% 53.3%;
	--secondary: 210 40% 96.1%;
	/* ... more colors */
}
```

### Footer Links

Update social media links in `src/components/Layout.tsx`:

```typescript
const socialLinks = [
	{ name: 'GitHub', url: 'https://github.com/yourusername', icon: Github },
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/in/yourusername',
		icon: Linkedin,
	},
	{
		name: 'Facebook',
		url: 'https://facebook.com/yourusername',
		icon: Facebook,
	},
];
```

### Responsive Breakpoints

The app uses Tailwind's default breakpoints with sm: prefix for mobile-first design:

- **Mobile**: < 640px (default styles)
- **Tablet**: >= 640px (sm:)
- **Desktop**: >= 768px (md:), >= 1024px (lg:), >= 1280px (xl:)

## Building for Production

1. Build the application:

```bash
pnpm build
```

2. The built files will be in the `dist/` directory

3. Preview the build:

```bash
pnpm preview
```

## Deployment

### Docker

The easiest way to deploy is using Docker:

```bash
docker build -t expense-manager-app .
docker run -p 80:80 expense-manager-app
```

### Static Hosting

Deploy the `dist/` folder to any static hosting service:

- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## Recent Improvements

### Design Updates

- ✅ Removed all gradient colors for cleaner design
- ✅ Implemented simple black and white color scheme
- ✅ Added profile dropdown menu with user info
- ✅ Created beautiful footer with social media links
- ✅ Optimized mobile navigation with backdrop blur

### Features Added

- ✅ Profile page with update functionality
- ✅ Profile API integration (name, email, password updates)
- ✅ Category management system with colors and emojis
- ✅ Bulk delete for expenses
- ✅ Export to CSV functionality
- ✅ Advanced filtering and sorting
- ✅ Quick date filter buttons

### Mobile Responsiveness Improvements

- ✅ 100% mobile responsive design across all pages
- ✅ Touch-optimized navigation and controls
- ✅ Optimized table layouts for small screens
- ✅ Mobile-first form designs

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Shakil Ahmed**

- GitHub: [@sakilahmmad71](https://github.com/sakilahmmad71)
- Email: sakilahmmad71@gmail.com

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) for optimal performance

## 📧 Support

For support, email sakilahmmad71@gmail.com or open an issue in the [GitHub repository](https://github.com/sakilahmmad71/expense-manager-app/issues).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/sakilahmmad71">Shakil Ahmed</a>
</div>
- ✅ Dashboard: Responsive stats cards, charts, and tables
- ✅ Expenses: Stacked list items, responsive filters, pagination
- ✅ Categories: Responsive grid layout, always-visible actions on mobile
- ✅ Profile: Stacked form layout, responsive inputs
- ✅ Touch-optimized button sizes (44px+ touch targets)
- ✅ Responsive text sizing with sm: breakpoints
- ✅ Horizontal scroll for wide tables
- ✅ Compact mobile navigation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- **GitHub**: [https://github.com/sakilahmmad71](https://github.com/sakilahmmad71)
- **LinkedIn**: [https://linkedin.com/in/sakilahmmad71](https://linkedin.com/in/sakilahmmad71)

## Acknowledgments

Built with ❤️ as an open-source project for the community.
