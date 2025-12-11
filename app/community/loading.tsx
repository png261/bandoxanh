'use client';

export default function CommunityLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-4">
                {/* Skeleton for tabs */}
                <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />

                {/* Skeleton for create post */}
                <div className="h-32 bg-white dark:bg-gray-800 rounded-3xl animate-pulse" />

                {/* Skeleton for posts */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-6 animate-pulse">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-24" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
