# Expenser App

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
	{ name: 'LinkedIn', url: 'https://linkedin.com/in/yourusername', icon: Linkedin },
	{ name: 'Facebook', url: 'https://facebook.com/yourusername', icon: Facebook },
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
