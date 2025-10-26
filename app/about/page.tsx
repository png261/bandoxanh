'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { QuoteIcon } from '@/components/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState, useEffect } from 'react';
import { Theme } from '@/types';
import React from 'react';

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
    { name: 'Hoàng An', role: 'Founder & Project Lead', avatar: 'https://picsum.photos/seed/team1/200/200' },
    { name: 'Minh Thư', role: 'Lead Developer', avatar: 'https://picsum.photos/seed/team2/200/200' },
    { name: 'Quốc Bảo', role: 'UX/UI Designer', avatar: 'https://picsum.photos/seed/team3/200/200' },
    { name: 'Lan Chi', role: 'Community Manager', avatar: 'https://picsum.photos/seed/team4/200/200' },
];

const testimonials = [
    { quote: 'Ứng dụng rất hữu ích! Tôi đã tìm được trạm thu gom pin cũ gần nhà mà trước đây không hề biết. Giao diện cũng rất thân thiện.', author: 'Anh Tuấn - Người dùng tại Hà Nội' },
    { quote: 'Tính năng nhận diện rác bằng AI thật tuyệt vời. Nó giúp gia đình tôi phân loại rác chính xác hơn rất nhiều. Cảm ơn BandoXanh!', author: 'Chị Mai - Người dùng tại Đà Nẵng' },
    { quote: 'Cộng đồng BandoXanh rất sôi nổi và tích cực. Tôi học được nhiều mẹo tái chế hay ho từ các thành viên khác.', author: 'Bạn Minh - Sinh viên' },
];

interface AboutPageProps {
  theme: Theme;
}

const AboutPageComponent: React.FC<AboutPageProps> = ({ theme }) => {
  const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';

  return (
    <div className="space-y-24">
      {/* --- SỨ MỆNH & TẦM NHÌN --- */}
      <section className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-8 md:p-12 rounded-xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold text-brand-gray-dark dark:text-gray-100 mb-6">Sứ mệnh & Tầm nhìn</h2>
            <p className="mb-4 text-lg text-brand-gray-DEFAULT dark:text-gray-400">
              "BandoXanh" ra đời với sứ mệnh kết nối và trao quyền cho cộng đồng, biến việc bảo vệ môi trường thành một thói quen hàng ngày. Chúng tôi tin rằng, mỗi cá nhân đều có thể trở thành một tác nhân thay đổi.
            </p>
            <ul className="list-disc list-inside space-y-3 text-brand-gray-dark dark:text-gray-300 mt-6">
              <li><strong>Kết nối:</strong> Xây dựng bản đồ số toàn diện về các điểm thu gom, giúp mọi người dễ dàng tiếp cận và tham gia tái chế.</li>
              <li><strong>Giáo dục:</strong> Nâng cao nhận thức về phân loại rác tại nguồn thông qua công cụ AI trực quan và các bài viết hướng dẫn.</li>
              <li><strong>Lan tỏa:</strong> Tạo ra một cộng đồng sống xanh, nơi mọi người có thể chia sẻ, học hỏi và truyền cảm hứng cho nhau.</li>
            </ul>
          </div>
          <div className="order-1 md:order-2">
            <img src="https://picsum.photos/seed/mission/800/600" alt="Hành động vì môi trường" className="rounded-lg transition-transform duration-300"/>
          </div>
        </div>
      </section>
      
      {/* --- TÁC ĐỘNG CỦA DỰ ÁN (BIỂU ĐỒ) --- */}
      <section className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-8 md:p-12 rounded-xl">
        <h2 className="text-4xl font-bold text-center text-brand-green-dark dark:text-brand-green-light mb-12">Dấu Ấn & Tác Động</h2>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="w-full h-80">
                <h3 className="text-xl font-semibold text-center text-brand-gray-dark dark:text-gray-200 mb-4">Phân bố loại rác đã nhận diện</h3>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={wasteDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={120} fill="#8884d8" dataKey="value" nameKey="name" label={{ fill: textColor, fontSize: 12 }}>
                            {wasteDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', border: '1px solid #4B5563', borderRadius: '0.5rem' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="w-full h-80">
                <h3 className="text-xl font-semibold text-center text-brand-gray-dark dark:text-gray-200 mb-4">Tăng trưởng cộng đồng</h3>
                <ResponsiveContainer>
                    <LineChart data={userGrowthData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4B5563' : '#E5E7EB'} />
                        <XAxis dataKey="month" tick={{ fill: textColor }} />
                        <YAxis tick={{ fill: textColor }} />
                        <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', border: '1px solid #4B5563', borderRadius: '0.5rem' }} />
                        <Legend wrapperStyle={{ color: textColor }} />
                        <Line type="monotone" dataKey="users" name="Thành viên" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </section>

      {/* --- ĐỘI NGŨ DỰ ÁN --- */}
      <section>
          <h2 className="text-4xl font-bold text-center text-brand-green-dark dark:text-brand-green-light mb-12">Những Người Đồng Hành</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {teamMembers.map(member => (
                  <div key={member.name} className="bg-white dark:bg-brand-gray-dark p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-brand-green">
                      <img src={member.avatar} alt={member.name} className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200 dark:border-gray-700" />
                      <h3 className="mt-4 font-bold text-lg text-brand-gray-dark dark:text-gray-100">{member.name}</h3>
                      <p className="text-sm text-brand-green">{member.role}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* --- PHẢN HỒI TỪ CỘNG ĐỒNG --- */}
      <section>
        <h2 className="text-4xl font-bold text-center text-brand-gray-dark dark:text-white mb-12">Cộng Đồng Nói Về Chúng Tôi</h2>
        <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
                <div key={index} className="bg-white dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-8 rounded-xl flex flex-col">
                    <QuoteIcon className="text-brand-green w-10 h-10 mb-4" />
                    <p className="flex-grow text-brand-gray-DEFAULT dark:text-gray-300 italic">"{item.quote}"</p>
                    <p className="mt-6 font-semibold text-right text-brand-gray-dark dark:text-gray-100">- {item.author}</p>
                </div>
            ))}
        </div>
      </section>
      
      {/* --- HÌNH ẢNH HOẠT ĐỘNG --- */}
      <section>
          <h2 className="text-4xl font-bold text-center text-brand-green-dark dark:text-brand-green-light mb-12">Khoảnh Khắc BandoXanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <img src="https://picsum.photos/seed/gallery1/500/500" alt="Hoạt động 1" className="rounded-lg w-full h-full object-cover aspect-square hover:opacity-80 transition-opacity" />
              <img src="https://picsum.photos/seed/gallery2/500/500" alt="Hoạt động 2" className="rounded-lg w-full h-full object-cover aspect-square hover:opacity-80 transition-opacity" />
              <img src="https://picsum.photos/seed/gallery3/500/500" alt="Hoạt động 3" className="rounded-lg w-full h-full object-cover aspect-square hover:opacity-80 transition-opacity" />
              <img src="https://picsum.photos/seed/gallery4/500/500" alt="Hoạt động 4" className="rounded-lg w-full h-full object-cover aspect-square hover:opacity-80 transition-opacity" />
          </div>
      </section>

    </div>
  );
};

export default function About() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="bg-brand-gray-light dark:bg-black min-h-screen font-sans text-brand-gray-dark dark:text-gray-200">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />
      <div className={`pt-20 md:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'}`}> 
        <main className="container mx-auto px-4 sm:px-6 py-10">
          <AboutPageComponent theme={theme} />
        </main>
        <Footer />
      </div>
    </div>
  );
}
