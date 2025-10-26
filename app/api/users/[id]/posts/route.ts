import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    // Try to parse as integer first (database ID), fallback to clerkId (string)
    const parsedId = parseInt(userId, 10);
    const whereCondition = !isNaN(parsedId)
      ? { id: parsedId }
      : { clerkId: userId };

    // Find user first to get their actual ID
    const user = await prisma.user.findFirst({
      where: whereCondition,
      select: {
        id: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's posts with likes and comments
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          }
        },
        likedBy: {
          select: {
            id: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      content: post.content,
      images: post.images,
      likes: post.likedBy.length,
      createdAt: post.createdAt.toISOString(),
      author: post.author,
      comments: post.comments.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      }))
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 }
    );
  }
}
