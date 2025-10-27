import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_REACTIONS = ['love', 'like', 'clap', 'green_heart', 'seedling', 'recycle', 'wow'];

// POST /api/posts/[id]/react - React to a post
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const postId = parseInt(params.id);
    const { type } = await request.json();

    // Validate reaction type
    if (!VALID_REACTIONS.includes(type)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check existing reaction
    const existingReaction = await prisma.postReaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: currentUser.id,
        },
      },
    });

    let reaction;
    if (existingReaction) {
      // Update reaction type if different
      if (existingReaction.type === type) {
        // Same reaction - remove it (toggle off)
        await prisma.postReaction.delete({
          where: {
            postId_userId: {
              postId,
              userId: currentUser.id,
            },
          },
        });
        return NextResponse.json({ success: true, removed: true });
      } else {
        // Different reaction - update it
        reaction = await prisma.postReaction.update({
          where: {
            postId_userId: {
              postId,
              userId: currentUser.id,
            },
          },
          data: { type },
        });
      }
    } else {
      // Create new reaction
      reaction = await prisma.postReaction.create({
        data: {
          postId,
          userId: currentUser.id,
          type,
        },
      });

      // Create notification for post author (if not own post)
      if (post.authorId !== currentUser.id) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'reaction',
            title: 'Bài viết của bạn nhận được phản ứng',
            message: `${currentUser.name || 'Ai đó'} đã phản ứng bài viết của bạn`,
            link: `/community`,
          },
        });
      }
    }

    // Get updated reaction counts
    const reactions = await prisma.postReaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: true,
    });

    return NextResponse.json({ success: true, reaction, reactions });
  } catch (error) {
    console.error('Error reacting to post:', error);
    return NextResponse.json({ error: 'Failed to react to post' }, { status: 500 });
  }
}

// GET /api/posts/[id]/react - Get reactions for a post
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = parseInt(params.id);

    // Get reaction counts grouped by type
    const reactions = await prisma.postReaction.groupBy({
      by: ['type'],
      where: { postId },
      _count: true,
    });

    // Get all users who reacted
    const reactionUsers = await prisma.postReaction.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ reactions, users: reactionUsers });
  } catch (error) {
    console.error('Error getting reactions:', error);
    return NextResponse.json({ error: 'Failed to get reactions' }, { status: 500 });
  }
}
