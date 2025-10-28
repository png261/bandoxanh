'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { LeafIcon, RecycleIcon, CommunityIcon, ArrowRightIcon } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);

  // Redirect signed-in users to map page
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/map');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading or nothing while checking auth status
  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-light dark:bg-black">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-green-light via-white to-blue-50">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <LeafIcon className="w-8 h-8 text-brand-green" />
              <span className="text-2xl font-bold text-brand-green">BandoXanh</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/sign-in')}
                className="px-6 py-2 text-brand-green font-semibold hover:bg-brand-green-light rounded-lg transition-colors"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => router.push('/sign-up')}
                className="px-6 py-2 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green-dark transition-colors"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-gray-dark mb-6 leading-tight">
              Cùng nhau bảo vệ <span className="text-brand-green">Trái đất</span>
            </h1>
            <p className="text-xl text-brand-gray-DEFAULT mb-8 max-w-2xl mx-auto leading-relaxed">
              Tham gia cộng đồng tái chế toàn cầu. Chia sẻ, học hỏi và cùng nhau tạo ra một tương lai xanh hơn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/sign-up')}
                className="px-8 py-4 bg-brand-green text-white font-bold text-lg rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Bắt đầu ngay
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/sign-in')}
                className="px-8 py-4 bg-white text-brand-green font-bold text-lg rounded-lg border-2 border-brand-green hover:bg-brand-green-light transition-all"
              >
                Đăng nhập
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop"
              alt="Recycling Center"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-brand-gray-dark mb-16">
            Tại sao chọn BandoXanh?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-brand-green-light hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <RecycleIcon className="w-12 h-12 text-brand-green" />
              </div>
              <h3 className="text-2xl font-bold text-brand-gray-dark mb-4">Tái chế dễ dàng</h3>
              <p className="text-brand-gray-DEFAULT">
                Tìm kiếm các trạm tái chế gần nhất và biết được cách phân loại rác thải đúng cách.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <CommunityIcon className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-brand-gray-dark mb-4">Cộng đồng vượt biên</h3>
              <p className="text-brand-gray-DEFAULT">
                Kết nối với các bạn có cùng đam mê bảo vệ môi trường trên toàn thế giới.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-yellow-50 hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <LeafIcon className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-brand-gray-dark mb-4">Theo dõi tiến độ</h3>
              <p className="text-brand-gray-DEFAULT">
                Thấy được tác động của bạn lên môi trường và nhận được phần thưởng cho những nỗ lực.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-green to-brand-green-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-white text-center">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <p className="text-lg">Thành viên cộng đồng</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <p className="text-lg">Trạm tái chế</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <p className="text-lg">Tấn rác tái chế</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-brand-green-light to-blue-50 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-brand-gray-dark mb-6">
            Bạn đã sẵn sàng tham gia?
          </h2>
          <p className="text-xl text-brand-gray-DEFAULT mb-8">
            Hãy tham gia cộng đồng BandoXanh hôm nay và bắt đầu hành trình bảo vệ môi trường của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/sign-up')}
              className="px-8 py-4 bg-brand-green text-white font-bold text-lg rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105"
            >
              Đăng ký miễn phí
            </button>
            <button
              onClick={() => router.push('/sign-in')}
              className="px-8 py-4 bg-white text-brand-green font-bold text-lg rounded-lg border-2 border-brand-green hover:bg-brand-green-light transition-all"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-gray-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LeafIcon className="w-6 h-6 text-brand-green" />
                <span className="text-xl font-bold">BandoXanh</span>
              </div>
              <p className="text-gray-400">Cùng nhau bảo vệ Trái đất</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Trang chủ</a></li>
                <li><a href="#" className="hover:text-white transition">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Chính sách</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition">Quyền riêng tư</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liên kết</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BandoXanh. Tất cả quyền được bảo vệ.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
