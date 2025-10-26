import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'BandoXanh',
  description: 'BandoXanh - Recycling Community Platform',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                tailwind.config = {
                  darkMode: 'class',
                  theme: {
                    extend: {
                      colors: {
                        'brand-green': {
                          light: '#dcfce7',
                          DEFAULT: '#22c55e',
                          dark: '#166534',
                        },
                        'brand-gray': {
                          light: '#f9fafb',
                          DEFAULT: '#6b7280',
                          dark: '#1f2937',
                        }
                      },
                      fontFamily: {
                        sans: ['Roboto', 'sans-serif'],
                      },
                    },
                  },
                }
              `,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <script
            src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossOrigin=""
          ></script>
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
