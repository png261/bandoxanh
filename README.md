<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BandoXanh - Recycling Community Platform

A Next.js-based web application for promoting recycling and environmental awareness through an interactive community platform.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add:
```bash
# Gemini API Key (for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Clerk Authentication Keys (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/components` - React components (Header, Footer, etc.)
- `/pages` - Page components (HomePage, MapPage, etc.)
- `/services` - API services (geminiService, etc.)
- `/public` - Static assets
- `/types` - TypeScript type definitions
- `/constants` - Application constants

## Features

- 🗺️ Interactive recycling station map
- 🎯 AI-powered waste identification using Gemini API
- 👥 Community profiles and interaction
- 📰 Environmental news and articles
- 🌓 Dark mode support
- 📱 Responsive design for mobile and desktop
- 🔐 Secure authentication with Clerk

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: Clerk
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Maps**: Leaflet

## Authentication

This app uses **Clerk** for secure user authentication. Features include:

- Sign-up and sign-in pages
- User profile management
- Session management
- Protected routes (via middleware)
- User avatar display in header

See [CLERK_READY.md](./CLERK_READY.md) for detailed authentication setup and usage.

## Migration from Vite

This project has been successfully converted from Vite to Next.js. Key changes include:

- Replaced Vite build system with Next.js
- Migrated to Next.js App Router structure
- Updated imports to use absolute paths (`@/*`)
- Converted single-page app routing to file-based routing
- Updated environment variable handling for Next.js

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

