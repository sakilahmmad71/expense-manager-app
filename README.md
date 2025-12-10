# Expense Manager App

A modern, responsive expense tracking application built with React, TypeScript, Vite, TailwindCSS, and shadcn/ui.

## Features

- 🔐 **Authentication** - Secure login and registration
- 📊 **Dashboard** - Visual analytics with charts and graphs
- 💰 **Expense Management** - Full CRUD operations for expenses
- 🎨 **Beautiful UI** - Clean white theme with shadcn/ui components
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development
- 🐳 **Docker Support** - Easy deployment with Docker

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide Icons** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker & Docker Compose (optional)

### Installation

1. Navigate to the project directory:

```bash
cd expense-manager-app
```

2. Install dependencies:

```bash
npm install
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
npm run dev
```

The app will be available at `http://localhost:5173`

## Docker Deployment

### Development

```bash
docker-compose -f docker-compose.dev.yml up
```

### Production

```bash
docker-compose up -d
```

The production build uses Nginx to serve the static files.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
expense-manager-app/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Layout.tsx       # App layout with navigation
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── context/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/
│   │   ├── api.ts           # Axios configuration
│   │   ├── services.ts      # API service functions
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ExpensesPage.tsx
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/
├── Dockerfile               # Production Docker image
├── Dockerfile.dev           # Development Docker image
├── docker-compose.yml       # Production compose
├── docker-compose.dev.yml   # Development compose
├── nginx.conf               # Nginx configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Features Overview

### Authentication

- User registration with validation
- Secure login with JWT tokens
- Protected routes
- Automatic token refresh

### Dashboard

- Total expenses summary
- Expense count and average
- Category breakdown (Pie chart)
- Monthly trends (Bar chart)
- Recent expenses list

### Expense Management

- Create new expenses
- Edit existing expenses
- Delete expenses
- Filter by category
- View all expenses with pagination

## UI Components

The app uses shadcn/ui components for a consistent, beautiful design:

- **Button** - Various button styles and sizes
- **Card** - Content containers
- **Input** - Form inputs
- **Label** - Form labels
- **Select** - Dropdown selections
- **Dialog** - Modal dialogs

## API Integration

The app connects to the Expense Manager API backend. Configure the API URL in `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### API Endpoints Used

- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login
- `GET /v1/auth/profile` - Get user profile
- `GET /v1/expenses` - Get all expenses
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /dashboard/summary` - Get dashboard summary
- `GET /dashboard/monthly-trends` - Get monthly trends
- `GET /dashboard/recent-expenses` - Get recent expenses

## Customization

### Theme Colors

Edit `src/index.css` to customize the color scheme:

```css
:root {
	--primary: 221.2 83.2% 53.3%;
	--secondary: 210 40% 96.1%;
	/* ... more colors */
}
```

### Categories

Edit the `CATEGORIES` array in `src/pages/ExpensesPage.tsx`:

```typescript
const CATEGORIES = [
	'Food',
	'Transportation',
	'Shopping',
	'Entertainment',
	'Bills',
	'Healthcare',
	'Other',
];
```

## Building for Production

1. Build the application:

```bash
npm run build
```

2. The built files will be in the `dist/` directory

3. Preview the build:

```bash
npm run preview
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
