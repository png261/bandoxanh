'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuoteIcon } from '@/components/Icons';
import { Theme } from '@/types';
import { useSidebar } from '@/hooks/useSidebar';
import { useTheme } from '@/hooks/useTheme';
import {
  Recycling as RecyclingIcon,
  Map as MapIcon,
  Psychology as PsychologyIcon,
  Groups as GroupsIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';

// --- DATA ---
const teamMembers = [
  { name: 'Mai Thị Ngọc Ánh', role: 'Co-Founder', avatar: 'https://ui-avatars.com/api/?name=Mai+Thi+Ngoc+Anh&background=10B981&color=fff' },
  { name: 'Lê Thị Quỳnh Mai', role: 'Founder', avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Quynh+Mai&background=10B981&color=fff' },
  { name: 'Phạm Thảo Ngân', role: 'Co-Founder', avatar: 'https://ui-avatars.com/api/?name=Pham+Thao+Ngan&background=10B981&color=fff' },
  { name: 'Nguyễn Hữu Phương', role: 'Co-Founder', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Huu+Phuong&background=10B981&color=fff' },
];

const testimonials = [
  { quote: 'Ứng dụng rất hữu ích! Tôi đã tìm được trạm thu gom pin cũ gần nhà mà trước đây không hề biết.', author: 'Anh Tuấn', role: 'Người dùng tại Hà Nội' },
  { quote: 'Tính năng nhận diện rác bằng AI thật tuyệt vời. Nó giúp gia đình tôi phân loại rác chính xác hơn rất nhiều.', author: 'Chị Mai', role: 'Người dùng tại Đà Nẵng' },
  { quote: 'Cộng đồng BandoXanh rất sôi nổi. Tôi học được nhiều mẹo tái chế hay ho từ các thành viên khác.', author: 'Minh', role: 'Sinh viên' },
];

const features = [
  {
    icon: MapIcon,
    title: 'Bản đồ thu gom',
    description: 'Tìm điểm thu gom rác thải gần nhất'
  },
  {
    icon: PsychologyIcon,
    title: 'AI nhận diện',
    description: 'Phân loại rác chính xác bằng AI'
  },
  {
    icon: GroupsIcon,
    title: 'Cộng đồng',
    description: 'Kết nối và chia sẻ sống xanh'
  },
  {
    icon: EmojiEventsIcon,
    title: 'Đổi thưởng',
    description: 'Tích điểm đổi quà hấp dẫn'
  },
];

const timeline = [
  { year: '10.2025', title: 'Khởi đầu', description: 'Ý tưởng BandoXanh ra đời từ nhóm sinh viên yêu môi trường' },
  { year: '11.2025', title: 'Phát triển MVP', description: 'Xây dựng bản đồ và cộng đồng cơ bản' },
  { year: '12.2025', title: 'Tích hợp AI', description: 'Ra mắt tính năng nhận diện rác thải thông minh' },
  { year: '01.2026', title: 'Ra mắt', description: 'Chính thức phát hành ứng dụng rộng rãi' },
];

interface AboutPageProps {
  theme: Theme;
}

const AboutPageComponent: React.FC<AboutPageProps> = ({ theme }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-20">

      {/* --- HERO SECTION --- */}
      <section className="text-center space-y-6 pt-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green font-bold text-sm">
          CÂU CHUYỆN CỦA CHÚNG TÔI
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-brand-gray-dark dark:text-white leading-tight">
          Vì một tương lai <span className="text-brand-green">Xanh & Sạch</span> 🌍
        </h1>
        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Nền tảng công nghệ kết nối cộng đồng, biến những hành động nhỏ mỗi ngày thành tác động lớn cho môi trường.
        </p>
      </section>

      {/* --- STATS GRID --- */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Người dùng', value: '1.5K+', icon: GroupsIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Điểm thu gom', value: '350+', icon: MapIcon, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Rác phân loại', value: '1.4K+', icon: RecyclingIcon, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10' },
          { label: 'Tăng trưởng', value: '215%', icon: TrendingUpIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} rounded-3xl p-6 text-center border border-transparent dark:border-white/5`}>
            <div className={`w-12 h-12 mx-auto rounded-2xl ${stat.color} bg-white dark:bg-black/20 flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon />
            </div>
            <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* --- MISSION --- */}
      <section className="bg-brand-gray-light dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-brand-gray-dark dark:text-white mb-6">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Kết Nối</h3>
                  <p className="text-gray-500 dark:text-gray-400">Mạng lưới điểm thu gom rộng khắp, dễ dàng tiếp cận.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Giáo Dục</h3>
                  <p className="text-gray-500 dark:text-gray-400">Nâng cao nhận thức qua công nghệ AI và dữ liệu.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Lan Tỏa</h3>
                  <p className="text-gray-500 dark:text-gray-400">Xây dựng cộng đồng sống xanh tích cực và bền vững.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-80 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb7d5fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Mission"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <p className="text-white font-medium">"Hành động nhỏ, Ý nghĩa lớn"</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-brand-gray-dark dark:text-white mb-4">Tính Năng Nổi Bật</h2>
          <p className="text-gray-500 dark:text-gray-400">Công cụ mạnh mẽ hỗ trợ lối sống xanh</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-white transition-colors">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- TIMELINE --- */}
      <section className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-black text-center text-brand-gray-dark dark:text-white mb-12">Lộ Trình Phát Triển</h2>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row gap-8 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                {/* Content */}
                <div className="flex-1 ml-12 md:ml-0 md:text-right">
                  <div className={`bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl md:max-w-md ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`} style={{ textAlign: 'left' }}>
                    <span className="text-brand-green font-bold text-sm block mb-1">{item.year}</span>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-4 border-brand-green rounded-full z-10"></div>

                {/* Empty Space for Grid Alignment */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TEAM --- */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-brand-gray-dark dark:text-white mb-4">Đội Ngũ Sáng Lập</h2>
          <p className="text-gray-500 dark:text-gray-400">Những người trẻ đầy nhiệt huyết</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="group text-center">
              <div className="relative rounded-3xl overflow-hidden aspect-square mb-4 shadow-md border-2 border-transparent group-hover:border-brand-green transition-all">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-brand-green font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="relative overflow-hidden bg-brand-green rounded-[2.5rem] p-12 text-center">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Sẵn Sàng Hành Động?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng BandoXanh ngay hôm nay để cùng chung tay bảo vệ môi trường sống của chúng ta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/community" className="px-8 py-3 bg-white text-brand-green font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
              Tham Gia Cộng Đồng
            </a>
            <a href="/map" className="px-8 py-3 bg-brand-green-dark/30 text-white font-bold rounded-xl border border-white/20 hover:bg-brand-green-dark/50 transition-colors">
              Khám Phá Bản Đồ
            </a>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mb-20"></div>
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
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}>
        <main className="container mx-auto px-4 md:px-8 py-8 md:pt-0 pt-20">
          <AboutPageComponent theme={theme} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
