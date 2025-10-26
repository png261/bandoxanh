import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    // Delete all related comments first
    await prisma.comment.deleteMany({
      where: { postId },
    });

    // Delete all likes for this post
    await prisma.postLike.deleteMany({
      where: { postId },
    });

    // Delete polls for this post
    await prisma.poll.deleteMany({
      where: { postId },
    });

    // Finally delete the post
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const postId = parseInt(id);
    const body = await request.json();
    const { content, images } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Post content cannot be empty' },
        { status: 400 }
      );
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        images: images ? JSON.stringify(images) : null,
      },
      include: {
        author: true,
        comments: {
          include: { author: true },
        },
        likedBy: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
