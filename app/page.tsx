'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Redirect to map page immediately
  useEffect(() => {
    router.push('/map');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-light dark:bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
    </div>
  );
}