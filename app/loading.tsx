'use client';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-gray-light dark:bg-black">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
                    Đang tải...
                </p>
            </div>
        </div>
    );
}
