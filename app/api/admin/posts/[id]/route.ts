import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin';

// DELETE post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const postId = parseInt(id);

    // Delete all related data in transaction
    await prisma.$transaction(async (tx) => {
      // Delete comments
      await tx.comment.deleteMany({
        where: { postId },
      });

      // Delete likes
      await tx.postLike.deleteMany({
        where: { postId },
      });

      // Delete reactions
      await tx.postReaction.deleteMany({
        where: { postId },
      });

      // Delete poll options if exists
      const polls = await tx.poll.findMany({
        where: { postId },
        select: { id: true },
      });

      for (const poll of polls) {
        await tx.pollOption.deleteMany({
          where: { pollId: poll.id },
        });
      }

      // Delete polls
      await tx.poll.deleteMany({
        where: { postId },
      });

      // Finally delete the post
      await tx.post.delete({
        where: { id: postId },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}

// PUT update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();
    const { content, images } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Post content cannot be empty' }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        images: images ? JSON.stringify(images) : null,
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
        _count: {
          select: {
            comments: true,
            likedBy: true,
            reactions: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}
