import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { authorId } = body;
    const postId = parseInt(id);

    if (!authorId) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Find or create user by Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId: authorId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: authorId,
          email: `user-${authorId}@bandoxanh.local`,
          name: 'Anonymous User',
        },
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    });

    let isLiked = false;

    if (existingLike) {
      // Unlike: delete the like
      await prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: user.id,
          },
        },
      });
    } else {
      // Like: create new like
      await prisma.postLike.create({
        data: {
          postId,
          userId: user.id,
        },
      });
      isLiked = true;
    }

    // Count total likes for this post
    const likeCount = await prisma.postLike.count({
      where: { postId },
    });

    // Update post likes count
    await prisma.post.update({
      where: { id: postId },
      data: { likes: likeCount },
    });

    // Fetch updated post
    const updatedPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...updatedPost,
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
