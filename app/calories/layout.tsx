import React from 'react';
import MainLayout from '@/components/MainLayout';

export default function CaloriesLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout
            className="bg-gray-50 dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200 selection:bg-brand-green selection:text-white overflow-hidden"
            mainClassName="h-full w-full relative overflow-y-auto p-4 md:p-8"
            isFullScreen={true}
        >
            {children}
        </MainLayout>
    );
}

