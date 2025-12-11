import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get list of users current user is following
    const following = await prisma.userFollow.findMany({
      where: { followerId: currentUser.id },
      select: { followingId: true },
    });

    const followingIds = following.map((f: any) => f.followingId);

    if (followingIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get posts from users being followed
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: followingIds,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        poll: {
          include: {
            options: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get likes count for each post
    const postsWithLikes = await Promise.all(
      posts.map(async (post: any) => {
        const likesCount = await prisma.postLike.count({
          where: { postId: post.id },
        });
        return { ...post, likesCount };
      })
    );

    // Transform posts to match expected format
    const transformedPosts = postsWithLikes.map((post: any) => ({
      id: post.id.toString(),
      content: post.content,
      images: post.images || [],
      hashtags: post.hashtags || [],
      timestamp: post.timestamp || post.createdAt.toISOString(),
      likes: post.likesCount || 0,
      createdAt: post.createdAt.toISOString(),
      authorId: post.authorId.toString(),
      author: post.author
        ? {
          id: post.author.id.toString(),
          name: post.author.name,
          email: post.author.email,
          avatar: post.author.avatar,
        }
        : undefined,
      comments: post.comments.map((comment: any) => ({
        id: comment.id.toString(),
        content: comment.content,
        timestamp: comment.timestamp || comment.createdAt.toISOString(),
        createdAt: comment.createdAt.toISOString(),
        postId: comment.postId.toString(),
        authorId: comment.authorId?.toString(),
        author: comment.author
          ? {
            id: comment.author.id.toString(),
            name: comment.author.name,
            email: comment.author.email,
            avatar: comment.author.avatar,
          }
          : undefined,
      })),
      poll: post.poll
        ? {
          id: post.poll.id.toString(),
          question: post.poll.question,
          options: post.poll.options || [],
          votedBy: post.poll.votedBy || [],
        }
        : undefined,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching following feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch following feed' },
      { status: 500 }
    );
  }
}
