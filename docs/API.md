# API Documentation

This document describes the API endpoints used by the Expenser App frontend.

## Base Configuration

The API base URL is configured via environment variable:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login

Login user and receive JWT token.

**Request:**

```json
{
	"email": "user@example.com",
	"password": "password"
}
```

**Response:**

```json
{
	"token": "jwt_token_here",
	"user": {
		"id": 1,
		"email": "user@example.com",
		"name": "John Doe"
	}
}
```

#### POST /auth/register

Register a new user account.

**Request:**

```json
{
	"name": "John Doe",
	"email": "user@example.com",
	"password": "password",
	"confirmPassword": "password"
}
```

#### GET /auth/me

Get current user information (requires authentication).

### Expenses

#### GET /expenses

Fetch user's expenses with optional filtering.

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category_id` - Filter by category
- `date_from` - Filter from date (YYYY-MM-DD)
- `date_to` - Filter to date (YYYY-MM-DD)
- `search` - Search in description

#### POST /expenses

Create a new expense.

**Request:**

```json
{
	"description": "Grocery shopping",
	"amount": 45.5,
	"category_id": 1,
	"date": "2023-12-15"
}
```

#### PUT /expenses/:id

Update an existing expense.

#### DELETE /expenses/:id

Delete an expense.

#### POST /expenses/bulk-delete

Delete multiple expenses.

**Request:**

```json
{
	"ids": [1, 2, 3, 4]
}
```

### Categories

#### GET /categories

Fetch user's expense categories.

#### POST /categories

Create a new category.

**Request:**

```json
{
	"name": "Groceries",
	"color": "#10B981",
	"emoji": "🛒"
}
```

#### PUT /categories/:id

Update an existing category.

#### DELETE /categories/:id

Delete a category.

### Analytics

#### GET /analytics/dashboard

Get dashboard analytics data.

**Response:**

```json
{
  "totalExpenses": 1250.75,
  "monthlyExpenses": 342.25,
  "expensesByCategory": [...],
  "monthlyTrend": [...]
}
```

## Error Handling

The API returns errors in the following format:

```json
{
	"error": "Error message here",
	"details": "Additional error details if available"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

The API may implement rate limiting. Check response headers:

- `X-RateLimit-Limit` - Request limit per window
- `X-RateLimit-Remaining` - Remaining requests in current window
- `X-RateLimit-Reset` - Time when the rate limit resets

## Related Backend Repository

For detailed API implementation, see: [expense-manager-apis](https://github.com/sakilahmmad71/expense-manager-apis)
