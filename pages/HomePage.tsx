import React from 'react';
import { NewsArticle } from '../types';
import { MapPinIcon, RecycleIcon, CommunityIcon, ArrowRightIcon, CameraIcon } from '../components/Icons';
import { NEWS_ARTICLES } from '../constants';

interface HomePageProps {
  navigateTo: (page: string, options?: { articleId?: number; profileId?: number; }) => void;
  isAuthenticated?: boolean;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; page: string; navigateTo: (page: string) => void; isAuthenticated: boolean; }> = ({ icon, title, description, page, navigateTo, isAuthenticated }) => (
  <div className="bg-card dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 p-8 rounded-xl hover:border-brand-green dark:hover:border-brand-green transition-all duration-300 flex flex-col">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-grow mt-5">
      <h3 className="text-xl font-semibold text-foreground dark:text-gray-100">{title}</h3>
      <p className="mt-2 text-brand-gray-DEFAULT dark:text-gray-400">{description}</p>
    </div>
    <div className="mt-6">
      {isAuthenticated ? (
        <button
          onClick={() => navigateTo(page)}
          className="text-brand-green font-semibold hover:text-brand-green-dark dark:hover:text-white transition-colors duration-200 flex items-center group"
        >
          Khám phá ngay <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          onClick={() => navigateTo('/sign-in')}
          className="text-brand-green font-semibold hover:text-brand-green-dark dark:hover:text-white transition-colors duration-200 flex items-center group"
        >
          Đăng nhập để xem <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  </div>
);

const NewsPreviewCard: React.FC<{ article: NewsArticle; navigateTo: (page: string, options?: { articleId?: number }) => void; isAuthenticated: boolean; }> = ({ article, navigateTo, isAuthenticated }) => (
  <div 
    onClick={() => {
      if (isAuthenticated) {
        navigateTo('/news', { articleId: article.id });
      } else {
        navigateTo('/sign-in');
      }
    }} 
    className="bg-card dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col"
  >
    <div className="overflow-hidden">
      <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-semibold text-lg text-foreground dark:text-gray-100 group-hover:text-brand-green transition-colors flex-grow">{article.title}</h3>
      <p className="text-sm text-brand-gray-DEFAULT dark:text-gray-400 mt-3 line-clamp-2">{article.excerpt}</p>
    </div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ navigateTo, isAuthenticated = false }) => {
  const latestNews = NEWS_ARTICLES.slice(0, 3);
  
  return (
    <div className="space-y-20 md:space-y-32">
      {/* Banner */}
      <section className="bg-brand-green-light dark:bg-brand-gray-dark text-center py-20 px-6 rounded-xl">
        <h2 className="text-4xl md:text-6xl font-bold leading-tight text-brand-green-dark dark:text-white">Chung Tay Vì Một Việt Nam Xanh</h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-brand-gray-dark dark:text-gray-300">
          {isAuthenticated 
            ? 'Tìm kiếm trạm thu gom, nhận diện rác thải bằng AI, và tham gia cộng đồng để lan tỏa lối sống bền vững.'
            : 'Đăng nhập để truy cập bản đồ trạm thu gom, nhận diện rác thải bằng AI, và tham gia cộng đồng xanh.'}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigateTo('/map')}
                className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105 w-full sm:w-auto"
              >
                Xem bản đồ
              </button>
              <button
                onClick={() => navigateTo('/identify')}
                className="bg-white dark:bg-brand-gray-dark border border-gray-300 dark:border-gray-600 text-brand-gray-dark dark:text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all w-full sm:w-auto"
              >
                Nhận diện rác
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('/sign-in')}
                className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105 w-full sm:w-auto"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigateTo('/sign-up')}
                className="bg-white dark:bg-brand-gray-dark border border-gray-300 dark:border-gray-600 text-brand-gray-dark dark:text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all w-full sm:w-auto"
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Tính năng nổi bật</h2>
          <p className="text-brand-gray-DEFAULT dark:text-gray-400 mt-3 max-w-xl mx-auto">Các công cụ mạnh mẽ giúp bạn hành động vì môi trường, ngay trong tầm tay.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MapPinIcon className="h-10 w-10 text-brand-green" />}
            title="Bản Đồ Trạm Thu Gom"
            description="Dễ dàng tìm kiếm và chia sẻ các điểm thu gom rác tái chế gần bạn nhất."
            page="/map"
            navigateTo={navigateTo}
            isAuthenticated={isAuthenticated}
          />
          <FeatureCard
            icon={<CameraIcon className="h-10 w-10 text-brand-green" />}
            title="Nhận Diện Rác Bằng AI"
            description="Chụp ảnh rác thải, AI sẽ giúp bạn phân loại và gợi ý cách xử lý phù hợp."
            page="/identify"
            navigateTo={navigateTo}
            isAuthenticated={isAuthenticated}
          />
          <FeatureCard
            icon={<CommunityIcon className="h-10 w-10 text-brand-green" />}
            title="Cộng Đồng Xanh"
            description="Chia sẻ hành động, học hỏi kinh nghiệm và lan tỏa cảm hứng sống xanh."
            page="/community"
            navigateTo={navigateTo}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </section>
      
      {/* How it works */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Làm thế nào để bắt đầu?</h2>
          <p className="text-brand-gray-DEFAULT dark:text-gray-400 mt-3">Chỉ với 3 bước đơn giản để cùng BandoXanh hành động.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="flex items-center justify-center h-24 w-24 mx-auto bg-brand-green-light dark:bg-brand-gray-dark rounded-full">
              <MapPinIcon className="h-12 w-12 text-brand-green-dark dark:text-brand-green" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">1. Tìm kiếm</h3>
            <p className="mt-2 text-brand-gray-DEFAULT dark:text-gray-400">Sử dụng bản đồ tương tác để tìm các trạm thu gom rác tái chế gần bạn.</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-24 w-24 mx-auto bg-brand-green-light dark:bg-brand-gray-dark rounded-full">
              <RecycleIcon className="h-12 w-12 text-brand-green-dark dark:text-brand-green" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">2. Phân loại</h3>
            <p className="mt-2 text-brand-gray-DEFAULT dark:text-gray-400">Chụp ảnh rác thải để AI của chúng tôi giúp bạn nhận diện và hướng dẫn xử lý.</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-24 w-24 mx-auto bg-brand-green-light dark:bg-brand-gray-dark rounded-full">
              <CommunityIcon className="h-12 w-12 text-brand-green-dark dark:text-brand-green" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">3. Chia sẻ</h3>
            <p className="mt-2 text-brand-gray-DEFAULT dark:text-gray-400">Tham gia cộng đồng, chia sẻ hành động của bạn và lan tỏa cảm hứng sống xanh.</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-card dark:bg-brand-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-foreground dark:text-white">Vì một tương lai xanh hơn</h2>
            <p className="mt-4 text-brand-gray-DEFAULT dark:text-gray-400">
              "BandoXanh" ra đời với sứ mệnh ứng dụng công nghệ để giải quyết các vấn đề môi trường, bắt đầu từ việc nhỏ nhất là phân loại rác. Chúng tôi tin rằng mỗi hành động nhỏ của cá nhân sẽ tạo nên một tác động lớn cho cộng đồng.
            </p>
            {isAuthenticated ? (
              <button 
                onClick={() => navigateTo('/about')}
                className="mt-8 bg-brand-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105 flex items-center group"
              >
                Tìm hiểu thêm <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={() => navigateTo('/sign-in')}
                className="mt-8 bg-brand-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105 flex items-center group"
              >
                Đăng nhập để tìm hiểu <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
          <div className="h-64 md:h-full">
            <img src="https://picsum.photos/seed/greenfuture/800/600" alt="Green Future" className="w-full h-full object-cover"/>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">Tin tức mới nhất</h2>
          <p className="text-brand-gray-DEFAULT dark:text-gray-400 mt-3">Cập nhật các thông tin và sự kiện môi trường nổi bật.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {latestNews.map(article => (
            <NewsPreviewCard key={article.id} article={article} navigateTo={navigateTo} isAuthenticated={isAuthenticated} />
          ))}
        </div>
        <div className="mt-12 text-center">
          {isAuthenticated ? (
            <button 
              onClick={() => navigateTo('/news')}
              className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105"
            >
              Xem tất cả tin tức
            </button>
          ) : (
            <button 
              onClick={() => navigateTo('/sign-in')}
              className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-green-dark transition-all transform hover:scale-105"
            >
              Đăng nhập để xem tất cả tin tức
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
