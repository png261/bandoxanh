import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

// Mock data - should match the data in newsStore
const newsArticles = [
  {
    id: 1,
    title: 'Việt Nam triển khai chương trình tái chế rác thải điện tử',
    excerpt: 'Bộ Tài nguyên và Môi trường vừa công bố chương trình thu gom và tái chế rác thải điện tử toàn quốc, nhằm giảm thiểu ô nhiễm môi trường và tận dụng tài nguyên.',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    category: 'Chính sách',
    date: '15/10/2024',
  },
  {
    id: 2,
    title: 'Khởi động chiến dịch "Biển không rác" tại các tỉnh miền Trung',
    excerpt: 'Chiến dịch thu gom rác thải nhựa trên các bãi biển miền Trung đã chính thức được triển khai với sự tham gia của hàng nghìn tình nguyện viên.',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
    category: 'Môi trường',
    date: '12/10/2024',
  },
  {
    id: 3,
    title: 'Startup Việt phát triển ứng dụng phân loại rác thông minh',
    excerpt: 'Một startup công nghệ tại TP.HCM vừa ra mắt ứng dụng sử dụng AI để nhận diện và hướng dẫn phân loại rác thải chính xác.',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    category: 'Công nghệ',
    date: '08/10/2024',
  },
  {
    id: 4,
    title: 'Mô hình thu gom rác thải tại nguồn được mở rộng',
    excerpt: 'Các thành phố lớn đang triển khai mô hình thu gom rác thải phân loại tại nguồn, giúp tăng tỷ lệ tái chế lên 40%.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800',
    category: 'Giải pháp',
    date: '05/10/2024',
  },
  {
    id: 5,
    title: 'Cộng đồng trẻ chung tay bảo vệ môi trường',
    excerpt: 'Hàng ngàn bạn trẻ tham gia các hoạt động tình nguyện thu gom rác, trồng cây xanh và tuyên truyền bảo vệ môi trường.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    category: 'Cộng đồng',
    date: '01/10/2024',
  },
];

// Generate metadata for Open Graph
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = newsArticles.find(a => a.id === parseInt(params.id));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!article) {
    return {
      title: 'Tin tức không tồn tại',
    };
  }

  return {
    title: `${article.title} | BandoXanh`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      locale: 'vi_VN',
      siteName: 'BandoXanh',
      url: `${appUrl}/share/news/${params.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

// Show a simple page with redirect message and meta refresh
export default async function ShareNewsPage({ params }: PageProps) {
  const article = newsArticles.find(a => a.id === parseInt(params.id));
  const redirectUrl = `/news#article-${params.id}`;

  return (
    <>
      {/* Meta refresh for automatic redirect after 2 seconds */}
      <meta httpEquiv="refresh" content={`2;url=${redirectUrl}`} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {article ? (
            <>
              {/* Article Preview */}
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-6 sm:p-8">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-brand-green-light text-brand-green-dark text-sm font-semibold rounded-md">
                    {article.category}
                  </span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {article.title}
                </h1>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.excerpt}
                </p>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  📅 {article.date}
                </p>

                {/* Redirect Message */}
                <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="inline-flex items-center gap-2 text-brand-green mb-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm font-medium">Đang chuyển hướng...</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Bạn sẽ được chuyển đến trang tin tức trong giây lát
                  </p>
                  <a 
                    href={redirectUrl}
                    className="inline-block px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Xem ngay
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Tin tức không tồn tại</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Tin tức này có thể đã bị xóa hoặc không tồn tại.</p>
              <a 
                href="/news"
                className="inline-block px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Về trang Tin tức
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
