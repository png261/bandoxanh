'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  // Redirect to map page immediately
  useEffect(() => {
    router.push('/map');
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-light dark:bg-black">
      <LoadingSpinner size="lg" />
    </div>
  );
}