'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, MapPinIcon } from '@/components/Icons';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green-light via-white to-gray-50 dark:from-brand-gray-dark dark:via-black dark:to-brand-gray-darker flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-brand-green/20 dark:text-brand-green/10">
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-brand-green-light dark:bg-brand-green/10 rounded-full flex items-center justify-center">
            <MapPinIcon className="w-12 h-12 text-brand-green" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Trang không tìm thấy
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Hãy quay lại và tiếp tục hành trình bảo vệ Trái đất của bạn.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-brand-gray-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-brand-gray-darker transition-all font-semibold"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Quay lại
          </button>
          <button
            onClick={() => router.push('/map')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-green-dark text-white rounded-lg transition-all transform hover:scale-105 font-semibold"
          >
            <MapPinIcon className="w-5 h-5" />
            Về bản đồ
          </button>
        </div>

        {/* Decorative element */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
