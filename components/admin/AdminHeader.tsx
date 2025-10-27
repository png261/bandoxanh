'use client';

import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  description: string;
  icon: string;
}

export default function AdminHeader({ title, description, icon }: AdminHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {icon} {title}
          </h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-gray-700"
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
}
