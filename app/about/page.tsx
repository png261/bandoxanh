'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuoteIcon } from '@/components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState, useEffect } from 'react';
import { Theme } from '@/types';
import React from 'react';
import RecyclingIcon from '@mui/icons-material/Recycling';
import MapIcon from '@mui/icons-material/Map';
import PsychologyIcon from '@mui/icons-material/Psychology';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import Image from "next/image";
import hien_avt from "@/public/images/hien.jpg"
import anh_avt from "@/public/images/anh.jpg"
import mai_avt from "@/public/images/mai.jpg"
import ngan_avt from "@/public/images/ngan.jpg"
import phuong_avt from "@/public/images/phuong.jpg"

// --- DỮ LIỆU MẪU ---
const wasteDistributionData = [
  { name: 'Nhựa', value: 450 },
  { name: 'Giấy', value: 320 },
  { name: 'Hữu cơ', value: 280 },
  { name: 'Điện tử', value: 150 },
  { name: 'Khác', value: 200 },
];
const PIE_COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];

const userGrowthData = [
  { month: 'Thg 1', users: 250 },
  { month: 'Thg 2', users: 380 },
  { month: 'Thg 3', users: 520 },
  { month: 'Thg 4', users: 710 },
  { month: 'Thg 5', users: 1150 },
  { month: 'Thg 6', users: 1520 },
];

const teamMembers = [
    { name: 'Hoàng Thu Hiền', role: 'Co-Founder', avatar: hien_avt },
    { name: 'Mai Thị Ngọc Ánh', role: 'Co-Founder', avatar: anh_avt },
    { name: 'Lê Thị Quỳnh Mai', role: 'Founder', avatar: mai_avt },
    { name: 'Phạm Thảo Ngân', role: 'Co-Founder', avatar: ngan_avt },
    { name: 'Nguyễn Hữu Phương', role: 'Co-Founder', avatar: phuong_avt },
];

const testimonials = [
    { quote: 'Ứng dụng rất hữu ích! Tôi đã tìm được trạm thu gom pin cũ gần nhà mà trước đây không hề biết. Giao diện cũng rất thân thiện.', author: 'Anh Tuấn - Người dùng tại Hà Nội' },
    { quote: 'Tính năng nhận diện rác bằng AI thật tuyệt vời. Nó giúp gia đình tôi phân loại rác chính xác hơn rất nhiều. Cảm ơn BandoXanh!', author: 'Chị Mai - Người dùng tại Đà Nẵng' },
    { quote: 'Cộng đồng BandoXanh rất sôi nổi và tích cực. Tôi học được nhiều mẹo tái chế hay ho từ các thành viên khác.', author: 'Bạn Minh - Sinh viên' },
];

const features = [
  { 
    icon: MapIcon, 
    title: 'Bản đồ thu gom', 
    description: 'Tìm kiếm điểm thu gom rác thải gần nhất với vị trí của bạn'
  },
  { 
    icon: PsychologyIcon, 
    title: 'AI nhận diện', 
    description: 'Phân loại rác chính xác bằng công nghệ trí tuệ nhân tạo'
  },
  { 
    icon: GroupsIcon, 
    title: 'Cộng đồng', 
    description: 'Kết nối và chia sẻ kinh nghiệm với người dùng khác'
  },
  { 
    icon: EmojiEventsIcon, 
    title: 'Hệ thống thưởng', 
    description: 'Nhận phần thưởng khi tham gia bảo vệ môi trường'
  },
];

const stats = [
  { label: 'Người dùng', value: '1,520+', icon: GroupsIcon },
  { label: 'Điểm thu gom', value: '350+', icon: MapIcon },
  { label: 'Rác đã phân loại', value: '1,400+', icon: RecyclingIcon },
  { label: 'Tăng trưởng', value: '+215%', icon: TrendingUpIcon },
];

const timeline = [
  { year: '10.2025', title: 'Khởi đầu', description: 'Ý tưởng BandoXanh ra đời từ nhóm sinh viên yêu môi trường' },
  { year: '10.2025', title: 'Phát triển', description: 'Xây dựng MVP với các tính năng cơ bản: bản đồ và cộng đồng' },
  { year: '10.2025', title: 'Tích hợp trí tuệ nhân tạo AI', description: 'Tích hợp công nghệ AI để nhận diện và phân loại rác thải' },
  { year: '10.2025', title: 'Ra mắt', description: 'Chính thức phát hành ứng dụng' },
];

interface AboutPageProps {
  theme: Theme;
}

const AboutPageComponent: React.FC<AboutPageProps> = ({ theme }) => {
  const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';

  return (
    <div className="max-w-7xl mx-auto">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green to-emerald-600 dark:from-emerald-800 dark:to-brand-green-dark text-white py-12 sm:py-16 md:py-20 lg:pb-28 lg:pt-10 -mx-3 sm:-mx-4 md:-mx-6 rounded-2xl sm:rounded-3xl mb-12 sm:mb-16">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col justify-center items-center">
            <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium">
              🌱 Vì một tương lai xanh
            </div>
            <Image src="logo.png" width={400} height={200} alt="BandoXanh Logo" />
            <p className="text-base sm:text-lg md:text-xl mt-5 lg:text-2xl mb-6 sm:mb-8 text-emerald-50 leading-relaxed break-words px-2">
              Nền tảng kết nối cộng đồng để bảo vệ môi trường,<br className="hidden md:block" />
              biến hành động nhỏ thành tác động lớn
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-2">
              <a href="#features" className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-green font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base">
                Khám phá tính năng
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-brand-gray-light dark:text-black"/>
          </svg>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-gray-dark dark:text-white mb-2 sm:mb-3 break-words">
            Tính năng nổi bật
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 break-words">
            Các công cụ mạnh mẽ để bảo vệ môi trường
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 md:p-6 hover:border-brand-green hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-green to-emerald-400 rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-brand-gray-dark dark:text-white mb-2 break-words">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- MISSION & VISION --- */}
      <section className="mb-20">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="inline-block w-fit mb-4 px-4 py-2 bg-brand-green/10 rounded-full">
                <span className="text-brand-green font-semibold text-sm">Sứ mệnh & Tầm nhìn</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-gray-dark dark:text-white mb-6">
                Kết nối - Giáo dục - Lan tỏa
              </h2>
              <div className="space-y-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-gray-dark dark:text-white mb-1 text-base">Kết nối</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Xây dựng bản đồ số toàn diện về các điểm thu gom, giúp mọi người dễ dàng tiếp cận
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-gray-dark dark:text-white mb-1 text-base">Giáo dục</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Nâng cao nhận thức về phân loại rác thông qua công cụ AI và nội dung chất lượng
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-gray-dark dark:text-white mb-1 text-base">Lan tỏa</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tạo cộng đồng sống xanh, nơi mọi người chia sẻ và truyền cảm hứng
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src="https://picsum.photos/seed/mission/800/600" 
                alt="Hành động vì môi trường" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TIMELINE --- */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-dark dark:text-white mb-3">
            Hành trình phát triển
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Từ ý tưởng đến hiện thực
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-brand-green via-emerald-400 to-brand-green hidden md:block"></div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-6 items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 md:text-right" style={{ textAlign: index % 2 === 0 ? 'right' : 'left' }}>
                  <div className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                    <div className="text-brand-green font-bold mb-1 text-sm">{item.year}</div>
                    <h3 className="text-lg font-bold text-brand-gray-dark dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                  {index + 1}
                </div>
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* --- TEAM --- */}
      <section className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-gray-dark dark:text-white mb-2 sm:mb-3 break-words">
            Người sáng lập
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 break-words">
            Đội ngũ tâm huyết và nhiệt huyết
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {teamMembers.map(member => (
            <div 
              key={member.name} 
              className="group bg-white dark:bg-brand-gray-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <Image 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <h3 className="font-bold text-sm sm:text-base text-brand-gray-dark dark:text-white mb-1 break-words truncate">
                  {member.name}
                </h3>
                <p className="text-xs sm:text-sm text-brand-green font-medium break-words line-clamp-2">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="community" className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-gray-dark dark:text-white mb-2 sm:mb-3 break-words">
            Cộng đồng nói về chúng tôi
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 break-words">
            Những phản hồi chân thành từ người dùng
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 md:p-6 flex flex-col hover:shadow-lg hover:border-brand-green transition-all duration-300"
            >
              <QuoteIcon className="text-brand-green w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
              <p className="flex-grow text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed mb-3 sm:mb-4 break-words">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-brand-green to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {item.author.charAt(0)}
                </div>
                <p className="font-semibold text-brand-gray-dark dark:text-white text-xs sm:text-sm truncate">
                  {item.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* --- GALLERY --- */}
      <section className="mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-gray-dark dark:text-white mb-2 sm:mb-3 break-words">
            Khoảnh khắc 
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 break-words">
            Những hoạt động ý nghĩa của cộng đồng
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div key={num} className="group relative overflow-hidden rounded-xl aspect-square">
              <img 
                src={`https://picsum.photos/seed/gallery${num}/500/500`} 
                alt={`Hoạt động ${num}`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/90 via-brand-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-white font-semibold text-xs sm:text-sm p-2 sm:p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 break-words">
                  Hoạt động cộng đồng
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="mb-12 sm:mb-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-green to-emerald-600 dark:from-emerald-800 dark:to-brand-green-dark rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTEydjEyaDEyVjMwem0wIDBWMThIMjR2MTJoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
          <div className="relative z-10">
            <FavoriteIcon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 break-words px-2">
              Cùng nhau tạo nên sự khác biệt
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-emerald-50 max-w-2xl mx-auto break-words px-2">
              Mỗi hành động nhỏ đều có ý nghĩa. Hãy tham gia cộng đồng BandoXanh để cùng bảo vệ môi trường ngày hôm nay!
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center px-2">
              <a 
                href="/community" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-brand-green font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Tham gia cộng đồng
              </a>
              <a 
                href="/map" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              >
                Khám phá bản đồ
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default function About() {
  const { isCollapsed: isSidebarCollapsed, setCollapsed: setIsSidebarCollapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}> 
        <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
          <AboutPageComponent theme={theme} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
