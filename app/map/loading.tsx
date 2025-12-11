'use client';

export default function MapLoading() {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Đang tải bản đồ...
                </p>
            </div>
        </div>
    );
}
