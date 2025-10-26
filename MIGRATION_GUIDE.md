# Migration Guide: Vite to Next.js

This document outlines the changes made to convert the BandoXanh project from Vite to Next.js.

## Overview

The project has been successfully migrated from a Vite-based React SPA (Single Page Application) to a Next.js full-stack framework.

## Key Changes

### 1. Build System & Configuration

**Removed:**
- `vite.config.ts` - Vite configuration
- `vite.svg` - Vite logo
- `index.html` - Manual HTML entry point
- `dist-ssr` build artifacts

**Added:**
- `next.config.js` - Next.js configuration
- `.next/` directory - Next.js build output
- `app/` directory - Next.js App Router

### 2. Directory Structure

**Old Structure (Vite):**
```
src/
├── App.tsx
├── index.tsx
├── index.html
└── pages/
```

**New Structure (Next.js):**
```
app/
├── page.tsx (homepage)
├── layout.tsx (root layout)
├── globals.css
├── map/page.tsx
├── identify/page.tsx
├── community/page.tsx
├── news/page.tsx
├── news/[id]/page.tsx
├── about/page.tsx
└── profile/[id]/page.tsx
```

### 3. Routing

**Vite (Client-side routing):**
```typescript
// Used manual state management for pages
const [currentPage, setCurrentPage] = useState<Page>('home');
// Manual navigation callback
const navigateTo = (page: Page) => setCurrentPage(page);
```

**Next.js (File-based routing):**
```typescript
// Automatic routing based on file structure
// /app/map/page.tsx → /map
// /app/news/[id]/page.tsx → /news/:id

// Navigation using Next.js router
const router = useRouter();
router.push('/map');
```

### 4. Entry Point

**Old (Vite with React.createRoot):**
```typescript
// index.tsx
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
```

**New (Next.js App Router):**
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <html>{children}</html>;
}

// app/page.tsx - Automatically rendered at /
export default function Home() {
  return <div>Home Page</div>;
}
```

### 5. Package Dependencies

**Removed:**
- `vite` - Build tool
- `@vitejs/plugin-react` - Vite React plugin

**Added:**
- `next` - Next.js framework
- `eslint-config-next` - ESLint configuration for Next.js

### 6. Scripts

**Vite:**
```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
```

**Next.js:**
```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
```

### 7. Environment Variables

**Vite:**
```typescript
// vite.config.ts
define: {
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**Next.js:**
```typescript
// next.config.js
env: {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
}

// Or use automatic exposure from .env.local
GEMINI_API_KEY=your_key
```

### 8. Client Component Directive

All interactive components must have `'use client'` directive in Next.js App Router:

```typescript
'use client';

import { useState } from 'react';

export default function MyComponent() {
  // ...
}
```

### 9. Imports & Path Aliases

**Updated Path Alias:**
- From: `import Component from '../components/Header'`
- To: `import Header from '@/components/Header'`

This uses the `@/*` alias configured in `tsconfig.json` and `next.config.js`.

### 10. Component Updates

#### Header Component
- Changed from `currentPage: Page` state prop to `usePathname()` hook
- Simplified navigation to use `useRouter()` and path strings
- Removed page tracking in favor of pathname comparison

#### Pages Structure
- Each page is now a separate route file (`/app/[page]/page.tsx`)
- Theme management is still client-side but duplicated across routes
- Dynamic routes use `[id]` parameter pattern

## Performance Benefits

1. **Server-Side Rendering**: Can render pages on the server when needed
2. **Automatic Code Splitting**: Each route is automatically code-split
3. **Image Optimization**: Built-in image optimization
4. **API Routes**: Can add backend functionality without separate server

## Future Improvements

1. Extract theme management to a Context API or Zustand store to avoid duplication
2. Implement server components for static content
3. Add API routes for backend functionality
4. Consider implementing incremental static regeneration (ISR)
5. Add performance monitoring and analytics

## Troubleshooting

### Issue: "Cannot find module 'react'"
**Solution**: Run `npm install` to install dependencies

### Issue: Port 3000 already in use
**Solution**: Use `npm run dev -- -p 3001` to use a different port

### Issue: Build errors with imported images
**Solution**: Next.js requires static imports for image optimization. Use:
```typescript
import Image from 'next/image';
import myImage from '@/public/image.png';

<Image src={myImage} alt="description" />
```

## Testing

After migration, test the following:
1. Navigation between all pages
2. Theme toggle functionality
3. Sidebar collapse/expand
4. Mobile responsiveness
5. Gemini API integration
6. Map functionality

## Questions?

Refer to the official Next.js documentation: https://nextjs.org/docs
