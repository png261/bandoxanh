# Clerk Authentication Integration Guide

## 🔐 Overview

Your BandoXanh application now includes user authentication via **Clerk**, a modern authentication platform. This guide explains the integration and how to use it.

## ✅ What's New

### 1. **Environment Variables** (Already configured)
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2FyZWZ1bC1hcGhpZC05NS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_h4iwk7W5OoMKWgFBESOdnpVjfWaVMylFIJP9Hgl8zO
```

### 2. **New Files Created**

#### Authentication Routes
- `/app/sign-in/[[...sign-in]]/page.tsx` - Sign in page
- `/app/sign-up/[[...sign-up]]/page.tsx` - Sign up page

#### Components
- `components/UserButton.tsx` - User menu with sign in/up links and logout

#### Middleware
- `middleware.ts` - Clerk middleware for authentication

### 3. **Updated Files**

- `app/layout.tsx` - Wrapped with `ClerkProvider`
- `components/Header.tsx` - Integrated `UserButton` component
- `package.json` - Added `@clerk/nextjs` dependency

## 📦 Installation

The Clerk package is already added to `package.json`. To install it:

```bash
npm install
```

This will install `@clerk/nextjs` which provides:
- Authentication UI components
- Middleware for protected routes
- User session management
- API routes for authentication

## 🚀 How It Works

### User Authentication Flow

1. **Unauthenticated User**: 
   - Sees "Đăng nhập" (Sign In) and "Đăng ký" (Sign Up) buttons in the header

2. **Sign In/Sign Up**:
   - User clicks button → redirected to sign-in/sign-up page
   - Clerk provides a beautiful, pre-built authentication UI
   - User enters credentials and authenticates

3. **Authenticated User**:
   - Sees their profile picture/avatar in header
   - Clicking avatar shows user menu with account options
   - Can log out from the menu

### Component Structure

```
<ClerkProvider>
  <App>
    <Header>
      <UserButton>
        - SignedOut: Show "Đăng nhập" & "Đăng ký" buttons
        - SignedIn: Show user avatar with menu
      </UserButton>
    </Header>
  </App>
</ClerkProvider>
```

## 📋 Key Components

### 1. **ClerkProvider** (in `app/layout.tsx`)
Wraps your entire application and provides authentication context.

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout() {
  return (
    <ClerkProvider>
      <html>
        {/* Your app */}
      </html>
    </ClerkProvider>
  );
}
```

### 2. **UserButton** (in `components/UserButton.tsx`)
Displays authentication UI based on user status.

```typescript
import { UserButton as ClerkUserButton, SignedIn, SignedOut } from '@clerk/nextjs';

<SignedOut>
  <Link href="/sign-in">Đăng nhập</Link>
  <Link href="/sign-up">Đăng ký</Link>
</SignedOut>

<SignedIn>
  <ClerkUserButton />
</SignedIn>
```

### 3. **Sign In Page** (`app/sign-in/[[...sign-in]]/page.tsx`)
Beautiful pre-built sign-in form from Clerk.

### 4. **Sign Up Page** (`app/sign-up/[[...sign-up]]/page.tsx`)
Beautiful pre-built sign-up form from Clerk.

## 🔒 Protecting Routes (Optional)

To protect routes and require authentication:

```typescript
// app/protected-route/page.tsx
'use client';

import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) redirect('/sign-in');

  return <div>This page is only for authenticated users</div>;
}
```

## 📍 Routes

| Route | Page | Description |
|-------|------|-------------|
| `/sign-in` | Sign In | User login page |
| `/sign-up` | Sign Up | User registration page |
| `/` | Home | Accessible to all users |
| `/map` | Map | Accessible to all users |
| `/identify` | Identify | Accessible to all users |
| `/community` | Community | Accessible to all users |
| `/news` | News | Accessible to all users |
| `/profile/:id` | Profile | Accessible to all users |
| `/about` | About | Accessible to all users |

## 🎨 Styling

Clerk components are styled to match your BandoXanh theme:

```typescript
appearance={{
  elements: {
    formButtonPrimary: 'bg-brand-green text-white hover:bg-brand-green-dark',
    footerActionLink: 'text-brand-green hover:text-brand-green-dark',
    formFieldInput: 'border border-gray-300 dark:border-gray-600',
  },
}}
```

You can customize these appearance properties further in:
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`
- `components/UserButton.tsx`

## 🔧 Advanced Usage

### Get Current User in Component

```typescript
'use client';

import { useUser } from '@clerk/nextjs';

export default function MyComponent() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {isSignedIn ? (
        <p>Hello, {user.firstName}!</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Middleware for Protected API Routes

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/api/protected(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
```

### User Session Data

```typescript
const { userId, sessionId, getToken } = useAuth();

// Get custom JWT token
const token = await getToken({ template: 'supabase' });
```

## 🌐 Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test Sign Up**:
   - Click "Đăng ký" button
   - Fill in email and password
   - Click sign up

3. **Test Sign In**:
   - Click "Đăng nhập" button
   - Enter credentials
   - Click sign in

4. **Test User Menu**:
   - After signing in, click avatar
   - See user menu options
   - Click sign out

## 🚨 Troubleshooting

### "Cannot find module '@clerk/nextjs'"
```bash
npm install @clerk/nextjs
npm run dev
```

### Environment Variables Not Working
- Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `NEXT_PUBLIC_`
- Restart dev server after changing env variables
- Check `.env.local` file exists

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`

## 📚 Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference/frontend/react)
- [Appearance Configuration](https://clerk.com/docs/components/customization/overview)

## 🔄 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Add Clerk keys to `.env.local` (already done)
3. ✅ Start dev server: `npm run dev`
4. 📝 Customize appearance if needed
5. 🛡️ Add route protection as needed
6. 🚀 Deploy to production

## 📞 Support

For issues with Clerk, visit:
- [Clerk Support](https://support.clerk.com)
- [Clerk Community](https://discord.gg/b5rXHjAg7b)

For issues with BandoXanh integration, check the main README.md

---

**Status**: ✅ Clerk authentication is ready to use!
