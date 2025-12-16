# Google OAuth Frontend Integration Guide

## Overview

This document outlines the Google OAuth integration in the Expense Manager frontend application, allowing users to authenticate using their Google accounts.

## Components Added

### 1. GoogleButton Component

**File**: `src/components/GoogleButton.tsx`

A reusable button component that redirects users to the Google OAuth flow.

**Features**:

- Official Google branding with multi-color logo SVG
- Customizable button text
- Reads API URL from environment variables
- Triggers OAuth flow by redirecting to `/api/v1/auth/google`

**Usage**:

```tsx
<GoogleButton text="Continue with Google" />
// or
<GoogleButton text="Sign up with Google" />
```

### 2. AuthCallback Page

**File**: `src/pages/AuthCallback.tsx`

Handles the OAuth callback after successful Google authentication.

**Flow**:

1. Extracts JWT token from URL query parameters
2. Stores token in localStorage
3. Fetches user profile using the token
4. Updates AuthContext with user data
5. Redirects to dashboard on success
6. Shows loading spinner during authentication
7. Handles errors and redirects to login page on failure

### 3. Updated Authentication Pages

#### LoginPage

**File**: `src/pages/LoginPage.tsx`

**Changes**:

- Added "Or continue with" divider
- Integrated GoogleButton component
- Maintains existing email/password functionality

#### RegisterPage

**File**: `src/pages/RegisterPage.tsx`

**Changes**:

- Added "Or continue with" divider
- Integrated GoogleButton with "Sign up with Google" text
- Maintains existing registration form

### 4. Enhanced AuthContext

**File**: `src/context/AuthContext.tsx`

**New Properties**:

- `isAuthenticated`: Boolean state tracking authentication status
- `setToken`: Function to update token state
- `setUser`: Function to update user state
- `setIsAuthenticated`: Function to update authentication status

**Updated Functions**:

- `login`: Now sets `isAuthenticated` to true
- `register`: Now sets `isAuthenticated` to true
- `logout`: Now sets `isAuthenticated` to false

### 5. Router Configuration

**File**: `src/App.tsx`

**New Route**:

```tsx
<Route path="/auth/callback" element={<AuthCallback />} />
```

## Authentication Flow

### Traditional Email/Password Flow

1. User enters credentials on Login/Register page
2. Form submission calls `login()` or `register()` from AuthContext
3. API returns user data and JWT token
4. Token and user stored in localStorage
5. User redirected to dashboard

### Google OAuth Flow

1. User clicks "Continue with Google" button
2. Browser redirects to `${VITE_API_URL}/auth/google`
3. Backend redirects to Google OAuth consent screen
4. User authenticates with Google
5. Google redirects back to backend callback URL
6. Backend validates OAuth response, creates/finds user, generates JWT
7. Backend redirects to frontend: `${FRONTEND_URL}/auth/callback?token=<jwt>`
8. AuthCallback component:
   - Extracts token from URL
   - Stores token in localStorage
   - Fetches user profile from `/api/v1/auth/profile`
   - Stores user data in localStorage
   - Updates AuthContext state
   - Redirects to `/dashboard`

## Error Handling

### OAuth Callback Errors

- Missing token: User redirected to login with error message
- Invalid token: User redirected to login with error message
- Profile fetch failure: User redirected to login with error message
- Network errors: Caught and logged, user redirected to login

### Button Click

- Uses environment variable for API URL with fallback to localhost
- Window redirect handles navigation errors naturally

## Environment Configuration

Required environment variable in `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Backend Dependencies

This frontend implementation requires the following backend endpoints:

1. **OAuth Initiation**: `GET /api/v1/auth/google`
   - Initiates Google OAuth flow
   - Redirects to Google consent screen

2. **OAuth Callback**: `GET /api/v1/auth/google/callback`
   - Handles Google OAuth callback
   - Creates/finds user in database
   - Generates JWT token
   - Redirects to frontend with token

3. **User Profile**: `GET /api/v1/auth/profile`
   - Returns authenticated user's profile
   - Requires Bearer token in Authorization header
   - Returns user object with id, email, name, avatar, authProvider, createdAt

## Testing Checklist

- [ ] Login page displays Google button
- [ ] Register page displays Google button
- [ ] Clicking Google button redirects to Google OAuth
- [ ] After Google authentication, user is redirected to callback
- [ ] Callback page shows loading spinner
- [ ] User profile is fetched successfully
- [ ] User is redirected to dashboard
- [ ] User data is stored in localStorage
- [ ] AuthContext is updated with user data
- [ ] User can access protected routes after OAuth login
- [ ] Error scenarios display appropriate messages
- [ ] User can still login with email/password

## Security Considerations

1. **Token Storage**: JWT tokens stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS Required**: OAuth requires HTTPS in production
3. **CORS Configuration**: Backend must allow frontend origin with credentials
4. **Token Validation**: All protected routes validate JWT token
5. **Session Management**: Tokens expire after 7 days (configurable in backend)

## UI/UX Features

1. **Consistent Design**: Google button matches existing UI design system
2. **Loading States**: Shows spinner during OAuth callback processing
3. **Error Feedback**: Toast notifications for authentication errors
4. **Divider**: Visual separator between email/password and OAuth options
5. **Branding**: Official Google colors and logo

## Future Enhancements

1. Add more OAuth providers (GitHub, Facebook)
2. Implement token refresh mechanism
3. Add account linking functionality
4. Move to httpOnly cookies for enhanced security
5. Add OAuth provider icons to user profile
6. Implement "Remember me" functionality
7. Add two-factor authentication option

## Troubleshooting

### Common Issues

**Issue**: OAuth callback redirects to 404

- **Solution**: Ensure route is registered in App.tsx

**Issue**: "Authentication failed. No token received"

- **Solution**: Check backend callback URL configuration

**Issue**: "Failed to fetch user information"

- **Solution**: Verify `/auth/profile` endpoint is working

**Issue**: Google button doesn't redirect

- **Solution**: Check VITE_API_URL environment variable

**Issue**: CORS errors during OAuth

- **Solution**: Verify backend CORS configuration includes credentials: true

## Related Documentation

- Backend: See `GOOGLE_OAUTH_SETUP.md` in expense-manager-apis
- Prisma Schema: See `prisma/schema.prisma` for user model
- API Routes: See `src/routes/authRoutes.js` for OAuth endpoints
