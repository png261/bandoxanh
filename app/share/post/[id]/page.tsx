import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: {
    id: string;
  };
}

// Generate metadata for Open Graph
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return {
        title: 'Bài viết không tồn tại',
      };
    }

    // Parse images from post
    let images: string[] = [];
    try {
      const parsedImages = JSON.parse(post.images || '[]');
      images = Array.isArray(parsedImages) ? parsedImages : [];
    } catch (e) {
      images = [];
    }

    const ogImage = images.length > 0 ? images[0] : '/og-image.png';
    const description = post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '');
    const title = `${post.author.name} trên BandoXanh`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return {
      title,
      description,
      openGraph: {
        title: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        description,
        images: [
          {
            url: ogImage.startsWith('http') ? ogImage : `${appUrl}${ogImage}`,
            width: 1200,
            height: 630,
            alt: post.content.substring(0, 100),
          },
        ],
        type: 'article',
        locale: 'vi_VN',
        siteName: 'BandoXanh',
        url: `${appUrl}/share/post/${params.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage.startsWith('http') ? ogImage : `${appUrl}${ogImage}`],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'BandoXanh',
    };
  }
}

// Show a simple page with redirect message and meta refresh
export default async function SharePostPage({ params }: PageProps) {
  let post = null;
  let images: string[] = [];
  
  try {
    post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (post) {
      try {
        const parsedImages = JSON.parse(post.images || '[]');
        images = Array.isArray(parsedImages) ? parsedImages : [];
      } catch (e) {
        images = [];
      }
    }
  } catch (error) {
    console.error('Error fetching post:', error);
  }

  const redirectUrl = `/community?post=${params.id}`;

  return (
    <>
      {/* Meta refresh for automatic redirect after 2 seconds */}
      <meta httpEquiv="refresh" content={`2;url=${redirectUrl}`} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
          {post ? (
            <>
              {/* Post Preview */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name || 'User')}`}
                    alt={post.author.name || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">{post.author.name || 'User'}</h2>
                    <p className="text-sm text-gray-500">BandoXanh - Cộng đồng Tái chế</p>
                  </div>
                </div>
                
                <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
                
                {images.length > 0 && (
                  <img 
                    src={images[0]} 
                    alt="Post image"
                    className="w-full rounded-lg object-cover max-h-96"
                  />
                )}
              </div>

              {/* Redirect Message */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 text-brand-green mb-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium">Đang chuyển hướng...</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bạn sẽ được chuyển đến bài viết trong giây lát
                </p>
                <a 
                  href={redirectUrl}
                  className="inline-block mt-4 px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Xem ngay
                </a>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bài viết không tồn tại</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
              <a 
                href="/community"
                className="inline-block px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Về trang Cộng đồng
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
