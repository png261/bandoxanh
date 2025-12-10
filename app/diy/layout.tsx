import React from 'react';
import MainLayout from '@/components/MainLayout';

export default function DIYLayout({ children }: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}

