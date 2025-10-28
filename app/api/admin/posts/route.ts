import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin';

// GET all posts with stats (admin only)
export async function GET(request: NextRequest) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { content: { contains: search, mode: 'insensitive' as const } },
            { author: { name: { contains: search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              clerkId: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likedBy: true,
              reactions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// GET stats
export async function POST(request: NextRequest) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { action } = await request.json();

    if (action === 'stats') {
      const [
        totalPosts,
        postsToday,
        postsThisWeek,
        postsThisMonth,
        totalComments,
        totalLikes,
        avgCommentsPerPost,
      ] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.post.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.post.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        prisma.comment.count(),
        prisma.postLike.count(),
        prisma.post.count().then(async (count) => {
          if (count === 0) return 0;
          const totalComments = await prisma.comment.count();
          return Math.round((totalComments / count) * 10) / 10;
        }),
      ]);

      return NextResponse.json({
        totalPosts,
        postsToday,
        postsThisWeek,
        postsThisMonth,
        totalComments,
        totalLikes,
        avgCommentsPerPost,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
