import { Metadata } from 'next';
import { redirect } from 'next/navigation';
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
    const title = `${post.author.name} - BandoXanh`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.content.substring(0, 100),
          },
        ],
        type: 'article',
        locale: 'vi_VN',
        siteName: 'BandoXanh',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'BandoXanh',
    };
  }
}

// This page just redirects to community with the post ID
export default async function SharePostPage({ params }: PageProps) {
  // Redirect to community page with post highlight
  redirect(`/community?post=${params.id}`);
}
