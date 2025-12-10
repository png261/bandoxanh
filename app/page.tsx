

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Map, Camera, Lightbulb, Salad, Users, User, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/MainLayout';

export default function HomePage() {
  const router = useRouter();
  const { user } = useUser();

  const features = [
    {
      title: 'Bản Đồ Xanh',
      description: 'Tìm điểm thu gom rác & sự kiện',
      icon: <Map className="w-8 h-8 text-white" />,
      color: 'bg-green-500',
      href: '/map',
    },
    {
      title: 'Công cụ AI',
      description: 'Phân loại rác, gợi ý món ăn...',
      icon: <Camera className="w-8 h-8 text-white" />,
      color: 'bg-blue-500',
      href: '/scan',
    },
    {
      title: 'Thực đơn xanh',
      description: 'Món ăn thuần chay bổ dưỡng',
      icon: <Salad className="w-8 h-8 text-white" />,
      color: 'bg-orange-500',
      href: '/vegetarian/menu',
    },
    {
      title: 'Đồ tái chế',
      description: 'Ý tưởng DIY sáng tạo',
      icon: <Lightbulb className="w-8 h-8 text-white" />,
      color: 'bg-purple-500',
      href: '/diy',
    },
    {
      title: 'Cộng Đồng',
      description: 'Chia sẻ & kết nối',
      icon: <Users className="w-8 h-8 text-white" />,
      color: 'bg-pink-500',
      href: '/community',
    },
    {
      title: 'Cá Nhân',
      description: 'Thành tích & huy hiệu',
      icon: <User className="w-8 h-8 text-white" />,
      color: 'bg-gray-600',
      href: user ? `/profile/${user.id}` : '/sign-in',
    },
  ];



  return (
    <MainLayout>
      <div className="p-4 md:p-8 pb-32 md:pb-8 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between pt-4 md:pt-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
              Xin chào, {user?.firstName || 'bạn mới'}! 👋
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              Hôm nay bạn muốn làm gì cho Trái Đất?
            </p>
          </div>
          {/* User Avatar - Only show on desktop as it's in the mobile menu */}
          {user && (
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="hidden md:block w-14 h-14 rounded-full border-4 border-white dark:border-gray-800 shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => router.push(`/profile/${user.id}`)}
            />
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => router.push(feature.href)}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-gray-100 dark:hover:border-gray-800 relative overflow-hidden"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-green transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {feature.description}
              </p>

              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tip or Stats */}
        <div className="bg-brand-green/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <span className="inline-block px-3 py-1 bg-brand-green text-white text-xs font-bold rounded-full mb-3">
              Mẹo sống xanh
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Mang theo bình nước cá nhân
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Sử dụng bình nước cá nhân thay vì chai nhựa dùng một lần có thể giảm thiểu hàng trăm chai nhựa thải ra môi trường mỗi năm!
            </p>
          </div>
          <div className="hidden md:flex w-24 h-24 bg-white dark:bg-gray-800 rounded-full items-center justify-center text-4xl shadow-md">
            💧
          </div>
        </div>

      </div>
    </MainLayout>
  );
}