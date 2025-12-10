import React from 'react';
import MainLayout from '@/components/MainLayout';

export default function MapLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout
            className="bg-white dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200 selection:bg-brand-green selection:text-white overflow-hidden"
            isFullScreen={true}
        >
            {children}
        </MainLayout>
    );
}

