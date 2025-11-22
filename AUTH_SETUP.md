# Authentication & RBAC Setup Guide

This document explains how to set up and use the Role-Based Access Control (RBAC) system for the Ali Hospital Management System.

## Overview

The system now includes authentication and role-based access control with three user roles:
- **Admin**: Full access to all features including Doctor Payments
- **User1**: Access to all features except Doctor Payments
- **User2**: Access to all features except Doctor Payments

## Setup Instructions

### 1. Database Setup

The User model has already been added to the Prisma schema. To create the users table:

```bash
# The database should already be in sync after running npm run seed
# If you need to sync manually:
npx prisma db push
```

### 2. Create Default Users

Run the seed script to create default users:

```bash
npm run seed
```

This will create three users with the following credentials:

| Username | Password  | Role   |
|----------|-----------|--------|
| admin    | admin123  | Admin  |
| user1    | user123   | User1  |
| user2    | user123   | User2  |

### 3. Environment Variables (Optional)

For production, add a custom session secret to your `.env` file:

```env
SESSION_SECRET=your-super-secret-random-string-here
```

If not set, a default secret will be used (not recommended for production).

## Features Implemented

### 1. User Authentication
- **Login Page**: `/login` - Users must authenticate to access the system
- **Session Management**: Cookie-based sessions with encrypted data
- **Password Security**: Passwords are hashed using bcryptjs
- **Auto-redirect**: Unauthenticated users are redirected to login page

### 2. Role-Based Access Control
- **Navigation Control**: "Doctor Payments" link only visible to Admin users
- **API Protection**: Doctor Payments API routes check for Admin role
- **Middleware Protection**: All routes require authentication except login and public assets

### 3. User Interface
- **User Info Display**: Current user's username and role shown in navigation bar
- **Logout Button**: Allows users to end their session
- **Login Form**: Clean, responsive login interface with credential hints

## File Structure

```
ali-hospital-system/
├── lib/
│   └── auth.ts                          # Authentication utilities
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── login/route.ts           # POST /api/auth/login
│   │       ├── logout/route.ts          # POST /api/auth/logout
│   │       └── me/route.ts              # GET /api/auth/me
│   ├── components/
│   │   └── LogoutButton.tsx             # Client-side logout button
│   ├── login/
│   │   └── page.tsx                     # Login page
│   └── layout.tsx                       # Updated with auth & role-based nav
├── middleware.ts                         # Route protection middleware
├── prisma/
│   ├── schema.prisma                    # Updated with User model
│   └── seed.ts                          # Updated with user creation
└── AUTH_SETUP.md                        # This file
```

## Usage Guide

### Logging In

1. Navigate to `http://localhost:3000` (or your server URL)
2. You will be automatically redirected to `/login`
3. Enter one of the default credentials:
   - Admin: `admin` / `admin123`
   - User1: `user1` / `user123`
   - User2: `user2` / `user123`
4. Click "Sign in"

### Testing Role-Based Access

**As Admin:**
- You can see and access all navigation links including "Doctor Payments"
- You can view, create, and delete doctor payment records

**As User1/User2:**
- You can access all features except "Doctor Payments"
- The "Doctor Payments" link will not appear in the navigation
- If you try to access `/doctor-payments` directly, the API will return a 403 Forbidden error

### Logging Out

Click the red "Logout" button in the top-right corner of the navigation bar.

## API Endpoints

### Authentication

**POST /api/auth/login**
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "clxxx...",
    "username": "admin",
    "role": "Admin"
  }
}

Response (401):
{
  "error": "Invalid username or password"
}
```

**POST /api/auth/logout**
```json
Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

**GET /api/auth/me**
```json
Response (200):
{
  "user": {
    "id": "clxxx...",
    "username": "admin",
    "role": "Admin"
  }
}

Response (401):
{
  "error": "Not authenticated"
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed with bcryptjs (10 rounds)
2. **HTTP-Only Cookies**: Session cookies are HTTP-only to prevent XSS attacks
3. **Secure Cookies**: In production, cookies are sent only over HTTPS
4. **Session Validation**: All protected routes validate session on server-side
5. **Role Verification**: Admin-only routes check user role before allowing access

## Adding New Users

To add new users programmatically, you can use the Prisma Client:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUser() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.create({
    data: {
      username: 'newuser',
      password: hashedPassword,
      role: 'User1', // or 'Admin', 'User2'
    },
  })

  console.log('User created:', user)
}
```

## Troubleshooting

### "Not authenticated" errors
- Clear your browser cookies and log in again
- Check that the session cookie is being set (check browser DevTools > Application > Cookies)

### Can't access Doctor Payments as Admin
- Verify you're logged in as the admin user (check username in navbar)
- Check the session role in browser DevTools > Application > Cookies > session (decode base64)

### Seed script fails
- If you get duplicate errors, users already exist (this is normal)
- To reset everything: delete `prisma/dev.db` and run `npx prisma db push && npm run seed`

## Production Considerations

Before deploying to production:

1. **Change Default Passwords**: Update all default user passwords
2. **Set SESSION_SECRET**: Use a strong, random secret in environment variables
3. **Use HTTPS**: Ensure your production server uses HTTPS
4. **Database Backup**: Regularly backup your database including user data
5. **Password Policy**: Consider implementing stronger password requirements
6. **Rate Limiting**: Add rate limiting to login endpoint to prevent brute force attacks
7. **Audit Logging**: Consider adding audit logs for sensitive operations

## Future Enhancements

Possible improvements to consider:

- Password reset functionality
- Multi-factor authentication (MFA)
- Session timeout and refresh tokens
- User management UI (for admins to create/edit users)
- More granular permissions system
- Activity logging and audit trails
- Remember me functionality
- Account lockout after failed login attempts
