import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

// Mock data - replace with actual API call
const newsArticles = [
  {
    id: 1,
    title: 'Việt Nam triển khai chương trình tái chế rác thải điện tử',
    excerpt: 'Bộ Tài nguyên và Môi trường vừa công bố chương trình thu gom và tái chế rác thải điện tử toàn quốc...',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    category: 'Chính sách',
    date: '15/10/2024',
  },
  {
    id: 2,
    title: 'Khởi động chiến dịch "Biển không rác" tại các tỉnh miền Trung',
    excerpt: 'Chiến dịch thu gom rác thải nhựa trên các bãi biển miền Trung đã chính thức được triển khai...',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
    category: 'Môi trường',
    date: '12/10/2024',
  },
];

// Generate metadata for Open Graph
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = newsArticles.find(a => a.id === parseInt(params.id));

  if (!article) {
    return {
      title: 'Tin tức không tồn tại',
    };
  }

  return {
    title: article.title,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

// This page just redirects to news page
export default async function ShareNewsPage({ params }: PageProps) {
  redirect(`/news#article-${params.id}`);
}
