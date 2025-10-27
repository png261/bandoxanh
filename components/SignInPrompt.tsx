'use client';

import { useRouter } from 'next/navigation';
import { XIcon } from './Icons';

interface SignInPromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export default function SignInPrompt({ isOpen, onClose, feature = 'tính năng này' }: SignInPromptProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
          Yêu cầu đăng nhập
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Bạn cần đăng nhập để sử dụng {feature}.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/sign-in')}
            className="w-full px-6 py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => router.push('/sign-up')}
            className="w-full px-6 py-3 bg-white text-brand-green border-2 border-brand-green font-semibold rounded-lg hover:bg-brand-green-light transition-colors dark:bg-gray-700 dark:text-white dark:border-brand-green"
          >
            Tạo tài khoản mới
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
